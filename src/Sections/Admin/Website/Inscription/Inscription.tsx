import React, { useState, useEffect } from 'react'
import { apiUrl } from '../../../../Constants/api'

interface InfoInscription {
  id_info_inscription: number
  txt_info_inscription: string
  requeriments_info_inscription: string
  periodo_info_inscripcion: string
  imagen_info_inscription: string | null
}

export default function Inscription() {
  const [infoInscriptions, setInfoInscriptions] = useState<InfoInscription[]>(
    []
  )
  const [newInfoInscription, setNewInfoInscription] = useState({
    txt_info_inscription: '',
    requeriments_info_inscription: '',
    periodo_info_inscripcion: '',
    imagen_info_inscription: null as File | null,
  })
  const [editingInfoInscription, setEditingInfoInscription] =
    useState<InfoInscription | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchInfoInscriptions()
  }, [])

  const fetchInfoInscriptions = async () => {
    try {
      const response = await fetch(`${apiUrl}/info_inscription`)
      const data = await response.json()
      setInfoInscriptions(data)
    } catch (error) {
      console.error('Error fetching info inscriptions:', error)
    }
  }

  const handleAddInfoInscription = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append(
      'txt_info_inscription',
      newInfoInscription.txt_info_inscription
    )
    formData.append(
      'requeriments_info_inscription',
      newInfoInscription.requeriments_info_inscription
    )
    formData.append(
      'periodo_info_inscripcion',
      newInfoInscription.periodo_info_inscripcion
    )
    if (newInfoInscription.imagen_info_inscription) {
      formData.append(
        'imagen_info_inscription',
        newInfoInscription.imagen_info_inscription
      )
    }

    try {
      const response = await fetch(`${apiUrl}/info_inscription/insert`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Error creating info inscription')

      fetchInfoInscriptions()
      setNewInfoInscription({
        txt_info_inscription: '',
        requeriments_info_inscription: '',
        periodo_info_inscripcion: '',
        imagen_info_inscription: null,
      })
      setShowAddModal(false)
    } catch (error) {
      console.error('Error creating info inscription:', error)
    }
  }

  const handleUpdateInfoInscription = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingInfoInscription) return

    const formData = new FormData()
    formData.append(
      'txt_info_inscription',
      editingInfoInscription.txt_info_inscription
    )
    formData.append(
      'requeriments_info_inscription',
      editingInfoInscription.requeriments_info_inscription
    )
    formData.append(
      'periodo_info_inscripcion',
      editingInfoInscription.periodo_info_inscripcion
    )
    if (newInfoInscription.imagen_info_inscription) {
      formData.append(
        'imagen_info_inscription',
        newInfoInscription.imagen_info_inscription
      )
    }

    try {
      const response = await fetch(
        `${apiUrl}/info_inscription/update/${editingInfoInscription.id_info_inscription}`,
        {
          method: 'PUT',
          body: formData,
        }
      )

      if (!response.ok) throw new Error('Error updating info inscription')

      fetchInfoInscriptions()
      setShowEditModal(false)
      setEditingInfoInscription(null)
    } catch (error) {
      console.error('Error updating info inscription:', error)
    }
  }

  const handleDeleteInfoInscription = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/info_inscription/delete/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Error deleting info inscription')

      fetchInfoInscriptions()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting info inscription:', error)
    }
  }

  return (
    <div className="users-tables-admins">
      <h2>Información de Inscripción</h2>
      <button
        className="add-button-aboutme"
        onClick={() => setShowAddModal(true)}
      >
        Añadir Información de Inscripción
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titulo</th>
            <th>Requerimientos</th>
            <th>Periodo</th>
            <th>Imagen</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {infoInscriptions.map((info) => (
            <tr key={info.id_info_inscription}>
              <td>{info.id_info_inscription}</td>
              <td>{info.txt_info_inscription}</td>
              <td>{info.requeriments_info_inscription}</td>
              <td>{info.periodo_info_inscripcion}</td>
              <td>
                {info.imagen_info_inscription && (
                  <img
                    src={`data:image/jpeg;base64,${info.imagen_info_inscription}`}
                    alt="Imagen de información de inscripción"
                    className="aboutme-image"
                  />
                )}
              </td>
              <button
                className="edit-button-aboutme"
                onClick={() => {
                  setEditingInfoInscription(info)
                  setShowEditModal(true)
                }}
              >
                Editar
              </button>
              <button
                className="delete-button-aboutme"
                onClick={() => {
                  setEditingInfoInscription(info)
                  setShowDeleteModal(true)
                }}
              >
                Eliminar
              </button>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para añadir información de inscripción */}
      {showAddModal && (
        <div className="modal-subject">
     <div className='modal-content-subject'>
     <h3>Añadir Información de Inscripción</h3>
          <form onSubmit={handleAddInfoInscription}>
            <input
              type="text"
              placeholder="Texto de la información"
              value={newInfoInscription.txt_info_inscription}
              onChange={(e) =>
                setNewInfoInscription({
                  ...newInfoInscription,
                  txt_info_inscription: e.target.value,
                })
              }
              required
            />
            <textarea
              placeholder="Requerimientos"
              value={newInfoInscription.requeriments_info_inscription}
              onChange={(e) =>
                setNewInfoInscription({
                  ...newInfoInscription,
                  requeriments_info_inscription: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Periodo"
              value={newInfoInscription.periodo_info_inscripcion}
              onChange={(e) =>
                setNewInfoInscription({
                  ...newInfoInscription,
                  periodo_info_inscripcion: e.target.value,
                })
              }
              required
            />
            <input
              type="file"
              onChange={(e) =>
                setNewInfoInscription({
                  ...newInfoInscription,
                  imagen_info_inscription: e.target.files
                    ? e.target.files[0]
                    : null,
                })
              }
            />
            <button className="save-button-subject" type="submit">Guardar</button>
            <button className="cancel-button-subject" onClick={() => setShowAddModal(false)}>Cancelar</button>
          </form>
     </div>
        </div>
      )}

      {/* Modal para editar información de inscripción */}
      {showEditModal && editingInfoInscription && (
        <div className="modal-subject">
       <div className='modal-content-subject'>
       <h3>Editar Información de Inscripción</h3>
          <form onSubmit={handleUpdateInfoInscription}>
            <input
              type="text"
              value={editingInfoInscription.txt_info_inscription}
              onChange={(e) =>
                setEditingInfoInscription({
                  ...editingInfoInscription,
                  txt_info_inscription: e.target.value,
                })
              }
              required
            />
            <textarea
              value={editingInfoInscription.requeriments_info_inscription}
              onChange={(e) =>
                setEditingInfoInscription({
                  ...editingInfoInscription,
                  requeriments_info_inscription: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              value={editingInfoInscription.periodo_info_inscripcion}
              onChange={(e) =>
                setEditingInfoInscription({
                  ...editingInfoInscription,
                  periodo_info_inscripcion: e.target.value,
                })
              }
              required
            />
            <input
              type="file"
              onChange={(e) =>
                setNewInfoInscription({
                  ...newInfoInscription,
                  imagen_info_inscription: e.target.files
                    ? e.target.files[0]
                    : null,
                })
              }
            />
            <button  className="save-button-subject" type="submit">Guardar</button>
            <button  className="cancel-button-subject" onClick={() => setShowEditModal(false)}>Cancelar</button>
          </form>
       </div>
        </div>
      )}

      {/* Modal para eliminar información de inscripción */}
      {showDeleteModal && editingInfoInscription && (
        <div className="modal-subject">
          <div className='modal-content-subject'>
          <h3>
            ¿Estás seguro de que deseas eliminar esta información de
            inscripción?
          </h3>
          <button className="cancel-button-subject"
            onClick={() =>
              handleDeleteInfoInscription(
                editingInfoInscription.id_info_inscription
              )
            }
          >
            Eliminar
          </button>
          <button className="edit-button-aboutme" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
