import 'bootstrap/dist/css/bootstrap.min.css';

import { useContext } from "react";
import { PartidasContext } from "./PartidasContext";

const Ranking = () => {
  const { partidas } = useContext(PartidasContext); 

  const top5Partidas = partidas
    .sort((a, b) => b.puntos - a.puntos) 
    .slice(0, 5);

  return (
    <div className="container mt-5">

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
          {top5Partidas.map((partida, index) => (
            <tr key={index}>
              <td>{partida.nombre}</td>
              <td>{partida.puntos}</td>
              <td>{partida.lineas}</td>
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

export default Ranking;
