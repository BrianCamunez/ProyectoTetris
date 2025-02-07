import React from 'react';
import { colorPieza } from '../lib/funciones';

const Panel = ({ matriz }) => {
  // Estilos en línea para el panel
  const panelStyle = {
    display: 'grid',
    gridTemplateRows: 'repeat(22, 20px)',  // 22 filas de 20px
    gridTemplateColumns: 'repeat(12, 20px)',  // 12 columnas de 20px
    gap: '0px', // Eliminamos el gap para que las celdas se toquen
    backgroundColor: '#222',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <div style={panelStyle}>
        {matriz.map((fila, indexFila) => (
          fila.map((celda, indexColumna) => (
            <div
            key={indexFila * 12 + indexColumna}
            className={`border ${celda !== 0 ? colorPieza(celda) : 'bg-white'}`} // Usa clases en lugar de `backgroundColor`
            style={{ width: '20px', height: '20px' }}
          />
          ))
        ))}
      </div>
    </div>
  );
};

export default Panel;
