import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../../Constants/api';

interface Grado {
  id_grado: number;
  nombre_grado: string;
}

export default function Grades() {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingGrado, setEditingGrado] = useState<Grado | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGradoName, setNewGradoName] = useState('');
  const gradosPerPage = 8;

  useEffect(() => {
    const fetchGrados = async () => {
      try {
        const response = await fetch(`${apiUrl}grado`);
        if (!response.ok) {
          throw new Error('Error al obtener los grados.');
        }
        const data = await response.json();
        setGrados(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGrados();
  }, []);

  const handleEditClick = (grado: Grado) => {
    setEditingGrado(grado);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrado) return;

    try {
      const response = await fetch(`${apiUrl}grado/${editingGrado.id_grado}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingGrado),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el grado.');
      }

      const updatedGrados = grados.map((grado) =>
        grado.id_grado === editingGrado.id_grado ? editingGrado : grado
      );
      setGrados(updatedGrados);
      setShowEditModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleAddGrado = async () => {
    try {
      const response = await fetch(`${apiUrl}grado/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_grado: newGradoName }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el grado.');
      }

      const newGrado: Grado = await response.json();
      setGrados([...grados, newGrado]);
      setShowAddModal(false);
      setNewGradoName('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingGrado) {
      setEditingGrado({
        ...editingGrado,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(grados.length / gradosPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastGrado = currentPage * gradosPerPage;
  const indexOfFirstGrado = indexOfLastGrado - gradosPerPage;
  const currentGrados = grados.slice(indexOfFirstGrado, indexOfLastGrado);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Cargando informacion de grados...</p>
      </div>
    );
  }

  if (error) {
    return <div className="users-tables-admins">Error: {error}</div>;
  }

  return (
    <div className="users-tables-admins">
      <h2>Lista de Grados</h2>
      <button
        type="button"
        className="add-button-subject"
        onClick={() => setShowAddModal(true)}
      >
        Añadir nuevo grado
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentGrados.map((grado) => (
            <tr key={grado.id_grado}>
              <td>{grado.id_grado}</td>
              <td>{grado.nombre_grado}</td>
              <td>
                <button
                  type="button"
                  className="save-button"
                  onClick={() => handleEditClick(grado)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de{' '}
          {Math.ceil(grados.length / gradosPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(grados.length / gradosPerPage)
          }
        >
          Siguiente
        </button>
      </div>

      {showEditModal && editingGrado && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Grado</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_grado"
                  value={editingGrado.nombre_grado}
                  onChange={handleInputChange}
                  required
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
            <h3>Añadir Nuevo Grado</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddGrado();
              }}
            >
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_grado"
                  value={newGradoName}
                  onChange={(e) => setNewGradoName(e.target.value)}
                  required
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
    </div>
  );
}
