import React, { useState, useEffect } from 'react';
import './Subject.css'; // Asegúrate de tener un archivo CSS para estilos personalizados
import { apiUrl } from '../../../../Constants/api';

interface Asignatura {
  id_asignatura: number;
  nombre_asignatura: string;
}

export default function Subject() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingAsignatura, setEditingAsignatura] = useState<Asignatura | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Estado para mostrar el modal de agregar
  const [newAsignaturaName, setNewAsignaturaName] = useState(''); // Estado para el nombre de la nueva asignatura
  const asignaturasPerPage = 8;

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const response = await fetch(`${apiUrl}asignatura`);
        if (!response.ok) {
          throw new Error('Error al obtener las asignaturas.');
        }
        const data = await response.json();
        setAsignaturas(data.asignaturas);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAsignaturas();
  }, []);

  const handleEditClick = (asignatura: Asignatura) => {
    setEditingAsignatura(asignatura);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsignatura) return;

    try {
      const response = await fetch(
        `${apiUrl}asignatura/${editingAsignatura.id_asignatura}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingAsignatura),
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar la asignatura.');
      }

      const updatedAsignaturas = asignaturas.map((asignatura) =>
        asignatura.id_asignatura === editingAsignatura.id_asignatura
          ? editingAsignatura
          : asignatura
      );
      setAsignaturas(updatedAsignaturas);
      setShowEditModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleAddAsignatura = async () => {
    try {
      const response = await fetch(`${apiUrl}asignatura/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_asignatura: newAsignaturaName }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la asignatura.');
      }

      const newAsignatura: Asignatura = await response.json();
      setAsignaturas([...asignaturas, newAsignatura]);
      setShowAddModal(false);
      setNewAsignaturaName(''); // Limpiar el nombre de la nueva asignatura
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingAsignatura) {
      setEditingAsignatura({
        ...editingAsignatura,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(asignaturas.length / asignaturasPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastAsignatura = currentPage * asignaturasPerPage;
  const indexOfFirstAsignatura = indexOfLastAsignatura - asignaturasPerPage;
  const currentAsignaturas = asignaturas.slice(
    indexOfFirstAsignatura,
    indexOfLastAsignatura
  );

  if (loading) {
    return <div className="subject-tables-admins">Cargando asignaturas...</div>;
  }

  if (error) {
    return <div className="subject-tables-admins">Error: {error}</div>;
  }

  return (
    <div className="users-tables-admins">
      <h2>Lista de Asignaturas</h2>
      <button
        type="button"
        className="add-button-subject"
        onClick={() => setShowAddModal(true)}
      >
        Añadir nueva asignatura
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
          {currentAsignaturas.map((asignatura) => (
            <tr key={asignatura.id_asignatura}>
              <td>{asignatura.id_asignatura}</td>
              <td>{asignatura.nombre_asignatura}</td>
              <td>
                <button
                  type="button"
                  className="save-button"
                  onClick={() => handleEditClick(asignatura)}
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
          {Math.ceil(asignaturas.length / asignaturasPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(asignaturas.length / asignaturasPerPage)
          }
        >
          Siguiente
        </button>
      </div>

      {showEditModal && editingAsignatura && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Asignatura</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_asignatura"
                  value={editingAsignatura.nombre_asignatura}
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
            <h3>Añadir Nueva Asignatura</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddAsignatura();
              }}
            >
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_asignatura"
                  value={newAsignaturaName}
                  onChange={(e) => setNewAsignaturaName(e.target.value)}
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
