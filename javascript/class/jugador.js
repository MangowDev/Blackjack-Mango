class Jugador {
    constructor(nombre) {
      this.nombre = nombre;
      this.cartas = [];
      this.puntos = 0;
    }
  
    agregarCarta(carta) {
      this.cartas.push(carta);
      this.puntos += this.calcularPuntos(carta);
    }
  
    calcularPuntos(carta) {
      let valor = carta.substring(0, carta.length - 1);
      return isNaN(valor) ? (valor === "A" ? 11 : 10) : parseInt(valor);
    }
  
    reiniciarCartas() {
      this.cartas = [];
      this.puntos = 0;
    }
  
    obtenerPuntos() {
      return this.puntos;
    }
  
    mostrarCartas() {
      return this.cartas;
    }
  }
  

  export default Jugador;