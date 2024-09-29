import { useState } from 'react';
import './Navbar.css';
import { logo_cbta } from '../../../Assets';
import { ModalBecas, ModalReinscripcion } from '../../../Modals';
import { ModalLogin } from '../../../Forms';

export default function Navbar() {
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesMenuOpen, setIsMobileServicesMenuOpen] = useState(false);
  const [isModalBecasOpen, setIsModalBecasOpen] = useState(false);
  const [isModalReinscripcionOpen, setIsModalReinscripcionOpen] = useState(false);
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false); // Estado para la modal de login

  const toggleServicesMenu = () => {
    setIsServicesMenuOpen(!isServicesMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileServicesMenu = () => {
    setIsMobileServicesMenuOpen(!isMobileServicesMenuOpen);
  };

  const openModalBecas = () => {
    setIsModalBecasOpen(true);
  };

  const closeModalBecas = () => {
    setIsModalBecasOpen(false);
  };

  const openModalReinscripcion = () => {
    setIsModalReinscripcionOpen(true);
  };

  const closeModalReinscripcion = () => {
    setIsModalReinscripcionOpen(false);
  };

  const openModalLogin = () => { // Función para abrir la modal de login
    setIsModalLoginOpen(true);
  };

  const closeModalLogin = () => { // Función para cerrar la modal de login
    setIsModalLoginOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo_cbta} alt="Logo" className="logo" />
        <span className="navbar-text">EDUCONTROL</span>
      </div>
      <div className="navbar-hamburger" onClick={toggleMobileMenu}>
        <span className="hamburger-icon">&#9776;</span>
      </div>
      <ul className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <li>
          <a href="#inicio">INICIO</a>
        </li>
        <li
          className="navbar-item"
          onMouseEnter={toggleServicesMenu}
          onMouseLeave={toggleServicesMenu}
        >
          <a href="#servicios">SERVICIOS</a>
          {isServicesMenuOpen && (
            <ul className="dropdown-menu">
              <li>
                <a href="#reinscripcion" onClick={openModalReinscripcion}>REINSCRIPCIÓN</a>
              </li>
              <li>
                <a href="#becas" onClick={openModalBecas}>BECAS</a>
              </li>
              <li>
                <a href="#titulacion">TITULACIÓN</a>
              </li>
            </ul>
          )}
        </li>
        <li>
          <a href="#blog">BLOG</a>
        </li>
        <li>
          <a href="#iniciar-sesion" onClick={openModalLogin}>INICIAR SESIÓN</a> {/* Llama a la modal de login */}
        </li>
        <li>
          <a href="#registro">REGISTRO</a>
        </li>
      </ul>
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <span className="close-icon" onClick={toggleMobileMenu}>
            &times;
          </span>
          <ul className="mobile-menu-list">
            <li>
              <a href="#inicio">INICIO</a>
            </li>
            <li>
              <a href="#servicios" onClick={toggleMobileServicesMenu}>
                SERVICIOS
              </a>
              {isMobileServicesMenuOpen && (
                <ul className="dropdown-mobile-menu">
                  <li>
                    <a href="#inscripcion">INSCRIPCIÓN</a>
                  </li>
                  <li>
                    <a href="#reinscripcion" onClick={openModalReinscripcion}>REINSCRIPCIÓN</a>
                  </li>
                  <li>
                    <a href="#becas" onClick={openModalBecas}>BECAS</a>
                  </li>
                  <li>
                    <a href="#titulacion">TITULACIÓN</a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a href="#blog">BLOG</a>
            </li>
            <li>
              <a href="#iniciar-sesion" onClick={openModalLogin}>INICIAR SESIÓN</a> {/* Llama a la modal de login */}
            </li>
            <li>
              <a href="#registro">REGISTRO</a>
            </li>
          </ul>
        </div>
      )}
      <ModalBecas isOpen={isModalBecasOpen} onRequestClose={closeModalBecas} />
      <ModalReinscripcion isOpen={isModalReinscripcionOpen} onRequestClose={closeModalReinscripcion} />
      <ModalLogin isOpen={isModalLoginOpen} onRequestClose={closeModalLogin} /> {/* Incluye la modal de login */}
    </nav>
  );
}
