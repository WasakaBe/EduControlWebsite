import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ModalVision.css';
import { apiUrl } from '../../Constants/api';

interface VisionData {
  id_vision: number;
  vision_text: string;
}

interface ModalVisionProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ModalVision: React.FC<ModalVisionProps> = ({ isOpen, onRequestClose }) => {
  const [visiones, setVisiones] = useState<VisionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchVisiones = async () => {
        try {
          const response = await fetch(`${apiUrl}vision`);
          if (!response.ok) {
            throw new Error('Error al obtener las visiones');
          }
          const data: VisionData[] = await response.json();
          setVisiones(data);
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchVisiones();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Visión"
      className="modal-vision"
      ariaHideApp={false}
      overlayClassName="overlay-vision"
    >
      <h2 className="modal-title-vision">Nuestra Visión</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="vision-content">
          {visiones.map((vision) => (
            <p key={vision.id_vision} className="vision-text">{vision.vision_text}</p>
          ))}
        </div>
      )}
      <button onClick={onRequestClose} className="close-button-mision">Cerrar</button>
    </Modal>
  );
}

export default ModalVision;
