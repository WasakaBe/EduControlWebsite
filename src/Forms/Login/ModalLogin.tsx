import React, { useState, useEffect, useRef, useContext } from 'react';
import Modal from 'react-modal';
import './ModalLogin.css';
import { apiUrl } from '../../Constants/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext, User } from '../../Auto/Auth';

interface ModalLoginProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ModalLogin: React.FC<ModalLoginProps> = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
  const [carruselImages, setCarruselImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;

  useEffect(() => {
    const fetchCarruselImages = async () => {
      try {
        const response = await fetch(`${apiUrl}carrusel_imgs`);
        const data = await response.json();
        if (data.carrusel_imgs && data.carrusel_imgs.length > 0) {
          const images = data.carrusel_imgs.map((img: { carrusel: string }) => 
            `data:image/png;base64,${img.carrusel}`
          );
          setCarruselImages(images);
        } else {
          setError('No se pudieron cargar las imágenes del carrusel.');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error inesperado');
        }
      }
    };

    fetchCarruselImages();
  }, []);

  useEffect(() => {
    if (carruselImages.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % carruselImages.length
        );
      }, 3000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [carruselImages]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('El correo electrónico es requerido.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo_usuario: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar el correo electrónico.');
      }

      if (data.exists) {
        toast.success('Correo Encontrado');
        setIsPasswordFormVisible(true);
      } else {
        setError('El correo electrónico no está registrado.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Error inesperado');
        toast.error('Error inesperado');
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError('La contraseña es requerida.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo_usuario: email,
          pwd_usuario: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión.');
      }

      const user: User = data.tbl_users;
      login(user);

      // Redirigir según el rol del usuario
      if (user.pwd_usuario === password) {
        const userName = user.nombre_usuario;
        const userName1 = user.nombre_usuario + " "+user.app_usuario +" "+ user.apm_usuario;
        
        



        if (user.idRol === 1) {
          toast.success(`Bienvenido administrador ${userName}`);
          navigate(`/Administration/${userName}`, { state: { user2: userName1 } });
        } else if (user.idRol === 2) {
          toast.success(`Bienvenido alumno ${userName}`);
          navigate(`/Student/${userName}`, { state: { user2: userName } });
        } else if (user.idRol === 3) {
          toast.success(`Bienvenido docente ${userName}`);
          navigate(`/Teacher/${userName}`, { state: { user2: userName } });
        } else if (user.idRol === 4) {
          toast.success(`Bienvenido familiar ${userName}`);
          navigate(`/Pather/${userName}`, { state: { user2: userName } });
        }
        setPassword('');
      } else {
        toast.error('Datos no coinciden');
        setPassword('Datos no coinciden');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Error inesperado');
        toast.error('Error inesperado');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      contentLabel="Iniciar Sesión"
      className="modal-login"
      overlayClassName="overlay-login"
    >
      <ToastContainer /> {/* Contenedor para los toasts */}
      <div className="login-container">
        <div className="login-image-container">
          {carruselImages.length > 0 && (
            <img
              src={carruselImages[currentImageIndex]}
              alt="Login"
              className="login-image"
            />
          )}
        </div>
        <div className="login-form-container">
          <h2 className="login-title">Iniciar Sesión</h2>
          {!isPasswordFormVisible ? (
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Ingrese su correo electrónico:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="login-input"
              />
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-button">Siguiente</button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <label htmlFor="password">Ingrese su contraseña:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="login-input"
              />
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-button">Login</button>
            </form>
          )}
        </div>
      </div>
      <button onClick={onRequestClose} className="modal-close-button-login">Cerrar</button>
    </Modal>
  );
};

export default ModalLogin;
