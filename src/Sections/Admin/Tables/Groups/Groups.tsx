import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../../Constants/api';

interface Grupo {
  id_grupos: number;
  nombre_grupos: string;
}

export default function Groups() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGrupoName, setNewGrupoName] = useState('');
  const gruposPerPage = 8;

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch(`${apiUrl}grupo`);
        if (!response.ok) {
          throw new Error('Error al obtener los grupos.');
        }
        const data = await response.json();
        setGrupos(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGrupos();
  }, []);

  const handleEditClick = (grupo: Grupo) => {
    setEditingGrupo(grupo);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrupo) return;

    try {
      const response = await fetch(`${apiUrl}grupo/${editingGrupo.id_grupos}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingGrupo),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el grupo.');
      }

      const updatedGrupos = grupos.map((grupo) =>
        grupo.id_grupos === editingGrupo.id_grupos ? editingGrupo : grupo
      );
      setGrupos(updatedGrupos);
      setShowEditModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleAddGrupo = async () => {
    try {
      const response = await fetch(`${apiUrl}grupo/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_grupos: newGrupoName }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el grupo.');
      }

      const newGrupo: Grupo = await response.json();
      setGrupos([...grupos, newGrupo]);
      setShowAddModal(false);
      setNewGrupoName('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingGrupo) {
      setEditingGrupo({
        ...editingGrupo,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(grupos.length / gruposPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastGrupo = currentPage * gruposPerPage;
  const indexOfFirstGrupo = indexOfLastGrupo - gruposPerPage;
  const currentGrupos = grupos.slice(indexOfFirstGrupo, indexOfLastGrupo);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Cargando informacion de grupos..</p>
      </div>
    );
  }


  if (error) {
    return <div className="users-tables-admins">Error: {error}</div>;
  }

  return (
    <div className="users-tables-admins">
      <h2>Lista de Grupos</h2>
      <button
        type="button"
        className="add-button-subject"
        onClick={() => setShowAddModal(true)}
      >
        Añadir nuevo grupo
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
          {currentGrupos.map((grupo) => (
            <tr key={grupo.id_grupos}>
              <td>{grupo.id_grupos}</td>
              <td>{grupo.nombre_grupos}</td>
              <td>
                <button
                  type="button"
                  className="save-button"
                  onClick={() => handleEditClick(grupo)}
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
          {Math.ceil(grupos.length / gruposPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(grupos.length / gruposPerPage)
          }
        >
          Siguiente
        </button>
      </div>

      {showEditModal && editingGrupo && (
        <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Grupo</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_grupos"
                  value={editingGrupo.nombre_grupos}
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
            <h3>Añadir Nuevo Grupo</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddGrupo();
              }}
            >
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_grupos"
                  value={newGrupoName}
                  onChange={(e) => setNewGrupoName(e.target.value)}
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
