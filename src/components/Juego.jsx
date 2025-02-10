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

    // Funciones de movimiento
    const moverDra = () => {
        setPiezaActual((prevPieza) => {
            const nuevaPieza = { ...prevPieza, columna: prevPieza.columna + 1 };
            const nuevaMatriz = pintarPieza(nuevaPieza);
            setArrayCasillas(nuevaMatriz);
            sumarPuntos(10);
            return nuevaPieza;
        });
    };

    const moverIzq = () => {
        setPiezaActual((prevPieza) => {
            const nuevaPieza = { ...prevPieza, columna: prevPieza.columna - 1 };
            const nuevaMatriz = pintarPieza(nuevaPieza);
            setArrayCasillas(nuevaMatriz);
            sumarPuntos(10);
            return nuevaPieza;
        });
    };

    const bajar = () => {
        setPiezaActual((prevPieza) => {
            const nuevaPieza = { ...prevPieza, fila: prevPieza.fila + 1 };
            const nuevaMatriz = pintarPieza(nuevaPieza);
            setArrayCasillas(nuevaMatriz);
            sumarPuntos(10);
            if(jugando == false){
                sumarPuntos(50);
            }
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
            
            nuevaPieza.girar(); // Llamar al método girar
            
            const nuevaMatriz = pintarPieza(nuevaPieza);
            setArrayCasillas(nuevaMatriz);
            sumarPuntos(20);
            return nuevaPieza;
        });
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