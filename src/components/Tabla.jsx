import { useState } from "react";

const Tabla = () => {
  const partidas = [
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
  ];

  const [orden, setOrden] = useState({
    columna: "puntaje",
    direccion: "asc",
  });

  const ordenarDatos = (columna) => {
    const nuevaDireccion = orden.columna === columna && orden.direccion === "asc" ? "desc" : "asc";
    setOrden({ columna, direccion: nuevaDireccion });
  };

  const partidasOrdenadas = [...partidas].sort((a, b) => {
    if (a[orden.columna] < b[orden.columna]) return orden.direccion === "asc" ? -1 : 1;
    if (a[orden.columna] > b[orden.columna]) return orden.direccion === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Lista de Partidas de Tetris</h1>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th onClick={() => ordenarDatos('jugador')} style={{ cursor: 'pointer' }}>Jugador</th>
            <th onClick={() => ordenarDatos('puntaje')} style={{ cursor: 'pointer' }}>Puntaje</th>
            <th onClick={() => ordenarDatos('lineasEliminadas')} style={{ cursor: 'pointer' }}>Líneas Eliminadas</th>
            <th onClick={() => ordenarDatos('nivel')} style={{ cursor: 'pointer' }}>Nivel</th>
            <th onClick={() => ordenarDatos('tiempo')} style={{ cursor: 'pointer' }}>Tiempo</th>
            <th onClick={() => ordenarDatos('fecha')} style={{ cursor: 'pointer' }}>Fecha</th>
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
    </div>
  );
};

export default Tabla;
