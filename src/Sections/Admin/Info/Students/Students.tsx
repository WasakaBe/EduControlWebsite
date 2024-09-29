import { useState, useEffect } from 'react'
import { apiUrl } from '../../../../Constants/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Alumn {
  id_alumnos: number
  nombre_alumnos: string
  app_alumnos: string
  apm_alumnos: string
  fecha_nacimiento_alumnos: string
  curp_alumnos: string
  nocontrol_alumnos: string
  telefono_alumnos: string
  seguro_social_alumnos: string
  cuentacredencial_alumnos: string
  idSexo: string
  idUsuario: number
  idClinica: string
  idGrado: string
  idGrupo: string
  idTraslado: string
  idTrasladotransporte: string
  idCarreraTecnica: string
  idPais: string
  idEstado: string
  municipio_alumnos: string
  comunidad_alumnos: string
  calle_alumnos: string
  proc_sec_alumno: string
}


export default function StudentsAdmin() {
  const [alumnos, setAlumnos] = useState<Alumn[]>([])
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const alumnosPerPage = 2 // Cantidad de alumnos por página
  const [showModal, setShowModal] = useState(false) // Estado para mostrar la modal
  const [showCsvModal, setShowCsvModal] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  // Funciones para abrir y cerrar la modal
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const openCsvModal = () => {
    closeModal() // Cerramos la primera modal antes de abrir la de CSV
    setShowCsvModal(true)
  }
  const closeCsvModal = () => setShowCsvModal(false)

  useEffect(() => {
    fetchAlumnos()
  }, [])

  // Obtener todos los alumnos
  const fetchAlumnos = async () => {
    try {
      const response = await fetch(`${apiUrl}alumno`)
      const data = await response.json()
      setAlumnos(data)
    } catch (error) {
      toast.error(`Error al obtener los alumnos: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Manejar la selección del archivo CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  // Enviar el archivo CSV al backend
  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Por favor selecciona un archivo CSV')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${apiUrl}alumno/upload_csv`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.success('Archivo CSV subido exitosamente')
        closeCsvModal() // Cerrar la segunda modal de CSV
        fetchAlumnos() // Refrescar la lista de alumnos después de subir
      } else {
        const errorData = await response.json()
        toast.error(`Error al subir CSV: ${errorData.error}`)
      }
    } catch (error) {
      toast.error(`Error al subir CSV: ${error}`)
    }
  }

  // Calcular el índice de los alumnos a mostrar en la página actual
  const indexOfLastAlumno = currentPage * alumnosPerPage
  const indexOfFirstAlumno = indexOfLastAlumno - alumnosPerPage
  const currentAlumnos = alumnos.slice(indexOfFirstAlumno, indexOfLastAlumno)

  // Cambiar de página
  const handleNextPage = () => {
    if (currentPage < Math.ceil(alumnos.length / alumnosPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Cargando alumnos...</p>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="users-tables-admins">
      <h2>Gestión de Alumnos</h2>

      <button type="button" className="add-button-subject" onClick={openModal}>
        Añadir Alumnos
      </button>

      <ToastContainer />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Fecha de Nacimiento</th>
            <th>CURP</th>
            <th>No. Control</th>
            <th>Teléfono</th>
            <th>Seguro Social</th>
            <th>Credencial</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentAlumnos.length === 0 ? (
            <tr>
              <td colSpan={11}>No hay alumnos disponibles.</td>
            </tr>
          ) : (
            currentAlumnos.map((alumno) => (
              <tr key={alumno.id_alumnos}>
                <td>{alumno.id_alumnos}</td>
                <td>{alumno.nombre_alumnos}</td>
                <td>{alumno.app_alumnos}</td>
                <td>{alumno.apm_alumnos}</td>
                <td>{alumno.fecha_nacimiento_alumnos}</td>
                <td>{alumno.curp_alumnos}</td>
                <td>{alumno.nocontrol_alumnos}</td>
                <td>{alumno.telefono_alumnos}</td>
                <td>{alumno.seguro_social_alumnos}</td>
                <td>{alumno.cuentacredencial_alumnos}</td>
                <td>
                  <button className="save-button-subject">Editar</button>
                  <button className="cancel-button-subject">Eliminar</button>
                  <button className="add-button-subject">Crear Usuario</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginador */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {Math.ceil(alumnos.length / alumnosPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(alumnos.length / alumnosPerPage)}
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h2>Agregar Alumnos</h2>
            <button
              onClick={() => console.log('Agregar Manualmente')}
              className="save-button-subject"
            >
              Agregar Manualmente
            </button>
            <button onClick={openCsvModal} className="add-button-subject">
              Agregar por CSV
            </button>
            <button
              onClick={closeModal}
              className="modal-button cancel-button-subject"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

       {/* Segunda Modal: Subir archivo CSV */}
       {showCsvModal && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h2>Subir archivo CSV</h2>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleFileUpload} className="add-button-subject">
              Subir archivo
            </button>
            <button onClick={closeCsvModal} className="modal-button cancel-button-subject">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
