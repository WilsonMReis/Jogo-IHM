
var blocosDoPrograma = [];
var indexDoPrograma = 0;
var programRunning = false;
var timer;
var segundosRestantes = 7 * 60; // 7 minutos
var pontuacao = 0;
var listaTempo = [1, 2, 3, 4, 55, 66, 777];
const containerJogo = document.getElementById('predio');
const inventoryContainer = document.getElementById('inventory-container');
const tamanhoBloco = 50;
const numLinhas = 5;
const numColunas = 6;
const gridDoJogo = [];
let bombeiroLinha = 0;
let bombeiroColuna = 0;
let temExtintor = false;
let numPessoasResgatadas = 0;
var checandoPorFogo = false;


// Criar um bloco no programa
function criarBlocoPrograma(blocoID, textoBloco) {
  var bloco = document.createElement('div');
  bloco.classList.add('bloco');
  bloco.setAttribute('dado-bloco-id', blocoID);
  bloco.textContent = textoBloco;

  // Adicionar o arrastar
  bloco.draggable = true;
  bloco.addEventListener('dragstart', function(event) {
    event.dataTransfer.setData('text/plain', event.target.getAttribute('dado-bloco-id'));
  });
    bloco.addEventListener('click', function () {
    removerBlocoDePrograma(blocoID);
  });
  return bloco;
}



function criarGridDoJogo() {
    for (let linha = 0; linha < numLinhas; linha++) {
      gridDoJogo[linha] = [];
      for (let Col = 0; Col < numColunas; Col++) {
        const bloco2 = document.createElement('div');
        bloco2.className = 'bloco2';
        gridDoJogo[linha][Col] = bloco2;
        containerJogo.appendChild(bloco2);
        bloco2.style.top = `${linha * tamanhoBloco}px`;
        bloco2.style.left = `${Col * tamanhoBloco}px`;
      }
    }
  }
  function posicionarBombeiro(linha, Col) {
    bombeiroLinha = linha;
    bombeiroColuna = Col;
    const blocoDoBombeiro = gridDoJogo[linha][Col];
    blocoDoBombeiro.classList.add('bombeiro');
  }
  

  function posicionarObjetos() {

    const posicaoDasPessoas = gerarPosicoesAleatorias(numLinhas, numColunas, 5);
    const posicaoDosFogos = gerarPosicoesAleatorias(numLinhas, numColunas, 10);
  
    for (const position of posicaoDasPessoas) {
      const { linha, Col } = position;
      const blocoPessoa = gridDoJogo[linha][Col];
      blocoPessoa.classList.add('pessoa');
    }
  
  for (const position of posicaoDosFogos) {
    const { linha, Col } = position;
    if (!temPessoaNaPosicao(linha, Col) && (linha !== bombeiroLinha || Col !== bombeiroColuna)) {
      const blocoFogo = gridDoJogo[linha][Col];
      blocoFogo.classList.add('fogo');
    }
  }
  }
  
  function gerarPosicoesAleatorias(numLinhas, numColunas, contador) {
    const posicoes = [];
    while (posicoes.length < contador) {
      const linha = Math.floor(Math.random() * numLinhas);
      const Col = Math.floor(Math.random() * numColunas);
      if (!posicoes.some(position => position.linha === linha && position.Col === Col)) {
        posicoes.push({ linha, Col });
      }
    }
    return posicoes;
  }

function iniciarJogo() {
  criarGridDoJogo();
  posicionarBombeiro(0, 0);
  posicionarObjetos();
  // Aqui é pra soltar na área de programação
  var areaDeProgramacao = document.getElementById('program');
  areaDeProgramacao.addEventListener('dragover', function(event) {
    event.preventDefault();
  });
  areaDeProgramacao.addEventListener('drop', function(event) {
    event.preventDefault();
    var blocoID = event.dataTransfer.getData('text/plain');
    var textoBloco = event.dataTransfer.getData('text/plain');
    var bloco = criarBlocoPrograma(blocoID, textoBloco);
    areaDeProgramacao.appendChild(bloco);
    blocosDoPrograma.push(blocoID);
  });

  var executarButton = document.getElementById('executar-button');
  executarButton.addEventListener('click', function() {
    if (!programRunning) {
      executarPrograma();
    }
  });

  const resetar = document.getElementById('resetar-button');
  resetar.addEventListener('click', function () {
    resetarPrograma();
  });

  const voltarButton = document.getElementById('voltar-button');
  voltarButton.addEventListener('click', function () {
    Swal.fire({
      title: 'Você tem certeza que deseja voltar ao menu inicial ?',
      text: "Você perderá todo o seu progresso atual!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Continuar!'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "index.html";
      }
    })
    
  });
  startTimer();
}
const inicioButton = document.getElementById('inicio-button');
inicioButton.addEventListener('click', function() {
  window.location.href = "index.html";
});
const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', function() {
  window.location.href = "telaJogo.html";
});


