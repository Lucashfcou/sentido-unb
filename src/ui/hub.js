// Tela inicial: etapa do PAS, letreiro (próxima parada), as linhas de hoje e a lista de todas as paradas (puzzles) da etapa.
import { fx } from "./fx.js";
import { GAMES, ORDER, PUZZLES } from "../jogos.js";
import { S, espiar, concluido, indiceDeHoje, indicesDaEtapaAtual, edicao, sequencia, etapaAtual, definirEtapa } from "../state.js";
import { ETAPAS } from "../lib/etapa.js";
import { dataPorExtenso } from "../lib/tempo.js";
import { ICONES, SIM, ICONE_SETA } from "../icons.js";
import { $$, main, esc, pintar } from "./dom.js";
import { ir } from "./comum.js";

const ROTULO = { won: "Resolvido", lost: "Não resolvido", play: "Em andamento", new: "Não jogado" };

function situacao(gid, idx) {
  const s = espiar(gid, PUZZLES[gid][idx].id);
  if (!s) return "new";
  const n = gid === "conex" ? s.attempts.length : s.guesses.length;
  if (s.status === "won") return "won";
  if (s.status === "lost") return "lost";
  return n ? "play" : "new";
}

const seloDe = (gid) => `<span class="selo-linha" style="--c:var(${GAMES[gid].cor})" aria-hidden="true">${ICONES[gid]}</span>`;

/** Seletor das três etapas: PAS 1 (1º ano), PAS 2 (2º ano), PAS 3 (3º ano). */
function seletorDeEtapa() {
  const atual = etapaAtual();
  return `<div class="etapas" role="radiogroup" aria-label="Etapa do PAS">${ETAPAS.map(
    (e) => `<button class="etapa" role="radio" aria-checked="${e.n === atual}" data-etapa="${e.n}"><b>${e.nome}</b><small>${e.ano}</small></button>`,
  ).join("")}</div>`;
}

/** Letreiro: leva à próxima linha a jogar. Quando tudo foi feito, vira aviso de fim de linha. */
function letreiro(proximo, faltam, comecou) {
  if (!proximo) {
    return `<div class="sign" role="img" aria-label="Fim de linha. Volte amanhã."><span class="sign-texto">Fim de linha</span><span class="sign-sub">Volte amanhã</span></div>`;
  }
  const G = GAMES[proximo];
  const sub = faltam === 1 ? "Falta 1 linha hoje" : `Faltam ${faltam} linhas hoje`;
  return `<button class="sign" data-go="${proximo}/${indiceDeHoje(proximo)}" aria-label="${comecou ? "Continuar" : "Embarcar"}: ${esc(G.name)}. ${sub}.">
    <span class="sign-texto">${esc(G.name)}</span><span class="sign-sub">${faltam === 1 ? "Falta 1" : `Faltam ${faltam}`} • toque para ${comecou ? "continuar" : "embarcar"}</span></button>`;
}

// A lista de todos os puzzles serve para testar. Fica escondida do público: aparece em localhost, com ?teste na URL ou na prévia privada.
const TESTE = globalThis.__MOSTRAR_TODAS === true || /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /[?&]teste/.test(location.search);

