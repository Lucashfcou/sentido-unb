# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Site estático em JavaScript puro (módulos ES) e CSS puro, sem build e sem dependências. Prévia empacotada em um único HTML por `scripts/empacotar.mjs`. Hospedagem ainda não decidida (publicação só com autorização do dono).

## Users
Estudantes de 14 a 17 anos do ensino médio, principalmente no Distrito Federal, que farão as provas do PAS da UnB (1ª, 2ª e 3ª etapas). Jogam no celular, em sessões de 1 a 3 minutos (intervalo, ônibus, casa), sozinhos, e mandam o resultado a amigos. O público inclui menores de idade.

## Product Purpose
Minijogos diários de dedução (estilo Termo, Conexões, Diagnóstico) cujo conteúdo nasce só do que o PAS publica: Matriz de Referência e listas de obras. Seis jogos em protótipo: Conexões PAS, Caso do Dia, Qual é a obra?, Que ano foi?, Fórmula misteriosa, Onde fica?. Sucesso: o aluno volta no dia seguinte, compartilha o resultado sem spoiler e aprende uma explicação curta com fonte ao final. Primeiro objetivo: provar uso real em Brasília (retorno no dia 7, compartilhamento) e servir de portfólio.

## Positioning
O único jogo diário feito sobre o que o PAS realmente cobra (obras, interdisciplinaridade, contexto de Brasília), em vez de simulado genérico de ENEM com pergunta e resposta. Cada item cita a origem no documento do PAS.

## Operating Context
Um puzzle por jogo por dia, igual para todos, o dia vira à meia-noite de Brasília. Progresso só no aparelho (`localStorage`), sem cadastro. Resultado compartilhável em grade de emojis mais uma frase engraçada, sem spoiler. Todo conteúdo é rascunho até um professor revisar (pacote em `revisao/`). Versão gratuita e sem anúncios; receita só depois de provar uso (patrocínio de cursinhos e colégios, jogos sob medida, plano pago).

## Capabilities and Constraints
- Conteúdo só com origem no PAS; conhecimento geral apenas para explicar, sempre marcado "a verificar".
- Conteúdo original, sem copiar questões da Cebraspe ou do Inep; trechos só de domínio público.
- Privacidade: sem cadastro, sem dados pessoais, medição só agregada.
- Projeto independente: não usar logotipo, nome institucional ou cores oficiais da UnB e do Cebraspe, e não sugerir vínculo oficial.
- Provas de 2026: PAS 3 em 29/11, PAS 1 em 06/12, PAS 2 em 13/12.
- Sem identidade visual definida: o protótipo atual usa tema provisório.

## Brand Commitments
Nome de trabalho: "Sentido UnB" (antes "Linha PAS") (escolhido pelo dono junto com a direção visual do letreiro de ônibus do DF); continua provisório até a decisão final antes de publicar. "PAS Diário" foi o nome anterior. Tom leve e engraçado, com referências de Brasília, sem humilhar quem erra.

## Evidence on Hand
Conteúdo real: Matriz de Referência dos PAS 1, 2 e 3 (dez/2022), lista oficial de obras do PAS 1 (2026-2028), listas preliminares de PAS 2 e 3 (jun/2024), em `docs/mapa-de-conteudo.md`. Não há logotipo, depoimentos, métricas de uso nem professores revisores confirmados; nada disso pode ser inventado.

## Product Principles
1. Jogo antes de aula: a graça vem primeiro, o aprendizado vem depois, com fonte.
2. Errar não pode doer: humor sem humilhação.
3. Curto e terminável: 1 a 3 minutos, uma vez por dia.
4. Honestidade de conteúdo: o que não é do PAS é marcado, e nada se inventa.
5. Compartilhar é parte do jogo, e nunca entrega a resposta.

## Accessibility & Inclusion
Operável por teclado, foco visível, `prefers-reduced-motion` respeitado, cor nunca como único sinal (símbolos e texto junto), alvos de toque de 44 px, funcionamento a 390 px em tema claro e escuro. Público inclui menores.
