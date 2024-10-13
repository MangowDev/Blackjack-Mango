class Baraja {
    constructor() {
      this.cartas = this.crearBaraja();
    }
  
    crearBaraja() {
      let baraja = [];
      const tipoCarta = ["C", "D", "P", "T"]; 
      const especiales = ["A", "K", "Q", "J"];
  
      for (let i = 2; i <= 10; i++) {
        for (let tipo of tipoCarta) {
          baraja.push(`${i}${tipo}`);
        }
      }
  
      for (let tipo of tipoCarta) {
        for (let esp of especiales) {
          baraja.push(`${esp}${tipo}`);
        }
      }
  
      return _.shuffle(baraja); // Usamos lodash para mezclar
    }
  
    pedirCarta() {
      if (this.cartas.length === 0) {
        throw "No hay más cartas en la baraja";
      }
      return this.cartas.pop();
    }
  
    reiniciarBaraja() {
      this.cartas = this.crearBaraja();
    }
  }
  
  export default Baraja;
