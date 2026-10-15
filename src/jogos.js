// Configuração dos jogos, textos das regras e frases de humor (voz de letreiro e de parada de ônibus).
import { escolher } from "./lib/tempo.js";

export const ORDER = ["conex", "caso", "obra", "ano", "formula", "lugar"];

export const GAMES = {
  conex: {
    id: "conex", name: "Conexões PAS", kicker: "Quatro grupos", cor: "--conex",
    desc: "16 termos, 4 grupos escondidos. Matérias misturadas, como na prova.",
    rules: "Selecione 4 termos que tenham algo em comum e envie. Há 4 grupos, do mais fácil (amarelo) ao mais difícil (roxo). Termos de matérias diferentes podem estar no mesmo grupo, porque a prova do PAS é interdisciplinar. Você pode errar até 4 vezes. Quando falta um termo para fechar o grupo, o jogo avisa.",
    humor: {
      ok: ["Sem erro. Esse motorista não perde o ponto.", "Quatro grupos, zero erros. Pode descer na UnB.", "Linha fechada sem uma freada brusca."],
      near: ["Chegou, mas pegou uns desvios. Vale igual.", "Fechou com uns solavancos. Faz parte da viagem.", "Quase sem erros. A pegadinha pegou só de leve."],
      wrong: ["Passou direto do ponto. A explicação está logo abaixo.", "Hoje o grupo escapou. Amanhã tem outra linha.", "Errou o ponto, mas agora você sabe onde ele fica."],
    },
  },
  caso: {
    id: "caso", name: "Caso do Dia", kicker: "Uma matéria por dia", cor: "--caso",
    desc: "Cinco pistas, cada uma mais fácil. Descubra o conceito com o menor número delas.",
    rules: "Hoje tem uma matéria em destaque. Leia a primeira pista e tente descobrir o conceito, a pessoa ou a obra. Digite para buscar e escolha uma opção. Cada erro revela uma pista mais fácil. Você também pode pular uma pista. Quanto menos pistas, melhor a nota. Amarelo indica um conceito vizinho, com a explicação do porquê.",
    humor: {
      ok: ["Na primeira pista? Você conhece esse trajeto de cor.", "Resolveu cedo e ainda pegou assento.", "Pista curta, resposta certeira."],
      near: ["Desceu no ponto certo, só que mais à frente.", "Pediu parada na última hora, mas pediu.", "Precisou de todas as pistas, e chegou."],
      wrong: ["Passou do ponto sem resolver. A explicação está abaixo.", "Acabaram as pistas. Amanhã tem novo caso.", "O caso ficou em aberto. Leia e guarde."],
    },
  },
  obra: {
    id: "obra", name: "Qual é a obra?", kicker: "Lista de obras do PAS", cor: "--obra",
    desc: "Chute uma obra da lista do PAS e veja o que ela tem em comum com a secreta.",
    rules: "A obra secreta está na lista de obras da etapa do puzzle (a do PAS 1 é a lista oficial atual; as do PAS 2 e do PAS 3 são prévias de 2024). Digite o nome de uma obra ou de um autor e escolha. Cada palpite mostra o que bate com a secreta: categoria, século (com seta para mais cedo ou mais tarde), país, forma, estilo e autor. Verde ✓ é igual, amarelo ≈ é parecido (século vizinho, mesmo continente) e cinza ✕ é diferente. 'Sem dado' significa que o PAS não permite comparar. Você tem 6 palpites e ganha uma dica depois do 2º e do 4º erro.",
    humor: {
      ok: ["Obra identificada. Esse leitor conhece a lista.", "Achou a obra sem precisar de baldeação.", "A lista do PAS já não tem segredos para você."],
      near: ["Fez baldeação, mas chegou na obra.", "Descobriu por eliminação. Também vale.", "Na reta final, mas acertou."],
      wrong: ["A obra se escondeu. Leia a explicação.", "Não foi dessa vez. Anote a obra: ela pode cair.", "A lista é grande. Amanhã tem outra parada."],
    },
  },
  ano: {
    id: "ano", name: "Que ano foi?", kicker: "Mais cedo ou mais tarde", cor: "--ano",
    desc: "Um evento ligado ao PAS. Chute o ano e siga as setas.",
    rules: "Leia a cena e descubra o ano do evento. Digite o ano e marque a.C. se for antes de Cristo. Depois de cada palpite, a seta mostra se o evento foi mais cedo (↓) ou mais tarde (↑), e a distância aparece em texto: pertinho (até 10 anos), perto (até 50), morno (até 200) e longe. Você tem 6 palpites e ganha uma dica depois do 2º e do 4º.",
    humor: {
      ok: ["Na mosca. A linha do tempo é sua.", "Ano certo. Parada confirmada.", "Direto ao ponto, sem volta."],
      near: ["Chegou ao ano pelas setas. Vale.", "Deu umas voltas no tempo, mas chegou.", "Acertou no limite. Vale o ponto."],
      wrong: ["O ano passou batido. Veja a explicação.", "Dessa vez o passado ganhou.", "Anote o ano e embarque amanhã."],
    },
  },
  formula: {
    id: "formula", name: "Fórmula misteriosa", kicker: "Monte peça por peça", cor: "--formula",
    desc: "Monte a fórmula símbolo por símbolo, com pistas de cor.",
    rules: "O título diz qual fórmula montar e a legenda explica as letras. Toque nas peças do teclado para preencher a linha e envie. Verde ✓: peça certa no lugar certo. Amarelo ≈: a peça existe, mas em outro lugar. Cinza ✕: a peça não está na fórmula. Você tem 6 tentativas. O PAS cobra o assunto mais do que a fórmula decorada: depois de acertar, leia a explicação.",
    humor: {
      ok: ["Fórmula montada, peça por peça.", "Encaixou tudo de primeira.", "Montou e ainda vai entender por quê."],
      near: ["Montou no sufoco, mas montou.", "Algumas peças brigaram, depois se acertaram.", "Chegou pelo caminho mais longo."],
      wrong: ["A fórmula desmontou. Leia a explicação e entenda o porquê.", "Não fechou. Fórmula boa é a que a gente entende.", "Hoje a peça sobrou. Amanhã tem outra."],
    },
  },
  lugar: {
    id: "lugar", name: "Onde fica?", kicker: "Obras e lugares do PAS", cor: "--lugar",
    desc: "Onde fica esta obra? Chute um lugar e siga a bússola.",
    rules: "O enunciado cita uma obra ou um tema do PAS. Escolha, na busca, o lugar que acha certo. Depois de cada palpite você vê a distância até o lugar certo, a direção para onde ir (da sua escolha até a resposta) e a proximidade de 0 a 100. Você tem 6 palpites e ganha uma dica depois do 3º e do 5º.",
    humor: {
      ok: ["Você sabe onde fica. Isso cai na prova.", "Achou o lugar sem GPS.", "Mapa na cabeça. Pode viajar."],
      near: ["Chegou lá pela bússola.", "Deu uma volta, mas achou.", "Acertou depois de uma baldeação."],
      wrong: ["O lugar fugiu. A resposta está abaixo.", "Faltou rota. Tente a próxima.", "Perdeu a parada. Anote o endereço."],
    },
  },
};

/** Lista de puzzles de cada jogo (preenchida depois de carregar o conteúdo). */
export const PUZZLES = { conex: [], caso: [], obra: [], ano: [], formula: [], lugar: [] };

/** Desafio do jogo para a edição n. */
export const desafioDe = (gid, n) => escolher(PUZZLES[gid], n);
