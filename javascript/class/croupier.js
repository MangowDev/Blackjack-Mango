class Croupier {
    constructor() {
      this.cartas = [];
      this.puntos = 0;
      this.cartaOculta = null;
    }
  
    agregarCarta(carta) {
      this.cartas.push(carta);
      this.puntos += this.calcularPuntos(carta);
    }
  
    agregarCartaOculta(carta) {
      this.cartaOculta = carta;
      this.cartas.push("Oculta"); // Añade un marcador de carta oculta
      this.puntos += this.calcularPuntos(carta);
    }
  
    revelarCartaOculta() {
      if (this.cartaOculta) {
        this.cartas[0] = this.cartaOculta; // Reemplaza la 'Oculta' por la carta real
        this.cartaOculta = null;
      }
    }
  
    calcularPuntos(carta) {
      let valor = carta.substring(0, carta.length - 1);
      return isNaN(valor) ? (valor === "A" ? 11 : 10) : parseInt(valor);
    }
  
    jugarTurno(puntosJugador, baraja) {
      while (this.puntos < 17 && this.puntos <= puntosJugador && puntosJugador <= 21) {
        this.agregarCarta(baraja.pedirCarta());
      }
      return this.puntos;
    }
  
    reiniciarCartas() {
      this.cartas = [];
      this.puntos = 0;
      this.cartaOculta = null;
    }
  
    obtenerPuntos() {
      return this.puntos;
    }
  
    mostrarCartas() {
      return this.cartas;
    }
  }
  
  export default Croupier;
