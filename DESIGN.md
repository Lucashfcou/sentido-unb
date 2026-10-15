---
name: Sentido UnB
description: Letreiro de ônibus e parada do DF. Asfalto, âmbar de LED, uma cor por linha de jogo.
colors:
  asfalto: "#e8ecef"
  painel: "#f6f8f9"
  tinta: "#10151b"
  tinta-suave: "#46515c"
  linha-fina: "#c2cbd3"
  ambar-led: "#ffb000"
  ambar-tinta: "#17110a"
  foco: "#0b57d0"
  selecao: "#ffd166"
  asfalto-escuro: "#0f1216"
  painel-escuro: "#171c23"
  tinta-escura: "#edf0f3"
  tinta-suave-escura: "#9ba6b2"
  linha-fina-escura: "#2a333d"
  foco-escuro: "#8ab4ff"
  selecao-escura: "#7a5600"
  letreiro-fundo: "#07090b"
  letreiro-led: "#ffb000"
  letreiro-ponto-apagado: "#3a2a00"
  letreiro-sub: "#f0b429"
  linha-conexoes: "#ff5a4e"
  linha-caso: "#2f9bff"
  linha-obra: "#a76bff"
  linha-ano: "#ff8a3d"
  linha-formula: "#2fd08a"
  linha-lugar: "#26c6da"
  texto-na-linha: "#0b0d10"
  ok: "#17653c"
  ok-fundo: "#d3eadc"
  perto: "#7a4f00"
  perto-fundo: "#f6e2b0"
  neutro: "#4b5560"
  neutro-fundo: "#dde2e7"
  erro: "#9d2222"
  erro-fundo: "#f4d5d5"
  ok-escuro: "#7fdca4"
  ok-fundo-escuro: "#173526"
  perto-escuro: "#ffcf5a"
  perto-fundo-escuro: "#40330c"
  neutro-escuro: "#aab3bf"
  neutro-fundo-escuro: "#252d37"
  erro-escuro: "#ff9d9d"
  erro-fundo-escuro: "#442020"
  faixa-amarela: "#f2c94c"
  faixa-verde: "#5fc27a"
  faixa-azul: "#5aa5ec"
  faixa-roxa: "#b085f0"
  faixa-tinta: "#0b0d10"
typography:
  led:
    fontFamily: "Doto, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "clamp(1.3rem, 6.6vw, 2rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "0.05em"
  led-placa-jogo:
    fontFamily: "Doto, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "clamp(1rem, 5vw, 1.3rem)"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "0.04em"
  led-marca:
    fontFamily: "Doto, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "1.05rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "0.08em"
  headline:
    fontFamily: "Overpass, Segoe UI, system-ui, -apple-system, Roboto, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Overpass, Segoe UI, system-ui, -apple-system, Roboto, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Overpass, Segoe UI, system-ui, -apple-system, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Overpass, Segoe UI, system-ui, -apple-system, Roboto, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 800
    lineHeight: 1.2
rounded:
  xs: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  dialog: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  gut: "16px"
  xl: "24px"
components:
  letreiro-botao:
    backgroundColor: "{colors.letreiro-fundo}"
    textColor: "{colors.letreiro-led}"
    typography: "{typography.led}"
    rounded: "{rounded.lg}"
    padding: "12px 14px 14px"
  botao-ambar:
    backgroundColor: "{colors.ambar-led}"
    textColor: "{colors.ambar-tinta}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
    height: "44px"
  botao-fantasma:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
    height: "44px"
  linha-de-jogo:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    padding: "12px 14px"
    height: "72px"
  linha-de-jogo-concluida:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-suave}"
    padding: "8px 14px"
    height: "56px"
  selo-de-linha:
    backgroundColor: "{colors.linha-conexoes}"
    textColor: "{colors.texto-na-linha}"
    rounded: "{rounded.lg}"
    size: "44px"
  placa-pas:
    backgroundColor: "{colors.letreiro-fundo}"
    textColor: "{colors.letreiro-led}"
    typography: "{typography.led-marca}"
    rounded: "{rounded.sm}"
    padding: "5px 8px 4px"
  placa-do-jogo:
    backgroundColor: "{colors.letreiro-fundo}"
    textColor: "{colors.letreiro-led}"
    typography: "{typography.led-placa-jogo}"
    rounded: "{rounded.lg}"
    padding: "8px 12px 8px 8px"
  bilhete:
    backgroundColor: "{colors.painel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    padding: "16px"
  canhoto:
    backgroundColor: "{colors.letreiro-fundo}"
    textColor: "{colors.letreiro-sub}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
  chip-estado:
    backgroundColor: "{colors.neutro-fundo}"
    textColor: "{colors.neutro}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  chip-estado-ok:
    backgroundColor: "{colors.ok-fundo}"
    textColor: "{colors.ok}"
  chip-estado-perdido:
    backgroundColor: "{colors.erro-fundo}"
    textColor: "{colors.erro}"
  atributo:
    backgroundColor: "{colors.neutro-fundo}"
    textColor: "{colors.neutro}"
    rounded: "{rounded.md}"
    padding: "4px 6px"
  atributo-ok:
    backgroundColor: "{colors.ok-fundo}"
    textColor: "{colors.ok}"
  atributo-perto:
    backgroundColor: "{colors.perto-fundo}"
    textColor: "{colors.perto}"
  tecla:
    backgroundColor: "{colors.painel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    padding: "8px 10px"
    height: "48px"
  busca:
    backgroundColor: "{colors.painel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    padding: "12px 14px"
    height: "48px"
