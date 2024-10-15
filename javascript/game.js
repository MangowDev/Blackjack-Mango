import Baraja from "./class/baraja.js";
import Jugador from "./class/jugador.js";
import Croupier from "./class/croupier.js";

// Inicialización de objetos globales
let baraja = new Baraja();
let croupier = new Croupier();
let jugadores = [];
let contadorJugadores = 0;

// Referencias a elementos del DOM
const botonPedir = document.querySelector("#btnPedir");
const botonPasar = document.querySelector("#btnPasar");
const botonNuevo = document.querySelector("#btnNuevo");
const marcador = document.querySelectorAll("span");
const divJugadores = document.querySelector(".player-div");
const divJugadorCarta = document.querySelector(".player-cards-div");
const divCroupierCarta = document.querySelector(".croupier-cards-div");
const divJugadorTitulo = document.querySelector(".player-title-div");
const divJugadorBarra = document.querySelector(".player-bar-div");


// Crear baraja para comenzar a repartir cartas
const crearBaraja = () => {
  baraja.crearBaraja();
  baraja.baraja = _.shuffle(baraja.baraja);
};

const inicializarJuego = () => {
  let numJugadores = parseInt(prompt("¿Cuántos jugadores? (1-6)"));
  
  while (numJugadores < 1 || numJugadores > 6 || isNaN(numJugadores)) {
    alert("El numero de jugadores debe de ser entre 1 y 6.");
    numJugadores = parseInt(prompt("¿Cuántos jugadores? (1-6)"));
  }

  
  jugadores = [];
  contadorJugadores = 0; 
  divJugadores.innerHTML = "";

  for (let i = 1; i <= numJugadores; i++) {
    let jugador = new Jugador(`Jugador ${i}`);
    jugadores.push(jugador);

    const jugadorDiv = document.createElement("div");
    jugadorDiv.classList.add("player-cards-div");
    jugadorDiv.id = `player-cards-${i}`;

    const numeroDiv = document.createElement("div");
    numeroDiv.classList.add("player-number-div");

    const numeroSpan = document.createElement("span");
    numeroSpan.classList.add("number-span");
    numeroSpan.innerHTML = "0";

    const jugadorTituloDiv = document.createElement("div");
    jugadorTituloDiv.id = `player-title-div-${i}`;
    jugadorTituloDiv.classList.add("player-title-div");

    const jugadorTitulo = document.createElement("h2");
    jugadorTitulo.id = `player-title-${i}`;
    jugadorTitulo.classList.add("player-title-h2");
    jugadorTitulo.innerHTML = `Jugador ${i}`;

    divJugadores.appendChild(jugadorDiv);
    jugadorDiv.appendChild(numeroDiv);
    numeroDiv.appendChild(numeroSpan);
    divJugadorBarra.appendChild(jugadorTituloDiv);
    jugadorTituloDiv.appendChild(jugadorTitulo);
  }

  crearBaraja();

  // Repartir las cartas iniciales a los jugadores
  for (let i = 0; i < 2; i++) {
    jugadores.forEach((jugador, index) => {
      pedirCartaJugador(index);
    });
  }

  pedirPrimeraCartaCroupier();
  pedirCartaCroupier();

  actualizarMarcador();
};

const actualizarMarcador = () => {
  marcador[0].innerHTML = croupier.obtenerPuntos();

  jugadores.forEach((jugador, index) => {
    const marcadorJugador = document.querySelector(
      `#player-cards-${index + 1} .number-span`
    );
    if (marcadorJugador) {
      marcadorJugador.innerHTML = jugador.obtenerPuntos();
    }
  });
};

const estiloGanadorJugador = (jugadorIndex) => {
  const jugadorTituloDiv = document.querySelector(
    `#player-title-div-${jugadorIndex + 1}`
  );
  const resultadoJugador = document.createElement("h2");
  resultadoJugador.classList.add("winner");
  resultadoJugador.textContent = "Gana"; // 
  jugadorTituloDiv.appendChild(resultadoJugador);
};

const estiloPerdedorJugador = (jugadorIndex) => {
  const jugadorTituloDiv = document.querySelector(
    `#player-title-div-${jugadorIndex + 1}`
  );
  const resultadoJugador = document.createElement("h2");
  resultadoJugador.classList.add("loser");
  resultadoJugador.textContent = "Pierde"; // 
  jugadorTituloDiv.appendChild(resultadoJugador);
};

