import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ModalMision.css';
import { apiUrl } from '../../Constants/api';

interface MisionData {
  id_mision: number;
  mision_text: string;
}

interface ModalMisionProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ModalMision: React.FC<ModalMisionProps> = ({ isOpen, onRequestClose }) => {
  const [misiones, setMisiones] = useState<MisionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchMisiones = async () => {
        try {
          const response = await fetch(`${apiUrl}mision`);
          if (!response.ok) {
            throw new Error('Error al obtener las misiones');
          }
          const data: MisionData[] = await response.json();
          setMisiones(data);
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchMisiones();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Misión"
      className="modal-mision"
      ariaHideApp={false}
      overlayClassName="overlay-mision"
    >
      <h2 className="modal-mision-title">Nuestra Misión</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="mision-content-mision">
          {misiones.map((mision) => (
            <p key={mision.id_mision} className="mision-text">{mision.mision_text}</p>
          ))}
        </div>
      )}
      <button onClick={onRequestClose} className="close-button-mision">Cerrar</button>
    </Modal>
  );
}

export default ModalMision;
