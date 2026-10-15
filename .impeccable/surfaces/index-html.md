---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: Linha PAS (hub e 6 jogos)

## Scope and mode
Operate. Superfície: tela inicial e telas dos 6 jogos do protótipo (index.html, src/ui, src/styles). Visitante: estudante de 14 a 17 anos, no celular, sessão de 1 a 3 minutos, uma vez por dia.

## Audience, job, action
Abrir, ver o que falta jogar hoje, jogar a próxima "linha", ler a explicação com fonte, copiar o bilhete sem spoiler. Restrições: 390 px, claro e escuro, alvos de 44 px, cor nunca como único sinal, reduced-motion, sem logo nem cor oficial da UnB ou do Cebraspe, sem emoji como ícone.

## Chosen direction
Nome de trabalho: **Linha PAS** (escolhido pelo dono). Mundo: o letreiro de ônibus do DF e a parada da Rodoviária. Memorável: o letreiro de pontinhos de LED no topo da tela inicial e o resultado como bilhete "sentido UnB".

## Direction contract

THESIS: A rotina diária do aluno vira uma viagem curta de 6 linhas. O design recusa a grade de cartões iguais com emoji e o visual neutro de app de simulado. O mundo empresta só tipo, paleta, densidade e um movimento-assinatura; a navegação continua padrão.

OWN-WORLD: Asfalto escuro (#0F1216) e cinza-asfalto claro (#E8ECEF), tinta quase preta, âmbar de LED (#FFB000) só no letreiro e nas ações principais. Cada jogo tem uma cor de linha fixa (vermelho, azul, roxo, laranja, verde, turquesa) com texto preto sobre ela. Overpass (placa rodoviária) para tudo; Doto (pontinhos de LED) só no letreiro e na marca. Ícones desenhados em SVG, traço único. Hairlines de 1 px, raio pequeno, sombras com offset e desfoque suaves. Números tabulares.

STORY: O aluno entende em 2 segundos quantas linhas faltam hoje, acredita que cada jogo é curto e feito sobre o que o PAS cobra (origem sempre visível ao final) e age: toca na próxima linha e joga.

FIRST VIEWPORT: Topo: marca "Linha PAS" (placa de LED com PAS) à esquerda, sequência e ajuda à direita. Logo abaixo, o letreiro de LED (faixa escura de ~64 px) rolando "PRÓXIMA PARADA: <jogo> · EDIÇÃO <n>". Depois o título "Hoje" com "X de 6 linhas feitas". A seguir a lista das 6 linhas como uma única tabela de rotas, linha por linha: selo colorido com ícone, nome, descrição curta, estado em texto e símbolo. A próxima linha a jogar abre destacada com botão âmbar "Embarcar". O bloco "Protótipo: todos os puzzles" fica abaixo da dobra.

FORM: Linha PAS, letreiro de ônibus e parada de Brasília; posição 5 da minha lista de 7 mundos (Cerrado em flor, Niemeyer, mapa do Plano Piloto, caderno de escola, letreiro e parada, lambe-lambe de cursinho, bilhete de loteria); chave do sorteio c80a04f8. Desafiante fundido e recusado: o estudo de grade de Crouwel, de quem fica só a disciplina de alinhar tudo em uma grade de células, sem desenhar a grade.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
Nome final (Linha PAS é de trabalho). Fontes: carregadas do Google Fonts na prévia; para publicar, hospedar localmente (decisão de privacidade, público inclui menores).
