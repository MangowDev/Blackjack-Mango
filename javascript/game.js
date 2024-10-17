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

// Crear baraja
const crearBaraja = () => {
  baraja.crearBaraja();

  // Barajamos las cartas
  baraja.baraja = _.shuffle(baraja.baraja);
};

const inicializarJuego = () => {
  let numJugadores = parseInt(prompt("¿Cuántos jugadores? (1-6)"));

  // Validación del número de jugadores
  while (numJugadores < 1 || numJugadores > 6 || isNaN(numJugadores)) {
    alert("El numero de jugadores debe de ser entre 1 y 6.");
    numJugadores = parseInt(prompt("¿Cuántos jugadores? (1-6)"));
  }

  // Reiniciar el estado del juego por seguridad
  jugadores = [];
  contadorJugadores = 0;
  divJugadores.innerHTML = "";

  // Crear jugadores con sus elementos correspondientes
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

    // Puntaje inicial
    numeroSpan.innerHTML = "0";

    const jugadorTituloDiv = document.createElement("div");
    jugadorTituloDiv.id = `player-title-div-${i}`;
    jugadorTituloDiv.classList.add("player-title-div");

    const jugadorTitulo = document.createElement("h2");
    jugadorTitulo.id = `player-title-${i}`;
    jugadorTitulo.classList.add("player-title-h2");
    jugadorTitulo.innerHTML = `Jugador ${i}`;

    // Agregar elementos al DOM
    divJugadores.appendChild(jugadorDiv);
    jugadorDiv.appendChild(numeroDiv);
    numeroDiv.appendChild(numeroSpan);
    divJugadorBarra.appendChild(jugadorTituloDiv);
    jugadorTituloDiv.appendChild(jugadorTitulo);
  }

  // Barajar cartas
  crearBaraja();

  // Repartir cartas iniciales a los jugadores
  for (let i = 0; i < 2; i++) {
    jugadores.forEach((jugador, index) => {
      pedirCartaJugador(index);
    });
  }

  // Croupier recibe su primera carta
  pedirPrimeraCartaCroupier();

  // Croupier recibe otra carta
  pedirCartaCroupier();

  // Actualizar puntajes
  actualizarMarcador();
};

// Actualizar el marcador
const actualizarMarcador = () => {
  marcador[0].innerHTML = croupier.obtenerPuntos();

  // Actualizamos el marcador del jugador en cuestion
  jugadores.forEach((jugador, index) => {
    const marcadorJugador = document.querySelector(
      `#player-cards-${index + 1} .number-span`
    );
    if (marcadorJugador) {
      marcadorJugador.innerHTML = jugador.obtenerPuntos();
    }
  });
};

// Estilos para el resultado del jugador

// Funcion que crea un h2 para mostrar la victoria del jugador
const estiloGanadorJugador = (jugadorIndex) => {
  const jugadorTituloDiv = document.querySelector(
    `#player-title-div-${jugadorIndex + 1}`
  );
  const resultadoJugador = document.createElement("h2");
  resultadoJugador.classList.add("winner");
  resultadoJugador.textContent = "Gana";
  jugadorTituloDiv.appendChild(resultadoJugador);
};

// Funcion que crea un h2 para mostrar la derrota del jugador
const estiloPerdedorJugador = (jugadorIndex) => {
  const jugadorTituloDiv = document.querySelector(
    `#player-title-div-${jugadorIndex + 1}`
  );
  const resultadoJugador = document.createElement("h2");
  resultadoJugador.classList.add("loser");
  resultadoJugador.textContent = "Pierde";
  jugadorTituloDiv.appendChild(resultadoJugador);
};

// Funcion que crea un h2 para mostrar el empate del jugador
const estiloEmpateJugador = (jugadorIndex) => {
  const jugadorTituloDiv = document.querySelector(
    `#player-title-div-${jugadorIndex + 1}`
  );
  const resultadoJugador = document.createElement("h2");
  resultadoJugador.classList.add("draw");
  resultadoJugador.textContent = "Empate";
  jugadorTituloDiv.appendChild(resultadoJugador);
};

// Funciones de interacción del jugador
const pedirCartaJugador = (index) => {
  // Pedir carta de la baraja
  const carta = baraja.pedirCarta();

  // Agregar carta al jugador
  jugadores[index].agregarCarta(carta);

  // Creamos elemento imagen con la imagen de la carta en cuestion, y la agregamos al jugador correspondiente
  const imgCarta = document.createElement("img");
  imgCarta.src = "assets/cartas/" + carta + ".png";
  imgCarta.classList.add("carta"); // Añadimos la clase 'carta'

  const jugadorDiv = document.querySelector(`#player-cards-${index + 1}`);

  if (jugadorDiv) {
    // Mostrar carta en el DOM
    jugadorDiv.appendChild(imgCarta);

    // Usamos un pequeño retraso para aplicar la clase de animación después de insertar la carta en el DOM
    setTimeout(() => {
      imgCarta.classList.add("appear"); 
    }, 10); 
  }

  // Actualizar puntajes
  actualizarMarcador();

  // Evaluar estado del jugador
  evaluarEstadoJugador(index);
};


