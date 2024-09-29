import React, { useState, useEffect } from 'react';
import './AboutMe.css'; // Asegúrate de tener un archivo CSS para estilos personalizados
import { apiUrl } from '../../../../Constants/api';

interface SobreNosotros {
  id_sobre_nosotros: number;
  txt_sobre_nosotros: string;
  imagen_sobre_nosotros: File | string | null; // Aquí se cambia el tipo
  fecha_sobre_nosotros: string;
}


export default function AboutMe() {
  const [sobreNosotrosList, setSobreNosotrosList] = useState<SobreNosotros[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSobreNosotros, setEditingSobreNosotros] = useState<SobreNosotros | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newSobreNosotros, setNewSobreNosotros] = useState({ txt_sobre_nosotros: '', imagen_sobre_nosotros: null as File | null });

  useEffect(() => {
    const fetchSobreNosotros = async () => {
      try {
        const response = await fetch(`${apiUrl}sobre_nosotros`);
        if (!response.ok) {
          throw new Error('Error al obtener la información sobre nosotros.');
        }
        const data = await response.json();
        setSobreNosotrosList(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSobreNosotros();
  }, []);

  const handleEditClick = (sobreNosotros: SobreNosotros) => {
    setEditingSobreNosotros(sobreNosotros);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSobreNosotros) return;

    const formData = new FormData();
    formData.append('txt_sobre_nosotros', editingSobreNosotros.txt_sobre_nosotros);
    if (editingSobreNosotros.imagen_sobre_nosotros) {
      formData.append('imagen_sobre_nosotros', editingSobreNosotros.imagen_sobre_nosotros);
    }

    try {
      const response = await fetch(
        `${apiUrl}sobre_nosotros/update/${editingSobreNosotros.id_sobre_nosotros}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar la información sobre nosotros.');
      }

      const updatedSobreNosotrosList = sobreNosotrosList.map(info =>
        info.id_sobre_nosotros === editingSobreNosotros.id_sobre_nosotros
          ? editingSobreNosotros
          : info
      );
      setSobreNosotrosList(updatedSobreNosotrosList);
      setShowEditModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingSobreNosotros) return;

    setEditingSobreNosotros({
      ...editingSobreNosotros,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('txt_sobre_nosotros', newSobreNosotros.txt_sobre_nosotros);
    if (newSobreNosotros.imagen_sobre_nosotros) {
      formData.append('imagen_sobre_nosotros', newSobreNosotros.imagen_sobre_nosotros);
    }

    try {
      const response = await fetch(`${apiUrl}sobre_nosotros/insert`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al añadir la nueva información sobre nosotros.');
      }

      const newInfo: SobreNosotros = await response.json();
      setSobreNosotrosList([...sobreNosotrosList, newInfo]);
      setShowAddModal(false);
      setNewSobreNosotros({ txt_sobre_nosotros: '', imagen_sobre_nosotros: null });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setEditingSobreNosotros(sobreNosotrosList.find(info => info.id_sobre_nosotros === id) || null);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!editingSobreNosotros) return;

    try {
      const response = await fetch(
        `${apiUrl}sobre_nosotros/delete/${editingSobreNosotros.id_sobre_nosotros}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar la información sobre nosotros.');
      }

      setSobreNosotrosList(sobreNosotrosList.filter(info => info.id_sobre_nosotros !== editingSobreNosotros.id_sobre_nosotros));
      setShowDeleteModal(false);
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
        <p className="loading-text">Cargando informacion...</p>
      </div>
    );
  }


  if (error) {
    return <div className="aboutme-tables-admins">Error: {error}</div>;
  }

  return (
    <div className="users-tables-admins">
      <h2>Información Sobre Nosotros</h2>
      <button
        type="button"
        className="add-button-aboutme"
        onClick={handleAddClick}
      >
        Añadir nueva información
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Texto</th>
            <th>Imagen</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {sobreNosotrosList.map(info => (
            <tr key={info.id_sobre_nosotros}>
              <td>{info.id_sobre_nosotros}</td>
              <td>{info.txt_sobre_nosotros}</td>
              <td>
                {info.imagen_sobre_nosotros ? (
                  <img
                    src={`data:image/jpeg;base64,${info.imagen_sobre_nosotros}`}
                    alt="Imagen sobre nosotros"
                    className="aboutme-image"
                  />
                ) : (
                  'No disponible'
                )}
              </td>
              <td>{new Date(info.fecha_sobre_nosotros).toLocaleDateString()}</td>
              <td>
                <button
                  type="button"
                  className="edit-button-aboutme"
                  onClick={() => handleEditClick(info)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="delete-button-aboutme"
                  onClick={() => handleDeleteClick(info.id_sobre_nosotros)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && editingSobreNosotros && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Información Sobre Nosotros</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Texto:
                <textarea
                  name="txt_sobre_nosotros"
                  value={editingSobreNosotros.txt_sobre_nosotros}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Imagen:
                <input
                  type="file"
                  name="imagen_sobre_nosotros"
                  onChange={e =>
                    setEditingSobreNosotros({
                      ...editingSobreNosotros,
                      imagen_sobre_nosotros: e.target.files
                        ? e.target.files[0]
                        : null,
                    })
                  }
                />
              </label>
              <button type="submit" className="save-button-subject">
                Guardar
              </button>
              <button
                type="button"
                className="cancel-button-subject"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Añadir Nueva Información Sobre Nosotros</h3>
            <form onSubmit={handleAddSubmit}>
              <label>
                Texto:
                <textarea
                  name="txt_sobre_nosotros"
                  value={newSobreNosotros.txt_sobre_nosotros}
                  onChange={e =>
                    setNewSobreNosotros({
                      ...newSobreNosotros,
                      txt_sobre_nosotros: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Imagen:
                <input
                  type="file"
                  name="imagen_sobre_nosotros"
                  onChange={e =>
                    setNewSobreNosotros({
                      ...newSobreNosotros,
                      imagen_sobre_nosotros: e.target.files
                        ? e.target.files[0]
                        : null,
                    })
                  }
                />
              </label>
              <button type="submit" className="save-button-subject">
                Guardar
              </button>
              <button
                type="button"
                    className="cancel-button-subject"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-aboutme">
          <div className="modal-content-aboutme">
            <h3>¿Estás seguro que deseas eliminar esta información?</h3>
            <button
              type="button"
              className="delete-button-confirm-aboutme"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </button>
            <button
              type="button"
              className="cancel-button-aboutme"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
