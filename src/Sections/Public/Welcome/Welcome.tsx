import { useState, useEffect } from 'react'
import './Welcome.css'
import { apiUrl } from '../../../Constants/api'
import { ModalMision, ModalVision } from '../../../Modals'

interface WelcomeData {
  id_welcome: number
  welcome_text: string
  foto_welcome: string | null
}

export default function Welcome() {
  const [welcomes, setWelcomes] = useState<WelcomeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMisionModalOpen, setIsMisionModalOpen] = useState(false)
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false)

  useEffect(() => {
    const fetchWelcomes = async () => {
      try {
        const response = await fetch(`${apiUrl}welcome`)
        if (!response.ok) {
          throw new Error('Error al obtener los datos de bienvenida')
        }
        const data: WelcomeData[] = await response.json()
        setWelcomes(data)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchWelcomes()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Bienvenido al C.B.T.A. No.5</h1>
      <div className="welcome-items">
        {welcomes.map((welcome) => (
          <div key={welcome.id_welcome} className="welcome-item">
            {welcome.foto_welcome && (
              <img
                src={`data:image/png;base64,${welcome.foto_welcome}`}
                alt="Welcome"
                className="welcome-image"
              />
            )}
            <p className="welcome-text">{welcome.welcome_text}</p>
          </div>
        ))}
      </div>
      <div className="align-buttons">
        <button onClick={() => setIsMisionModalOpen(true)}>Misión</button>
        <button onClick={() => setIsVisionModalOpen(true)}>Visión</button>
      </div>
      <ModalMision
        isOpen={isMisionModalOpen}
        onRequestClose={() => setIsMisionModalOpen(false)}
      />
      <ModalVision
        isOpen={isVisionModalOpen}
        onRequestClose={() => setIsVisionModalOpen(false)}
      />
    </div>
  )
}
