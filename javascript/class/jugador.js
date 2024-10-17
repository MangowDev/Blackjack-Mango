// Clase que representa a un jugador en un juego de cartas
class Jugador {
  // Constructor que inicializa el jugador con su nombre
  constructor(nombre) {
    this.nombre = nombre;
    this.cartas = [];
    this.puntos = 0;
  }

  // Agrega una carta y actualiza los puntos
  agregarCarta(carta) {
    // Añade la carta al array
    this.cartas.push(carta);

    // Suma los puntos de la carta
    let puntosCarta = this.calcularPuntos(carta);

    // Si la carta es un As y los puntos superan 21, ajustar el valor a 1
    if (puntosCarta === 11 && this.puntos + puntosCarta > 21) {
      puntosCarta = 1;
    }

    // Sumar los puntos de la carta ajustados
    this.puntos += puntosCarta;
  }

  // Calcula los puntos de una carta
  calcularPuntos(carta) {
    // Obtiene el valor de la carta
    let valor = carta.substring(0, carta.length - 1);

    // Retorna 11 para "A", 10 para figuras, o el valor numérico
    return isNaN(valor) ? (valor === "A" ? 11 : 10) : parseInt(valor);
  }

  // Reinicia las cartas y los puntos del jugador
  reiniciarCartas() {
    this.cartas = [];
    this.puntos = 0;
  }

  // Devuelve los puntos actuales del jugador
  obtenerPuntos() {
    return this.puntos;
  }

  // Devuelve las cartas del jugador
  mostrarCartas() {
    return this.cartas;
  }
}

// Exporta la clase Jugador
export default Jugador;
