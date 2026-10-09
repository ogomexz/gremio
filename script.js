/* =========================================
   CHAPAS DA ELEIÇÃO
========================================= */

const chapas = {

    "1": {
        nome: "Voz Ativa",
        presidente: "Presidente: João Miguel Ramos",
        vice: "Vice-presidente: Elisa Costa Pereira"
    },

    "2": {
        nome: "Unidos da Barra",
        presidente: "Presidente: Juliano César Rosa",
        vice: "Vice-presidente: Lucas Freitas de Deus"
    },

    "3": {
        nome: "Gaviões",
        presidente: "Presidente: Paulo Victor Oliveira",
        vice: "Vice-presidente: Rebeca Rios Campos"
    },

    "4": {
        nome: "Ideia Jovem",
        presidente: "Presidente: Iasmin Denise Santos",
        vice: "Vice-presidente: Guilherme Andrade Galacio"
    }

};


/* =========================================
   VARIÁVEL DO VOTO ATUAL
========================================= */

let numeroDigitado = "";


/* =========================================
   CONTAGEM DOS VOTOS
========================================= */

function obterVotos() {

    return JSON.parse(localStorage.getItem("votosGremio")) || {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0
    };

}


/* =========================================
   DIGITAR NÚMERO
========================================= */


function digitarNumero(numero) {

    if (numeroDigitado.length >= 2) {
        return;
    }

    numeroDigitado += numero;

    tocarSomUrna("tecla");

    atualizarNumero();

    verificarChapa();

}

/* =========================================
   MOSTRAR NÚMERO NA TELA
========================================= */

function atualizarNumero() {

    const campos = document.querySelectorAll("#numeroVoto span");

    campos[0].textContent = numeroDigitado[0] || "";
    campos[1].textContent = numeroDigitado[1] || "";

}


/* =========================================
   VERIFICAR CHAPA
========================================= */

function verificarChapa() {

    let numero = numeroDigitado;


    /* Permite 1, 2, 3 e 4 */

    if (numero.length === 1 && chapas[numero]) {

        mostrarChapa(numero);

        return;
    }


    /* Permite 01, 02, 03 e 04 */

    if (numero.length === 2) {

        if (numero.charAt(0) === "0") {

            numero = numero.charAt(1);

        }


        if (chapas[numero]) {

            mostrarChapa(numero);

        } else {

            mostrarErro();

        }

    }

}


/* =========================================
   MOSTRAR INFORMAÇÕES DA CHAPA
========================================= */

function mostrarChapa(numero) {

    const chapa = chapas[numero];

    const informacoes =
        document.getElementById("informacoesChapa");

    document.getElementById("nomeChapa").textContent =
        chapa.nome;

    document.getElementById("presidente").textContent =
        chapa.presidente;

    document.getElementById("vice").textContent =
        chapa.vice;

    informacoes.style.display = "flex";


    document.getElementById("mensagem").textContent =
        "CONFIRA OS DADOS E CLIQUE EM CONFIRMAR";

}


/* =========================================
   VOTO INVÁLIDO
========================================= */

function mostrarErro() {

    document.getElementById("informacoesChapa").style.display =
        "none";

    document.getElementById("mensagem").textContent =
        "NÚMERO INVÁLIDO. CLIQUE EM CORRIGIR.";

}


/* =========================================
   CORRIGIR VOTO
========================================= */

function corrigirVoto() {

    numeroDigitado = "";

    atualizarNumero();

    document.getElementById("informacoesChapa").style.display =
        "none";

    document.getElementById("mensagem").textContent =
        "DIGITE O NÚMERO DA CHAPA";

}


/* =========================================
   CONFIRMAR VOTO
========================================= */

function confirmarVoto() {

    let numero = numeroDigitado;


    if (numero === "") {

        alert("Digite o número de uma chapa.");

        return;

    }


    /* Transformar 01 em 1 */

    if (numero.length === 2 && numero.charAt(0) === "0") {

        numero = numero.charAt(1);

    }


    /* Verificar se a chapa existe */

    if (!chapas[numero]) {

        alert("Número inválido. Escolha uma chapa de 1 a 4.");

        return;

    }


    /* =====================================
       PEGAR OS VOTOS ATUAIS
    ===================================== */

    let votos = obterVotos();


    /* =====================================
       ADICIONAR 1 VOTO
    ===================================== */

    votos[numero]++;
    tocarSomUrna("confirmar");


    /* =====================================
       SALVAR OS VOTOS
    ===================================== */

    localStorage.setItem(
        "votosGremio",
        JSON.stringify(votos)
    );


    /* =====================================
       MOSTRAR CONFIRMAÇÃO
    ===================================== */

    tocarSomUrna("finalizado");
    document.querySelector(".tela").innerHTML = `

        <div style="
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        ">

            <h1 style="font-size: 6vh;">
                VOTO CONFIRMADO
            </h1>

            <p style="
                font-size: 3vh;
                margin-top: 3vh;
            ">
                Obrigado por participar da eleição!
            </p>

        </div>

    `;


    document.querySelector(".teclado").style.display =
        "none";


    /* =====================================
       PREPARAR PARA O PRÓXIMO ELEITOR
    ===================================== */

    setTimeout(() => {

        location.reload();

    }, 3000);

}


function tocarSomUrna(tipo) {
  const AudioContext =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) return;

  const audio = new AudioContext();

  const notas = {
    tecla: [{ freq: 700, duracao: 0.07 }],
    confirmar: [
      { freq: 520, duracao: 0.12 },
      { freq: 680, duracao: 0.18 }
    ],
    finalizado: [
      { freq: 600, duracao: 0.12 },
      { freq: 760, duracao: 0.12 },
      { freq: 900, duracao: 0.3 }
    ]
  };

  let inicio = audio.currentTime;

  (notas[tipo] || notas.tecla).forEach(nota => {
    const oscilador = audio.createOscillator();
    const volume = audio.createGain();

    oscilador.type = "sine";
    oscilador.frequency.value = nota.freq;

    volume.gain.setValueAtTime(0.0001, inicio);
    volume.gain.exponentialRampToValueAtTime(
      0.15,
      inicio + 0.01
    );
    volume.gain.exponentialRampToValueAtTime(
      0.0001,
      inicio + nota.duracao
    );

    oscilador.connect(volume);
    volume.connect(audio.destination);

    oscilador.start(inicio);
    oscilador.stop(inicio + nota.duracao);

    inicio += nota.duracao + 0.04;
  });

  setTimeout(() => audio.close(), 1500);
}
