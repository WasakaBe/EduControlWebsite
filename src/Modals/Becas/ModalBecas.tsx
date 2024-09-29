import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ModalBecas.css';
import { apiUrl } from '../../Constants/api';

interface BecaInfo {
  id_info_becas: number;
  titulo_info_becas: string;
  descripcion_info_becas: string;
  requisitos_info_becas: string;
  foto_info_becas: string | null;
}

interface ModalBecasProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ModalBecas: React.FC<ModalBecasProps> = ({ isOpen, onRequestClose }) => {
  const [becas, setBecas] = useState<BecaInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBecas = async () => {
      try {
        const response = await fetch(`${apiUrl}info_becas`);
        if (!response.ok) {
          throw new Error('Error al obtener la información de becas');
        }
        const data = await response.json();
        setBecas(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchBecas();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Información de Becas"
      className="modal-becas"
      overlayClassName="overlay-becas"
    >
      <h2 className="modal-title-becas">Información de Becas</h2>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <div className="modal-content-becas">
        {becas.map((beca) => (
          <div key={beca.id_info_becas} className="beca-item">
            {beca.foto_info_becas && (
              <img
                src={`data:image/png;base64,${beca.foto_info_becas}`}
                alt={beca.titulo_info_becas}
                className="beca-image"
              />
            )}
            <h3>{beca.titulo_info_becas}</h3>
            <p>{beca.descripcion_info_becas}</p>
            <p><strong>Requisitos:</strong> {beca.requisitos_info_becas}</p>
          </div>
        ))}
      </div>
      <button onClick={onRequestClose} className="modal-close-button-becas">Cerrar</button>
    </Modal>
  );
}

export default ModalBecas;