---

# Design System: Sentido UnB

## Overview

**Creative North Star: "O Letreiro da Parada"**

A rotina diária vira uma viagem curta de 6 linhas. O mundo é o letreiro de ônibus do DF e a parada da Rodoviária, emprestado só em tipo, paleta, densidade e um movimento. A navegação é padrão: uma coluna de 640px, uma lista, botões. O que lembra o aluno é o painel de pontinhos de LED no topo e o resultado como bilhete "Sentido UnB".

Asfalto cinza (claro e escuro), tinta quase preta, e um único âmbar de LED. Cada jogo é uma linha com uma cor fixa e texto preto sobre ela. Hairlines de 1px, raio de 8px, uma sombra suave. Números tabulares em tudo. O tema claro e o escuro são dois asfaltos do mesmo mundo; o letreiro é um objeto físico e fica escuro e âmbar nos dois.

Nome "Sentido UnB" (antes "Linha PAS") é provisório; o conceito visual continua o letreiro de ônibus do DF.

**Key Characteristics:**
- Letreiro de LED (fundo `#07090b`, grade de pontos apagados) como única superfície "luminosa".
- Overpass para toda a interface; Doto só no letreiro, na placa PAS, na placa do jogo e no canhoto.
- Uma cor por jogo, sempre com texto preto (`#0b0d10`).
- Estado nunca só por cor: símbolo SVG e texto junto.
- Plano por padrão: hairline + uma sombra ambiente; sem brilho.

## Colors

Asfalto frio e tinta quase preta, com um âmbar de LED raro e seis cores de linha saturadas. Valores claros abaixo são os do frontmatter; o escuro vem de `[data-theme="dark"]` ou `prefers-color-scheme: dark`.

### Primary
- **Âmbar de LED** (`#ffb000`): pontos do letreiro e botão de ação principal (`.btn`, texto `#17110a`). Igual nos dois temas. Cursor de texto (`caret-color`) nos campos.

### Secondary: as linhas (uma por jogo)
Texto sobre cada cor é sempre `#0b0d10`.
- **Linha Conexões** (`#ff5a4e`, vermelho)
- **Linha Caso do Dia** (`#2f9bff`, azul)
- **Linha Qual é a obra?** (`#a76bff`, roxo)
- **Linha Que ano foi?** (`#ff8a3d`, laranja)
- **Linha Fórmula misteriosa** (`#2fd08a`, verde)
- **Linha Onde fica?** (`#26c6da`, turquesa)

### Neutral
- **Asfalto** (`#e8ecef` claro / `#0f1216` escuro): fundo da página.
- **Painel** (`#f6f8f9` / `#171c23`): listas, bilhete, campos, diálogos.
- **Tinta** (`#10151b` / `#edf0f3`): texto. **Tinta suave** (`#46515c` / `#9ba6b2`): texto secundário.
- **Linha fina** (`#c2cbd3` / `#2a333d`): hairlines de 1px e bordas de campo.
- **Foco** (`#0b57d0` / `#8ab4ff`): anel de foco. **Seleção** (`#ffd166` / `#7a5600`).
- **Letreiro** (`#07090b`, LED `#ffb000`, ponto apagado `#3a2a00`, subtítulo `#f0b429`): iguais nos dois temas.

### Estados
Cada estado tem tinta e fundo próprios por tema, e sempre vem com símbolo e texto.
- **Acerto / ok**: `#17653c` sobre `#d3eadc` (escuro: `#7fdca4` sobre `#173526`).
- **Perto**: `#7a4f00` sobre `#f6e2b0` (escuro: `#ffcf5a` sobre `#40330c`).
- **Neutro / sem info**: `#4b5560` sobre `#dde2e7` (escuro: `#aab3bf` sobre `#252d37`).
- **Erro / perdido**: `#9d2222` sobre `#f4d5d5` (escuro: `#ff9d9d` sobre `#442020`).

