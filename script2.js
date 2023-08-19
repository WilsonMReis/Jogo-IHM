
const telaInicial = document.querySelector('.telaInicial');
const telaDeInstrucoes = document.querySelector('.telaDeInstrucoes');

const slidesContainer = document.getElementById("slides-container");
const slide = document.querySelector(".slide");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");
const carousel = slidesContainer;

nextButton.addEventListener("click", () => {
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft += slideWidth;
});

prevButton.addEventListener("click", () => {
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft -= slideWidth;
});

function mostrarInstrucoes() {
  telaInicial.style.display = 'none';
  telaDeInstrucoes.style.display = 'block';
  currentSlide = 0;
  carousel.querySelector('.slide').classList.add('active');
}
function voltar() {
  window.location.href = "index.html";
}

// Definir evento de clique no botão Iniciar
const startButton = document.getElementById('iniciar-button');
startButton.addEventListener('click', function() {
  let timerInterval
  Swal.fire({
    title: 'Carregando!',
    html: 'O jogo iniciará em <b></b> milisegundos.',
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      window.location.href = "telaJogo.html";
    }
  })
  
});

const instrucoesButton = document.getElementById('instrucoes-button');
instrucoesButton.addEventListener('click', mostrarInstrucoes);

const voltarButton = document.querySelector('.voltar-button');
voltarButton.addEventListener('click', voltar);

