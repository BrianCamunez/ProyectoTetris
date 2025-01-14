import 'bootstrap/dist/css/bootstrap.min.css';

const Inicio = () => {
  return (
    <div className="container mt-5">
      <div className="card shadow-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card-body">
          <h1 className="card-title text-center">Instrucciones de Tetris</h1>
          <p className="card-text">
            Tetris es un juego clásico en el que el objetivo es encajar piezas de diferentes formas (llamadas "tetrominos") para formar líneas horizontales completas. Cuando una línea se completa, desaparece y el jugador gana puntos. El juego continúa hasta que las piezas se apilan hasta la parte superior de la pantalla.
          </p>
          
          <img className="img-fluid mx-auto d-block" src="https://m.media-amazon.com/images/I/61M3rDwh4qL.png" alt="Foto Tetris" />

          <h2 className="mt-4">Objetivo:</h2>
          <p className="card-text">
            El objetivo es evitar que las piezas lleguen a la parte superior de la pantalla. El jugador debe organizar las piezas para crear líneas horizontales completas. Cuantas más líneas elimines, más puntos ganarás.
          </p>

          <h2 className="mt-4 text-center">¡Buena suerte!</h2>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
