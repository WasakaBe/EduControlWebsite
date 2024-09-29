import { useContext } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import './NavbarAdmin.css'
import { AuthContext } from '../../../Auto'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { logo_cbta } from '../../../Assets'

interface NavbarAdminProps {
  setCurrentView: (view: string) => void // Definición de la propiedad esperada
}

export default function NavbarAdmin({ setCurrentView }: NavbarAdminProps) {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()

  // Verifica que el contexto y el usuario estén disponibles
  if (!authContext || !authContext.user) {
    return null // O muestra algún componente de carga o estado de "no logueado"
  }

  const { user, logout } = authContext

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Sesión cerrada correctamente')
  }

  return (
    <nav className="navbar-admin">
      <ToastContainer />
      <div className="navbar-logo">
        <img src={logo_cbta} alt="Logo" className="logo" />
        <span className="navbar-text">Administrador</span>
      </div>

      <ul className="navbar-admin-menu">
        <li>
        <Link to="#" onClick={() => setCurrentView('headeraddmin')}>INICIO</Link>
        </li>
        <li>
        <Link to="#" onClick={() => setCurrentView('usuarios')}>TABLAS</Link>
          <ul className="dropdown-menu-admin">
            <li>
            <Link to="#" onClick={() => setCurrentView('usuarios')}>USUARIOS</Link>
            </li>
            <li>
            <Link to="#" onClick={() => setCurrentView('asignaturas')}>ASIGNATURAS</Link>
            </li>
            <li>
            <Link to="#" onClick={() => setCurrentView('traslados')}>TRASLADOS</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('transportes')}>TRANSPORTES</Link>
            </li>
            <li>
                <Link to="#" onClick={() => setCurrentView('grados')}>GRADOS</Link>
            </li>
            <li>
              <Link  to="#" onClick={() => setCurrentView('grupos')}>GRUPOS</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('preguntas')}>PREGUNTAS</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('relacionfamiliar')}>RELACIÓN FAMILIAR</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="#">DISEÑO WEB</Link>
          <ul className="dropdown-menu-admin">
            <li>
            <Link to="#" onClick={() => setCurrentView('carrusel')}>CARRUSEL</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('bienvenidaa')}>BIENVENIDA</Link>
            </li>
            <li> 
              <Link to="#" onClick={() => setCurrentView('misionvision')}>MISIÓN - VISIÓN</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('noticias')}>NOTICIAS</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('inscripcion')}>INSCRIPCIÓN</Link>
            </li>
            <li>
            <Link to="#" onClick={() => setCurrentView('cultural')}>CULTURAL</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('carrerastecnicas')}>CARRERAS TÉCNICAS</Link>
            </li>
            <li>
            <Link to="#" onClick={() => setCurrentView('sobremi')}>ACERCA DE</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="#">INFORMACION</Link>
          <ul className="dropdown-menu-admin">
            <li>
              <Link to="#" onClick={() => setCurrentView('infoalumnos')}>ALUMNOS</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('infodocentes')}>DOCENTES</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('infobecas')}>BECAS</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="#">CREDENCIALES</Link>
          <ul className="dropdown-menu-admin">
            <li>
              <Link to="#" onClick={() => setCurrentView('crearcredencial')}>CREAR</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('visualizarcredencial')}>VISUALIZAR</Link>
            </li>
            <li>
              <Link to="#">DISEÑO DE CREDENCIALES</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="#">HORARIOS</Link>
          <ul className="dropdown-menu-admin">
            <li>
              <Link to="#" onClick={() => setCurrentView('asignarhorario')}>ASIGNAR</Link>
            </li>
            <li>
              <Link to="#" onClick={() => setCurrentView('visualizarhorario')}>VISUALIZAR</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="#" onClick={() => setCurrentView('mensajes')}>MENSAJES</Link>
        </li>
      </ul>
      <div className="navbar-admin-user">
        {user && user.foto_usuario ? (
          <>
            <img
              src={`data:image/png;base64,${user.foto_usuario}`}
              alt="Foto del usuario"
              className="navbar-admin-user-photo"
            />
            <span className="user-name">{user.nombre_usuario}</span>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <span className="user-name">{user.nombre_usuario}</span>
        )}
      </div>
    </nav>
  )
}
