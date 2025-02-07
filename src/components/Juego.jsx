import 'bootstrap/dist/css/bootstrap.min.css';
import Panel from "./Panel"
import { useState, useEffect } from 'react';
import modelos from "../lib/modelos";
import Piezas from './Pieza';
import modeloPieza from '../lib/modeloPieza';
//import { pintarPieza } from '../lib/funciones';

const Juego = () => {
    const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz);
    const [piezaActual, setPiezaActual] = useState(() => {
      return new modeloPieza();
    });


    function pintarPieza(){
        const copiaArray = [...arrayCasillas];
        piezaActual.matriz.forEach((fila, indexFila) => {
            console.log(fila);
            fila.forEach((celda, indexColumna) => {
                console.log(celda);
                if (celda !== 0) {
                    copiaArray[piezaActual.fila + indexFila][piezaActual.columna + indexColumna] = celda;
                }
                console.log(celda);
            });
        });
        return copiaArray;
    }


    const insertaNuevaPieza = () => {
        const nuevaPieza = new modeloPieza();
        setPiezaActual(nuevaPieza);
        const nuevaMatriz = pintarPieza();
        setArrayCasillas(nuevaMatriz);
    };

    useEffect(() => {
        // Definir el manejador de eventos
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
    
        // Agregar el eventListener
        window.addEventListener('keydown', controlTeclas);
    
        // Cleanup: eliminar el eventListener cuando el componente se desmonte
        return () => {
            window.removeEventListener('keydown', controlTeclas);
        };
    }, []); // Solo se ejecuta una vez al montar y desmontar el componente
    
    // Funciones de movimiento
    const moverDra = () => console.log("Mover derecha");
    const moverIzq = () => console.log("Mover izquierda");
    const bajar = () => console.log("Bajar pieza");
    const girar = () => console.log("Girar pieza");

    return(
        <div className="container mt-5">
            <h2 className="text-center border border-primary rounded p-3 mt-4 mb-4 bg-light">Aqui va el juego</h2>
            <Panel matriz={arrayCasillas}/>
            <button className="btn btn-primary mt-3" onClick={insertaNuevaPieza}>Insertar Nueva Pieza</button>
            <Piezas/>
    </div>
    )
}

export default Juego