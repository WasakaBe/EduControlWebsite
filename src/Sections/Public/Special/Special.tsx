import { useState, useEffect, useRef } from 'react'
import './Special.css'
import { apiUrl } from '../../../Constants/api'
import { ModalCarrera } from '../../../Modals'

interface CarreraTecnica {
  id_carrera_tecnica: number
  nombre_carrera_tecnica: string
  descripcion_carrera_tecnica: string
  foto_carrera_tecnica: string | null
}

export default function Special() {
  const [carreras, setCarreras] = useState<CarreraTecnica[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCarrera, setSelectedCarrera] = useState<CarreraTecnica | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await fetch(`${apiUrl}carreras/tecnicas`)
        if (!response.ok) {
          throw new Error('Error al obtener las carreras técnicas')
        }
        const data = await response.json()
        setCarreras(data.carreras)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchCarreras()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 3000) // Cambia de imagen cada 3 segundos

    return () => clearInterval(interval)
  }, [carreras])

  const handleNext = () => {
    if (carouselRef.current) {
      const firstItem = carouselRef.current.firstElementChild
      if (firstItem) {
        carouselRef.current.appendChild(firstItem)
      }
    }
  }

  const handlePrev = () => {
    if (carouselRef.current) {
      const lastItem = carouselRef.current.lastElementChild
      if (lastItem) {
        carouselRef.current.prepend(lastItem)
      }
    }
  }

  const openModal = (carrera: CarreraTecnica) => {
    if (!isModalOpen) {
      setSelectedCarrera(carrera)
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCarrera(null) // Limpiar la carrera seleccionada después de cerrar la modal
  }
  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="special-container">
      <h2 className="special-title">Popular this week</h2>
      <div className="special-carousel-wrapper">
        <button className="carousel-control prev" onClick={handlePrev}>
          &#10094;
        </button>
        <div className="special-carousel" ref={carouselRef}>
          {carreras.map((carrera) => (
            <div
              key={carrera.id_carrera_tecnica}
              className="special-item"
              onClick={() => openModal(carrera)}
            >
              {carrera.foto_carrera_tecnica && (
                <img
                  src={`data:image/png;base64,${carrera.foto_carrera_tecnica}`}
                  alt={carrera.nombre_carrera_tecnica}
                  className="special-image"
                />
              )}
            </div>
          ))}
        </div>
        <button className="carousel-control next" onClick={handleNext}>
          &#10095;
        </button>
      </div>
      <ModalCarrera
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        carrera={selectedCarrera}
      />
    </div>
  )
}
