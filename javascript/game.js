import Baraja from "./class/baraja.js";
import Jugador from "./class/jugador.js";
import Croupier from "./class/croupier.js";

// Inicialización de objetos globales
let baraja = new Baraja();
let jugador = new Jugador("Jugador 1");
let croupier = new Croupier();

// Referencias a elementos del DOM
const botonPedir = document.querySelector("#btnPedir");
const botonPasar = document.querySelector("#btnPasar");
const botonNuevo = document.querySelector("#btnNuevo");
const marcador = document.querySelectorAll("span");
const divJugadorCarta = document.querySelector(".player-cards-div");
const divCroupierCarta = document.querySelector(".croupier-cards-div");
const divJugadorBarra = document.querySelector(".player-bar-div");
const divCroupierBarra = document.querySelector(".croupier-bar-div");

const ganador = document.createElement("h2");
ganador.textContent = "Gana";
ganador.style.color = "lightgreen";

const perdedor = document.createElement("h2");
perdedor.textContent = "Pierde";
perdedor.style.color = "red";

const empate1 = document.createElement("h2");
empate1.textContent = "Empate";
empate1.style.color = "#314DC0";
const empate2 = document.createElement("h2");
empate2.textContent = "Empate";
empate2.style.color = "#314DC0";

// Crear baraja para comenzar a repartir cartas
const crearBaraja = () => {
  baraja.crearBaraja();
  baraja.baraja = _.shuffle(baraja.baraja);
};

// Inicializa el juego
const inicializarJuego = () => {
  crearBaraja();
  for (let i = 0; i < 2; i++) {
    pedirCartaJugador();
    pedirCartaCroupier();
  }
  actualizarMarcador();
};

// Actualiza el marcador en el DOM
const actualizarMarcador = () => {
  marcador[0].innerHTML = croupier.obtenerPuntos();
  marcador[1].innerHTML = jugador.obtenerPuntos();
};

// Funciones para el estilo de ganador
const estiloGanadorJugador = () => {
  ganador.style.marginLeft = "10px";
  perdedor.style.marginRight = "10px";
  ganador.classList.add("resultado");
  perdedor.classList.add("resultado");
  divCroupierBarra.insertAdjacentElement("afterbegin", perdedor);
  divJugadorBarra.append(ganador);
};

const estiloGanadorCroupier = () => {
  ganador.style.marginRight = "10px";
  perdedor.style.marginLeft = "10px";
  ganador.classList.add("resultado");
  perdedor.classList.add("resultado");
  divCroupierBarra.insertAdjacentElement("afterbegin", ganador);
  divJugadorBarra.append(perdedor);
};

const estiloEmpate = () => {
  empate1.style.marginRight = "10px";
  empate2.style.marginLeft = "10px";
  empate1.classList.add("resultado");
  empate2.classList.add("resultado");
  divCroupierBarra.insertAdjacentElement("afterbegin", empate1);
  divJugadorBarra.append(empate2);
};

// Funciones de interacción del jugador
const pedirCartaJugador = () => {
  const carta = baraja.pedirCarta();
  jugador.agregarCarta(carta);
  const imgCarta = document.createElement("img");
  imgCarta.src = "assets/cartas/" + carta + ".png";
  imgCarta.classList.add("carta");
  divJugadorCarta.append(imgCarta);
  actualizarMarcador();
  evaluarEstadoJugador();
};

const evaluarEstadoJugador = () => {
  if (jugador.obtenerPuntos() > 21) {
    estiloGanadorCroupier();
    botonPedir.disabled = true;
    botonPasar.disabled = true;
  } else if (jugador.obtenerPuntos() === 21) {
    estiloGanadorJugador();
    botonPedir.disabled = true;
    botonPasar.disabled = true;
    turnoCroupier();
  }
};

const pedirCartaCroupier = () => {
  const carta = baraja.pedirCarta();
  croupier.agregarCarta(carta);
  const imgCartaB = document.createElement("img");
  imgCartaB.src = "assets/cartas/" + carta + ".png";
  imgCartaB.classList.add("carta");
  divCroupierCarta.insertAdjacentElement("afterbegin", imgCartaB);
  actualizarMarcador();
};

// Funciones de botones
botonPedir.addEventListener("click", () => {
  pedirCartaJugador();
});

botonPasar.addEventListener("click", () => {
  botonPedir.disabled = true;
  botonPasar.disabled = true;
  turnoCroupier();
});

botonNuevo.addEventListener("click", () => {
  // Reiniciar la lógica del juego
  jugador.reiniciarCartas();
  croupier.reiniciarCartas();
  baraja.reiniciarBaraja();
  botonPedir.disabled = false; 
  botonPasar.disabled = false; 

  // Reiniciar puntos
  jugador.puntos = 0; 
  croupier.puntos = 0; 
  
  const imgsJugador = divJugadorCarta.querySelectorAll("img");
  imgsJugador.forEach((img) => img.remove());

  const imgsCroupier = divCroupierCarta.querySelectorAll("img");
  imgsCroupier.forEach((img) => img.remove());

  const resultadoCroupier = divCroupierBarra.querySelectorAll(".resultado");
  resultadoCroupier.forEach((element) => element.remove());

  const resultadoJugador = divJugadorBarra.querySelectorAll(".resultado");
  resultadoJugador.forEach((element) => element.remove());
  
  marcador[0].innerHTML = croupier.obtenerPuntos();
  marcador[1].innerHTML = jugador.obtenerPuntos();
  
  inicializarJuego(); // Comenzar una nueva partida
});

// Turno del croupier
const turnoCroupier = () => {
  const pedirCartasCroupier = () => {
    if (croupier.obtenerPuntos() < 17) {
      pedirCartaCroupier();
      setTimeout(pedirCartasCroupier, 1000);
    } else {
      evaluarResultado();
    }
  };

  pedirCartasCroupier();
};

// Evaluar el resultado del juego
const evaluarResultado = () => {
  if (jugador.obtenerPuntos() > 21) {
    estiloGanadorCroupier();
  } else if (croupier.obtenerPuntos() > 21 || jugador.obtenerPuntos() > croupier.obtenerPuntos()) {
    estiloGanadorJugador();
  } else if (croupier.obtenerPuntos() === jugador.obtenerPuntos()) {
    estiloEmpate();
  } else {
    estiloGanadorCroupier();
  }
};

// Inicializa el juego
inicializarJuego();
