// Clase que representa una baraja de cartas
class Baraja {
  // Constructor que inicializa la baraja
  constructor() {
      this.cartas = this.crearBaraja(); 
  }

  // Método que crea una nueva baraja de cartas
  crearBaraja() {
      let baraja = []; 
      const tipoCarta = ["C", "D", "P", "T"]; 
      const especiales = ["A", "K", "Q", "J"]; 

      // Agrega las cartas del 2 al 10 a la baraja
      for (let i = 2; i <= 10; i++) {
          for (let tipo of tipoCarta) {
              baraja.push(`${i}${tipo}`);
          }
      }

      // Agrega las cartas especiales (A, K, Q, J) a la baraja
      for (let tipo of tipoCarta) {
          for (let esp of especiales) {
              baraja.push(`${esp}${tipo}`); 
          }
      }

      // Mezcla la baraja antes de devolverla
      return _.shuffle(baraja); 
  }

  // Método para pedir una carta de la baraja
  pedirCarta() {
    // Lanza un error si no hay cartas
      if (this.cartas.length === 0) {
          throw "No hay más cartas en la baraja"; 
      }

      // Devuelve la última carta de la baraja
      return this.cartas.pop(); 
  }

  // Método para reiniciar la baraja
  reiniciarBaraja() {
      this.cartas = this.crearBaraja(); 
  }
}

// Exporta la clase Baraja
export default Baraja;
