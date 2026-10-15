# Conteúdo

Todo o conteúdo é **rascunho** até um professor revisar. Valida-se com `npm run conteudo` (e nos testes).

## Regra de ouro

A fonte de verdade é o **PAS**, não o conhecimento geral. Só entra item que tenha `origem_pas` apontando para a Matriz de Referência (dez/2022) ou para a lista oficial de obras. Conhecimento geral só serve para **explicar** depois, e sempre com `"verificar": true`.

## Arquivos

| Arquivo | O que tem |
| --- | --- |
| `conexoes.json` | `desafios`: 8 puzzles com 4 grupos (`lvl` 1 a 4), `explain`, `origem_pas`, `fonte`, `verificar` |
| `caso.json` | `respostas`: `[id, nome, matéria]` (pesquisável); `casos`: 5 pistas, `near` (conceito vizinho, com o porquê), `explain`, `origem_pas`, `fonte`, `verificar` |
| `historia.json` | `eventos`: ano (negativo = a.C.), cena, 2 dicas, `explain`, `origem_pas`, `fonte`, `verificar` |
| `formulas.json` | `puzzles`: `tokens` (peças), `extras` (distração), `legenda`, `js` (a mesma fórmula, testada em `tests/jogos2.test.js`) |
| `lugares.json` | `lugares` (coordenadas aproximadas) e `puzzles` (enunciado com a obra, 2 dicas) |
| `obras.json` | `obras`: 69 itens da lista do PAS 1 (colunas em `colunas`); `puzzles`: obra secreta, 2 dicas, `explain`, `origem_pas`, `fonte`, `verificar` |

## Campos de obra

`ano` é aproximado (negativo = a.C.) e só serve para comparar século. `null` significa "não informado": o jogo mostra "sem dado" e não compara. Se a obra secreta tiver `null` em categoria, ano, país ou forma, o validador recusa.

## O que o validador garante

- Estrutura completa (4 grupos de 4 termos sem repetição, 5 pistas, 2 dicas, ids existentes).
- `origem_pas` e `fonte` preenchidos em todo item.
- As 4 primeiras pistas do Caso do Dia e as dicas do "Qual é a obra?" não trazem o nome da resposta.

## O que o validador NÃO garante

Que o fato está certo. Isso é o trabalho do professor, com o pacote em `revisao/`.

## Notas dos jogos novos

- **Que ano foi?** O PAS não publica lista de eventos. Cada evento se apoia num período da Matriz ou numa obra da lista, e o ano é conhecimento geral (`verificar: true`).
- **Fórmula misteriosa.** A Matriz cita o assunto, quase nunca a fórmula escrita. Só entraram fórmulas de Matemática e a do pH (citada como contexto da função logarítmica). A Matriz de Física e Química não cita fórmulas.
- **Onde fica?** A Matriz de Geografia não lista estados nem países. Os lugares vêm das obras (artes visuais, audiovisuais, textos) e do DF. As coordenadas são aproximadas e precisam de conferência.

## Para os professores validarem

1. Os itens com `"verificar": true` (fatos fora do PAS: datas, biografias, classificações).
2. Os atributos das 69 obras (ano, país, forma, estilo), principalmente os marcados `v: true`.
3. Os agrupamentos das Conexões (são editoriais, e os termos vêm do PAS).
4. Se a lista de obras do PAS 2 e do PAS 3 ainda é a de junho de 2024. Neste protótipo só o PAS 1 tem obras no "Qual é a obra?".
