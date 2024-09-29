import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Activities.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiUrl } from '../../../Constants/api';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { Activity } from '../../../Constants/Interfaces';
import { ModalSobreNosotros, ModalContacto } from '../../../Modals';

const Activities: React.FC = () => {
  const [activitiesData, setActivitiesData] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalContactoOpen, setIsModalContactoOpen] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);

  // Definir fetchActivities con useCallback para memorizar la función
  const fetchActivities = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}actividades_noticias`);
      if (!response.ok) {
        throw new Error('La respuesta de la red no fue correcta');
      }
      const data: Activity[] = await response.json();
      if (data.length) {
        setActivitiesData(data);
      } else {
        toast.info('No hay actividades noticias disponibles.');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error al obtener actividades noticias: ' + error.message);
      }
    }
  }, []);

  // useEffect con fetchActivities como dependencia
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleNext = () => {
    const slide = slideRef.current;
    if (slide && slide.firstElementChild) {
      slide.appendChild(slide.firstElementChild);
    }
  };

  const handlePrev = () => {
    const slide = slideRef.current;
    if (slide && slide.lastElementChild) {
      slide.prepend(slide.lastElementChild);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalContacto = () => {
    setIsModalContactoOpen(true);
  };

  const closeModalContacto = () => {
    setIsModalContactoOpen(false);
  };

  return (
    <div className="container-act">
      <ToastContainer /> {/* Contenedor para los toasts */}
      <div id="slide" ref={slideRef}>
        {activitiesData.map((activity, index) => (
          <div
            key={index}
            className="item"
            style={{
              backgroundImage: `url(data:image/png;base64,${activity.imagen_actividad_noticia})`,
            }}
          >
            <div className="content">
              <div className="name">{activity.titulo_actividad_noticia}</div>
              <br />
              <div className="des">
                {activity.descripcion_actividad_noticia}
              </div>
              <br />

              <div className="align-buttons">
                <button className="save-button" onClick={openModal}>
                  Acerca De
                </button>
                <button className="save-button" onClick={openModalContacto}>
                  Contactanos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="buttonsx">
        <button className="b1" id="prev" onClick={handlePrev}>
          <span className="icon">
            <IoChevronBackOutline />
          </span>
        </button>
        <button className="b1" id="next" onClick={handleNext}>
          <span className="icon">
            <IoChevronForwardOutline />
          </span>
        </button>
      </div>
      <ModalSobreNosotros isOpen={isModalOpen} onRequestClose={closeModal} />
      <ModalContacto isOpen={isModalContactoOpen} onRequestClose={closeModalContacto} />
    </div>
  );
};

export default Activities;
