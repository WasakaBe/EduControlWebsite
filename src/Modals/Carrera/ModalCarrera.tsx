import React from 'react';
import Modal from 'react-modal';
import './ModalCarrera.css';

interface CarreraTecnica {
  id_carrera_tecnica: number;
  nombre_carrera_tecnica: string;
  descripcion_carrera_tecnica: string;
  foto_carrera_tecnica: string | null;
}

interface ModalCarreraProps {
  isOpen: boolean;
  onRequestClose: () => void;
  carrera: CarreraTecnica | null;
}

const ModalCarrera: React.FC<ModalCarreraProps> = ({ isOpen, onRequestClose, carrera }) => {
  if (!carrera) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      contentLabel="Información de Carrera"
      className="modal-carrera"
      overlayClassName="overlay-carrera"
    >
      <h2 className="modal-title-carrera">{carrera.nombre_carrera_tecnica}</h2>
      {carrera.foto_carrera_tecnica && (
        <img
          src={`data:image/png;base64,${carrera.foto_carrera_tecnica}`}
          alt={carrera.nombre_carrera_tecnica}
          className="modal-image-carrera"
        />
      )}
      <p className="modal-description-carrera">{carrera.descripcion_carrera_tecnica}</p>
      <button onClick={onRequestClose} className="modal-close-button-carrera">Cerrar</button>
    </Modal>
  );
}

export default ModalCarrera;
