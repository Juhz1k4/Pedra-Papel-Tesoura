from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Ranking global: {"jogador": {"vitorias": 0, "jogos": 0}}
ranking = {}

# Função para determinar o vencedor da rodada
def determinar_vencedor(jogador, maquina):
    if jogador == maquina:
        return "empate"
    elif (jogador == "pedra" and maquina == "tesoura") or \
         (jogador == "papel" and maquina == "pedra") or \
         (jogador == "tesoura" and maquina == "papel"):
        return "jogador"
    else:
        return "maquina"

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/jogar', methods=['POST'])
def jogar():
    dados = request.get_json()
    nome_jogador = dados.get("nome")
    escolha_jogador = dados.get("escolha")
    escolha_maquina = random.choice(["pedra", "papel", "tesoura"])
    resultado = determinar_vencedor(escolha_jogador, escolha_maquina)

    # Atualiza o ranking
    if nome_jogador not in ranking:
        ranking[nome_jogador] = {"vitorias": 0, "jogos": 0}
    ranking[nome_jogador]["jogos"] += 1
    if resultado == "jogador":
        ranking[nome_jogador]["vitorias"] += 1

    # Ordena o ranking por número de vitórias
    ranking_ordenado = dict(sorted(ranking.items(), key=lambda item: item[1]["vitorias"], reverse=True))

    return jsonify({
        "jogador": escolha_jogador,
        "maquina": escolha_maquina,
        "resultado": resultado,
        "ranking": ranking_ordenado
    })

if __name__ == '__main__':
    app.run(debug=True)
