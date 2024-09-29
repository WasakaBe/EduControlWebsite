import React, { useState, useEffect } from 'react'
import { apiUrl } from '../../../../Constants/api'

interface WelcomeData {
  id_welcome: number
  welcome_text: string
  foto_welcome: File | string | null
}

export default function Welcome() {
  const [welcomes, setWelcomes] = useState<WelcomeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newWelcome, setNewWelcome] = useState({
    welcome_text: '',
    foto_welcome: null as File | null,
  })
  const [editingWelcome, setEditingWelcome] = useState<WelcomeData | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Obtener todas las bienvenidas
  useEffect(() => {
    const fetchWelcomes = async () => {
      try {
        const response = await fetch(`${apiUrl}/welcome`)
        if (!response.ok) throw new Error('Error al obtener las bienvenidas')

        const data = await response.json()
        setWelcomes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchWelcomes()
  }, [])

  // Crear una nueva bienvenida
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('welcome_text', newWelcome.welcome_text)
    if (newWelcome.foto_welcome) {
      formData.append('foto_welcome', newWelcome.foto_welcome)
    }

    try {
      const response = await fetch(`${apiUrl}/welcomes/insert`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Error al crear la bienvenida')

      const newWelcomeData: WelcomeData = await response.json()
      setWelcomes([...welcomes, newWelcomeData])
      setShowAddModal(false)
      setNewWelcome({ welcome_text: '', foto_welcome: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  // Actualizar una bienvenida
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingWelcome) return

    const formData = new FormData()
    formData.append('welcome_text', editingWelcome.welcome_text)
    if (editingWelcome.foto_welcome) {
      formData.append('foto_welcome', editingWelcome.foto_welcome)
    }

    try {
      const response = await fetch(
        `${apiUrl}/welcome/update/${editingWelcome.id_welcome}`,
        {
          method: 'PUT',
          body: formData,
        }
      )
      if (!response.ok) throw new Error('Error al actualizar la bienvenida')

      const updatedList = welcomes.map((welcome) =>
        welcome.id_welcome === editingWelcome.id_welcome
          ? editingWelcome
          : welcome
      )
      setWelcomes(updatedList)
      setShowEditModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  // Eliminar una bienvenida
  const handleDeleteSubmit = async () => {
    if (!editingWelcome) return

    try {
      const response = await fetch(
        `${apiUrl}/welcome/${editingWelcome.id_welcome}`,
        {
          method: 'DELETE',
        }
      )
      if (!response.ok) throw new Error('Error al eliminar la bienvenida')

      setWelcomes(
        welcomes.filter(
          (welcome) => welcome.id_welcome !== editingWelcome.id_welcome
        )
      )
      setShowDeleteModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="users-tables-admins">
      <h2>Bienvenidas</h2>
      <button
        className="add-button-aboutme"
        onClick={() => setShowAddModal(true)}
      >
        Añadir Bienvenida
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Texto</th>
            <th>Foto</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {welcomes.map((welcome) => (
            <tr key={welcome.id_welcome}>
              <td>{welcome.id_welcome}</td>
              <td>{welcome.welcome_text}</td>
              <td>
                {welcome.foto_welcome ? (
                  <img
                    src={`data:image/jpeg;base64,${welcome.foto_welcome}`}
                    alt="Foto de bienvenida"
                    className="aboutme-image"
                  />
                ) : (
                  'No disponible'
                )}
              </td>
              <td>
                <button
                  className="edit-button-aboutme"
                  onClick={() => {
                    setEditingWelcome(welcome)
                    setShowEditModal(true)
                  }}
                >
                  Editar
                </button>
                <button
                  className="delete-button-aboutme"
                  onClick={() => {
                    setEditingWelcome(welcome)
                    setShowDeleteModal(true)
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modales para añadir, editar y eliminar */}
      {showAddModal && (
        <div className="modal">
          <h3>Añadir Nueva Bienvenida</h3>
          <form onSubmit={handleAddSubmit}>
            <label>
              Texto:
              <input
                type="text"
                value={newWelcome.welcome_text}
                onChange={(e) =>
                  setNewWelcome({ ...newWelcome, welcome_text: e.target.value })
                }
                required
              />
            </label>
            <label>
              Foto:
              <input
                type="file"
                onChange={(e) =>
                  setNewWelcome({
                    ...newWelcome,
                    foto_welcome: e.target.files ? e.target.files[0] : null,
                  })
                }
              />
            </label>
            <button type="submit">Guardar</button>
            <button onClick={() => setShowAddModal(false)}>Cancelar</button>
          </form>
        </div>
      )}

      {showEditModal && editingWelcome && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Bienvenida</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Texto:
                <input
                  type="text"
                  value={editingWelcome.welcome_text}
                  onChange={(e) =>
                    setEditingWelcome({
                      ...editingWelcome,
                      welcome_text: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Foto:
                <input
                  type="file"
                  onChange={(e) =>
                    setEditingWelcome({
                      ...editingWelcome,
                      foto_welcome: e.target.files
                        ? e.target.files[0]
                        : editingWelcome.foto_welcome,
                    })
                  }
                />
              </label>
              <button type="submit" className="save-button-subject">
                Guardar
              </button>
              <button
                className="cancel-button-subject"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && editingWelcome && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>¿Estás seguro de que deseas eliminar esta bienvenida?</h3>
            <button
              type="button"
              className="cancel-button-subject"
              onClick={handleDeleteSubmit}
            >
              Eliminar
            </button>
            <br />
            <br />
            <button
              type="button"
              className="save-button-subject"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
