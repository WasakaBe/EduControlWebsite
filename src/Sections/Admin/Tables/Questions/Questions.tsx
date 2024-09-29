import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../../Constants/api';

interface Pregunta {
  id_preguntas: number;
  nombre_preguntas: string;
}

export default function Questions() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPregunta, setEditingPregunta] = useState<Pregunta | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPreguntaName, setNewPreguntaName] = useState('');
  const preguntasPerPage = 8;

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await fetch(`${apiUrl}pregunta`);
        if (!response.ok) {
          throw new Error('Error al obtener las preguntas.');
        }
        const data = await response.json();
        setPreguntas(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPreguntas();
  }, []);

  const handleEditClick = (pregunta: Pregunta) => {
    setEditingPregunta(pregunta);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPregunta) return;

    try {
      const response = await fetch(`${apiUrl}pregunta/${editingPregunta.id_preguntas}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPregunta),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la pregunta.');
      }

      const updatedPreguntas = preguntas.map((pregunta) =>
        pregunta.id_preguntas === editingPregunta.id_preguntas ? editingPregunta : pregunta
      );
      setPreguntas(updatedPreguntas);
      setShowEditModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleAddPregunta = async () => {
    try {
      const response = await fetch(`${apiUrl}pregunta/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_preguntas: newPreguntaName }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la pregunta.');
      }

      const newPregunta: Pregunta = await response.json();
      setPreguntas([...preguntas, newPregunta]);
      setShowAddModal(false);
      setNewPreguntaName('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingPregunta) {
      setEditingPregunta({
        ...editingPregunta,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(preguntas.length / preguntasPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastPregunta = currentPage * preguntasPerPage;
  const indexOfFirstPregunta = indexOfLastPregunta - preguntasPerPage;
  const currentPreguntas = preguntas.slice(indexOfFirstPregunta, indexOfLastPregunta);

  if (loading) {
    return <div className="users-tables-admins">Cargando preguntas...</div>;
  }

  if (error) {
    return <div className="users-tables-admins">Error: {error}</div>;
  }

  return (
    <div className="users-tables-admins">
      <h2>Lista de Preguntas</h2>
      <button
        type="button"
        className="add-button-subject"
        onClick={() => setShowAddModal(true)}
      >
        Añadir nueva pregunta
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
          {currentPreguntas.map((pregunta) => (
            <tr key={pregunta.id_preguntas}>
              <td>{pregunta.id_preguntas}</td>
              <td>{pregunta.nombre_preguntas}</td>
              <td>
                <button
                  type="button"
                  className="save-button"
                  onClick={() => handleEditClick(pregunta)}
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
          {Math.ceil(preguntas.length / preguntasPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(preguntas.length / preguntasPerPage)
          }
        >
          Siguiente
        </button>
      </div>

      {showEditModal && editingPregunta && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Pregunta</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_preguntas"
                  value={editingPregunta.nombre_preguntas}
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
            <h3>Añadir Nueva Pregunta</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPregunta();
              }}
            >
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_preguntas"
                  value={newPreguntaName}
                  onChange={(e) => setNewPreguntaName(e.target.value)}
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
