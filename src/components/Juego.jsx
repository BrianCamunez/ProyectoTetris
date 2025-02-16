import 'bootstrap/dist/css/bootstrap.min.css';
import Panel from "./Panel";
import { useState, useEffect, useContext } from 'react';
import modelos from "../lib/modelos";
import modeloPieza from '../lib/modeloPieza';
import { colorPieza } from "../lib/funciones";
import { PartidasContext } from './PartidasContext';
import { useNavigate } from 'react-router-dom';


const Juego = () => {
    const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz);
    const [piezaActual, setPiezaActual] = useState(() => new modeloPieza());
    const [colaPiezas, setColaPiezas] = useState([new modeloPieza(), new modeloPieza(), new modeloPieza()])
    const [piezaGuardada, setPiezaGuardada] = useState(null);
    const [intervaloMovimiento, setIntervaloMovimiento] = useState(null);
    const [jugando, setJugando] = useState(false);
    const [puntos, setPuntos] = useState(0);
    const [lineas, setLineas] = useState(0);
    const [nivel, setNivel] = useState(1);
    const [gameOver, setGameOver] = useState(false);

    const navigate = useNavigate();

    const [nombre, setNombre] = useState(''); // Nuevo estado para el nickname
    const [formulario, setFormulario] = useState(false);
    const { registraPartida } = useContext(PartidasContext);

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
        if (gameOver) return;

        let nuevaPieza = colaPiezas[0];

        setColaPiezas(prevPiezas => {
            const piezasActualizadas = [...prevPiezas]
            piezasActualizadas.shift()
            piezasActualizadas.push(new modeloPieza())
            return piezasActualizadas
        })

        nuevaPieza.columna = Math.max(1, Math.min(arrayCasillas[0].length - nuevaPieza.matriz[0].length - 1, nuevaPieza.columna));
        nuevaPieza.fila = 0; // Aparece en la fila 0

        // Verificar si hay espacio para colocar la nueva pieza
        if (hayColision(nuevaPieza, arrayCasillas)) {
            finalizarJuego(); // Si ya no hay espacio para colocar la nueva pieza, termina el juego
            return;
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
        if (!jugando && !gameOver) {
            setJugando(true);
        }
    };

    // useEffect para manejar el intervalo del movimiento automático
    useEffect(() => {
        if (jugando) {
            const delay = Math.max(100, 1000 - (nivel - 1) * 100);
            const intervalo = setInterval(() => {
                bajar();
            }, delay);

            return () => clearInterval(intervalo); // Limpia el intervalo al desmontar
        }
    }, [jugando, piezaActual]); // Se ejecuta cada vez que la pieza cambia

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
                    return verificarLineasCompletas(nuevaMatriz);
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
                case " ": // Tecla espacio
                    guardarPieza();
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', controlTeclas);
        return () => {
            window.removeEventListener('keydown', controlTeclas);
        };
    }, [piezaActual, arrayCasillas, piezaGuardada]);

    const reiniciarJuego = () => {
        setArrayCasillas(modelos.matriz); // Reinicia el tablero
        setPiezaActual(new modeloPieza()); // Nueva pieza inicial
        setGameOver(false);
        setPuntos(0); // Reiniciar puntaje
        setJugando(false);
    };

    // Función para finalizar el juego
    const finalizarJuego = () => {
        setJugando(false);
        setGameOver(true);
        setFormulario(true)
    };

    const mirarNombre = (evento) => {
        setNombre(evento.target.value)
    }

    const guardarPartida = () => {
        const partida ={
            nombre,
            puntos,
            lineas,
            nivel,
            fecha: new Date().toLocaleDateString("es-ES"),
        }

        registraPartida(partida)
        setFormulario(false)

        navigate('/partidas');

    }

    const verificarLineasCompletas = (matriz) => {
        // Filtra la matriz: elimina la fila si está completa (sin 0) excepto cuando la fila está compuesta únicamente de 1.
        let nuevasFilas = matriz.filter(fila => {
            // Si la fila es completamente 1, se conserva
            if (fila.every(celda => celda === 1)) {
                return true;
            }
            // Si la fila contiene al menos un 0, se conserva (no está completa)
            return fila.some(celda => celda === 0);
        });

        // Calcula cuántas filas se eliminaron
        let lineasEliminadas = matriz.length - nuevasFilas.length;

        if (lineasEliminadas > 0) {
            // Actualiza el contador de líneas y el nivel basado en el total de líneas eliminadas
            setLineas(prevLineas => {
                const newTotal = prevLineas + lineasEliminadas;
                // Cada 5 líneas eliminadas se incrementa el nivel
                setNivel(Math.floor(newTotal / 5) + 1);
                return newTotal;
            });
        }

        const crearFilaBorde = () => {
            const numColumnas = matriz[0].length;
            const fila = new Array(numColumnas).fill(0);
            fila[0] = 1;
            fila[numColumnas - 1] = 1;
            return fila;
        };

        // Por cada línea eliminada, se añade una nueva fila de borde al principio
        for (let i = 0; i < lineasEliminadas; i++) {
            nuevasFilas.unshift(crearFilaBorde());
        }

        return nuevasFilas; // Retorna la matriz modificada
    };

    const guardarPieza = () => {
        setArrayCasillas(prevMatriz => limpiarPieza()); // 1. Limpiar la pieza del tablero

        if (!piezaGuardada) {
            // 2. Si no hay una pieza guardada, guardamos la actual
            setPiezaGuardada(piezaActual);
            insertaNuevaPieza(); // Insertamos una nueva pieza para continuar el juego
        } else {
            // 3. Si ya hay una pieza guardada, intercambiamos con la pieza actual
            setPiezaActual(prevPieza => {
                const nuevaPieza = { ...piezaGuardada }; // Tomamos la pieza guardada

                // 4. Mantener la posición de la pieza actual
                nuevaPieza.fila = prevPieza.fila;
                nuevaPieza.columna = prevPieza.columna;

                // 5. Verificar colisión antes de colocarla
                if (hayColision(nuevaPieza, limpiarPieza())) {
                    console.log("No se puede intercambiar, hay colisión.");
                    return prevPieza; // No se intercambia si hay colisión
                }

                // 6. Intercambiamos y pintamos la pieza en el tablero
                setPiezaGuardada(prevPieza);
                setArrayCasillas(pintarPieza(nuevaPieza));
                return nuevaPieza;
            });
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center border border-primary rounded p-3 mt-4 mb-4 bg-light">Aquí va el juego</h2>
            {gameOver && <h2 className="text-center text-danger">¡Game Over!</h2>}
            {/* Formulario para el nombre al terminar el juego */}
            {formulario && (
                <div className="mt-4 text-center">
                    <input
                        type="text"
                        placeholder="Ingresa tu nickname"
                        value={nombre}
                        onChange={mirarNombre}
                        className="form-control mb-2"
                    />
                    <button onClick={guardarPartida} className="btn btn-success">
                        Guardar Partida
                    </button>
                </div>
            )}
            <div className="mt-4 text-center">
                <h4>Pieza Guardada:</h4>
                {piezaGuardada ? (
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${piezaGuardada.matriz[0].length}, 20px)` }}>
                        {piezaGuardada.matriz.map((fila, i) =>
                            fila.map((celda, j) => (
                                <div key={`${i}-${j}`} style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '1px solid #222',
                                }} className={celda === 0 ? 'bg-white' : colorPieza(celda)} />
                            ))
                        )}
                    </div>
                ) : (
                    <p>No hay pieza guardada</p>
                )}
            </div>
            <div className="mt-4">
                <h4>Siguientes piezas:</h4>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    {colaPiezas.map((pieza, index) => (
                        <div key={index}>
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${pieza.matriz[0].length}, 20px)` }}>
                                {pieza.matriz.map((fila, i) =>
                                    fila.map((celda, j) => (
                                        <div key={`${i}-${j}`} style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '1px solid #222',
                                        }} className={celda === 0 ? 'bg-white' : colorPieza(celda)} />
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Panel matriz={arrayCasillas} />
            <button className="btn btn-primary mt-3" onClick={iniciarMovimiento}>JUGAR</button>
            <button className="btn btn-danger mt-3" onClick={reiniciarJuego}>Reiniciar Juego</button>
            <div className="mt-4 text-center">
                <h3>Puntos: {puntos}</h3> {/* Mostrar los puntos */}
                <h3>Nivel: {nivel}</h3>
            </div>
        </div>
    );
};

export default Juego;