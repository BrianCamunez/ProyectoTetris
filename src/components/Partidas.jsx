import { useState, useContext } from "react";
import { PartidasContext } from "./PartidasContext";
import { useNavigate } from "react-router-dom";

const Partidas = () => {
  const { partidas, registraPartida } = useContext(PartidasContext); 

  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);

  // Estado para la nueva partida
  const [newPartida, setNewPartida] = useState({
    jugador: "",
    puntaje: "",
    lineasEliminadas: "",
    nivel: "",
    tiempo: "",
    fecha: "",
  });

  const valoresInputs = (e) => {
    setNewPartida({
      ...newPartida,
      [e.target.name]: e.target.value,
    });
  };

  // Guardar la nueva partida y redirigir
  const agregarPartida = () => {
    registraPartida(newPartida); // Guardar en el contexto
    setNewPartida({
      jugador: "",
      puntaje: "",
      lineasEliminadas: "",
      nivel: "",
      tiempo: "",
      fecha: "",
    });
    cerrarModal();
  };

  const abrirModal = () => setModalVisible(true);
  const cerrarModal = () => setModalVisible(false);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Lista de Partidas de Tetris</h1>
      <button className="btn btn-primary mb-3" onClick={abrirModal}>
        Añadir Nueva Partida
      </button>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Jugador</th>
            <th>Puntaje</th>
            <th>Líneas Eliminadas</th>
            <th>Nivel</th>
            <th>Tiempo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {partidas.map((partida, index) => {
            return (
              <tr key={index}>
                <td>{partida.nombre}</td>
                <td>{partida.puntos}</td>
                <td>{partida.lineas}</td>
                <td>{partida.nivel}</td>
                <td>{partida.tiempo}</td>
                <td>{partida.fecha}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal para agregar nueva partida */}
      {modalVisible && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nueva Partida</h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Jugador</label>
                    <input type="text" className="form-control" name="jugador" value={newPartida.jugador} onChange={valoresInputs} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Puntaje</label>
                    <input type="number" className="form-control" name="puntaje" value={newPartida.puntaje} onChange={valoresInputs} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Líneas Eliminadas</label>
                    <input type="number" className="form-control" name="lineasEliminadas" value={newPartida.lineasEliminadas} onChange={valoresInputs} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nivel</label>
                    <input type="number" className="form-control" name="nivel" value={newPartida.nivel} onChange={valoresInputs} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tiempo</label>
                    <input type="text" className="form-control" name="tiempo" value={newPartida.tiempo} onChange={valoresInputs} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha</label>
                    <input type="date" className="form-control" name="fecha" value={newPartida.fecha} onChange={valoresInputs} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={agregarPartida}>
                  Agregar Partida
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partidas;
