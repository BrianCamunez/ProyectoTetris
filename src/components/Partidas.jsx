import { useState } from "react";

const Partidas = () => {
  // Estado para almacenar las partidas
  const [partidas, setPartidas] = useState([
    {
      id: 1,
      jugador: "Juan Pérez",
      puntaje: 25000,
      lineasEliminadas: 150,
      nivel: 10,
      tiempo: "15:30",
      fecha: "2024-12-10",
    },
    {
      id: 2,
      jugador: "Ana Gómez",
      puntaje: 32000,
      lineasEliminadas: 180,
      nivel: 12,
      tiempo: "18:45",
      fecha: "2024-12-09",
    },
    {
      id: 3,
      jugador: "Carlos López",
      puntaje: 20000,
      lineasEliminadas: 130,
      nivel: 8,
      tiempo: "12:15",
      fecha: "2024-12-08",
    },
    {
      id: 4,
      jugador: "María Fernández",
      puntaje: 50000,
      lineasEliminadas: 250,
      nivel: 15,
      tiempo: "20:00",
      fecha: "2024-12-07",
    },
    {
      id: 5,
      jugador: "Luis García",
      puntaje: 18000,
      lineasEliminadas: 100,
      nivel: 7,
      tiempo: "10:30",
      fecha: "2024-12-06",
    },
  ]);

  // Estado para ordenar las partidas
  const [orden, setOrden] = useState({
    columna: "puntaje",
    direccion: "asc",
  });

  // Función para ordenar las partidas por diferentes columnas
  const ordenarDatos = (columna) => {
    const nuevaDireccion =
      orden.columna === columna && orden.direccion === "asc" ? "desc" : "asc";
    setOrden({ columna, direccion: nuevaDireccion });
  };

  // Ordenar las partidas basadas en el estado de orden
  const partidasOrdenadas = [...partidas].sort((a, b) => {
    if (a[orden.columna] < b[orden.columna]) return orden.direccion === "asc" ? -1 : 1;
    if (a[orden.columna] > b[orden.columna]) return orden.direccion === "asc" ? 1 : -1;
    return 0;
  });

  // Estado para controlar la visibilidad del modal
  const [modalVisible, setModalVisible] = useState(false);

  // Abrir el modal
  const abrirModal = () => {
    setModalVisible(true);
  };

  // Cerrar el modal
  const cerrarModal = () => {
    setModalVisible(false);
  };

  // Estado para la nueva partida
  const [newPartida, setNewPartida] = useState({
    jugador: "",
    puntaje: "",
    lineasEliminadas: "",
    nivel: "",
    tiempo: "",
    fecha: "",
  });

  // Función para manejar los cambios en el formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNewPartida((prev) => ({
      ...prev,
      [name]: value,  // Actualiza el campo correspondiente del estado
    }));
  };

  // Función para agregar una nueva partida
  const agregarPartida = () => {
    const nuevaPartida = {
      ...newPartida,
      id: partidas.length + 1,  // Asigna un nuevo ID único
    };

    setPartidas((prevPartidas) => [...prevPartidas, nuevaPartida]);
    setNewPartida({
      jugador: "",
      puntaje: "",
      lineasEliminadas: "",
      nivel: "",
      tiempo: "",
      fecha: "",
    });  // Resetear el formulario
    cerrarModal();  // Cerrar el modal después de agregar
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Lista de Partidas de Tetris</h1>
      <i className="bi bi-arrow-up" style={{ fontSize: "20px" }}></i>
      <button className="btn btn-primary mb-3" onClick={abrirModal}>
        Añadir Nueva Partida
      </button>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th onClick={() => ordenarDatos("jugador")} style={{ cursor: "pointer" }}>
              Jugador <i className="bi bi-arrow-up" style={{ color: "#ffffff", fontSize: "20px" }}></i>
            </th>
            <th onClick={() => ordenarDatos("puntaje")} style={{ cursor: "pointer"}}>
              Puntaje
            </th>
            <th onClick={() => ordenarDatos("lineasEliminadas")} style={{ cursor: "pointer" }}>
              Líneas Eliminadas
            </th>
            <th onClick={() => ordenarDatos("nivel")} style={{ cursor: "pointer" }}>
              Nivel
            </th>
            <th onClick={() => ordenarDatos("tiempo")} style={{ cursor: "pointer" }}>
              Tiempo
            </th>
            <th onClick={() => ordenarDatos("fecha")} style={{ cursor: "pointer" }}>
              Fecha
            </th>
          </tr>
        </thead>
        <tbody>
          {partidasOrdenadas.map((partida) => (
            <tr key={partida.id}>
              <td>{partida.jugador}</td>
              <td>{partida.puntaje}</td>
              <td>{partida.lineasEliminadas}</td>
              <td>{partida.nivel}</td>
              <td>{partida.tiempo}</td>
              <td>{partida.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para agregar nueva partida */}
      {modalVisible && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nueva Partida</h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="jugador" className="form-label">
                      Jugador
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="jugador"
                      name="jugador"
                      value={newPartida.jugador}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="puntaje" className="form-label">
                      Puntaje
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="puntaje"
                      name="puntaje"
                      value={newPartida.puntaje}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lineasEliminadas" className="form-label">
                      Líneas Eliminadas
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="lineasEliminadas"
                      name="lineasEliminadas"
                      value={newPartida.lineasEliminadas}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="nivel" className="form-label">
                      Nivel
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="nivel"
                      name="nivel"
                      value={newPartida.nivel}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tiempo" className="form-label">
                      Tiempo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tiempo"
                      name="tiempo"
                      value={newPartida.tiempo}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fecha" className="form-label">
                      Fecha
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha"
                      name="fecha"
                      value={newPartida.fecha}
                      onChange={manejarCambio}
                    />
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
