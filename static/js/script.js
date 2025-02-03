let modo = 'maquina';
let jogador1Escolha = null;
let nomeJogador = "";
let jogadoresCadastrados = [];

function iniciarJogo() {
    nomeJogador = document.getElementById('nome-jogador').value.trim();
    if (nomeJogador === "") {
        alert("Digite seu nome para continuar!");
        return;
    }
    document.querySelector('.entrada-nome').style.display = 'none';
    document.querySelector('.escolha-modo').style.display = 'block';
    adicionarJogadorLista(nomeJogador);
}

function selecionarModo(novoModo) {
    modo = novoModo;
    jogador1Escolha = null;
    document.querySelector('.escolha-modo').style.display = 'none';
    document.getElementById('jogo-container').style.display = 'block';
}

function jogar(escolhaJogador) {
    if (modo === 'maquina') {
        fetch('/jogar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nomeJogador, escolha: escolhaJogador })
        })
        .then(response => response.json())
        .then(data => {
            animarEscolha(escolhaJogador);
            atualizarInterface(data);
            atualizarRanking(data.ranking);
        })
        .catch(error => console.error('Erro:', error));
    }
}

function atualizarInterface(data) {
    const maoJogador = document.getElementById('mao-jogador');
    const maoMaquina = document.getElementById('mao-maquina');

    maoJogador.style.backgroundImage = `url('/static/imagens/${data.jogador}.png')`;
    maoMaquina.style.backgroundImage = `url('/static/imagens/${data.maquina}.png')`;

    maoJogador.classList.add('animacao-jogador');
    maoMaquina.classList.add('animacao-maquina');

    setTimeout(() => {
        maoJogador.classList.remove('animacao-jogador');
        maoMaquina.classList.remove('animacao-maquina');
    }, 1000);

    let resultadoTexto = data.resultado === "jogador" ? "🎉 Você venceu!" : data.resultado === "maquina" ? "😞 Você perdeu..." : "🤝 Empate!";
    document.getElementById('resultado').innerText = resultadoTexto;
}

function atualizarRanking(ranking) {
    const listaRanking = document.getElementById('lista-ranking');
    listaRanking.innerHTML = "";
    Object.keys(ranking).forEach(jogador => {
        let item = document.createElement('li');
        item.textContent = `${jogador}: ${ranking[jogador].vitorias} vitórias, ${ranking[jogador].jogos} jogos`;
        listaRanking.appendChild(item);
    });
}

function adicionarJogadorLista(nome) {
    if (!jogadoresCadastrados.includes(nome)) {
        jogadoresCadastrados.push(nome);
        const listaJogadores = document.getElementById('lista-jogadores');
        if (listaJogadores) {
            let item = document.createElement('li');
            item.textContent = nome;
            listaJogadores.appendChild(item);
        }
    }
}

function voltarInicio() {
    document.getElementById('jogo-container').style.display = 'none';
    document.querySelector('.escolha-modo').style.display = 'none';
    document.querySelector('.entrada-nome').style.display = 'block';
    document.getElementById('nome-jogador').value = "";
}

function animarEscolha(escolha) {
    const imagem = document.querySelector(`.imagem-opcao[data-escolha="${escolha}"]`);
    if (imagem) {
        imagem.style.transform = "scale(1.5) rotate(360deg)";
        setTimeout(() => {
            imagem.style.transform = "scale(1)";
        }, 500);
    } else {
        console.error("Imagem não encontrada para a escolha:", escolha);
    }
}
