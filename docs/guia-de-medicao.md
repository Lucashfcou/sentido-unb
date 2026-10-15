# Guia de medição do piloto

Objetivo do piloto: responder duas perguntas com números reais. Os alunos voltam no dia seguinte? Eles compartilham o resultado? (E, em paralelo, algum cursinho ou colégio aceita pagar?) Este guia define o que contar, como contar sem identificar ninguém e quando parar.

## Metas (ponto de partida, a combinar)

Estas metas vieram do plano de ação. Não têm dado por trás e **precisam do seu aval antes do piloto**.

| Meta | Definição | Valor de partida |
| --- | --- | --- |
| Jogadores únicos | Aparelhos que abriram o site pela primeira vez (eventos `visita` com `tipo = novo`) | 100 |
| Retorno no dia seguinte | Aparelhos que voltaram no dia 1 em relação aos que chegaram no dia 0 | a medir (sem meta) |
| Retorno no dia 7 | Aparelhos que voltaram exatamente 7 dias depois da primeira visita, sobre os novos daquele dia | 25% |
| Compartilhamento | Puzzles concluídos que terminaram em "Copiar bilhete", sobre o total de puzzles concluídos | 15% |
| Disposição a pagar | Pelo menos uma escola, cursinho ou patrocinador aceita pagar, mesmo valor pequeno, em 60 dias | 1 |

## Como contar sem identificar ninguém

O site não tem cadastro nem cookie de acompanhamento. O aparelho guarda, só nele, a **data da primeira visita**. Quando o aluno volta, o site informa apenas a **faixa de dias** desde a primeira visita (`0`, `1`, `2a6`, `7`, `8a13`, `14mais`), sem ID, sem IP guardado e sem nome. A contagem de eventos por faixa dá o retorno.

Eventos previstos (código em `src/lib/medicao.js`, testado em `tests/medicao.test.js`). Qualquer campo fora desta lista é descartado:

| Evento | Campos | Quando acontece |
| --- | --- | --- |
| `visita` | `tipo` (`novo` ou `volta`), `faixa`, `etapa` | O site abre |
| `concluiu` | `jogo`, `etapa`, `venceu` | Um puzzle termina |
| `compartilhou` | `jogo`, `etapa` | O aluno toca em "Copiar bilhete" |
| `etapa` | `etapa` | O aluno escolhe PAS 1, 2 ou 3 |

**Estado atual: nada é enviado.** O código só entrega o evento a uma função `window.__medir` se alguém a ligar. Ligar um provedor de contagem agregada é uma decisão sua, com custo e privacidade definidos (ver abaixo).

## Como calcular

- **Jogadores únicos** = número de `visita` com `tipo = novo`.
- **Retorno no dia 1** (dia D) = `visita` com `faixa = 1` no dia D ÷ `visita` com `tipo = novo` no dia D−1.
- **Retorno no dia 7** (dia D) = `visita` com `faixa = 7` no dia D ÷ `visita` com `tipo = novo` no dia D−7.
- **Compartilhamento** = `compartilhou` ÷ `concluiu`, no mesmo período.
- Divida sempre por etapa (`etapa` = 1, 2 ou 3) e por jogo. O número que mais importa é o retorno, e ele pode ficar escondido na média.

Limites honestos desse método: quem troca de celular, limpa os dados do navegador ou usa aba anônima conta como novo. O retorno medido é, portanto, um **piso**. Cada aparelho conta uma vez, e não cada pessoa.

## Como ligar a medição (decisão pendente)

Opções que não usam cookie nem identificam pessoas e que eu **não** contratei nem configurei:

1. Um contador de eventos simples numa função serverless própria, só somando números por faixa. Custo perto de zero; exige publicar e manter um endpoint.
2. Um serviço de analytics sem cookies (por exemplo Plausible ou Umami). Custo mensal ou hospedagem própria. Confirmar na documentação do serviço que não guarda IP nem cria identificador, antes de usar com menores de idade.

Antes de ligar qualquer uma: avise por escrito a escola e o professor responsável, diga exatamente o que é contado, e não envie nada além dos campos da tabela acima.

## Calendário sugerido

As provas de 2026 são: PAS 3 em **29/11**, PAS 1 em **06/12**, PAS 2 em **13/12**. Hoje é 15/10, então a janela é curta.

- Preparar e revisar o conteúdo: agora até o fim de outubro (precisa dos professores).
- Piloto fechado com 3 a 5 turmas do DF: 3 a 4 semanas antes da prova de cada etapa.
- Leitura dos números: no dia 8 e no dia 14 do piloto.
- Se não houver tempo útil antes das provas, o piloto real acontece no ciclo seguinte, e este período serve para revisar o conteúdo e fechar contatos.

## Critério de parada

Se, depois de 3 semanas de piloto e com pelo menos 100 jogadores únicos, o retorno no dia 7 ficar abaixo de 10% e nenhuma escola ou cursinho demonstrar interesse em pagar, o projeto vira portfólio: guardar capturas, números, o fluxo de revisão e o aprendizado. Gasto máximo: cerca de 100 €.

## Antes do primeiro aluno jogar

- [ ] Professores revisaram o conteúdo dos jogos que vão ao piloto (ver `revisao/` e `professores/index.html`).
- [ ] O nome definitivo foi escolhido (hoje, "Sentido UnB" é de trabalho; cuidado: "UnB" no nome pode sugerir material oficial).
- [ ] A hospedagem foi escolhida e os limites de uso comercial do plano foram lidos.
- [ ] A medição foi decidida (ligada ou não) e os responsáveis foram avisados.
- [ ] A data de lançamento (`LANCAMENTO` em `src/lib/tempo.js`) foi definida.
- [x] Os puzzles de teste ("Todas as paradas") ficam escondidos do público. Aparecem só em localhost, com `?teste` na URL e na prévia privada.
