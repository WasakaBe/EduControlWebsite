import React, { useState, useEffect } from 'react'
import './Transfers.css'
import { apiUrl } from '../../../../Constants/api'

interface Traslado {
  id_traslado: number
  nombre_traslado: string
}

export default function Transfers() {
  const [traslados, setTraslados] = useState<Traslado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingTraslado, setEditingTraslado] = useState<Traslado | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false) // Estado para mostrar el modal de agregar
  const [newTrasladoName, setNewTrasladoName] = useState('') // Estado para el nombre del nuevo traslado
  const trasladosPerPage = 8

  useEffect(() => {
    const fetchTraslados = async () => {
      try {
        const response = await fetch(`${apiUrl}traslado`)
        if (!response.ok) {
          throw new Error('Error al obtener los traslados.')
        }
        const data = await response.json()
        setTraslados(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTraslados()
  }, [])

  const handleEditClick = (traslado: Traslado) => {
    setEditingTraslado(traslado)
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTraslado) return

    try {
      const response = await fetch(
        `${apiUrl}traslado/${editingTraslado.id_traslado}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingTraslado),
        }
      )

      if (!response.ok) {
        throw new Error('Error al actualizar el traslado.')
      }

      const updatedTraslados = traslados.map((traslado) =>
        traslado.id_traslado === editingTraslado.id_traslado
          ? editingTraslado
          : traslado
      )
      setTraslados(updatedTraslados)
      setShowEditModal(false)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const handleAddTraslado = async () => {
    try {
      const response = await fetch(`${apiUrl}traslado/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_traslado: newTrasladoName }),
      })

      if (!response.ok) {
        throw new Error('Error al agregar el traslado.')
      }

      const newTraslado: Traslado = await response.json()
      setTraslados([...traslados, newTraslado])
      setShowAddModal(false)
      setNewTrasladoName('') // Limpiar el nombre del nuevo traslado
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingTraslado) {
      setEditingTraslado({
        ...editingTraslado,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleNextPage = () => {
    if (currentPage < Math.ceil(traslados.length / trasladosPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const indexOfLastTraslado = currentPage * trasladosPerPage
  const indexOfFirstTraslado = indexOfLastTraslado - trasladosPerPage
  const currentTraslados = traslados.slice(
    indexOfFirstTraslado,
    indexOfLastTraslado
  )

  if (loading) {
    return <div className="transfers-tables-admins">Cargando traslados...</div>
  }

  if (error) {
    return <div className="transfers-tables-admins">Error: {error}</div>
  }

  return (
    <div className="users-tables-admins">
      <h2>Lista de Traslados</h2>
      <button
        type="button"
        className="add-button-subject"
        onClick={() => setShowAddModal(true)}
      >
        Añadir nuevo traslado
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
          {currentTraslados.map((traslado) => (
            <tr key={traslado.id_traslado}>
              <td>{traslado.id_traslado}</td>
              <td>{traslado.nombre_traslado}</td>
              <td>
                <button
                  type="button"
                  className="save-button"
                  onClick={() => handleEditClick(traslado)}
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
          {Math.ceil(traslados.length / trasladosPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(traslados.length / trasladosPerPage)
          }
        >
          Siguiente
        </button>
      </div>

      {showEditModal && editingTraslado && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Traslado</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_traslado"
                  value={editingTraslado.nombre_traslado}
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
            <h3>Añadir Nuevo Traslado</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddTraslado()
              }}
            >
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_traslado"
                  value={newTrasladoName}
                  onChange={(e) => setNewTrasladoName(e.target.value)}
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
