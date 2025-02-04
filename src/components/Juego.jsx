import 'bootstrap/dist/css/bootstrap.min.css';
import Panel from "./Panel"
import { useState } from 'react';
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
            fila.forEach((celda, indexColumna) => {
                if(celda !== 0){
                    copiaArray[piezaActual.fila + indexFila][piezaActual.columna + indexColumna] = celda;
                }
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