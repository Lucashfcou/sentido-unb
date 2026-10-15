// Fórmula misteriosa: Wordle de símbolos.
import { PUZZLES } from "../jogos.js";
import { estado, salvar, concluir } from "../state.js";
import { avaliar, estadoDasPecas, pecasDoTeclado } from "../lib/formula.js";
import { embaralhar, gerador, hashTexto } from "../lib/texto.js";
import { grelhaFormula, montarTexto } from "../lib/partilha.js";
import { SIM } from "../icons.js";
import { $, $$, main, esc, pintar } from "./dom.js";
import { cabecalho, ligarCabecalho, painelResultado, ligarResultado, frase } from "./comum.js";

const MAX = 6;
const SIMBOLO = { ok: SIM.ok, near: SIM.near, no: SIM.no };
const TEXTO = { ok: "certa no lugar certo", near: "existe, mas em outro lugar", no: "não está na fórmula" };

let atual = [];
let ultimo = "";

const linha = (tokens, estados) =>
  `<div class="frow">${tokens
    .map((t, i) => `<span class="fslot ${estados ? estados[i] : "cur"}" ${estados ? `title="${TEXTO[estados[i]]}"` : ""}>${esc(t)}${estados ? `<i aria-hidden="true">${SIMBOLO[estados[i]]}</i><em class="sr"> ${TEXTO[estados[i]]}</em>` : ""}</span>`)
    .join("")}</div>`;

export function telaFormula(idx) {
  const P = PUZZLES.formula[idx];
  if (ultimo !== P.id) {
    atual = [];
    ultimo = P.id;
  }
  const s = estado("formula", P.id);
  const fim = s.status !== "playing";
  const N = P.tokens.length;
  const n = s.guesses.length;
  const ganhou = s.status === "won";
  const tipo = ganhou ? (n <= 3 ? "ok" : "near") : "wrong";
  const teclas = embaralhar(pecasDoTeclado(P), gerador(hashTexto(P.id)));
  const cor = estadoDasPecas(s.guesses, P.tokens);

  const anteriores = s.guesses.map((t) => linha(t, avaliar(t, P.tokens))).join("");
  const vazios = Array.from({ length: N }, (_, i) => atual[i] ?? "·");
  const entrada = fim
    ? ""
    : `<div class="fatual" aria-label="Linha em construção">${linha(vazios, null)}</div>
      <div class="teclado" role="group" aria-label="Peças">${teclas
        .map((t) => `<button class="tecla ${cor[t] || ""}" data-t="${esc(t)}" ${atual.length >= N ? "disabled" : ""}>${esc(t)}${cor[t] ? `<i aria-hidden="true">${SIMBOLO[cor[t]]}</i>` : ""}</button>`)
        .join("")}</div>
      <div class="actions"><button class="btn ghost" data-apagar ${atual.length ? "" : "disabled"}>Apagar</button><button class="btn ghost" data-limpar ${atual.length ? "" : "disabled"}>Limpar</button><button class="btn" data-enviar ${atual.length === N ? "" : "disabled"}>Enviar</button></div>`;

  const resultado = fim
    ? painelResultado({
        gid: "formula", idx, venceu: ganhou,
        titulo: P.tokens.join(" "),
        veredito: ganhou ? `Montou em ${n}/${MAX}.` : "Não fechou. A fórmula certa está acima.",
        humor: frase("formula", tipo, idx),
        extra: `<p class="formula-final" aria-label="Fórmula">${esc(P.tokens.join(" "))}</p>`,
        corpo: `<p>${esc(P.explain)}</p>`,
        origem: P.origem_pas, fonte: P.fonte, verificar: P.verificar,
      })
    : "";

  pintar(`<div class="game">
    ${cabecalho("formula", idx, "Fórmula misteriosa")}
    <p class="tema"><b>${esc(P.nome)}</b> • ${esc(P.materia)} • ${esc(P.etapa)} • ${N} peças</p>
    <p class="legenda">${esc(P.legenda)}</p>
    <div class="triesrow"><div class="tries" aria-hidden="true">${Array.from({ length: MAX }, (_, i) => `<i class="${i < n ? (ganhou && i === n - 1 ? "ok" : "bad") : ""}"></i>`).join("")}</div><span>${n}/${MAX} tentativas</span></div>
    <div class="fgrade">${anteriores}</div>
    ${entrada}
    ${resultado}
  </div>`);
  ligarCabecalho("formula");
  const refresh = () => telaFormula(idx);

  if (!fim) {
    $$(".tecla", main).forEach((b) => {
      b.onclick = () => {
        if (atual.length < N) atual.push(b.dataset.t);
        refresh();
        const novo = $$(".tecla", main).find((x) => x.dataset.t === b.dataset.t && !x.disabled);
        if (novo) novo.focus({ preventScroll: true });
      };
    });
    $("[data-apagar]", main).onclick = () => {
      atual.pop();
      refresh();
    };
    $("[data-limpar]", main).onclick = () => {
      atual = [];
      refresh();
    };
    $("[data-enviar]", main).onclick = () => {
      if (atual.length !== N) return;
      s.guesses.push(atual);
      atual = [];
      if (s.guesses[s.guesses.length - 1].every((t, i) => t === P.tokens[i])) s.status = "won";
      else if (s.guesses.length >= MAX) s.status = "lost";
      if (s.status !== "playing") concluir("formula", P.id, s.status === "won");
      salvar();
      refresh();
    };
  } else {
    ligarResultado("formula", idx, montarTexto({
      jogo: "Fórmula misteriosa", numero: idx + 1, placar: ganhou ? `${n}/${MAX}` : `X/${MAX}`, grade: grelhaFormula(P.tokens, s.guesses), frase: frase("formula", tipo, idx),
    }));
  }
}
