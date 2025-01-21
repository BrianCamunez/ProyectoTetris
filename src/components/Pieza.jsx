import React from 'react';
import modeloPieza from '../lib/modeloPieza';
import colorPieza from "../lib/funciones";

const Piezas = () => {
  // Crear la instancia de pieza
  const pieza1 = new modeloPieza();
  const pieza2 = new modeloPieza();

  // Función para renderizar cada fila de la matriz
  const renderizarMatriz = (matriz) => {
    return matriz.map((fila, indexFila) => (
      <div key={indexFila} style={{ display: 'flex' }}>
        {fila.map((celda, indexColumna) => (
          <div
            key={indexColumna}
            style={{
              width: '20px',
              height: '20px',
              border: '1px solid #222',
            }}
            className={celda === 0 ? 'bg-white' : colorPieza(celda)} // Asume que colorPieza es una función para dar color a la celda
          />
        ))}
      </div>
    ));
  };

  return (
    <div>
      <h2>Lista de Piezas con sus Rotaciones</h2>

      {/* Mostrar pieza 1 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Pieza 1</h3>
        
        {/* Renderizar la matriz de la pieza 1 */}
        <div style={{ display: 'inline-block', margin: '5px' }}>
          {renderizarMatriz(pieza1.matriz)}
        </div>
      </div>
       {/* Mostrar pieza 1 */}
       <div style={{ marginBottom: '20px' }}>
        <h3>Pieza 1</h3>
        
        {/* Renderizar la matriz de la pieza 1 */}
        <div style={{ display: 'inline-block', margin: '5px' }}>
          {renderizarMatriz(pieza2.matriz)}
        </div>
      </div>
    </div>
  );
};

export default Piezas;
