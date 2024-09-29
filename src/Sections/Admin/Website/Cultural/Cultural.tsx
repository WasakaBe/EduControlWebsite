import React, { useState, useEffect } from 'react'
import { apiUrl } from '../../../../Constants/api'

interface ActividadCultural {
  id_actividad_cultural: number
  nombre_actividad_cultural: string
  descripcion_actividad_cultural: string
  imagen_actividad_cultural: string | null
}

export default function Cultural() {
  const [actividadesCulturales, setActividadesCulturales] = useState<
    ActividadCultural[]
  >([])
  const [newActividadCultural, setNewActividadCultural] = useState({
    nombre_actividad_cultural: '',
    descripcion_actividad_cultural: '',
    imagen_actividad_cultural: null as File | null,
  })
  const [editingActividadCultural, setEditingActividadCultural] =
    useState<ActividadCultural | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const actividadesPorPagina = 5;

   // Paginación: Calculamos el número total de páginas
   const totalPages = Math.ceil(actividadesCulturales.length / actividadesPorPagina);

   // Paginación: Filtramos las actividades para mostrar solo las de la página actual
   const indexOfLastActividad = currentPage * actividadesPorPagina;
   const indexOfFirstActividad = indexOfLastActividad - actividadesPorPagina;
   const currentActividades = actividadesCulturales.slice(indexOfFirstActividad, indexOfLastActividad);
 
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
    fetchActividadesCulturales()
  }, [])

  const fetchActividadesCulturales = async () => {
    try {
      const response = await fetch(`${apiUrl}/actividades_culturales`)
      const data = await response.json()
      setActividadesCulturales(data)
    } catch (error) {
      console.error('Error fetching actividades culturales:', error)
    }
  }

  const handleAddActividadCultural = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append(
      'nombre_actividad_cultural',
      newActividadCultural.nombre_actividad_cultural
    )
    formData.append(
      'descripcion_actividad_cultural',
      newActividadCultural.descripcion_actividad_cultural
    )
    if (newActividadCultural.imagen_actividad_cultural) {
      formData.append(
        'imagen_actividad_cultural',
        newActividadCultural.imagen_actividad_cultural
      )
    }

    try {
      const response = await fetch(`${apiUrl}/actividades_culturales/insert`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Error creando la actividad cultural')

      fetchActividadesCulturales()
      setNewActividadCultural({
        nombre_actividad_cultural: '',
        descripcion_actividad_cultural: '',
        imagen_actividad_cultural: null,
      })
      setShowAddModal(false)
    } catch (error) {
      console.error('Error creando la actividad cultural:', error)
    }
  }

  const handleUpdateActividadCultural = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingActividadCultural) return

    const formData = new FormData()
    formData.append(
      'nombre_actividad_cultural',
      editingActividadCultural.nombre_actividad_cultural
    )
    formData.append(
      'descripcion_actividad_cultural',
      editingActividadCultural.descripcion_actividad_cultural
    )
    if (newActividadCultural.imagen_actividad_cultural) {
      formData.append(
        'imagen_actividad_cultural',
        newActividadCultural.imagen_actividad_cultural
      )
    }

    try {
      const response = await fetch(
        `${apiUrl}/actividades_culturales/update/${editingActividadCultural.id_actividad_cultural}`,
        {
          method: 'PUT',
          body: formData,
        }
      )

      if (!response.ok)
        throw new Error('Error actualizando la actividad cultural')

      fetchActividadesCulturales()
      setShowEditModal(false)
      setEditingActividadCultural(null)
    } catch (error) {
      console.error('Error actualizando la actividad cultural:', error)
    }
  }

  const handleDeleteActividadCultural = async (id: number) => {
    try {
      const response = await fetch(
        `${apiUrl}/actividades_culturales/delete/${id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok)
        throw new Error('Error eliminando la actividad cultural')

      fetchActividadesCulturales()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error eliminando la actividad cultural:', error)
    }
  }

  return (
    <div className="users-tables-admins">
      <h2>Actividades Culturales</h2>
      <button
        className="add-button-aboutme"
        onClick={() => setShowAddModal(true)}
      >
        Añadir Actividad Cultural
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>TITULO</th>
            <th>DESCRIPCION</th>
            <th>IMAGEN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {currentActividades.map((actividad) => (
            <tr key={actividad.id_actividad_cultural}>
              <td>{actividad.id_actividad_cultural}</td>
              <td>{actividad.nombre_actividad_cultural}</td>
              <td>{actividad.descripcion_actividad_cultural}</td>
              <td>
                {actividad.imagen_actividad_cultural && (
                  <img
                    src={`data:image/jpeg;base64,${actividad.imagen_actividad_cultural}`}
                    alt="Imagen de actividad cultural"
                    className="aboutme-image"
                  />
                )}
              </td>
              <td>
                <button
                  className="edit-button-aboutme"
                  onClick={() => {
                    setEditingActividadCultural(actividad)
                    setShowEditModal(true)
                  }}
                >
                  Editar
                </button>
                <button
                  className="delete-button-aboutme"
                  onClick={() => {
                    setEditingActividadCultural(actividad)
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
      {/* Modal para añadir actividad cultural */}
      {showAddModal && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Añadir Actividad Cultural</h3>
            <form onSubmit={handleAddActividadCultural}>
              <input
                type="text"
                placeholder="Nombre"
                value={newActividadCultural.nombre_actividad_cultural}
                onChange={(e) =>
                  setNewActividadCultural({
                    ...newActividadCultural,
                    nombre_actividad_cultural: e.target.value,
                  })
                }
                required
              />
              <textarea
                placeholder="Descripción"
                value={newActividadCultural.descripcion_actividad_cultural}
                onChange={(e) =>
                  setNewActividadCultural({
                    ...newActividadCultural,
                    descripcion_actividad_cultural: e.target.value,
                  })
                }
                required
              />
              <input
                type="file"
                onChange={(e) =>
                  setNewActividadCultural({
                    ...newActividadCultural,
                    imagen_actividad_cultural: e.target.files
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

      {/* Modal para editar actividad cultural */}
      {showEditModal && editingActividadCultural && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Actividad Cultural</h3>
            <form onSubmit={handleUpdateActividadCultural}>
              <input
                type="text"
                value={editingActividadCultural.nombre_actividad_cultural}
                onChange={(e) =>
                  setEditingActividadCultural({
                    ...editingActividadCultural,
                    nombre_actividad_cultural: e.target.value,
                  })
                }
                required
              />
              <textarea
                value={editingActividadCultural.descripcion_actividad_cultural}
                onChange={(e) =>
                  setEditingActividadCultural({
                    ...editingActividadCultural,
                    descripcion_actividad_cultural: e.target.value,
                  })
                }
                required
              />
              <input
                type="file"
                onChange={(e) =>
                  setNewActividadCultural({
                    ...newActividadCultural,
                    imagen_actividad_cultural: e.target.files
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
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminar actividad cultural */}
      {showDeleteModal && editingActividadCultural && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>
              ¿Estás seguro de que deseas eliminar esta actividad cultural?
            </h3>
            <button
              className="cancel-button-subject"
              onClick={() =>
                handleDeleteActividadCultural(
                  editingActividadCultural.id_actividad_cultural
                )
              }
            >
              Eliminar
            </button>
            <button
              className="edit-button-aboutme"
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
