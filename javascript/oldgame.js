let baraja = [];
let tipoCarta = ["C", "D", "P", "T"];
let especiales = ["A", "K", "Q", "J"];
let puntosJugador = 0;
let puntosCroupier = 0;

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
empate1.style.color = "darkblue";
ganador.style.marginLeft = "10px";
ganador.style.marginRight = "10px";

const empate2 = document.createElement("h2");
empate2.textContent = "Empate";
empate2.style.color = "darkblue";
ganador.style.marginRight = "10px";
ganador.style.marginLeft = "10px";

// Crear baraja para comenzar a repartir cartas

const crearBaraja = () => {
  for (let i = 2; i <= 10; i++) {
    for (let tipo of tipoCarta) {
      baraja.push(i + tipo);
    }
  }

  for (let tipo of tipoCarta) {
    for (let esp of especiales) {
      baraja.push(esp + tipo);
    }
  }

  baraja = _.shuffle(baraja);
  return baraja;
};

// Pedir una carta y retirar de la baraja
const pedirCarta = () => {
  const carta = baraja.pop();
  if (baraja.length === 0) {
    throw "No hay cartas";
  }

  return carta;
};

// Calculamos el valor de la carta
const valorCarta = (carta) => {
  let puntos = carta.substring(0, carta.length - 1);
  let valor = isNaN(puntos) ? (puntos === "A" ? 11 : 10) : puntos * 1;
  return valor;
};

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

const pedirCartaJugador = () => {
  const carta = pedirCarta();
  puntosJugador += valorCarta(carta);
  marcador[1].innerHTML = puntosJugador;
  const imgCarta = document.createElement("img");
  imgCarta.src = "assets/cartas/" + carta + ".png";
  imgCarta.classList.add("carta");
  divJugadorCarta.append(imgCarta);
};

const pedirCartaCroupier = () => {
  const cartaB = pedirCarta();
  puntosCroupier += valorCarta(cartaB);
  marcador[0].innerHTML = puntosCroupier;
  const imgCartaB = document.createElement("img");
  imgCartaB.src = "assets/cartas/" + cartaB + ".png";
  imgCartaB.classList.add("carta");
  divCroupierCarta.insertAdjacentElement("afterbegin", imgCartaB);
};

const pedirCartaCroupierPrimera = () => {
  const cartaB = pedirCarta();
  puntosCroupier += valorCarta(cartaB);
  marcador[0].innerHTML = puntosCroupier;
  const imgCartaB = document.createElement("img");
  imgCartaB.src = "assets/cartas/reverso-rojo.png";
  imgCartaB.classList.add("carta");
  divCroupierCarta.insertAdjacentElement("afterbegin", imgCartaB);
};

botonPedir.addEventListener("click", () => {
  pedirCartaJugador();
  if (puntosJugador > 21) {
    estiloGanadorCroupier();
    botonPedir.disabled = true;
    botonPasar.disabled = true;
  } else if (puntosJugador === 21) {
    estiloGanadorJugador();
    botonPedir.disabled = true;
    botonPasar.disabled = true;
    turnoCroupier(puntosJugador);
  }
});

botonPasar.addEventListener("click", () => {
  botonPedir.disabled = true;
  botonPasar.disabled = true;
  turnoCroupier(puntosJugador);
});

botonNuevo.addEventListener("click", () => {
  botonPedir.disabled = false;
  botonPasar.disabled = false;
  baraja = [];
  crearBaraja();
  puntosJugador = 0;
  puntosCroupier = 0;
  marcador[0].innerHTML = "0";
  marcador[1].innerHTML = "0";

  const imgsJugador = divJugadorCarta.querySelectorAll("img");
  imgsJugador.forEach((img) => img.remove());

  const imgsCroupier = divCroupierCarta.querySelectorAll("img");
  imgsCroupier.forEach((img) => img.remove());

  const resultadoCroupier = divCroupierBarra.querySelectorAll(".resultado");
  resultadoCroupier.forEach((element) => element.remove());

  const resultadoJugador = divJugadorBarra.querySelectorAll(".resultado");
  resultadoJugador.forEach((element) => element.remove());

  cartaInicial();
});

const turnoCroupier = (puntosJugador) => {
  const pedirCartasCroupier = () => {
    if (puntosCroupier < 17 || puntosCroupier < puntosJugador) {
      if (puntosCroupier <= puntosJugador && puntosJugador <= 21) {
        pedirCartaCroupier();

        setTimeout(pedirCartasCroupier, 1000);
      } else {
        evaluarResultado();
      }
    } else {
      evaluarResultado();
    }
  };

  pedirCartasCroupier();
};

const evaluarResultado = () => {
  if (puntosJugador > 21) {
    estiloGanadorCroupier();
  } else if (puntosCroupier === puntosJugador) {
    if (puntosCroupier === 21 && puntosJugador === 21) {
      console.log("repartimos ganancias");
    } else {
      empate1.classList.add("resultado");
      empate2.classList.add("resultado");
      divCroupierBarra.insertAdjacentElement("afterbegin", empate1);
      divJugadorBarra.append(empate2);
    }
  } else if (puntosCroupier > puntosJugador && puntosCroupier <= 21) {
    estiloGanadorCroupier();
  } else if (puntosCroupier > 21) {
    estiloGanadorJugador();
  } else {
    estiloGanadorJugador();
  }
};


const cartaInicial = () => {
  for (let i = 0; i < 2; i++) {
    pedirCartaJugador();
    pedirCartaCroupier();
  }

  if (puntosCroupier === 21) {
    estiloGanadorCroupier();
  } else if (puntosJugador === 21) {
    estiloGanadorJugador();
  }
};

crearBaraja();
cartaInicial();