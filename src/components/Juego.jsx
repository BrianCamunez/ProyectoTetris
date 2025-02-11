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
    const [gameOver, setGameOver] = useState(false);

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

    // Función para verificar si hay colisión entre la pieza y el tablero
    const fueraDeLimitesHorizontales = (pieza, arrayCasillas) => {
        for (let fila = 0; fila < pieza.matriz.length; fila++) {
            for (let columna = 0; columna < pieza.matriz[fila].length; columna++) {
                if (pieza.matriz[fila][columna] !== 0) {
                    const posicionColumna = pieza.columna + columna;
                    // Asegúrate de que la columna no exceda los límites (bordes de las columnas)
                    if (posicionColumna < 1 || posicionColumna >= arrayCasillas[0].length - 1) {
                        return true;  // Está fuera del límite izquierdo o derecho (considerando los bordes)
                    }
                }
            }
        }
        return false;  // No está fuera de los límites
    };
    

    // Función para insertar una nueva pieza
    const insertaNuevaPieza = () => {
        if (jugando || gameOver) return;
    
        let nuevaPieza = new modeloPieza();
    
        // Verificar si hay espacio para colocar la nueva pieza
        if (hayColision(nuevaPieza, arrayCasillas)) {
            finalizarJuego(); // Si ya no hay espacio para colocar la nueva pieza, termina el juego
            return;
        }
    
        // Verificamos si la pieza está dentro de los límites
        while (fueraDeLimitesHorizontales(nuevaPieza, arrayCasillas)) {
            nuevaPieza = new modeloPieza();  // Genera una nueva pieza
        }
    
        // Ahora tenemos una pieza válida dentro de los límites
        setPiezaActual(nuevaPieza);
    
        // Colocar la nueva pieza en el tablero
        setArrayCasillas(prevMatriz => {
            const nuevaMatriz = prevMatriz.map(fila => fila.slice()); // Copia la matriz sin borrar lo anterior
    
            // Colocar la nueva pieza
            nuevaPieza.matriz.forEach((fila, indexFila) => {
                fila.forEach((celda, indexColumna) => {
                    const filaJuego = nuevaPieza.fila + indexFila;
                    const columnaJuego = nuevaPieza.columna + indexColumna;
    
                    if (filaJuego >= 0 && filaJuego < nuevaMatriz.length && columnaJuego >= 0 && columnaJuego < nuevaMatriz[0].length && celda !== 0) {
                        nuevaMatriz[filaJuego][columnaJuego] = celda; // Coloca la nueva pieza
                    }
                });
            });
    
            return nuevaMatriz; // Devuelve la nueva matriz con la pieza colocada
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
            let tableroSinPieza = limpiarPieza(); // Eliminar la pieza actual del tablero
            const nuevaPieza = { ...prevPieza, columna: prevPieza.columna + 1 };
    
            // Verificar colisión con el tablero limpio
            if (hayColision(nuevaPieza, tableroSinPieza)) {
                console.log("No se puede mover hacia la derecha debido a una colisión.");
                return prevPieza; // No mueve la pieza si hay colisión
            }
    
            // Si no hay colisión, pintar la nueva posición
            const nuevaMatriz = pintarPieza(nuevaPieza);
            setArrayCasillas(nuevaMatriz);
            sumarPuntos(10);
            return nuevaPieza;
        });
    }; 

    const moverIzq = () => {
        setPiezaActual((prevPieza) => {
            const tableroSinPieza = limpiarPieza();
            const nuevaPieza = { ...prevPieza, columna: prevPieza.columna - 1 };
    
            if (hayColision(nuevaPieza, tableroSinPieza)) {
                console.log("No se puede mover hacia la izquierda debido a una colisión.");
                return prevPieza;
            }
    
            const nuevaMatriz = pintarPieza(nuevaPieza);
            setArrayCasillas(nuevaMatriz);
            sumarPuntos(10);
            return nuevaPieza;
        });
    };
    

    const girar = () => {
        setPiezaActual((prevPieza) => {
            const nuevaPieza = new modeloPieza();
            const tableroSinPieza = limpiarPieza();
            nuevaPieza.numero = prevPieza.numero;
            nuevaPieza.nombre = prevPieza.nombre;
            nuevaPieza.angulo = prevPieza.angulo;
            nuevaPieza.fila = prevPieza.fila;
            nuevaPieza.columna = prevPieza.columna;
            nuevaPieza.matriz = prevPieza.matriz;
            
            // Girar la pieza
            nuevaPieza.girar();
    
            // Verificar si la nueva rotación tiene colisión
            if (hayColision(nuevaPieza, tableroSinPieza)) {
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
            const nuevaPieza = { ...prevPieza, fila: prevPieza.fila + 1 };
    
            if (hayColision(nuevaPieza, limpiarPieza())) {
                console.log("No se puede bajar más.");
                
                setArrayCasillas((prevMatriz) => {
                    const nuevaMatriz = pintarPieza(prevPieza);
                    return nuevaMatriz;
                });
                insertaNuevaPieza();
                return prevPieza;
            }
    
            const nuevaMatriz = pintarPieza(nuevaPieza);
            setArrayCasillas(nuevaMatriz);
            sumarPuntos(10);
            return nuevaPieza;
        });
    };
    
    
    

    const hayColision = (pieza, matrizTemporal = arrayCasillas) => {
        for (let fila = 0; fila < pieza.matriz.length; fila++) {
            for (let columna = 0; columna < pieza.matriz[fila].length; columna++) {
                if (pieza.matriz[fila][columna] !== 0) {
                    const filaJuego = pieza.fila + fila;
                    const columnaJuego = pieza.columna + columna;
    
                    // Verificamos si la pieza está fuera de los límites del tablero
                    if (filaJuego < 0 || filaJuego >= matrizTemporal.length ||
                        columnaJuego < 0 || columnaJuego >= matrizTemporal[0].length) {
                        return true; // Colisión con los bordes
                    }
    
                    // Verificamos si la casilla ya está ocupada por otra pieza
                    if (matrizTemporal[filaJuego][columnaJuego] !== 0) {
                        return true; // Colisión con otra pieza
                    }
                }
            }
        }
        return false; // No hay colisión
    };
    
    
     

    // Control de teclas
    useEffect(() => {
        const controlTeclas = (event) => {
            if (gameOver) return;
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

    const reiniciarJuego = () => {
        setArrayCasillas(modelos.matriz); // Reinicia el tablero
        setPiezaActual(new modeloPieza()); // Nueva pieza inicial
        setGameOver(false);
        setPuntos(0); // Reiniciar puntaje
        setJugando(false);
    };

    const finalizarJuego = () => {
        if (!gameOver) {
            setJugando(false);
            if (intervaloMovimiento) clearInterval(intervaloMovimiento);
            setIntervaloMovimiento(null);
            setGameOver(true);
            alert("¡Game Over! No hay más espacio para nuevas piezas.");
        }
    };

    return(
        <div className="container mt-5">
            <h2 className="text-center border border-primary rounded p-3 mt-4 mb-4 bg-light">Aquí va el juego</h2>
            {gameOver && <h2 className="text-center text-danger">¡Game Over!</h2>}
            <Panel matriz={arrayCasillas}/>
            <button className="btn btn-primary mt-3" onClick={iniciarMovimiento}>JUGAR</button>
            <button className="btn btn-primary mt-3" onClick={insertaNuevaPieza}>Insertar Nueva Pieza</button>
            <button className="btn btn-danger mt-3" onClick={reiniciarJuego}>Reiniciar Juego</button>
            <div className="mt-4 text-center">
                <h3>Puntos: {puntos}</h3> {/* Mostrar los puntos */}
            </div>
        </div>
    );
};

export default Juego;