// Conexões PAS: 16 termos, 4 grupos.
import { fx } from "./fx.js";
import { PUZZLES } from "../jogos.js";
import { estado, salvar, concluir, edicao } from "../state.js";
import { grupoDe, melhorGrupo, erros, repetida, MAX_ERROS } from "../lib/conexoes.js";
import { embaralhar, gerador, hashTexto } from "../lib/texto.js";
import { grelhaConexoes, placarConexoes, montarTexto } from "../lib/partilha.js";
import { $, $$, main, esc, pintar, toast } from "./dom.js";
import { cabecalho, ligarCabecalho, painelResultado, ligarResultado, frase } from "./comum.js";

let selecionados = [];
let ultimo = "";

const tipoFinal = (s, e) => (s.status === "won" ? (e === 0 ? "ok" : "near") : "wrong");

export function telaConexoes(idx) {
  const P = PUZZLES.conex[idx];
  if (ultimo !== P.id) {
    selecionados = [];
    ultimo = P.id;
  }
  const s = estado("conex", P.id);
  if (!s.order) {
    s.order = embaralhar(P.groups.flatMap((g) => g.words), gerador(hashTexto(P.id)));
    salvar();
  }
  const fim = s.status !== "playing";
  const ordemGrupos = fim ? [...s.solved, ...[0, 1, 2, 3].filter((g) => !s.solved.includes(g))] : s.solved;
  const soltos = fim ? [] : s.order.filter((w) => !s.solved.includes(grupoDe(P, w)));
  const e = erros(P, s.attempts);
  const vidas = Array.from({ length: MAX_ERROS }, (_, i) => `<i class="${i < e ? "gone" : ""}"></i>`).join("");

  const grupos = ordemGrupos
    .map((gi) => {
      const g = P.groups[gi];
      const falhou = fim && !s.solved.includes(gi);
      return `<div class="cx-g ${falhou ? "missed" : ""}" style="--k:var(--k${g.lvl})"><b>${esc(g.name)}</b><span>${g.words.map(esc).join(" • ")}</span>${falhou ? '<em class="sr">grupo não encontrado</em>' : ""}</div>`;
    })
    .join("");

  const jogo = fim
    ? ""
    : `<div class="cx-grid" role="group" aria-label="Termos">${soltos
        .map((w) => `<button class="cx-w ${selecionados.includes(w) ? "sel" : ""}" aria-pressed="${selecionados.includes(w)}" data-w="${esc(w)}">${esc(w)}</button>`)
        .join("")}</div>
      <div class="cx-bar"><div class="vidas" role="img" aria-label="${MAX_ERROS - e} erros restantes"><span>Erros restantes</span>${vidas}</div>
      <div class="actions"><button class="btn ghost" data-shuffle>Embaralhar</button><button class="btn ghost" data-clear ${selecionados.length ? "" : "disabled"}>Limpar</button><button class="btn" data-send ${selecionados.length === 4 ? "" : "disabled"}>Enviar</button></div></div>`;

  const resultado = fim
    ? painelResultado({
        gid: "conex", idx, venceu: s.status === "won",
        titulo: s.status === "won" ? "Grupos resolvidos" : "Os grupos eram estes",
        veredito: s.status === "won" ? `Resolvido ${e === 0 ? "sem erros" : `com ${e} ${e === 1 ? "erro" : "erros"}`}.` : "Acabaram os erros. As respostas estão acima.",
        humor: frase("conex", tipoFinal(s, e), idx),
        corpo: `<ul class="expl">${P.groups.map((g) => `<li><b>${esc(g.name)}.</b> ${esc(g.explain)} <small>Origem no PAS: ${esc(g.origem_pas)}</small></li>`).join("")}</ul>`,
        origem: `cada grupo traz a sua origem acima (etapa: ${P.etapa}).`,
        fonte: [...new Set(P.groups.map((g) => g.fonte))].join("; "),
        verificar: P.groups.some((g) => g.verificar),
      })
    : "";

  pintar(`<div class="game">
    ${cabecalho("conex", idx)}
    <p class="tema">${esc(P.tema)} • ${esc(P.etapa)}</p>
    <div class="cx-done">${grupos}</div>
    ${jogo}
    ${resultado}
  </div>`);
  ligarCabecalho("conex");
  const refresh = () => telaConexoes(idx);

  $$(".cx-w", main).forEach((b) => {
    b.onclick = () => {
      const w = b.dataset.w;
      selecionados = selecionados.includes(w) ? selecionados.filter((x) => x !== w) : selecionados.length < 4 ? [...selecionados, w] : selecionados;
      refresh();
      const novo = $(`.cx-w[data-w="${CSS.escape(w)}"]`, main);
      if (novo) novo.focus({ preventScroll: true });
    };
  });

  if (!fim) {
    $("[data-shuffle]", main).onclick = () => {
      s.order = embaralhar(s.order);
      salvar();
      refresh();
    };
    $("[data-clear]", main).onclick = () => {
      selecionados = [];
      refresh();
    };
    $("[data-send]", main).onclick = () => {
      const sel = selecionados.slice();
      if (sel.length !== 4) return;
      if (repetida(s.attempts, sel)) return toast("Você já tentou esse grupo.");
      s.attempts.push(sel);
      const m = melhorGrupo(P, sel);
      if (m === 4) s.solved.push(grupoDe(P, sel[0]));
      else toast(m === 3 ? "Falta um! Um dos termos é de outro grupo." : "Esses termos não formam um grupo.");
      // com três grupos resolvidos, o quarto sobra sozinho
      if (s.solved.length === 3) for (let g = 0; g < 4; g++) if (!s.solved.includes(g)) s.solved.push(g);
      selecionados = [];
      const perdeu = erros(P, s.attempts) >= MAX_ERROS;
      if (perdeu) s.status = "lost";
      else if (s.solved.length === 4) s.status = "won";
      if (s.status !== "playing") concluir("conex", P.id, s.status === "won");
      salvar();
      refresh();
      if (m !== 4) fx.tremer($(".cx-grid", main));
    };
  } else {
    ligarResultado("conex", idx, montarTexto({
      jogo: "Conexões PAS", numero: idx + 1, placar: placarConexoes(P, s), grade: grelhaConexoes(P, s.attempts), frase: frase("conex", tipoFinal(s, e), idx),
    }));
  }
}