function startTimer() {
  timer = setInterval(function() {
    var minutos = Math.floor(segundosRestantes / 60);
    var segundos = segundosRestantes % 60;
    document.getElementById('minutos').textContent = padZero(minutos);
    document.getElementById('segundos').textContent = padZero(segundos);

    if (segundosRestantes === 0) {
      stopTimer();
      fimDeJogo('Acabou o tempo !');
    } else {
      segundosRestantes--;
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function executarPrograma() {
  programRunning = true;
  indexDoPrograma = 0;
  executarProximoComando();
}

function executarProximoComando() {
  if (indexDoPrograma < blocosDoPrograma.length) {
    var blocoID = blocosDoPrograma[indexDoPrograma];
    var elementoDoBloco = document.querySelector('[dado-bloco-id="' + blocoID + '"]');
    var comando = elementoDoBloco.textContent;

    if (comando === 'ApagarFogo') {
      checandoPorFogo = true;

      const indexDoProximoComando = indexDoPrograma + 1;
      if (indexDoProximoComando < blocosDoPrograma.length) {
        var proximoIDBloco = blocosDoPrograma[indexDoProximoComando];
        var bloximoElementoDoBloco = document.querySelector('[dado-bloco-id="' + proximoIDBloco + '"]');
        var proximoComando = bloximoElementoDoBloco.textContent;
        if (proximoComando === 'Descer') {
          const proximaLinha = bombeiroLinha + 1;
          const proximaCol = bombeiroColuna;
          const proximoBloco = gridDoJogo[proximaLinha][proximaCol];
          if (proximoBloco.classList.contains('fogo')) {
            proximoBloco.classList.remove('fogo');
          }
        }
        else if (proximoComando === 'Subir') {
          const proximaLinha = bombeiroLinha - 1;
          const proximaCol = bombeiroColuna;
          const proximoBloco = gridDoJogo[proximaLinha][proximaCol];
          if (proximoBloco.classList.contains('fogo')) {
            proximoBloco.classList.remove('fogo');
          }
        }
        else if (proximoComando === 'Direita') {
          const proximaLinha = bombeiroLinha;
          const proximaCol = bombeiroColuna + 1;
          const proximoBloco = gridDoJogo[proximaLinha][proximaCol];
          if (proximoBloco.classList.contains('fogo')) {
            proximoBloco.classList.remove('fogo');
          }
        }
        else if (proximoComando === 'Esquerda') {
          const proximaLinha = bombeiroLinha;
          const proximaCol = bombeiroColuna - 1;
          const proximoBloco = gridDoJogo[proximaLinha][proximaCol];
          if (proximoBloco.classList.contains('fogo')) {
            proximoBloco.classList.remove('fogo');
          }
        }
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Você não indicou onde o bombeiro deve apagar o fogo.',
          footer: 'Indique a direção e execute novamente !'
        })
      }
      setTimeout(function () {
        checandoPorFogo = false;
        indexDoPrograma++;
        executarProximoComando();
      }, 1000);
    } else {
      executarComando(comando, indexDoPrograma);
      if(comando === 'Esquerda' || comando === 'Direita' || comando === 'Subir' || comando === 'Descer' || comando === 'ResgatarPessoas' ){
      if (!checandoPorFogo) {
        indexDoPrograma++;
        setTimeout(executarProximoComando, 1000);
      }
      }else{programRunning = false;}
    }
  } else {
    programRunning = false;
  }
}

function executarComando(comando, indexDoPrograma) {
  switch (comando) {
    case 'Direita':
      direita();
      break;
    case 'Esquerda':
      esquerda();
      break;
    case 'Subir':
      subir();
      break;
    case 'Descer':
      descer();
      break;
    case 'ApagarFogo':
      apagarFogo();
      break;
    case 'ResgatarPessoas':
       if (pessoaEstaPosicaoBombeiro()) {
        resgatarPessoa();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Não há pessoas para resgatar nesta posição.',
          footer: 'Continue tentando !'
        })
      }
      break;
    default:
      var comandoerrado = indexDoPrograma + 1;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que o comando ' + comandoerrado + ' é um comando inválido.',
        footer: 'Reveja os comandos e tente novamente !'
      })
  }
}

  function movimentoValido(linha, Col) {
    return linha >= 0 && linha < numLinhas && Col >= 0 && Col < numColunas;
  }
  
  // Função para movimentar o bombeiro na grade
  function moverBombeiro(linha, Col) {
  if (movimentoValido(linha, Col)) {
    const blocoAtual = gridDoJogo[bombeiroLinha][bombeiroColuna];
    blocoAtual.classList.remove('bombeiro');

    const novoBloco = gridDoJogo[linha][Col];
    if (novoBloco.classList.contains('fogo')) {
      fimDeJogo('Infelizmente o bombeiro entrou em um apartamento antes de apagar o fogo !');
    } else {
      novoBloco.classList.add('bombeiro');
      bombeiroLinha = linha;
      bombeiroColuna = Col;
    }
  }
}

