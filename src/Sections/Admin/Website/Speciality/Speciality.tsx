import React, { useState, useEffect } from 'react'
import { apiUrl } from '../../../../Constants/api'

interface CarreraTecnica {
  id_carrera_tecnica: number
  nombre_carrera_tecnica: string
  descripcion_carrera_tecnica: string
  foto_carrera_tecnica: string | null
}

export default function Speciality() {
  const [carrerasTecnicas, setCarrerasTecnicas] = useState<CarreraTecnica[]>([])
  const [newCarreraTecnica, setNewCarreraTecnica] = useState({
    nombre_carrera_tecnica: '',
    descripcion_carrera_tecnica: '',
    foto_carrera_tecnica: null as File | null,
  })
  const [editingCarreraTecnica, setEditingCarreraTecnica] =
    useState<CarreraTecnica | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const carrerasPorPagina = 3;

   // Paginación: Calculamos el número total de páginas
   const totalPages = Math.ceil(carrerasTecnicas.length / carrerasPorPagina);

   // Paginación: Filtramos las carreras para mostrar solo las de la página actual
   const indexOfLastCarrera = currentPage * carrerasPorPagina;
   const indexOfFirstCarrera = indexOfLastCarrera - carrerasPorPagina;
   const currentCarreras = carrerasTecnicas.slice(indexOfFirstCarrera, indexOfLastCarrera);
 
   const handleNextPage = () => {
     if (currentPage < totalPages) {
       setCurrentPage(currentPage + 1);
     }
   };
 
   const handlePreviousPage = () => {
     if (currentPage > 1) {
       setCurrentPage(currentPage - 1);
     }
   };
 
  useEffect(() => {
    fetchCarrerasTecnicas()
  }, [])

  const fetchCarrerasTecnicas = async () => {
    try {
      const response = await fetch(`${apiUrl}/carreras/tecnicas`)
      const data = await response.json()
      setCarrerasTecnicas(data.carreras)
    } catch (error) {
      console.error('Error fetching carreras técnicas:', error)
    }
  }

  const handleAddCarreraTecnica = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append(
      'nombre_carrera_tecnica',
      newCarreraTecnica.nombre_carrera_tecnica
    )
    formData.append(
      'descripcion_carrera_tecnica',
      newCarreraTecnica.descripcion_carrera_tecnica
    )
    if (newCarreraTecnica.foto_carrera_tecnica) {
      formData.append(
        'foto_carrera_tecnica',
        newCarreraTecnica.foto_carrera_tecnica
      )
    }

    try {
      const response = await fetch(`${apiUrl}/carreras/tecnicas/insert`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Error creando la carrera técnica')

      fetchCarrerasTecnicas()
      setNewCarreraTecnica({
        nombre_carrera_tecnica: '',
        descripcion_carrera_tecnica: '',
        foto_carrera_tecnica: null,
      })
      setShowAddModal(false)
    } catch (error) {
      console.error('Error creando la carrera técnica:', error)
    }
  }

  const handleUpdateCarreraTecnica = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCarreraTecnica) return

    const formData = new FormData()
    formData.append(
      'nombre_carrera_tecnica',
      editingCarreraTecnica.nombre_carrera_tecnica
    )
    formData.append(
      'descripcion_carrera_tecnica',
      editingCarreraTecnica.descripcion_carrera_tecnica
    )
    if (newCarreraTecnica.foto_carrera_tecnica) {
      formData.append(
        'foto_carrera_tecnica',
        newCarreraTecnica.foto_carrera_tecnica
      )
    }

    try {
      const response = await fetch(
        `${apiUrl}/carreras/tecnicas/update/${editingCarreraTecnica.id_carrera_tecnica}`,
        {
          method: 'PUT',
          body: formData,
        }
      )

      if (!response.ok) throw new Error('Error actualizando la carrera técnica')

      fetchCarrerasTecnicas()
      setShowEditModal(false)
      setEditingCarreraTecnica(null)
    } catch (error) {
      console.error('Error actualizando la carrera técnica:', error)
    }
  }

  const handleDeleteCarreraTecnica = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/carreras/tecnicas/delete/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Error eliminando la carrera técnica')

      fetchCarrerasTecnicas()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error eliminando la carrera técnica:', error)
    }
  }

  return (
    <div className="users-tables-admins">
      <h2>Carreras Técnicas </h2>
      <button
        className="add-button-aboutme"
        onClick={() => setShowAddModal(true)}
      >
        Añadir Carrera Técnica
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>CARRERA</th>
            <th>DESCRIPCION</th>
            <th>LOGO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {currentCarreras.map((carrera) => (
            <tr key={carrera.id_carrera_tecnica}>
              <td>{carrera.id_carrera_tecnica}</td>
              <td>{carrera.nombre_carrera_tecnica}</td>
              <td>{carrera.descripcion_carrera_tecnica}</td>
              <td>
                {carrera.foto_carrera_tecnica && (
                  <img
                    src={`data:image/jpeg;base64,${carrera.foto_carrera_tecnica}`}
                    alt="Imagen de carrera técnica"
                    className="aboutme-image"
                  />
                )}
              </td>
              <button
                className="edit-button-aboutme"
                onClick={() => {
                  setEditingCarreraTecnica(carrera)
                  setShowEditModal(true)
                }}
              >
                Editar
              </button>
              <button
                className="cancel-button-subject"
                onClick={() => {
                  setEditingCarreraTecnica(carrera)
                  setShowDeleteModal(true)
                }}
              >
                Eliminar
              </button>
            </tr>
          ))}
        </tbody>
      </table>
  {/* Paginación */}
  <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
      {/* Modal para añadir carrera técnica */}
      {showAddModal && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Añadir Carrera Técnica </h3>
            <form onSubmit={handleAddCarreraTecnica}>
              <input
                type="text"
                placeholder="Nombre"
                value={newCarreraTecnica.nombre_carrera_tecnica}
                onChange={(e) =>
                  setNewCarreraTecnica({
                    ...newCarreraTecnica,
                    nombre_carrera_tecnica: e.target.value,
                  })
                }
                required
              />
              <textarea
                placeholder="Descripción"
                value={newCarreraTecnica.descripcion_carrera_tecnica}
                onChange={(e) =>
                  setNewCarreraTecnica({
                    ...newCarreraTecnica,
                    descripcion_carrera_tecnica: e.target.value,
                  })
                }
                required
              />
              <input
                type="file"
                onChange={(e) =>
                  setNewCarreraTecnica({
                    ...newCarreraTecnica,
                    foto_carrera_tecnica: e.target.files
                      ? e.target.files[0]
                      : null,
                  })
                }
              />
              <button className="save-button-subject" type="submit">
                Guardar
              </button>
              <button
                className="cancel-button-subject"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar carrera técnica */}
      {showEditModal && editingCarreraTecnica && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Carrera Técnica</h3>
            <form onSubmit={handleUpdateCarreraTecnica}>
              <input
                type="text"
                value={editingCarreraTecnica.nombre_carrera_tecnica}
                onChange={(e) =>
                  setEditingCarreraTecnica({
                    ...editingCarreraTecnica,
                    nombre_carrera_tecnica: e.target.value,
                  })
                }
                required
              />
              <textarea
                value={editingCarreraTecnica.descripcion_carrera_tecnica}
                onChange={(e) =>
                  setEditingCarreraTecnica({
                    ...editingCarreraTecnica,
                    descripcion_carrera_tecnica: e.target.value,
                  })
                }
                required
              />
              <input
                type="file"
                onChange={(e) =>
                  setNewCarreraTecnica({
                    ...newCarreraTecnica,
                    foto_carrera_tecnica: e.target.files
                      ? e.target.files[0]
                      : null,
                  })
                }
              />
              <button   className="save-button-subject" type="submit">Guardar</button>
              <button   className="cancel-button-subject" onClick={() => setShowEditModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminar carrera técnica */}
      {showDeleteModal && editingCarreraTecnica && (
        <div className="modal-subject">
          <div className='modal-content-subject'>
          <h3>¿Estás seguro de que deseas eliminar esta carrera técnica?</h3>
          <button className="cancel-button-subject"
            onClick={() =>
              handleDeleteCarreraTecnica(
                editingCarreraTecnica.id_carrera_tecnica
              )
            }
          >
            Eliminar
          </button>
          <button className="save-button-subject" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
