import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import './ModalSobreNosotros.css'
import { apiUrl } from '../../Constants/api'
interface SobreNosotrosData {
  id_sobre_nosotros: number
  txt_sobre_nosotros: string
  imagen_sobre_nosotros: string | null
  fecha_sobre_nosotros: string
}

interface ModalSobreNosotrosProps {
  isOpen: boolean
  onRequestClose: () => void
}

const ModalSobreNosotros: React.FC<ModalSobreNosotrosProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const [data, setData] = useState<SobreNosotrosData[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchSobreNosotros()
    }
  }, [isOpen])

  const fetchSobreNosotros = async () => {
    try {
      const response = await fetch(`${apiUrl}sobre_nosotros`)
      if (!response.ok) {
        throw new Error('Error al obtener la información sobre nosotros')
      }
      const result: SobreNosotrosData[] = await response.json()
      setData(result)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Sobre Nosotros"
      className="modal-sobre-nosotros"
      ariaHideApp={false}
      overlayClassName="overlay-sobre-nosotros"
    >
      <h2 className="titulo-sobre-nosotros">Sobre Nosotros</h2>
      {data.length ? (
        data.map((info) => (
          <div
            key={info.id_sobre_nosotros}
            className="contenido-sobre-nosotros"
          >
            {info.imagen_sobre_nosotros && (
              <img
                src={`data:image/png;base64,${info.imagen_sobre_nosotros}`}
                alt="Imagen Sobre Nosotros"
                className="imagen-sobre-nosotros"
              />
            )}
            <div className="texto-sobre-nosotros">
              <p>{info.txt_sobre_nosotros}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No hay información disponible en este momento.</p>
      )}
      <button className="boton-cerrar-sobre-nosotros" onClick={onRequestClose}>
        Cerrar
      </button>
    </Modal>
  )
}

export default ModalSobreNosotros
