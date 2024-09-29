import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../../Constants/api';

interface RelacionFamiliar {
  id_relacion_familiar: number;
  nombre_relacion_familiar: string;
}

export default function Familyrelationship() {
  const [relacionesFamiliares, setRelacionesFamiliares] = useState<RelacionFamiliar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRelacion, setEditingRelacion] = useState<RelacionFamiliar | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRelacionName, setNewRelacionName] = useState('');
  const relacionesPerPage = 8;

  useEffect(() => {
    const fetchRelacionesFamiliares = async () => {
      try {
        const response = await fetch(`${apiUrl}relaciones_familiares`);
        if (!response.ok) {
          throw new Error('Error al obtener las relaciones familiares.');
        }
        const data = await response.json();
        setRelacionesFamiliares(data.relaciones_familiares);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRelacionesFamiliares();
  }, []);

  const handleEditClick = (relacion: RelacionFamiliar) => {
    setEditingRelacion(relacion);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRelacion) return;

    try {
      const response = await fetch(`${apiUrl}relaciones_familiares/${editingRelacion.id_relacion_familiar}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingRelacion),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la relación familiar.');
      }

      const updatedRelaciones = relacionesFamiliares.map((relacion) =>
        relacion.id_relacion_familiar === editingRelacion.id_relacion_familiar ? editingRelacion : relacion
      );
      setRelacionesFamiliares(updatedRelaciones);
      setShowEditModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleAddRelacion = async () => {
    try {
      const response = await fetch(`${apiUrl}relaciones_familiares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_relacion_familiar: newRelacionName }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la relación familiar.');
      }

      const newRelacion: RelacionFamiliar = await response.json();
      setRelacionesFamiliares([...relacionesFamiliares, newRelacion]);
      setShowAddModal(false);
      setNewRelacionName('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingRelacion) {
      setEditingRelacion({
        ...editingRelacion,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(relacionesFamiliares.length / relacionesPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastRelacion = currentPage * relacionesPerPage;
  const indexOfFirstRelacion = indexOfLastRelacion - relacionesPerPage;
  const currentRelaciones = relacionesFamiliares.slice(indexOfFirstRelacion, indexOfLastRelacion);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Cargando informacion de relaciones familiares...</p>
      </div>
    );
  }

  if (error) {
    return <div className="users-tables-admins">Error: {error}</div>;
  }

  return (
    <div className="users-tables-admins">
      <h2>Lista de Relaciones Familiares</h2>
      <button
        type="button"
        className="add-button-subject"
        onClick={() => setShowAddModal(true)}
      >
        Añadir nueva relación familiar
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
          {currentRelaciones.map((relacion) => (
            <tr key={relacion.id_relacion_familiar}>
              <td>{relacion.id_relacion_familiar}</td>
              <td>{relacion.nombre_relacion_familiar}</td>
              <td>
                <button
                  type="button"
                  className="save-button"
                  onClick={() => handleEditClick(relacion)}
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
          {Math.ceil(relacionesFamiliares.length / relacionesPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(relacionesFamiliares.length / relacionesPerPage)
          }
        >
          Siguiente
        </button>
      </div>

      {showEditModal && editingRelacion && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Relación Familiar</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_relacion_familiar"
                  value={editingRelacion.nombre_relacion_familiar}
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
            <h3>Añadir Nueva Relación Familiar</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddRelacion();
              }}
            >
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_relacion_familiar"
                  value={newRelacionName}
                  onChange={(e) => setNewRelacionName(e.target.value)}
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
