import 'bootstrap/dist/css/bootstrap.min.css';
import Panel from "./Panel";
import { useState, useEffect } from 'react';
import modelos from "../lib/modelos";
import modeloPieza from '../lib/modeloPieza';

const Juego = () => {
    const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz);
    const [piezaActual, setPiezaActual] = useState(() => new modeloPieza());
    const [intervaloMovimiento, setIntervaloMovimiento] = useState(null);
    const [jugando, setJugando] = useState(false);
    const [puntos, setPuntos] = useState(0); 

    // Limpiar la pieza anterior en su posición actual
    function limpiarPieza() {
        const copiaArray = arrayCasillas.map(fila => fila.slice()); // Crea una copia del tablero.
    
        piezaActual.matriz.forEach((fila, indexFila) => {
            fila.forEach((celda, indexColumna) => {
                const filaJuego = piezaActual.fila + indexFila;
                const columnaJuego = piezaActual.columna + indexColumna;
    
                // Asegúrate de que la posición esté dentro de los límites del tablero
                if (filaJuego >= 0 && filaJuego < copiaArray.length && columnaJuego >= 0 && columnaJuego < copiaArray[0].length) {
                    if (celda !== 0) {
                        copiaArray[filaJuego][columnaJuego] = 0; // Limpiar la antigua posición de la pieza
                    }
                }
            });
        });
    
        return copiaArray;
    }
    

    // Pintar la pieza en su nueva posición
    function pintarPieza(nuevaPieza) {
        const copiaArray = limpiarPieza();
    
        nuevaPieza.matriz.forEach((fila, indexFila) => {
            fila.forEach((celda, indexColumna) => {
                const filaJuego = nuevaPieza.fila + indexFila;
                const columnaJuego = nuevaPieza.columna + indexColumna;
                
                // Asegúrate de que la posición esté dentro de los límites del tablero
                if (filaJuego >= 0 && filaJuego < copiaArray.length && columnaJuego >= 0 && columnaJuego < copiaArray[0].length && celda !== 0) {
                    copiaArray[filaJuego][columnaJuego] = celda; // Pinta la nueva posición de la pieza.
                }
            });
        });
        
        return copiaArray;
    }

    // Función para insertar una nueva pieza
   const insertaNuevaPieza = () => {
    if (jugando) return;
    const nuevaPieza = new modeloPieza();
    setPiezaActual(nuevaPieza);

    setArrayCasillas(prevMatriz => {
        const nuevaMatriz = prevMatriz.map(fila => fila.slice()); // Copia la matriz sin borrar lo anterior

        // Pintar la nueva pieza sobre la matriz existente
        nuevaPieza.matriz.forEach((fila, indexFila) => {
            fila.forEach((celda, indexColumna) => {
                const filaJuego = nuevaPieza.fila + indexFila;
                const columnaJuego = nuevaPieza.columna + indexColumna;

                if (filaJuego >= 0 && filaJuego < nuevaMatriz.length && columnaJuego >= 0 && columnaJuego < nuevaMatriz[0].length && celda !== 0) {
                    nuevaMatriz[filaJuego][columnaJuego] = celda; // Coloca la nueva pieza en su lugar
                }
            });
        });

        return nuevaMatriz; // Devuelve la nueva matriz con la pieza agregada
    });
};
    // Función para iniciar el movimiento de la pieza
    const iniciarMovimiento = () => {
        if (intervaloMovimiento) {
            clearInterval(intervaloMovimiento);
        }
        const nuevoIntervalo = setInterval(() => {
            bajar(); // Mover la pieza hacia abajo cada segundo
        }, 1000);
        setIntervaloMovimiento(nuevoIntervalo);
        setJugando(true); // Activamos el estado "jugando"
    };

    const sumarPuntos = (cantidad) => {
        setPuntos((prevPuntos) => prevPuntos + cantidad); // Sumamos los puntos recibidos
    };

    const moverDra = () => {
        setPiezaActual((prevPieza) => {
            const nuevaPieza = { ...prevPieza, columna: prevPieza.columna + 1 }; // Mover hacia la derecha
    
            // Verificar si hay colisión antes de mover
            if (hayColision(nuevaPieza)) {
                console.log("No se puede mover hacia la derecha debido a una colisión.");
                return prevPieza; // No mueve la pieza si hay colisión
            }
    
            // Si no hay colisión, pintamos la nueva posición de la pieza
            const nuevaMatriz = pintarPieza(nuevaPieza);
            setArrayCasillas(nuevaMatriz);
            sumarPuntos(10);
            return nuevaPieza;
        });
    };

    const moverIzq = () => {
        setPiezaActual((prevPieza) => {
            const nuevaPieza = { ...prevPieza, columna: prevPieza.columna - 1 }; // Mover hacia la izquierda
    
            // Verificar si hay colisión antes de mover
            if (hayColision(nuevaPieza)) {
                console.log("No se puede mover hacia la izquierda debido a una colisión.");
                return prevPieza; // No mueve la pieza si hay colisión
            }
    
            // Si no hay colisión, pintamos la nueva posición de la pieza
            const nuevaMatriz = pintarPieza(nuevaPieza);
            setArrayCasillas(nuevaMatriz);
            sumarPuntos(10);
            return nuevaPieza;
        });
    };

    const girar = () => {
        setPiezaActual((prevPieza) => {
            const nuevaPieza = new modeloPieza();
            nuevaPieza.numero = prevPieza.numero;
            nuevaPieza.nombre = prevPieza.nombre;
            nuevaPieza.angulo = prevPieza.angulo;
            nuevaPieza.fila = prevPieza.fila;
            nuevaPieza.columna = prevPieza.columna;
            nuevaPieza.matriz = prevPieza.matriz;
            
            // Girar la pieza
            nuevaPieza.girar();
    
            // Verificar si la nueva rotación tiene colisión
            if (hayColision(nuevaPieza)) {
                console.log("No se puede girar la pieza debido a una colisión.");
                return prevPieza; // No rota la pieza si hay colisión
            }
    
            // Si no hay colisión, pintar la pieza en su nueva posición rotada
            const nuevaMatriz = pintarPieza(nuevaPieza);
            setArrayCasillas(nuevaMatriz);
            sumarPuntos(20); // Se suman los puntos por rotar la pieza
            return nuevaPieza;
        });
    };
    

    const bajar = () => {
        setPiezaActual((prevPieza) => {
            // Creamos una nueva pieza con la fila incrementada para bajarla
            const nuevaPieza = { ...prevPieza, fila: prevPieza.fila + 1 }; 
    
            // Limpiar la pieza anterior antes de comprobar la colisión
            const nuevaMatriz = pintarPieza(nuevaPieza); // Limpiar la pieza anterior y pintar la nueva
    
            // Verificar si hay colisión antes de mover la pieza
            if (hayColision(nuevaPieza)) {
                console.log("No se puede bajar la pieza debido a una colisión.");
                return prevPieza; // Si hay colisión, no mover la pieza
            }
    
            // Si no hay colisión, actualizamos el estado con la nueva matriz
            setArrayCasillas(nuevaMatriz);
    
            // Sumamos puntos por el movimiento
            sumarPuntos(10);
    
            // Retornamos la nueva pieza para actualizar su estado
            return nuevaPieza;
        });
    };
    
    

    const hayColision = (pieza) => {
        for (let fila = 0; fila < pieza.matriz.length; fila++) {
            for (let columna = 0; columna < pieza.matriz[fila].length; columna++) {
                if (pieza.matriz[fila][columna] !== 0) {
                    const filaJuego = pieza.fila + fila;
                    const columnaJuego = pieza.columna + columna;
    
                    // Verificamos si la pieza está fuera de los límites del tablero
                    if (filaJuego < 0 || filaJuego >= arrayCasillas.length || columnaJuego < 0 || columnaJuego >= arrayCasillas[0].length) {
                        console.log(`Colisión con los bordes del tablero en la posición (${filaJuego}, ${columnaJuego})`);
                        return true; // Colisión con los bordes del tablero
                    }
    
                    // Verificamos si la casilla ya está ocupada por otra pieza
                    if (arrayCasillas[filaJuego][columnaJuego] !== 0) {
                        console.log(arrayCasillas[filaJuego][columnaJuego])
                        console.log(`Colisión con otra pieza en la posición (${filaJuego}, ${columnaJuego})`);
                        return true; // Colisión con otra pieza
                    }
                }
            }
        }
        console.log("No hay colisión");
        return false; // No hay colisión
    };
    
     

    // Control de teclas
    useEffect(() => {
        const controlTeclas = (event) => {
            switch (event.key) {
                case "ArrowRight":
                    moverDra();
                    break;
                case "ArrowLeft":
                    moverIzq();
                    break;
                case "ArrowDown":
                    bajar();
                    break;
                case "ArrowUp":
                    girar();
                    break;
                default:
                    break;
            }
        };

        // Agregar el eventListener para keydown
        window.addEventListener('keydown', controlTeclas);

        // Cleanup: eliminar el eventListener cuando el componente se desmonte
        return () => {
            window.removeEventListener('keydown', controlTeclas);
        };
    }, [piezaActual, arrayCasillas]);

    return(
        <div className="container mt-5">
            <h2 className="text-center border border-primary rounded p-3 mt-4 mb-4 bg-light">Aquí va el juego</h2>
            <Panel matriz={arrayCasillas}/>
            <button className="btn btn-primary mt-3" onClick={iniciarMovimiento}>JUGAR</button>
            <button className="btn btn-primary mt-3" onClick={insertaNuevaPieza}>Insertar Nueva Pieza</button>
            <div className="mt-4 text-center">
                <h3>Puntos: {puntos}</h3> {/* Mostrar los puntos */}
            </div>
        </div>
    );
};

export default Juego;