export function telaHub() {
  const etapa = ETAPAS[etapaAtual() - 1];
  const jogos = ORDER.filter((g) => indiceDeHoje(g) >= 0);
  const feito = (g) => concluido(espiar(g, PUZZLES[g][indiceDeHoje(g)].id));
  const proximo = jogos.find((g) => !feito(g));
  const feitos = jogos.filter(feito).length;
  const comecou = proximo ? situacao(proximo, indiceDeHoje(proximo)) === "play" : false;

  const linhas = ORDER.map((gid) => {
    const G = GAMES[gid];
    const idx = indiceDeHoje(gid);
    if (idx < 0) {
      return `<div class="linha vazia" aria-label="${esc(G.name)}. Sem puzzle para o ${etapa.ano} ainda.">${seloDe(gid)}
        <span class="ct"><b>${esc(G.name)}</b><small>Ainda sem puzzle para o ${etapa.ano} (${etapa.nome}).</small></span><span class="estado new">Em breve</span></div>`;
    }
    const st = situacao(gid, idx);
    const pronto = st === "won" || st === "lost";
    return `<button class="linha ${pronto ? "pronta" : ""} ${gid === proximo ? "proxima" : ""}" data-go="${gid}/${idx}" data-state="${st}" aria-label="${esc(G.name)}. ${ROTULO[st]}">
      ${seloDe(gid)}
      <span class="ct"><b>${esc(G.name)}</b>${pronto ? "" : `<small>${esc(G.desc)}</small>`}</span>
      ${gid === proximo ? `<span class="btn peq">${st === "play" ? "Continuar" : "Embarcar"}</span>` : st === "new" ? `<span class="seta" aria-hidden="true">${ICONE_SETA}</span>` : `<span class="estado ${st}">${SIM[st]}${ROTULO[st]}</span>`}
    </button>`;
  }).join("");

  const paradas = ORDER.map((gid) => {
    const G = GAMES[gid];
    const lista = indicesDaEtapaAtual(gid);
    const chips = lista.length
      ? lista
          .map((idx, k) => {
            const st = situacao(gid, idx);
            return `<button class="pz ${st}" data-go="${gid}/${idx}" aria-label="${esc(G.name)}, puzzle ${k + 1}: ${ROTULO[st]}">${k + 1}<i aria-hidden="true">${SIM[st]}</i></button>`;
          })
          .join("")
      : `<span class="sub">Sem puzzle para o ${etapa.ano} ainda.</span>`;
    return `<div class="proto-row"><span class="pn">${seloDe(gid)}${esc(G.name)}</span><div class="pzs">${chips}</div></div>`;
  }).join("");

  pintar(`<div class="home">
    ${seletorDeEtapa()}
    ${jogos.length ? letreiro(proximo, jogos.length - feitos, comecou) : ""}
    <section class="hoje" aria-label="Resumo do dia">
      <h1>${!jogos.length ? `Sem linhas para o ${etapa.ano}` : feitos === jogos.length ? "Linhas de hoje concluídas" : `${feitos} de ${jogos.length} linhas feitas`}</h1>
      <p class="sub">${etapa.nome} (${etapa.ano}), edição nº ${edicao()}, ${esc(dataPorExtenso(S.hoje))}. Jogos de 1 a 3 minutos sobre o que o PAS da UnB realmente cobra.</p>
    </section>
    <section class="linhas" aria-label="Jogos de hoje">${linhas}</section>
    ${TESTE ? `    <section class="proto" aria-label="Todos os puzzles de teste">
      <h2>Todas as paradas (teste)</h2>
      <p class="sub">Puzzles do ${etapa.nome}. Um puzzle que vale para duas etapas aparece nas duas. O progresso fica só neste aparelho.</p>
      ${paradas}
      <p class="sub"><button class="btn ghost" id="zerar">Apagar meu progresso de teste</button></p>
    </section>`  : ""}
  </div>`);

  $$("[data-go]", main).forEach((b) => {
    b.onclick = (e) => {
      const gid = b.dataset.go.split("/")[0];
      const cor = getComputedStyle(document.documentElement).getPropertyValue(GAMES[gid]?.cor || "--caso").trim() || "#ffb000";
      const r = b.getBoundingClientRect();
      const x = e.clientX || r.left + r.width / 2;
      const y = e.clientY || r.top + r.height / 2;
      fx.abrir(x, y, cor, () => ir(b.dataset.go));
    };
  });
  $$("[data-etapa]", main).forEach((b) => {
    b.onclick = () => {
      definirEtapa(Number(b.dataset.etapa));
      telaHub();
      const novo = main.querySelector(`[data-etapa="${etapaAtual()}"]`);
      if (novo) novo.focus({ preventScroll: true });
    };
  });
  const n = sequencia();
  fx.rolar(document.getElementById("streak-n"), n);
  document.getElementById("streak-l").textContent = n === 1 ? "dia" : "dias";
  const zerar = document.getElementById("zerar");
  if (zerar) zerar.onclick = () => {
    // confirmação dentro da página: alguns visualizadores bloqueiam confirm()
    if (!zerar.dataset.certeza) {
      zerar.dataset.certeza = "1";
      zerar.textContent = "Toque de novo para apagar tudo";
      return;
    }
    try {
      localStorage.removeItem("pas-diario:v1");
    } catch {
      /* sem armazenamento */
    }
    location.reload();
  };
}
