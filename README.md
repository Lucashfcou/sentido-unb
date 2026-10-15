# PAS Diário (protótipo)

Minijogos diários para quem vai fazer o PAS da UnB. Site estático em JavaScript puro (módulos ES), sem dependências e sem etapa de build nesta fase. Sem cadastro: o progresso fica no aparelho (`localStorage`).

## Comandos

```bash
npm run dev        # servidor local em http://localhost:5173 (node serve.mjs)
npm test           # testes (node --test)
npm run conteudo   # valida os JSON de conteúdo
npm run revisao    # gera o pacote de revisão em revisao/
npm run site       # monta a pasta site/ que vai para a hospedagem
npm run cobertura  # tabela de puzzles por jogo e etapa
```

Precisa do Node 20 ou mais novo (testado no 24). Não há `npm install`.

## Etapas (PAS 1, 2 e 3)

O jogador escolhe a etapa na tela inicial: PAS 1 (1º ano), PAS 2 (2º ano) ou PAS 3 (3º ano). A escolha fica no aparelho. Cada puzzle tem um campo `etapa` ("PAS 1", "PAS 2 e 3", "PAS 1 a 3"); o puzzle do dia e a lista de puzzles de teste mostram só os da etapa escolhida, e a sequência de dias é contada por etapa. O "Qual é a obra?" busca só na lista de obras da etapa. O validador exige pelo menos 3 puzzles por jogo em cada etapa.

## Jogos desta fase (protótipos)

| Jogo | Regra | Dados |
| --- | --- | --- |
| Conexões PAS | 16 termos, 4 grupos, até 4 erros | `src/content/conexoes.json` (86 puzzles) |
| Caso do Dia | 5 pistas, cada uma mais fácil; cartela fechada de 8 opções | `src/content/caso.json` (89 casos, 105 conceitos) |
| Qual é a obra? | 6 palpites; compara categoria, século, país, forma, estilo e autor | `src/content/obras.json` (173 obras das três listas, 90 puzzles) |
| Que ano foi? | 6 palpites de ano; seta (mais cedo ou mais tarde), faixas de distância e 2 dicas | `src/content/historia.json` (90 eventos) |
| Fórmula misteriosa | Wordle de símbolos: monte a fórmula peça por peça em 6 tentativas | `src/content/formulas.json` (89 fórmulas, todas verificadas por teste numérico) |
| Onde fica? | 6 palpites de lugar; distância, direção (bússola) e proximidade | `src/content/lugares.json` (24 lugares, 10 puzzles; coordenadas aproximadas) |

Cada puzzle vem com `origem_pas` (documento e trecho do PAS que o justifica), `fonte` e `verificar`. Ver `CONTEUDO.md` e `docs/mapa-de-conteudo.md`.

## Documentos

- `docs/mapa-de-conteudo.md`: o que o PAS cobra (Fase 0).
- `docs/lote-30-dias.md`: estado do lote de conteúdo por jogo e etapa.
- `docs/guia-de-medicao.md`: como medir o piloto sem identificar ninguém.
- `professores/index.html`: página para quem vai revisar o conteúdo.
- `DESIGN.md` e `PRODUCT.md`: sistema visual e contexto do produto.

## Estrutura

- `src/lib/`: regras puras, com testes em `tests/`. `busca`, `conexoes`, `progresso` e `texto` vieram do projeto Ruídos Mentais; `tempo` foi adaptado (dia vira à meia-noite de Brasília).
- `src/ui/`: telas. `src/state.js`: estado guardado no aparelho.
- `scripts/`: validador de conteúdo e gerador do pacote de revisão.
- `revisao/`: pacote para professores (CSV para Excel com `;` e HTML).

## Publicar na Vercel

O site é estático, sem dependências. O `vercel.json` já manda a Vercel rodar `node scripts/montar-site.mjs` e publicar a pasta `site/` (só `index.html`, `src/`, `professores/` e `revisao/`). Passos, feitos por você:

1. Criar o projeto na Vercel apontando para esta pasta (pelo painel, enviando o repositório, ou com a CLI da Vercel).
2. Deixar os campos de build como o `vercel.json` define. Não há variáveis de ambiente.
3. Antes de divulgar, em `src/lib/tempo.js`, definir `LANCAMENTO` (a data do desafio nº 1) e conferir o nome definitivo.
4. Ler os limites de uso comercial do plano da Vercel antes de cobrar de escolas ou cursinhos: o plano gratuito (Hobby) é para uso pessoal e não comercial.

A lista "Todas as paradas (teste)" fica escondida do público; aparece só em localhost ou com `?teste` na URL. As páginas `professores/` e `revisao/` saem com `noindex`. Nenhuma medição é enviada por padrão.

## Estado

Protótipo. Conteúdo em rascunho, sem revisão de professores. Projeto independente: não é material oficial da UnB nem do Cebraspe. Lote de 30 dias por etapa completo nos cinco jogos. Não publicado.
