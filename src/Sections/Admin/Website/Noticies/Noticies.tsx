import React, { useState, useEffect } from 'react'
import { apiUrl } from '../../../../Constants/api'

interface ActividadNoticia {
  id_actividades_noticias: number
  titulo_actividad_noticia: string
  descripcion_actividad_noticia: string
  imagen_actividad_noticia: string | null
  fecha_actividad_noticias: string
}

export default function Noticies() {
  const [actividadesNoticias, setActividadesNoticias] = useState<
    ActividadNoticia[]
  >([])
  const [newActividadNoticia, setNewActividadNoticia] = useState({
    titulo_actividad_noticia: '',
    descripcion_actividad_noticia: '',
    imagen_actividad_noticia: null as File | null,
    fecha_actividad_noticias: '',
  })
  const [editingActividadNoticia, setEditingActividadNoticia] =
    useState<ActividadNoticia | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const noticiasPerPage = 5;

  useEffect(() => {
    fetchActividadesNoticias()
  }, [])

  const fetchActividadesNoticias = async () => {
    try {
      const response = await fetch(`${apiUrl}/actividades_noticias`)
      const data = await response.json()
      setActividadesNoticias(data)
    } catch (error) {
      console.error('Error fetching actividades/noticias:', error)
    }
  }

   // Paginación: Calculamos el número total de páginas
  const totalPages = Math.ceil(actividadesNoticias.length / noticiasPerPage);

  // Paginación: Filtramos las actividades para mostrar solo las de la página actual
  const indexOfLastNoticia = currentPage * noticiasPerPage;
  const indexOfFirstNoticia = indexOfLastNoticia - noticiasPerPage;
  const currentNoticias = actividadesNoticias.slice(indexOfFirstNoticia, indexOfLastNoticia);

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



  const handleAddActividadNoticia = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append(
      'titulo_actividad_noticia',
      newActividadNoticia.titulo_actividad_noticia
    )
    formData.append(
      'descripcion_actividad_noticia',
      newActividadNoticia.descripcion_actividad_noticia
    )
    if (newActividadNoticia.imagen_actividad_noticia) {
      formData.append(
        'imagen_actividad_noticia',
        newActividadNoticia.imagen_actividad_noticia
      )
    }
    formData.append(
      'fecha_actividad_noticias',
      newActividadNoticia.fecha_actividad_noticias
    )

    try {
      const response = await fetch(`${apiUrl}/actividades_noticias/insert`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Error creating actividad/noticia')

      fetchActividadesNoticias()
      setNewActividadNoticia({
        titulo_actividad_noticia: '',
        descripcion_actividad_noticia: '',
        imagen_actividad_noticia: null,
        fecha_actividad_noticias: '',
      })
      setShowAddModal(false)
    } catch (error) {
      console.error('Error creating actividad/noticia:', error)
    }
  }

  const handleUpdateActividadNoticia = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingActividadNoticia) return

    const formData = new FormData()
    formData.append(
      'titulo_actividad_noticia',
      editingActividadNoticia.titulo_actividad_noticia
    )
    formData.append(
      'descripcion_actividad_noticia',
      editingActividadNoticia.descripcion_actividad_noticia
    )
    if (newActividadNoticia.imagen_actividad_noticia) {
      formData.append(
        'imagen_actividad_noticia',
        newActividadNoticia.imagen_actividad_noticia
      )
    }
    formData.append(
      'fecha_actividad_noticias',
      editingActividadNoticia.fecha_actividad_noticias
    )

    try {
      const response = await fetch(
        `${apiUrl}/actividades_noticias/update/${editingActividadNoticia.id_actividades_noticias}`,
        {
          method: 'PUT',
          body: formData,
        }
      )

      if (!response.ok) throw new Error('Error updating actividad/noticia')

      fetchActividadesNoticias()
      setShowEditModal(false)
      setEditingActividadNoticia(null)
    } catch (error) {
      console.error('Error updating actividad/noticia:', error)
    }
  }

  const handleDeleteActividadNoticia = async (id: number) => {
    try {
      const response = await fetch(
        `${apiUrl}/actividades_noticias/delete/${id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) throw new Error('Error deleting actividad/noticia')

      fetchActividadesNoticias()
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error deleting actividad/noticia:', error)
    }
  }

  return (
    <div className="users-tables-admins">
      <h2>Actividades y Noticias</h2>
      <button onClick={() => setShowAddModal(true)} className='add-button-aboutme'>
        Añadir Actividad/Noticia
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titulo</th>
            <th>Descripcion</th>
            <th>foto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentNoticias.map((actividad) => (
            <tr key={actividad.id_actividades_noticias}>
              <td>{actividad.id_actividades_noticias}</td>
              <td>{actividad.titulo_actividad_noticia}</td>
              <td>{actividad.descripcion_actividad_noticia}</td>
              <td>
                {actividad.imagen_actividad_noticia && (
                  <img
                    src={`data:image/jpeg;base64,${actividad.imagen_actividad_noticia}`}
                    alt="Imagen de actividad/noticia"
                    className="aboutme-image"
                  />
                )}
              </td>
              <td>
                Fecha:{' '}
                {new Date(
                  actividad.fecha_actividad_noticias
                ).toLocaleDateString()}
              </td>
              <td>
                <button
                  className="edit-button-aboutme"
                  onClick={() => {
                    setEditingActividadNoticia(actividad)
                    setShowEditModal(true)
                  }}
                >
                  Editar
                </button>
                <button
                  className="delete-button-aboutme"
                  onClick={() => {
                    setEditingActividadNoticia(actividad)
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

      {/* Modal para añadir actividad/noticia */}
      {showAddModal && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Añadir Actividad/Noticia</h3>
            <form onSubmit={handleAddActividadNoticia}>
              <input
                type="text"
                placeholder="Título"
                value={newActividadNoticia.titulo_actividad_noticia}
                onChange={(e) =>
                  setNewActividadNoticia({
                    ...newActividadNoticia,
                    titulo_actividad_noticia: e.target.value,
                  })
                }
                required
              />
              <textarea
                placeholder="Descripción"
                value={newActividadNoticia.descripcion_actividad_noticia}
                onChange={(e) =>
                  setNewActividadNoticia({
                    ...newActividadNoticia,
                    descripcion_actividad_noticia: e.target.value,
                  })
                }
                required
              />
              <input
                type="file"
                onChange={(e) =>
                  setNewActividadNoticia({
                    ...newActividadNoticia,
                    imagen_actividad_noticia: e.target.files
                      ? e.target.files[0]
                      : null,
                  })
                }
              />
              <input
                type="datetime-local"
                value={newActividadNoticia.fecha_actividad_noticias}
                onChange={(e) =>
                  setNewActividadNoticia({
                    ...newActividadNoticia,
                    fecha_actividad_noticias: e.target.value,
                  })
                }
                required
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

      {/* Modal para editar actividad/noticia */}
      {showEditModal && editingActividadNoticia && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Actividad/Noticia</h3>
            <form onSubmit={handleUpdateActividadNoticia}>
              <input
                type="text"
                value={editingActividadNoticia.titulo_actividad_noticia}
                onChange={(e) =>
                  setEditingActividadNoticia({
                    ...editingActividadNoticia,
                    titulo_actividad_noticia: e.target.value,
                  })
                }
                required
              />
              <textarea
                value={editingActividadNoticia.descripcion_actividad_noticia}
                onChange={(e) =>
                  setEditingActividadNoticia({
                    ...editingActividadNoticia,
                    descripcion_actividad_noticia: e.target.value,
                  })
                }
                required
              />
              <input
                type="file"
                onChange={(e) =>
                  setNewActividadNoticia({
                    ...newActividadNoticia,
                    imagen_actividad_noticia: e.target.files
                      ? e.target.files[0]
                      : null,
                  })
                }
              />
              <input
                type="datetime-local"
                value={editingActividadNoticia.fecha_actividad_noticias}
                onChange={(e) =>
                  setEditingActividadNoticia({
                    ...editingActividadNoticia,
                    fecha_actividad_noticias: e.target.value,
                  })
                }
                required
              />
              <button   className="save-button-subject" type="submit">Guardar</button>
              <button   className="cancel-button-subject" onClick={() => setShowEditModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminar actividad/noticia */}
      {showDeleteModal && editingActividadNoticia && (
        <div className="modal-subject">
   <div className='modal-content-subject'>
   <h3>¿Estás seguro de que deseas eliminar esta actividad/noticia?</h3>
          <button  className="cancel-button-subject"
            onClick={() =>
              handleDeleteActividadNoticia(
                editingActividadNoticia.id_actividades_noticias
              )
            }
          >
            Eliminar
          </button>
          <button  className="edit-button-aboutme" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
   </div>
        </div>
      )}
    </div>
  )
}