function direita() {
  let novaLinha = bombeiroLinha;
  let novaCol = bombeiroColuna;
  novaCol++;
  if (movimentoValido(novaLinha, novaCol)) {
    moverBombeiro(novaLinha, novaCol);
  }
  console.log('Movendo o bombeiro');
}
function esquerda() {
  let novaLinha = bombeiroLinha;
  let novaCol = bombeiroColuna;
  novaCol--;
  if (movimentoValido(novaLinha, novaCol)) {
    moverBombeiro(novaLinha, novaCol);
  }
  console.log('Movendo o bombeiro');
}
function subir() {
  let novaLinha = bombeiroLinha;
  let novaCol = bombeiroColuna;
  novaLinha--;
  if (movimentoValido(novaLinha, novaCol)) {
    moverBombeiro(novaLinha, novaCol);
  }
  console.log('Movendo o bombeiro');
}
function descer() {
  let novaLinha = bombeiroLinha;
  let novaCol = bombeiroColuna;
  novaLinha++;
  if (movimentoValido(novaLinha, novaCol)) {
    moverBombeiro(novaLinha, novaCol);
  }
  console.log('Movendo o bombeiro');
}

function apagarFogo() {
  const blocoAtual = gridDoJogo[bombeiroLinha][bombeiroColuna];
  if (blocoAtual.classList.contains('fogo')) {
    blocoAtual.classList.remove('fogo');
    return { linha: bombeiroLinha, Col: bombeiroColuna };
  }
  return null;
}

function resgatarPessoa() {
  console.log('Resgatando as pessoas');
  if (pessoaEstaPosicaoBombeiro()) {
    const blocoAtual = gridDoJogo[bombeiroLinha][bombeiroColuna];
    blocoAtual.classList.remove('pessoa');
    Swal.fire(
      'Bom trabalho!',
      'Você salvou uma pessoa do prédio',
      'success'
    )
    numPessoasResgatadas++;
    document.getElementById('numpessoas').innerHTML = numPessoasResgatadas;
    if(numPessoasResgatadas==5){
   console.log(numPessoasResgatadas);
   fimDeJogo2('Parabéns, você salvou todas as pessoas do prédio !');
}

    // Resetar o jogo após resgatar uma pessoa
    resetarJogo();
  } else {

  }
}

function pessoaEstaPosicaoBombeiro() {
  const blocoAtual = gridDoJogo[bombeiroLinha][bombeiroColuna];
  return blocoAtual.classList.contains('pessoa');
}
function temPessoaNaPosicao(linha, Col) {
  const blocoAtual = gridDoJogo[linha][Col];
  return blocoAtual.classList.contains('pessoa');
}
function resetarPrograma() {
  Swal.fire({
    title: 'Você tem certeza ?',
    text: "Você removerá todos os comandos da área de programação!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, Continuar!'
  }).then((result) => {
    if (result.isConfirmed) {
      blocosDoPrograma = [];
  const areaDeProgramacao = document.getElementById('program');
  areaDeProgramacao.innerHTML = '';
    }
  })

}
function removerBlocoDePrograma(blocoID) {
  const bloco = document.querySelector(`[dado-bloco-id="${blocoID}"]`);
  if (bloco) {
    const index = blocosDoPrograma.indexOf(blocoID);
    if (index !== -1) {
      blocosDoPrograma.splice(index, 1);
    }
    // Remover bloco da área de programação
    bloco.remove();
  }
}

function resetarJogo() {
  const blocoAtual = gridDoJogo[bombeiroLinha][bombeiroColuna];
  blocoAtual.classList.remove('bombeiro');
  posicionarBombeiro(0, 0);
  blocosDoPrograma = [];
  indexDoPrograma = 0;
  programRunning = false;
  const areaDeProgramacao = document.getElementById('program');
  areaDeProgramacao.innerHTML = '';
}

function fimDeJogo(motivo) {
  document.getElementById('motivogameover').innerHTML = motivo;
  const gameOverScreen = document.querySelector('.telaGameOver');
  gameOverScreen.style.display = 'flex';
}

function fimDeJogo2(motivo) {
  document.getElementById('motivogameover').innerHTML = motivo;
  document.getElementById('fimdejogo').style.Color = 'blue';
  document.getElementById('inicio-button').style.backgroundColor = 'blue';
  document.getElementById('restart-button').style.backgroundColor = 'blue';
  const gameOverScreen = document.querySelector('.telaGameOver');
  gameOverScreen.style.display = 'flex';
}

function padZero(number) {
  return number.toString().padStart(2, '0');
}

window.addEventListener('load', iniciarJogo);






