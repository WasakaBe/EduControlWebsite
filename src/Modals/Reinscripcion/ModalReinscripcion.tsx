import React from 'react';
import Modal from 'react-modal';
import './ModalReinscripcion.css';

interface ModalReinscripcionProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ModalReinscripcion: React.FC<ModalReinscripcionProps> = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Reinscripción"
      className="modal-reinscripcion"
      overlayClassName="overlay-reinscripcion"
    >
      <h2 className="modal-title-becas">Reinscripción</h2>
      <p>POR EL MOMENTO NO SE ENCUENTRA DISPONIBLE, para más información acuda a su centro de servicio escolar en su plantel.</p>
      <button onClick={onRequestClose} className="modal-close-button-becas">Cerrar</button>
    </Modal>
  );
}

export default ModalReinscripcion;