### Faixas de Conexões
Quatro faixas, texto `#0b0d10`: amarela `#f2c94c`, verde `#5fc27a`, azul `#5aa5ec`, roxa `#b085f0`. Só existem dentro de Conexões.

### Named Rules
**The LED Only Rule.** Âmbar aparece no letreiro, na placa PAS, na placa do jogo, no canhoto e nas ações principais. Nunca como cor de estado "informativo", nunca como fundo de aviso. O estado "perto" usa o marrom-âmbar `#7a4f00`/`#ffcf5a` em fundo suave e sempre com símbolo.
**The Line Color Rule.** A cor da linha identifica o jogo (selo, cor de pistas do Caso, barra de proximidade do Onde fica?). Texto sobre ela é preto, nunca branco.
**The Never Alone Rule.** Cor nunca é o único sinal de estado: símbolo SVG e palavra acompanham.

## Typography

**Display/LED Font:** Doto (com `ui-monospace`, `SFMono-Regular`, `Menlo`, `Consolas`, monospace)
**Body Font:** Overpass (com `Segoe UI`, `system-ui`, `-apple-system`, `Roboto`, sans-serif)

**Character:** placa rodoviária para ler, pontinhos de LED para chamar. Números tabulares no `body`.

### Hierarchy
- **LED letreiro** (Doto 900, `clamp(1.3rem, 6.6vw, 2rem)`, 1.1, +0.05em, maiúsculas): nome do jogo que vem a seguir.
- **LED placa do jogo** (Doto 900, `clamp(1rem, 5vw, 1.3rem)`, 1.15, +0.04em, maiúsculas): título na tela de cada jogo.
- **LED marca/canhoto** (Doto 900, 1.05rem, 1, +0.08em marca / +0.05em canhoto): "PAS" e "Sentido UnB".
- **Headline** (Overpass 800, 2rem, 1.05, -0.02em): "Hoje".
- **Title** (Overpass 800, 1.35rem / 1.3rem / 1.15rem): título do bilhete, título do jogo, blocos.
- **Item** (Overpass 800, 1.05rem): nome da linha na lista; concluídas em 600 e cor suave.
- **Body** (Overpass 400, 1rem, 1.5): texto corrido. **Pequeno** (0.85 a 0.9rem, cor suave): descrições e notas.
- **Label** (Overpass 800, 0.8rem): chips de estado; caixa-alta com +0.04em só no subtítulo do letreiro (600, 0.9rem), no canhoto (700, 0.85rem) e nas faixas de Conexões (800, 0.85rem); rótulos de atributo 0.65rem, +0.06em, maiúsculas.

### Named Rules
**The Dot Matrix Rule.** Doto só no letreiro, na placa PAS, na placa do jogo e no canhoto. Nenhum texto de leitura em Doto.
**The One Family Rule.** Fora do LED, tudo é Overpass; hierarquia por peso (400, 600, 800) e tamanho.

## Layout

Coluna única centrada, `max-width: 640px`, margem lateral de 16px. Ritmo de 4, 8, 12, 16 e 24px. A lista de linhas é uma tabela de rotas: grade `44px 1fr auto` com selo, nome com descrição e estado, linhas de 72px (concluídas 56px com selo de 36px). Alvos de toque de 44px no mínimo (campos e teclas de 48px). Grade de Conexões em 4 colunas; atributos em 3 colunas, 6 a partir de 520px. Pensado a 390px, tema claro e escuro.

## Elevation & Depth

Plano com uma sombra ambiente. Profundidade vem de hairline de 1px mais um anel de 2px no letreiro e nas placas (`0 0 0 2px var(--line)`), não de sombra grande.

### Shadow Vocabulary
- **Ambiente claro** (`0 1px 0 rgba(255,255,255,.5) inset, 0 10px 24px -14px rgba(16,21,27,.45)`): listas, painéis, letreiro.
- **Ambiente escuro** (`0 1px 0 rgba(255,255,255,.05) inset, 0 12px 28px -16px rgba(0,0,0,.8)`).
- **Lista de busca** (`0 14px 30px -10px rgba(0,0,0,.55)`): só o menu de autocompletar, que flutua sobre o conteúdo.

### Named Rules
**The No Glow Rule.** Sem brilho, halo ou sombra colorida. Letreiro em hover troca o anel de 2px para âmbar; nada além disso.

## Shapes

