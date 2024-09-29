import { useState, useEffect } from 'react'
import { apiUrl } from '../../../../Constants/api'

interface Mision {
  id_mision: number
  mision_text: string
}

interface Vision {
  id_vision: number
  vision_text: string
}

export default function MissionVission() {
  const [misiones, setMisiones] = useState<Mision[]>([])
  const [visiones, setVisiones] = useState<Vision[]>([])
  const [newMision, setNewMision] = useState({ mision_text: '' })
  const [newVision, setNewVision] = useState({ vision_text: '' })
  const [editingMision, setEditingMision] = useState<Mision | null>(null)
  const [editingVision, setEditingVision] = useState<Vision | null>(null)
  const [showMisionModal, setShowMisionModal] = useState(false)
  const [showVisionModal, setShowVisionModal] = useState(false)

  useEffect(() => {
    fetchMisiones()
    fetchVisiones()
  }, [])

  const fetchMisiones = async () => {
    try {
      const response = await fetch(`${apiUrl}/mision`)
      const data = await response.json()
      setMisiones(data)
    } catch (error) {
      console.error('Error fetching misiones:', error)
    }
  }

  const fetchVisiones = async () => {
    try {
      const response = await fetch(`${apiUrl}/vision`)
      const data = await response.json()
      setVisiones(data)
    } catch (error) {
      console.error('Error fetching visiones:', error)
    }
  }

  const handleAddMision = async () => {
    try {
      const response = await fetch(`${apiUrl}/mision/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMision),
      })

      if (!response.ok) throw new Error('Error creating mision')

      fetchMisiones()
      setNewMision({ mision_text: '' })
    } catch (error) {
      console.error('Error creating mision:', error)
    }
  }

  const handleAddVision = async () => {
    try {
      const response = await fetch(`${apiUrl}/vision/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVision),
      })

      if (!response.ok) throw new Error('Error creating vision')

      fetchVisiones()
      setNewVision({ vision_text: '' })
    } catch (error) {
      console.error('Error creating vision:', error)
    }
  }

  const handleUpdateMision = async () => {
    if (!editingMision) return

    try {
      const response = await fetch(
        `${apiUrl}/mision/update/${editingMision.id_mision}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingMision),
        }
      )

      if (!response.ok) throw new Error('Error updating mision')

      fetchMisiones()
      setEditingMision(null)
      setShowMisionModal(false)
    } catch (error) {
      console.error('Error updating mision:', error)
    }
  }

  const handleUpdateVision = async () => {
    if (!editingVision) return

    try {
      const response = await fetch(
        `${apiUrl}/vision/update/${editingVision.id_vision}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingVision),
        }
      )

      if (!response.ok) throw new Error('Error updating vision')

      fetchVisiones()
      setEditingVision(null)
      setShowVisionModal(false)
    } catch (error) {
      console.error('Error updating vision:', error)
    }
  }

  const handleDeleteMision = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/mision/delete/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Error deleting mision')

      fetchMisiones()
    } catch (error) {
      console.error('Error deleting mision:', error)
    }
  }

  const handleDeleteVision = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/vision/delete/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Error deleting vision')

      fetchVisiones()
    } catch (error) {
      console.error('Error deleting vision:', error)
    }
  }

  return (
    <div className="users-tables-admins">
      <h2>Misiones</h2>
      <input
        type="text"
        value={newMision.mision_text}
        onChange={(e) => setNewMision({ mision_text: e.target.value })}
        placeholder="Nueva misión"
      />
      <button className="add-button-aboutme" onClick={handleAddMision}>
        Añadir Misión
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mision</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {misiones.map((mision) => (
            <tr key={mision.id_mision}>
              <td>{mision.id_mision}</td>
              <td>{mision.mision_text}</td>
              <td>
                <button
                  className="edit-button-aboutme"
                  onClick={() => {
                    setEditingMision(mision)
                    setShowMisionModal(true)
                  }}
                >
                  Editar
                </button>
                <button
                  className="delete-button-aboutme"
                  onClick={() => handleDeleteMision(mision.id_mision)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Visiones</h2>
      <input
        type="text"
        value={newVision.vision_text}
        onChange={(e) => setNewVision({ vision_text: e.target.value })}
        placeholder="Nueva visión"
      />
      <button className="add-button-aboutme" onClick={handleAddVision}>
        Añadir Visión
      </button>
      <table>
        <thead>
          <th>ID</th>
          <th>Vision</th>
          <th>Acciones</th>
        </thead>
        <tbody>
          {visiones.map((vision) => (
            <tr key={vision.id_vision}>
              <td>{vision.id_vision}</td>
              <td>{vision.vision_text}</td>
              <td>
                <button
                  className="edit-button-aboutme"
                  onClick={() => {
                    setEditingVision(vision)
                    setShowVisionModal(true)
                  }}
                >
                  Editar
                </button>
                <button
                  className="delete-button-aboutme"
                  onClick={() => handleDeleteVision(vision.id_vision)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showMisionModal && editingMision && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Misión</h3>
            <input
              type="text"
              value={editingMision.mision_text}
              onChange={(e) =>
                setEditingMision({
                  ...editingMision,
                  mision_text: e.target.value,
                })
              }
            />
            <button
              className="save-button-subject"
              onClick={handleUpdateMision}
            >
              Guardar
            </button>
            <button
              className="cancel-button-subject"
              onClick={() => setShowMisionModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showVisionModal && editingVision && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Visión</h3>
            <input
              type="text"
              value={editingVision.vision_text}
              onChange={(e) =>
                setEditingVision({
                  ...editingVision,
                  vision_text: e.target.value,
                })
              }
            />
            <button  className="save-button-subject" onClick={handleUpdateVision}>Guardar</button>
            <button  className="cancel-button-subject" onClick={() => setShowVisionModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
