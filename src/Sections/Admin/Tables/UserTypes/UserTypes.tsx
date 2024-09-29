import React, { useState, useEffect } from 'react'
import './UserTypes.css' // Asegúrate de tener un archivo CSS para estilos personalizados
import { apiUrl } from '../../../../Constants/api'

interface TipoRol {
  id_tipo_rol: number
  nombre_tipo_rol: string
}

export default function UserTypes() {
  const [tipoRoles, setTipoRoles] = useState<TipoRol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingTipoRol, setEditingTipoRol] = useState<TipoRol | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false) // Estado para mostrar el modal de agregar
  const [newTipoRolName, setNewTipoRolName] = useState('') // Estado para el nombre del nuevo tipo de rol
  const tipoRolesPerPage = 8

  useEffect(() => {
    const fetchTipoRoles = async () => {
      try {
        const response = await fetch(`${apiUrl}tipo_rol`)
        if (!response.ok) {
          throw new Error('Error al obtener los tipos de rol.')
        }
        const data = await response.json()
        setTipoRoles(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTipoRoles()
  }, [])

  const handleEditClick = (tipoRol: TipoRol) => {
    setEditingTipoRol(tipoRol)
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTipoRol) return

    try {
      const response = await fetch(
        `${apiUrl}tipo_rol/${editingTipoRol.id_tipo_rol}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingTipoRol),
        }
      )

      if (!response.ok) {
        throw new Error('Error al actualizar el tipo de rol.')
      }

      const updatedTipoRoles = tipoRoles.map((rol) =>
        rol.id_tipo_rol === editingTipoRol.id_tipo_rol ? editingTipoRol : rol
      )
      setTipoRoles(updatedTipoRoles)
      setShowEditModal(false)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const handleAddTipoRol = async () => {
    try {
      const response = await fetch(`${apiUrl}tipo_rol/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_tipo_rol: newTipoRolName }),
      })

      if (!response.ok) {
        throw new Error('Error al agregar el tipo de rol.')
      }

      const newTipoRol: TipoRol = await response.json()
      setTipoRoles([...tipoRoles, newTipoRol])
      setShowAddModal(false)
      setNewTipoRolName('') // Limpiar el nombre del nuevo tipo de rol
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingTipoRol) {
      setEditingTipoRol({
        ...editingTipoRol,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleNextPage = () => {
    if (currentPage < Math.ceil(tipoRoles.length / tipoRolesPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const indexOfLastTipoRol = currentPage * tipoRolesPerPage
  const indexOfFirstTipoRol = indexOfLastTipoRol - tipoRolesPerPage
  const currentTipoRoles = tipoRoles.slice(
    indexOfFirstTipoRol,
    indexOfLastTipoRol
  )

  if (loading) {
    return (
      <div className="usertypes-tables-admins">Cargando tipos de rol...</div>
    )
  }

  if (error) {
    return <div className="usertypes-tables-admins">Error: {error}</div>
  }

  return (
    <div className="users-tables-admins">
      <h2>Lista de Tipos de Rol</h2>
      <button
        type="button"
        className="add-button-subject"
        onClick={() => setShowAddModal(true)}
      >
        Añadir nuevo tipo de rol
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentTipoRoles.map((tipoRol) => (
            <tr key={tipoRol.id_tipo_rol}>
              <td>{tipoRol.id_tipo_rol}</td>
              <td>{tipoRol.nombre_tipo_rol}</td>
              <td>
                <button
                  type="button"
                  className="save-button"
                  onClick={() => handleEditClick(tipoRol)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de{' '}
          {Math.ceil(tipoRoles.length / tipoRolesPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(tipoRoles.length / tipoRolesPerPage)
          }
        >
          Siguiente
        </button>
      </div>

      {showEditModal && editingTipoRol && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Tipo de Rol</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_tipo_rol"
                  value={editingTipoRol.nombre_tipo_rol}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit" className="save-button-subject">
                Guardar
              </button>
              <button
                type="button"
                className="cancel-button-subject"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Añadir Nuevo Tipo de Rol</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddTipoRol()
              }}
            >
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_tipo_rol"
                  value={newTipoRolName}
                  onChange={(e) => setNewTipoRolName(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="save-button-subject">
                Guardar
              </button>
              <button
                type="button"
                className="cancel-button-subject"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
