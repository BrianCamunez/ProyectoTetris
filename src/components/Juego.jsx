import 'bootstrap/dist/css/bootstrap.min.css';
import Panel from "./Panel";
import { useState, useEffect } from 'react';
import modelos from "../lib/modelos";
import modeloPieza from '../lib/modeloPieza';

const Juego = () => {
    const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz);
    const [piezaActual, setPiezaActual] = useState(() => new modeloPieza());

    // Limpiar la pieza anterior en su posición actual
    function limpiarPieza() {
        const copiaArray = arrayCasillas.map(fila => fila.slice()); // Crea una copia del tablero.

        piezaActual.matriz.forEach((fila, indexFila) => {
            fila.forEach((celda, indexColumna) => {
                const filaJuego = piezaActual.fila + indexFila;
                const columnaJuego = piezaActual.columna + indexColumna;
                
                // Asegúrate de que la posición esté dentro de los límites del tablero
                if (filaJuego >= 0 && filaJuego < copiaArray.length && columnaJuego >= 0 && columnaJuego < copiaArray[0].length) {
                    copiaArray[filaJuego][columnaJuego] = 0; // Limpiar la antigua posición.
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
        const nuevaPieza = new modeloPieza();
        setPiezaActual(nuevaPieza);
    
        setArrayCasillas(prevMatriz => {
            const nuevaMatriz = prevMatriz.map(fila => fila.slice()); // Copia la matriz sin borrar lo anterior
            nuevaPieza.matriz.forEach((fila, indexFila) => {
                fila.forEach((celda, indexColumna) => {
                    const filaJuego = nuevaPieza.fila + indexFila;
                    const columnaJuego = nuevaPieza.columna + indexColumna;
    
                    if (filaJuego >= 0 && filaJuego < nuevaMatriz.length && columnaJuego >= 0 && columnaJuego < nuevaMatriz[0].length && celda !== 0) {
                        nuevaMatriz[filaJuego][columnaJuego] = celda; // Agrega la nueva pieza sin borrar lo anterior
                    }
                });
            });
            return nuevaMatriz;
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

    // Funciones de movimiento
    const moverDra = () => {
        const nuevaPieza = { ...piezaActual, columna: piezaActual.columna + 1 };
        setPiezaActual(nuevaPieza);
        const nuevaMatriz = pintarPieza(nuevaPieza);
        setArrayCasillas(nuevaMatriz);
    };

    const moverIzq = () => {
        const nuevaPieza = { ...piezaActual, columna: piezaActual.columna - 1 };
        setPiezaActual(nuevaPieza);
        const nuevaMatriz = pintarPieza(nuevaPieza);
        setArrayCasillas(nuevaMatriz);
    };
    
    const bajar = () => {
        const nuevaPieza = { ...piezaActual, fila: piezaActual.fila + 1 };
        setPiezaActual(nuevaPieza);
        const nuevaMatriz = pintarPieza(nuevaPieza);
        setArrayCasillas(nuevaMatriz);
    };

    const girar = () => {
        const nuevaPieza = new modeloPieza();
        nuevaPieza.numero = piezaActual.numero;
        nuevaPieza.nombre = piezaActual.nombre;
        nuevaPieza.angulo = piezaActual.angulo;
        nuevaPieza.fila = piezaActual.fila;
        nuevaPieza.columna = piezaActual.columna;
        nuevaPieza.matriz = piezaActual.matriz;
        
        nuevaPieza.girar(); // Llamar al método girar
        
        setPiezaActual(nuevaPieza);
        const nuevaMatriz = pintarPieza(nuevaPieza);
        setArrayCasillas(nuevaMatriz);
    };

    return(
        <div className="container mt-5">
            <h2 className="text-center border border-primary rounded p-3 mt-4 mb-4 bg-light">Aqui va el juego</h2>
            <Panel matriz={arrayCasillas}/>
            <button className="btn btn-primary mt-3" onClick={insertaNuevaPieza}>Insertar Nueva Pieza</button>
        </div>
    )
}

export default Juego;