Raio de 8px é o padrão (`--r`): painéis, botões, campos, selos, teclas, letreiro. 6px para células pequenas (atributos, dias do protótipo), 4px na placa PAS e no anel de foco, 12px no diálogo, 999px em chips de estado, contador de sequência e barra de proximidade. Hairlines de 1px; células sem resposta com borda tracejada. O bilhete tem cabeçalho separado por linha tracejada de 2px com dois semicírculos de perfuração nas bordas.

## Components

### Letreiro-botão
Faixa de LED (fundo `#07090b`, pontos `#3a2a00` em grade de 6px) com o nome do jogo em Doto âmbar e subtítulo "Faltam N • toque para embarcar". É `button`, hover troca o anel para âmbar. Sem jogos pendentes vira "Fim de linha / Volte amanhã" (não interativo).

### Lista de linhas
Uma tabela única com borda de 1px e raio 8px. Cada linha: selo, nome, descrição, estado e, na próxima, botão âmbar "Embarcar" (`.btn.peq`, 44px). Próxima linha em fundo neutro. Linhas concluídas ficam rebaixadas: 56px, selo 36px a 75% de opacidade, nome em 600 cor suave.

### Selo de linha
Quadrado de 44px, raio 8px, cor da linha, ícone SVG de traço único (2px, pontas redondas) em `#0b0d10`, filete interno `rgba(0,0,0,.28)`.

### Placa PAS e placa do jogo
Placa PAS: "PAS" em Doto âmbar sobre `#07090b`, raio 4px, anel de 2px. Placa do jogo: selo da linha mais título em Doto, fundo de LED, anel de 2px.

### Bilhete de resultado
Painel com cabeçalho (símbolo, título, veredito), linha de perfuração tracejada com dois meios-círculos, corpo com explicação e fonte, e canhoto de LED ("Sentido UnB" em Doto + nome do jogo). Primeiro botão em largura total.

### Chips de estado
Pílula com símbolo SVG e palavra: neutro, ganhou, perdido, em andamento (contorno de 1px). Cores da tabela de estados.

### Grade de atributos
Células de 6px com rótulo pequeno em caixa-alta, valor em 800 e símbolo SVG de direção. Estados ok, perto, neutro; sem dado é tracejado.

### Teclado de peças
Teclas de 48px (mín. 46px de largura), borda de 2px, raio 8px; marcadas ok/perto com cor e símbolo, descartadas a 45%.

### Busca com autocompletar
Campo de 48px, borda de 2px que vira cor de foco. Lista flutuante com raio 8px e itens de 44px+; item ativo em fundo neutro; trecho achado em `mark` sobre fundo "perto".

### Movimento
Uma assinatura: varredura de LED no texto do letreiro (`clip-path`, 0.6s, `steps(14, end)`, uma vez). Pistas novas entram em 0.25s. Ambos só sob `prefers-reduced-motion: no-preference`.

## Do's and Don'ts

### Do:
- **Do** usar âmbar `#ffb000` só em LED e ações principais.
- **Do** pôr texto `#0b0d10` sobre toda cor de linha e de faixa.
- **Do** dar a todo estado símbolo SVG mais palavra, nos dois temas.
- **Do** manter alvos de 44px, foco de 3px (`--focus`, offset 2px) e `prefers-reduced-motion`.
- **Do** desenhar ícones em SVG de traço único (2px, pontas redondas).
- **Do** usar tokens por tema; valores de estado têm par claro e escuro.

### Don't:
- **Don't** usar eyebrows ou kickers acima de títulos.
- **Don't** pôr faixa grossa de cor na borda de cartão arredondado.
- **Don't** usar emoji como ícone de interface (emoji só no texto de compartilhamento).
- **Don't** usar âmbar para estado informativo.
- **Don't** usar brilho, glow ou sombra colorida.
- **Don't** usar Doto fora dos quatro lugares do LED.
- **Don't** usar logotipo, nome ou cores oficiais da UnB ou do Cebraspe.

## Pendências conhecidas

- Fontes hospedadas no próprio site (`src/fonts`, subconjunto latino, licença em `src/fonts/LICENCAS.md`): sem requisição a terceiros. Falta confirmar o texto da licença OFL de cada família antes de publicar.
- Nome "Sentido UnB" (antes "Linha PAS") é provisório; o conceito visual continua o letreiro de ônibus do DF.
- Não inspecionados: estado "bilhete perdido" e nomes longos no cabeçalho do jogo (o título da placa não tem `overflow-wrap` explícito).
- Não canonizado: a linha `.meta` da placa do jogo mostra `G.kicker` (ex.: "Quatro grupos") junto da edição. Fica abaixo do título e é só descrição, mas leva o nome de kicker nos dados; novas telas não devem criar rótulos pequenos acima de títulos.