// Método para resaltar al jugador activo
const resaltarJugadorActivo = () => {
  // Quitamos todas las clases del jugador activo al resto del jugadores
  const titulosJugadores = document.querySelectorAll(".player-title-h2");
  titulosJugadores.forEach((titulo) => {
    titulo.classList.remove("active-player");
  });

  const jugadorTitulo = document.querySelector(
    `#player-title-${contadorJugadores + 1}`
  );

  // Añadimos la clase del jugador activo
  if (jugadorTitulo) {
    jugadorTitulo.classList.add("active-player");
  }
};

// Evaluar el estado del jugador
const evaluarEstadoJugador = () => {
  resaltarJugadorActivo();

  const puntosJugador = jugadores[contadorJugadores].obtenerPuntos();

  if (puntosJugador > 21 || puntosJugador === 21) {
    // Cambiar al siguiente jugador
    contadorJugadores++;
    resaltarJugadorActivo();
    if (contadorJugadores >= jugadores.length) {
      // Iniciar turno del croupier
      turnoCroupier();

      // Deshabilitar botones de accion
      botonPedir.disabled = true;
      botonPasar.disabled = true;
    }
  }
};

// Primera cara del croupier (oculta)
const pedirPrimeraCartaCroupier = () => {
  const carta = baraja.pedirCarta();
  croupier.agregarCartaOculta(carta);

  // Mostrar carta oculta
  const imgCartaB = document.createElement("img");
  imgCartaB.src = "assets/cartas/reverso-rojo.png";
  imgCartaB.classList.add("carta");
  imgCartaB.id = "carta-oculta";
  divCroupierCarta.insertAdjacentElement("afterbegin", imgCartaB);

  // Iniciar la animación añadiendo la clase 'appearC'
  setTimeout(() => {
    imgCartaB.classList.add("appearC");
  }, 10); 
};

// Método para que el croupier pida carta
const pedirCartaCroupier = () => {
  const carta = baraja.pedirCarta();
  croupier.agregarCarta(carta);

  // Mostrar carta
  const imgCartaB = document.createElement("img");
  imgCartaB.src = "assets/cartas/" + carta + ".png";
  imgCartaB.classList.add("carta");
  
  // Agregar la carta a la vista antes de aplicar la animación
  divCroupierCarta.insertAdjacentElement("afterbegin", imgCartaB);

  // Iniciar la animación añadiendo la clase 'appearC'
  setTimeout(() => {
    imgCartaB.classList.add("appearC");
  }, 10); 

  // Actualizar puntajes
  actualizarMarcador();
};

// Metodo que revela la carta oculta del croupier

const revelarCarta = () => {
  croupier.revelarCartaOculta();

  const imgCartaOculta = document.querySelector("#carta-oculta");

  if (imgCartaOculta) {
    // Mostrar carta oculta
    const valorOculta = croupier.cartas[0];
    imgCartaOculta.src = "assets/cartas/" + valorOculta + ".png";
  }

  // Actualizar puntajes
  actualizarMarcador();
};

// Boton para pedir cartas
botonPedir.addEventListener("click", () => {
  // Pedir carta al jugador
  pedirCartaJugador(contadorJugadores);

  // Si el jugador tiene 21 o más
  if (jugadores[contadorJugadores].puntos === 21 || jugadores[contadorJugadores].puntos > 21) {
    // Pasar al siguiente jugador
    contadorJugadores++;
    resaltarJugadorActivo();
  }
});

// Boton para pasar turno
botonPasar.addEventListener("click", () => {
  // Pasar al siguiente jugador
  contadorJugadores++;
  resaltarJugadorActivo();

  // Pasar si el jugador tiene 21 puntos, y no es el ultimo jugador
  while (
    contadorJugadores < jugadores.length &&
    jugadores[contadorJugadores].puntos === 21
  ) {
    contadorJugadores++;
    resaltarJugadorActivo();
  }

  if (contadorJugadores >= jugadores.length) {
    // Iniciar turno del croupier
    turnoCroupier();

    // Deshabilitar botones
    botonPedir.disabled = true;
    botonPasar.disabled = true;
  }
});

// Boton para reiniciar el juego
botonNuevo.addEventListener("click", () => {
  jugadores.forEach((jugador) => jugador.reiniciarCartas());
  croupier.reiniciarCartas();
  baraja.reiniciarBaraja();

  // Reiniciar el contador de jugadores
  contadorJugadores = 0;

  // Habilitar botones
  botonPedir.disabled = false;
  botonPasar.disabled = false;

  // Limpiar cartas y resultados
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

  // Comenzar un nuevo juego
  inicializarJuego();
});

// Turno del croupier
const turnoCroupier = () => {
  botonNuevo.disabled = true;
  const pedirCartasCroupier = () => {
    setTimeout(() => {
      // Revelar carta oculta
      revelarCarta();

      setTimeout(() => {
        // Pedir carta si menos de 17
        if (croupier.obtenerPuntos() < 17) {
          pedirCartaCroupier();

          // Repetir el proceso
          pedirCartasCroupier();
        } else {
          // Evaluar el resultado
          evaluarResultado();
          botonNuevo.disabled = false;
        }
      }, 1000);
    }, 200);
  };

  // Iniciar el turno del croupier
  pedirCartasCroupier();
};

// Evaluar el resultado del juego
const evaluarResultado = () => {
  jugadores.forEach((jugador, index) => {
    const puntosJugador = jugador.obtenerPuntos();
    const puntosCroupier = croupier.obtenerPuntos();

    // Determinar el resultado para cada jugador
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
