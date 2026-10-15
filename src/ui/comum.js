// Peças compartilhadas pelos três jogos: cabeçalho, painel de resultado, navegação.
import { fx } from "./fx.js";
import { GAMES, PUZZLES } from "../jogos.js";
import { edicao, indiceDeHoje, indicesDaEtapaAtual, etapaAtual, consumirConclusao } from "../state.js";
import { ETAPAS } from "../lib/etapa.js";
import { emitir } from "../lib/medicao.js";
import { ICONES, ICONE_VOLTAR, SIM } from "../icons.js";
import { $, main, esc, toast, copiar, abrirFolha, abrirFim } from "./dom.js";

export const ir = (caminho) => {
  location.hash = caminho;
};

/** "PAS 2 • Hoje • edição nº 3" se for o puzzle de hoje; senão "PAS 2 • Puzzle 4 de 8" (posição na etapa escolhida). */
export function rotuloEdicao(gid, idx) {
  const etapa = PUZZLES[gid][idx].etapa;
  if (idx === indiceDeHoje(gid)) return `${etapa} • Hoje • edição nº ${edicao()}`;
  const lista = indicesDaEtapaAtual(gid);
  const pos = lista.indexOf(idx);
  return `${etapa} • Puzzle ${pos >= 0 ? pos + 1 : idx + 1} de ${pos >= 0 ? lista.length : PUZZLES[gid].length}`;
}

export function cabecalho(gid, idx, titulo) {
  const G = GAMES[gid];
  return `<div class="ghead">
    <button class="icon-btn" data-home aria-label="Voltar ao início">${ICONE_VOLTAR}</button>
    <div class="placa-jogo"><span class="selo-linha gbadge" style="--c:var(${G.cor})" aria-hidden="true">${ICONES[gid]}</span>
      <div class="titles"><h2>${esc(titulo || G.name)}</h2><p class="meta">${esc(rotuloEdicao(gid, idx))}</p></div></div>
    <button class="btn ghost peq" data-rules aria-label="Como jogar ${esc(G.name)}">Regras</button>
  </div>`;
}

export function regras(gid) {
  const G = GAMES[gid];
  abrirFolha(`<h2 id="dlg-t">${esc(G.name)}</h2><p>${esc(G.rules)}</p><p class="nota">Todo conteúdo nasce de documentos públicos do PAS (Matriz de Referência e listas de obras). Cada item traz a origem ao final.</p>`);
}

export function ligarCabecalho(gid) {
  $("[data-home]", main).onclick = () => ir("hub");
  $("[data-rules]", main).onclick = () => regras(gid);
}

/** Frase de humor estável: tipo é "ok", "near" ou "wrong". */
export const frase = (gid, tipo, semente) => GAMES[gid].humor[tipo][semente % GAMES[gid].humor[tipo].length];

/**
 * Painel de resultado.
 * @param p {gid, idx, venceu, titulo, veredito, humor, corpo, origem, fonte, verificar, extra}
 */
export function painelResultado(p) {
  const G = GAMES[p.gid];
  return `<section class="panel result ${p.venceu ? "won" : "lost"}" id="result" style="--c:var(${G.cor})" aria-live="polite">
    <div class="tk-cabeca">
      <span class="selo-linha" style="--c:var(${G.cor})" aria-hidden="true">${ICONES[p.gid]}</span>
      <div class="tk-t"><h3>${esc(p.titulo)}</h3><p class="verdict">${esc(p.veredito)}</p></div>
      <span class="rsym" aria-hidden="true">${p.venceu ? SIM.ok : SIM.no}</span>
    </div>
    <p class="humor">${esc(p.humor)}</p>
    ${p.extra || ""}
    <div class="explain">${p.corpo}</div>
    <p class="ref"><b>Origem no PAS:</b> ${esc(p.origem)}</p>
    <p class="ref"><b>Fonte:</b> ${esc(p.fonte)}${p.verificar ? ' <span class="selo" title="Fatos fora do PAS aguardam revisão de professor">a verificar</span>' : ""}</p>
    <div class="actions"><button class="btn" data-share>Copiar bilhete</button>
      <button class="btn ghost" data-next>Próximo puzzle</button><button class="btn ghost" data-hub>Início</button></div>
    <div class="canhoto" aria-hidden="true"><span class="canhoto-led">Sentido UnB</span><span>${esc(G.name)}</span></div>
  </section>`;
}

export function ligarResultado(gid, idx, texto) {
  const r = $("#result");
  if (!r) return;
  // reação só na hora em que o puzzle termina; ao reabrir um puzzle antigo, nada pula na tela
  if (consumirConclusao(gid)) {
    const venceu = r.classList.contains("won");
    // lê os textos antes: a animação do título embaralha as letras por alguns instantes
    const resposta = gid === "conex" ? "" : r.querySelector("h3")?.textContent || "";
    const veredito = gid === "conex" && !venceu ? "Estes eram os quatro grupos." : r.querySelector(".verdict")?.textContent || "";
    fx.depoisDoResultado(r, venceu);
    const extra = gid === "conex" ? $(".cx-done", main)?.innerHTML || "" : "";
    setTimeout(
      () =>
        abrirFim({
          venceu,
          titulo: venceu ? "Acertou!" : "Não foi dessa vez",
          resposta,
          rotulo: gid === "conex" ? (venceu ? "Os quatro grupos" : "Os grupos eram") : venceu ? "A resposta" : "A resposta era",
          veredito,
          extra,
          aoFechar: () => r.scrollIntoView({ behavior: "smooth", block: "start" }),
        }),
      gid === "conex" ? 900 : 1100,
    );
  }
  $("[data-share]", r).onclick = async () => {
    const n = etapaAtual();
    emitir("compartilhou", { jogo: gid, etapa: n });
    const how = await copiar(texto.replace(/^Sentido UnB · /, `Sentido UnB · ${ETAPAS[n - 1].ano} (PAS ${n}) · `));
    toast(how === "erro" ? "Não deu para copiar. Selecione e copie manualmente." : how === "copiado" ? "Resultado copiado" : "Compartilhado");
  };
  $("[data-next]", r).onclick = () => {
    const lista = indicesDaEtapaAtual(gid);
    const pos = lista.indexOf(idx);
    ir(`${gid}/${lista.length ? lista[(pos + 1) % lista.length] : idx}`);
  };
  $("[data-hub]", r).onclick = () => ir("hub");
}
