import React from 'react';
import { colorPieza} from '../lib/funciones';

const Panel = ({ matriz }) => {
  // Estilos en línea para el panel
  const panelStyle = {
    display: 'grid',
    gridTemplateRows: 'repeat(22, 20px)',  // 22 filas de 20px
    gridTemplateColumns: 'repeat(12, 20px)',  // 12 columnas de 20px
    gap: '0px', // Eliminamos el gap para que las celdas se toquen
    backgroundColor: '#222',
  };

  const celdaStyle = {
    width: '20px',
    height: '20px',
    backgroundColor: '#fff',

    border: '1px solid #222',  // Borde para que se vea claramente
  };

  const celdaOcupadaStyle = {
    ...celdaStyle,
    backgroundColor: colorPieza(10), // Color para las celdas ocupadas
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <div style={panelStyle}>
        {matriz.map((fila, indexFila) => (
          // Cada fila debe contener 12 celdas
          fila.map((celda, indexColumna) => (
            <div
              key={indexFila * 12 + indexColumna}  // Clave única para cada celda
              style={celda !== 0 ? celdaOcupadaStyle : celdaStyle}
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default Panel;
