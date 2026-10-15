# Lote de conteúdo (30 dias)

Meta pedida: 30 dias de puzzles por jogo e por etapa (PAS 1, 2 e 3), com `origem_pas` em cada item, para os cinco jogos escolhidos (todos menos "Onde fica?"). Estado em 15/10/2026, gerado por `node scripts/cobertura.mjs`:

| Jogo | PAS 1 | PAS 2 | PAS 3 |
| --- | --- | --- | --- |
| Conexões PAS | 30 | 30 | 30 |
| Caso do Dia | 30 | 30 | 30 |
| Qual é a obra? | 30 | 30 | 30 |
| Que ano foi? | 30 | 30 | 30 |
| Fórmula misteriosa | 30 | 30 | 30 |
| Onde fica? (fora do lote) | 7 | 3 | 3 |

Depois de 30 dias o app recomeça a lista da etapa.

## Como o lote foi completado

Cada item novo traz o trecho da Matriz de Referência (dez/2022) ou da lista de obras que o sustenta, em `origem_pas`:

- **Conexões:** 40 puzzles novos (86 no total). Os grupos vêm de listas da Matriz (conhecimentos essenciais e objetivos por etapa) e das listas de obras. Os grupos que dependem de atributo das obras (país, época, autoria) estão marcados "a verificar".
- **Caso do Dia:** 21 casos novos, agora com **cartela fechada de 8 opções** (sem digitação livre) e sem pessoas como resposta.
- **Que ano foi?:** 51 eventos novos. Todos marcados "a verificar": o assunto vem da Matriz, mas a data é conhecimento geral.
- **Fórmula misteriosa:** 59 fórmulas novas. A Matriz cita o assunto e quase nunca a fórmula escrita, então a notação é a convencional e está marcada "a verificar". Cada fórmula tem teste numérico independente (`tests/formulas2.test.js` e `tests/formulas3.test.js`).

## O que ainda precisa de professor

Todo conteúdo é rascunho até um professor revisar. Prioridade da revisão:

1. Fatos marcados "a verificar" (datas, classificações, atributos das obras).
2. Se cada item é mesmo da etapa indicada.
3. Se as pistas deixam o item justo, nem óbvio nem impossível.
4. As listas de obras de PAS 2 e PAS 3 são as versões preliminares de junho de 2024. A do PAS 2 passou por consulta pública em 2026.

## Números do lote

- Obras: 173 (69 do PAS 1 oficial, 49 do PAS 2 e 56 do PAS 3, com uma em comum), 90 puzzles.
- Caso do Dia: 89 casos e 105 conceitos.
- Conexões: 86 puzzles.
- Que ano foi?: 90 eventos.
- Fórmula misteriosa: 89 fórmulas.
- Pacote de revisão: `revisao/pacote-de-revisao.html` e dois CSV.
