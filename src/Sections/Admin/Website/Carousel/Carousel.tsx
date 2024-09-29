import{ useState, useEffect } from 'react';
import './Carousel.css';
import { apiUrl } from '../../../../Constants/api';

interface CarruselImg {
  id_carrusel: number;
  carrusel: string | null;
}

export default function Carousel() {
  const [carruselImgs, setCarruselImgs] = useState<CarruselImg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newImgFile, setNewImgFile] = useState<File | null>(null);
  const [selectedImgId, setSelectedImgId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCarruselImgs = async () => {
      try {
        const response = await fetch(`${apiUrl}carrusel_imgs`);
        if (!response.ok) {
          throw new Error('Error al obtener las imágenes del carrusel.');
        }
        const data = await response.json();
        setCarruselImgs(data.carrusel_imgs);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCarruselImgs();
  }, []);

  const handleDeleteClick = (id: number) => {
    setSelectedImgId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedImgId === null) return;

    try {
      const response = await fetch(`${apiUrl}carrusel_imgs/delete/${selectedImgId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la imagen del carrusel.');
      }

      setCarruselImgs(carruselImgs.filter(img => img.id_carrusel !== selectedImgId));
      setShowDeleteModal(false);
      setSelectedImgId(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleAddImg = async () => {
    if (!newImgFile) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('carrusel', newImgFile);

    try {
      const response = await fetch(`${apiUrl}carrusel_imgs/insert`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al agregar la imagen al carrusel.');
      }

      const newImg: CarruselImg = await response.json();
      setCarruselImgs([...carruselImgs, newImg]);
      setShowAddModal(false);
      setNewImgFile(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Cargando imágenes del carrusel...</p>
      </div>
    );
  }

  if (error) {
    return <div className="carousel-tables-admins">Error: {error}</div>;
  }

  return (
    <div className="carousel-tables-admins">
      <h2>Imágenes del Carrusel</h2>
      <button
        type="button"
        className="add-button-carousel"
        onClick={() => setShowAddModal(true)}
      >
        Añadir nueva imagen
      </button>
      <div className="carousel-images-container">
        {carruselImgs.map(img => (
          <div key={img.id_carrusel} className="carousel-image-wrapper">
            {img.carrusel ? (
              <img
                src={`data:image/jpeg;base64,${img.carrusel}`}
                alt="Imagen del carrusel"
                className="carousel-image"
              />
            ) : (
              'No disponible'
            )}
            <button
              type="button"
              className="delete-button-carousel"
              onClick={() => handleDeleteClick(img.id_carrusel)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-carousel">
          <div className="modal-content-carousel">
            <h3>Añadir Nueva Imagen al Carrusel</h3>
            <input
              type="file"
              accept="image/*"
              onChange={e => setNewImgFile(e.target.files ? e.target.files[0] : null)}
            />
            <button type="button" className="save-button-subject" onClick={handleAddImg}>
              Guardar
            </button>
            <button
              type="button"
              className="cancel-button-subject"
              onClick={() => setShowAddModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-carousel">
          <div className="modal-content-carousel">

            <h3>¿Estás seguro que deseas eliminar esta imagen?</h3>
            <div className='align'>
            <button type="button" className="cancel-button-subject" onClick={handleConfirmDelete}>
              Eliminar
            </button>
            <button
              type="button"
              className="save-button-subject"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
