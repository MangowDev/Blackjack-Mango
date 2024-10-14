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
const divJugadorTitulo = document.querySelector(".player-title-div");
const divCroupierBarra = document.querySelector(".croupier-bar-div");

const ganador = document.createElement("h2");
ganador.textContent = "Gana";
ganador.style.color = "lightgreen";
ganador.style.textDecoration = "underline";

const perdedor = document.createElement("h2");
perdedor.textContent = "Pierde";
perdedor.style.color = "red";
perdedor.style.textDecoration = "underline";

const empate1 = document.createElement("h2");
empate1.textContent = "Empate";
empate1.style.color = "#3172C0";
empate1.style.textDecoration = "underline";
const empate2 = document.createElement("h2");
empate2.textContent = "Empate";
empate2.style.color = "#3172C0";
empate2.style.textDecoration = "underline";

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
  }
  pedirPrimeraCartaCroupier();
  pedirCartaCroupier();
  actualizarMarcador();

  if (croupier.puntos === 21) {
    revelarCarta();
    estiloGanadorCroupier();
  }
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
  divJugadorTitulo.append(ganador);
};

const estiloGanadorCroupier = () => {
  ganador.style.marginRight = "10px";
  perdedor.style.marginLeft = "10px";
  ganador.classList.add("resultado");
  perdedor.classList.add("resultado");
  divCroupierBarra.insertAdjacentElement("afterbegin", ganador);
  divJugadorTitulo.append(perdedor);
};

const estiloEmpate = () => {
  empate1.style.marginRight = "10px";
  empate2.style.marginLeft = "10px";
  empate1.classList.add("resultado");
  empate2.classList.add("resultado");
  divCroupierBarra.insertAdjacentElement("afterbegin", empate1);
  divJugadorTitulo.append(empate2);
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
    revelarCarta();
  } else if (jugador.obtenerPuntos() === 21) {
    botonPedir.disabled = true;
    botonPasar.disabled = true;
    turnoCroupier();
  }
};

const pedirPrimeraCartaCroupier = () => {
  const carta = baraja.pedirCarta();
  croupier.agregarCartaOculta(carta); 
  const imgCartaB = document.createElement("img");
  imgCartaB.src = "assets/cartas/reverso-rojo.png"; 
  imgCartaB.classList.add("carta");
  imgCartaB.id = "carta-oculta"; 
  divCroupierCarta.insertAdjacentElement("afterbegin", imgCartaB);
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

const revelarCarta = () => {
  croupier.revelarCartaOculta(); 

  const imgCartaOculta = document.querySelector("#carta-oculta");

  if (imgCartaOculta) {
    const valorOculta = croupier.cartas[0]; 
    imgCartaOculta.src = "assets/cartas/" + valorOculta + ".png"; 
  }

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

  const resultadoJugador = divJugadorTitulo.querySelectorAll(".resultado");
  resultadoJugador.forEach((element) => element.remove());
  
  marcador[0].innerHTML = croupier.obtenerPuntos();
  marcador[1].innerHTML = jugador.obtenerPuntos();
  
  inicializarJuego(); 
});

// Turno del croupier
const turnoCroupier = () => {
  const pedirCartasCroupier = () => {
    setTimeout(() => {
      revelarCarta(); 
      if (croupier.obtenerPuntos() < 17) {
        if (croupier.obtenerPuntos() <= jugador.obtenerPuntos() && jugador.obtenerPuntos() <= 21) {
          setTimeout(() => {
            pedirCartaCroupier();
            pedirCartasCroupier(); 
          }, 1000); 
        } else {
          evaluarResultado(); 
        }
      } else {
        evaluarResultado(); 
      }
    }, 200); 
  };

  pedirCartasCroupier(); 
};


// Evaluar el resultado del juego
const evaluarResultado = () => {
  if (jugador.obtenerPuntos() > 21) {
    estiloGanadorCroupier();
  } else if (croupier.obtenerPuntos() === jugador.obtenerPuntos()) {
    if (croupier.obtenerPuntos() === 21 && jugador.obtenerPuntos() === 21) {
      estiloEmpate();
    } else {
      estiloEmpate();
    }
  } else if (croupier.obtenerPuntos() > jugador.obtenerPuntos() && croupier.obtenerPuntos() <= 21) {
    estiloGanadorCroupier();
  } else if (croupier.obtenerPuntos() > 21) {
    estiloGanadorJugador();
  } else {
    estiloGanadorJugador();
  }
};

// Inicializa el juego
inicializarJuego();
