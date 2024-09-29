import { useState, useEffect } from 'react'
import './Users.css'
import { apiUrl } from '../../../../Constants/api'

interface User {
  id_usuario: number
  nombre_usuario: string
  app_usuario: string
  apm_usuario: string
  fecha_nacimiento_usuario: string
  token_usuario: string
  correo_usuario: string
  pwd_usuario: string
  phone_usuario: string
  ip_usuario: string
  id_rol: number
  nombre_rol: string | null
  id_sexo: number
  id_cuenta_activo: number
  id_pregunta: number
  respuesta_pregunta: string
  foto_usuario: string | null
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const usersPerPage = 4

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}usuario`)
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios.')
        }
        const data: User[] = await response.json()
        setUsers(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

  if (loading) {
    return <div className="users-tables-admins">Cargando usuarios...</div>
  }

  if (error) {
    return <div className="users-tables-admins">Error: {error}</div>
  }

  return (
    <div className="users-tables-admins">
      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Foto</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id_usuario}>
              <td>{user.id_usuario}</td>
              <td>{user.nombre_usuario}</td>
              <td>{user.app_usuario}</td>
              <td>{user.apm_usuario}</td>
              <td>{user.correo_usuario}</td>
              <td>{user.nombre_rol}</td>
              <td>{user.phone_usuario}</td>
              <td>
                {user.foto_usuario ? (
                  <img
                    src={`data:image/png;base64,${user.foto_usuario}`}
                    alt="Foto del usuario"
                    className="user-photo"
                  />
                ) : (
                  'No disponible'
                )}
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
          Página {currentPage} de {Math.ceil(users.length / usersPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(users.length / usersPerPage)}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
