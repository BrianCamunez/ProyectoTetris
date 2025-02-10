import modelos from "./modelos"

class modeloPieza {
     numero = Math.floor(Math.random() * 7)
     nombre = modelos.piezas[this.numero].nombre
     angulo = Math.floor(Math.random() * 4)
     fila = 0
     columna = Math.floor(Math.random() * 10) + 1
     matriz = modelos.piezas[this.numero].rotaciones[this.angulo]

     girar() {
         this.angulo++
         if(this.angulo == 4){
             this.angulo = 0
         }
         this.matriz = modelos.piezas[this.numero].rotaciones[this.angulo]
     }
}

export default modeloPieza