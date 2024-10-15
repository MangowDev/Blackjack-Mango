// Clase que representa al croupier en un juego de cartas
class Croupier {
  // Constructor que inicializa al croupier
  constructor() {
    this.cartas = []; 
    this.puntos = 0; 
    this.cartaOculta = null; 
  }

  // Agrega una carta al croupier y actualiza los puntos
  agregarCarta(carta) {
    this.cartas.push(carta); 
    this.puntos += this.calcularPuntos(carta);
  }

  // Agrega una carta oculta al croupier
  agregarCartaOculta(carta) {
    this.cartaOculta = carta; 
    this.cartas.push("Oculta"); 
  }

  // Revela la carta oculta y actualiza puntos
  revelarCartaOculta() {
    // Si hay una carta oculta
    if (this.cartaOculta) {
      // Reemplaza "Oculta" por la carta real
      this.cartas[0] = this.cartaOculta;

      // Suma los puntos de la carta oculta
      this.puntos += this.calcularPuntos(this.cartaOculta); 
      this.cartaOculta = null;
    }
  }

  // Calcula los puntos de una carta
  calcularPuntos(carta) {
    // Obtiene el valor de la carta
    let valor = carta.substring(0, carta.length - 1);

    // Retorna 11 para "A", 10 para figuras, o el valor numérico
    return isNaN(valor) ? (valor === "A" ? 11 : 10) : parseInt(valor);
  }

  // Lógica del turno del croupier
  jugarTurno(puntosJugador, baraja) {
    // El croupier sigue tomando cartas hasta tener al menos 17 puntos o hasta que los puntos del jugador sean mayores a 21
    while (
      this.puntos < 17 &&
      this.puntos <= puntosJugador &&
      puntosJugador <= 21
    ) {
      // Pide una carta de la baraja
      this.agregarCarta(baraja.pedirCarta());
    }
    return this.puntos;
  }

  // Reinicia las cartas, puntos y carta oculta del croupier
  reiniciarCartas() {
    this.cartas = [];
    this.puntos = 0;
    this.cartaOculta = null;
  }

  // Devuelve los puntos actuales del croupier
  obtenerPuntos() {
    return this.puntos;
  }

  // Devuelve las cartas del croupier
  mostrarCartas() {
    return this.cartas;
  }
}

// Exporta la clase Croupier
export default Croupier;
