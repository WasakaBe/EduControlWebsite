import React, { useState, useEffect } from 'react';
import './Transport.css';
import { apiUrl } from '../../../../Constants/api';

interface TrasladoTransporte {
  id_traslado_transporte: number;
  nombre_traslado_transporte: string;
}

export default function Transport() {
  const [trasladosTransporte, setTrasladosTransporte] = useState<TrasladoTransporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTraslado, setEditingTraslado] = useState<TrasladoTransporte | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrasladoName, setNewTrasladoName] = useState('');
  const trasladosPerPage = 8;

  useEffect(() => {
    const fetchTrasladosTransporte = async () => {
      try {
        const response = await fetch(`${apiUrl}traslado_transporte`);
        if (!response.ok) {
          throw new Error('Error al obtener los traslados de transporte.');
        }
        const data = await response.json();
        setTrasladosTransporte(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrasladosTransporte();
  }, []);

  const handleEditClick = (traslado: TrasladoTransporte) => {
    setEditingTraslado(traslado);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTraslado) return;

    try {
      const response = await fetch(`${apiUrl}traslado_transporte/${editingTraslado.id_traslado_transporte}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTraslado),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el traslado de transporte.');
      }

      const updatedTraslados = trasladosTransporte.map((traslado) =>
        traslado.id_traslado_transporte === editingTraslado.id_traslado_transporte ? editingTraslado : traslado
      );
      setTrasladosTransporte(updatedTraslados);
      setShowEditModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleAddTraslado = async () => {
    try {
      const response = await fetch(`${apiUrl}traslado_transporte/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_traslado_transporte: newTrasladoName }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el traslado de transporte.');
      }

      const newTraslado: TrasladoTransporte = await response.json();
      setTrasladosTransporte([...trasladosTransporte, newTraslado]);
      setShowAddModal(false);
      setNewTrasladoName('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingTraslado) {
      setEditingTraslado({
        ...editingTraslado,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(trasladosTransporte.length / trasladosPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastTraslado = currentPage * trasladosPerPage;
  const indexOfFirstTraslado = indexOfLastTraslado - trasladosPerPage;
  const currentTraslados = trasladosTransporte.slice(indexOfFirstTraslado, indexOfLastTraslado);

  if (loading) {
    return <div className="transfers-tables-admins">Cargando traslados de transporte...</div>;
  }

  if (error) {
    return <div className="transfers-tables-admins">Error: {error}</div>;
  }

  return (
    <div className="users-tables-admins">
      <h2>Lista de Traslados de Transporte</h2>
      <button
        type="button"
        className="add-button-subject"
        onClick={() => setShowAddModal(true)}
      >
        Añadir nuevo traslado de transporte
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
          {currentTraslados.map((traslado) => (
            <tr key={traslado.id_traslado_transporte}>
              <td>{traslado.id_traslado_transporte}</td>
              <td>{traslado.nombre_traslado_transporte}</td>
              <td>
                <button
                  type="button"
                  className="save-button"
                  onClick={() => handleEditClick(traslado)}
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
          {Math.ceil(trasladosTransporte.length / trasladosPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(trasladosTransporte.length / trasladosPerPage)
          }
        >
          Siguiente
        </button>
      </div>

      {showEditModal && editingTraslado && (
         <div className="modal-subject">
          <div className="modal-content-subject">
            <h3>Editar Traslado de Transporte</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_traslado_transporte"
                  value={editingTraslado.nombre_traslado_transporte}
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
            <h3>Añadir Nuevo Traslado de Transporte</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTraslado();
              }}
            >
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre_traslado_transporte"
                  value={newTrasladoName}
                  onChange={(e) => setNewTrasladoName(e.target.value)}
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
