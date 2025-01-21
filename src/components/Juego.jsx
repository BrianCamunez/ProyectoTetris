import 'bootstrap/dist/css/bootstrap.min.css';
import Panel from "./Panel"
import { useState } from 'react';
import modelos from "../lib/modelos";
import Piezas from './Pieza';

const Juego = () =>{
        const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz)

    return(
        <div className="container mt-5">
            <h2 className="text-center border border-primary rounded p-3 mt-4 mb-4 bg-light">Aqui va el juego</h2>
            <Panel matriz={arrayCasillas}/>
            <Piezas/>
    </div>
    )
}

export default Juego