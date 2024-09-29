import { useState, useContext, useEffect } from 'react'
import { AboutMe, Carousel, Cultural, Familyrelationship, Grades, Groups, HeaderAdmin, Inscription, MissionVission, NavbarAdmin, Noticies, Questions, Speciality, StudentsAdmin, Subject, Transfers, Transport, UserTypes, Welcome } from '../../Sections/Admin'
import { AuthContext } from '../../Auto'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Users } from '../../Sections/Admin'

export default function Admin() {
  const authContext = useContext(AuthContext)
  const [currentView, setCurrentView] = useState<string | null>('headeraddmin')
  const navigate = useNavigate()

  const { isAuthenticated, user } = authContext || {}

  useEffect(() => {
    if (!isAuthenticated || user?.idRol !== 1) {
      navigate('/')
      toast.error('No tienes permisos de administrador.')
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div>
      <NavbarAdmin setCurrentView={setCurrentView} />
      {currentView === 'headeraddmin' && <HeaderAdmin />}
      {currentView === 'usuarios' && <Users />}
      {currentView === 'asignaturas' && <Subject />}
      {currentView === 'tipousuarios' && <UserTypes />}
      {currentView === 'traslados' && <Transfers />}
      {currentView === 'transportes' && <Transport />}
      {currentView === 'grados' && <Grades />}
      {currentView === 'grupos' && <Groups />}
      {currentView === 'preguntas' && <Questions />}
      {currentView === 'relacionfamiliar' && <Familyrelationship />}

      {currentView === 'carrusel' && <Carousel />}
      {currentView === 'sobremi' && <AboutMe />}
      {currentView === 'bienvenidaa' && <Welcome />}
      {currentView === 'misionvision' && <MissionVission />}
      {currentView === 'noticias' && <Noticies />}
      {currentView === 'cultural' && <Cultural />}
      {currentView === 'inscripcion' && <Inscription />}
      {currentView === 'carrerastecnicas' && <Speciality />}

      {currentView === 'infoalumnos' && <StudentsAdmin />}
    </div>
  )
}
