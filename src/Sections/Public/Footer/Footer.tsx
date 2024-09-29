import React from 'react'
import './Footer.css'

const Footer: React.FC = () => {
  return (
    <div className="container-footer">
      <div className="sect-footer">
        <div className="footer-info">
          <h1>Datos de la empresa</h1>
          <ul>
            <li>
              <p>Centro Bachillerato Tecnológico Agropecuario No.5:</p>
              <span>"Hermanos Flores Magon"</span>
            </li>
            <li>
              <p>Direccion:</p>
              <span>
                Adolfo López Mateos SN, Aviación Civil, 43000 Huejutla, Hgo.
              </span>
            </li>
            <li>
              <p>Telefono:</p>
              <span>789 896 0065</span>
            </li>
            <li>
              <p>Celular:</p>
              <span>+52 7713591287</span>
            </li>
          </ul>
        </div>
        <div className="footer-enlaces">
          <h1>Información</h1>
          <ul>
            <li>
              <a href="/terms">Términos y Condiciones</a>
            </li>
            <li>
              <a href="/privacy">Aviso de privacidad</a>
            </li>
            <li>
              <a href="/aviso/clientes">Aviso de clientes</a>
            </li>
          </ul>
        </div>
        <div className="footer-icons">
          <h1>Redes de la empresa</h1>
          <ul>
            <li>
              <a href="/" className="icon1">
               Facebook
              </a>
            </li>
            <li>
              <a href="/" className="icon2">
                Twitter / X
              </a>
            </li>
            <li>
              <a href="/" className="icon3">
              Youtube
              </a>
            </li>
            <li>
              <a href="/" className="icon4">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="sect-footer-end">
        <p>Todos los derechos reservados | © 2023 Cbta 5</p>
      </div>
    </div>
  )
}

export default Footer