const estiloEmpateJugador = (jugadorIndex) => {
  const jugadorTituloDiv = document.querySelector(
    `#player-title-div-${jugadorIndex + 1}`
  );
  const resultadoJugador = document.createElement("h2");
  resultadoJugador.classList.add("draw");
  resultadoJugador.textContent = "Empate"; // 
  jugadorTituloDiv.appendChild(resultadoJugador);
};


// Funciones de interacción del jugador
const pedirCartaJugador = (index) => {
  const carta = baraja.pedirCarta();
  jugadores[index].agregarCarta(carta);

  const imgCarta = document.createElement("img");
  imgCarta.src = "assets/cartas/" + carta + ".png";
  imgCarta.classList.add("carta");
  const jugadorDiv = document.querySelector(`#player-cards-${index + 1}`);
  if (jugadorDiv) {
    jugadorDiv.appendChild(imgCarta);
  }

  actualizarMarcador();
  evaluarEstadoJugador(index);
};

const resaltarJugadorActivo = () => {
  const titulosJugadores = document.querySelectorAll(".player-title-h2");
  titulosJugadores.forEach((titulo) => {
    titulo.classList.remove("active-player");
  });

  const jugadorTitulo = document.querySelector(
    `#player-title-${contadorJugadores + 1}`
  );
  if (jugadorTitulo) {
    jugadorTitulo.classList.add("active-player");
  }
};

const evaluarEstadoJugador = () => {
  resaltarJugadorActivo();

  const puntosJugador = jugadores[contadorJugadores].obtenerPuntos();

  if (puntosJugador > 21 || puntosJugador === 21) {
    contadorJugadores++;
    resaltarJugadorActivo();
    if (contadorJugadores >= jugadores.length) {
      turnoCroupier();
      botonPedir.disabled = true;
      botonPasar.disabled = true;
    }
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
  pedirCartaJugador(contadorJugadores);
  if (
    jugadores[contadorJugadores].puntos === 21 ||
    jugadores[contadorJugadores].puntos > 21
  ) {
    contadorJugadores++;
    resaltarJugadorActivo();
  }
});

botonPasar.addEventListener("click", () => {
  contadorJugadores++;

  resaltarJugadorActivo();

  while (
    contadorJugadores < jugadores.length &&
    jugadores[contadorJugadores].puntos === 21
  ) {
    contadorJugadores++;
  }

  if (contadorJugadores >= jugadores.length) {
    turnoCroupier();
    botonPedir.disabled = true;
    botonPasar.disabled = true;
  }
});

botonNuevo.addEventListener("click", () => {
  jugadores.forEach((jugador) => jugador.reiniciarCartas());
  croupier.reiniciarCartas();
  baraja.reiniciarBaraja();
  contadorJugadores = 0; // Reiniciar el contador de jugadores

  botonPedir.disabled = false;
  botonPasar.disabled = false;

  if (divJugadorCarta) {
    const imgsJugador = divJugadorCarta.querySelectorAll("img");
    imgsJugador.forEach((img) => img.remove());
  }

  if (divCroupierCarta) {
    const imgsCroupier = divCroupierCarta.querySelectorAll("img");
    imgsCroupier.forEach((img) => img.remove());
  }

  if (divJugadorTitulo) {
    const resultadoJugador = divJugadorTitulo.querySelectorAll(".resultado");
    resultadoJugador.forEach((element) => element.remove());
  }

  if (divJugadorBarra) {
    const titulosBarraJugador =
      divJugadorBarra.querySelectorAll(".player-title-div");
    titulosBarraJugador.forEach((element) => element.remove());
  }

  inicializarJuego();
});

const turnoCroupier = () => {
  const pedirCartasCroupier = () => {
    setTimeout(() => {
      revelarCarta();

      setTimeout(() => {
        if (croupier.obtenerPuntos() < 17) {
          pedirCartaCroupier();
          pedirCartasCroupier();
        } else {
          evaluarResultado();
        }
      }, 1000);
    }, 200);
  };

  pedirCartasCroupier();
};

const evaluarResultado = () => {
  jugadores.forEach((jugador, index) => {
    const puntosJugador = jugador.obtenerPuntos();
    const puntosCroupier = croupier.obtenerPuntos();

    if (puntosJugador > 21) {
      estiloPerdedorJugador(index);
    } else if (puntosCroupier > 21 || puntosJugador > puntosCroupier) {
      estiloGanadorJugador(index);
    } else if (puntosJugador === puntosCroupier) {
      estiloEmpateJugador(index);
    } else {
      estiloPerdedorJugador(index);
    }
  });
};

// Inicializa el juego
inicializarJuego();
