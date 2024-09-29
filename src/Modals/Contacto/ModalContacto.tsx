import React, { useState } from 'react';
import Modal from 'react-modal';
import './ModalContacto.css';
import { apiUrl } from '../../Constants/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ModalContactoProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ModalContacto: React.FC<ModalContactoProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Expresión regular para validar el nombre

    if (regex.test(value)) {
      setNombre(value);
    } else {
      toast.error('El nombre solo puede contener letras y espacios.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      nombre_mensaje_contacto: nombre,
      correo_mensaje_contacto: correo,
      motivo_mensaje_contacto: motivo,
      mensaje_mensaje_contacto: mensaje,
    };

    try {
      const response = await fetch(`${apiUrl}mensaje_contacto/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje de contacto');
      }

      const result = await response.json();
      toast.success(result.message);

      setNombre('');
      setCorreo('');
      setMotivo('');
      setMensaje('');
    } catch {
      toast.error('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Contáctanos"
      ariaHideApp={false}
      className="modal-contacto"
      overlayClassName="overlay-contacto"
    >
      <ToastContainer /> {/* Contenedor para los toasts */}
      <h2 className="titulo-contacto">Contáctanos</h2>
      <form onSubmit={handleSubmit} className="form-contacto">
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={handleNombreChange}
          required
        />
        <label htmlFor="correo">Correo Electrónico:</label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <label htmlFor="motivo">Motivo:</label>
        <input
          type="text"
          id="motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
        <label htmlFor="mensaje">Mensaje:</label>
        <textarea
          id="mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
        />
        <button type="submit" className="boton-enviar-contacto">
          Enviar
        </button>
      </form>
      <button className="boton-cerrar-contacto" onClick={onRequestClose}>
        Cerrar
      </button>
    </Modal>
  );
};

export default ModalContacto;
