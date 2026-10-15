// Caso do Dia: cinco pistas, cada uma mais fácil.
import { PUZZLES } from "../jogos.js";
import { C } from "../ctx.js";
import { estado, salvar, concluir } from "../state.js";
import { julgar, MAX_PISTAS, PULO, pistasVisiveis, opcoesDoCaso } from "../lib/caso.js";
import { grelhaCaso, montarTexto } from "../lib/partilha.js";
import { SIM } from "../icons.js";
import { $, main, esc, pintar, toast } from "./dom.js";
import { cabecalho, ligarCabecalho, painelResultado, ligarResultado, frase } from "./comum.js";
import { fx } from "./fx.js";

const vistas = new Set();

export function telaCaso(idx) {
  const P = PUZZLES.caso[idx];
  const R = C.CASO;
  const s = estado("caso", P.id);
  const fim = s.status !== "playing";
  const usadas = s.guesses.length;
  const visiveis = fim ? MAX_PISTAS : pistasVisiveis(usadas);
  const nome = (id) => R.respostas[id].name;

  const pistas = P.hints
    .slice(0, visiveis)
    .map((h, i) => `<li class="pista ${i === visiveis - 1 && !fim ? "nova" : ""}"><span class="n">${i + 1}</span><p>${esc(h)}</p></li>`)
    .join("");

  const palpites = [...s.guesses]
    .reverse()
    .map((g) => {
      const j = julgar(P, g);
      const marca = { ok: SIM.ok, near: SIM.near, wrong: SIM.no, skip: SIM.skip }[j];
      const txt = g === PULO ? "Pista pulada" : nome(g);
      const por = j === "near" ? `<small>${esc(P.near[g])}</small>` : "";
      return `<li class="palp ${j}"><i aria-hidden="true">${marca}</i><span><b>${esc(txt)}</b>${por}</span></li>`;
    })
    .join("");

  const ganhou = s.status === "won";
  const tipo = ganhou ? (usadas <= 2 ? "ok" : "near") : "wrong";
  const opcoes = opcoesDoCaso(P, R.materiaDe);
  const grade = opcoes
    .map((id) => {
      const j = s.guesses.includes(id) ? julgar(P, id) : "";
      const marca = { near: SIM.near, wrong: SIM.no }[j] || "";
      return `<button class="opcao ${j}" data-op="${esc(id)}" ${j ? "disabled" : ""}><i aria-hidden="true">${marca}</i><span>${esc(nome(id))}</span></button>`;
    })
    .join("");
  const entrada = fim
    ? ""
    : `<p class="dica-op">Qual destes é o assunto? Cada erro tira uma opção e revela outra pista.</p>
       <div class="opcoes" role="group" aria-label="Opções de resposta">${grade}</div>
       <div class="actions"><button class="btn ghost" data-skip ${usadas >= MAX_PISTAS - 1 ? "disabled" : ""}>Pular para a próxima pista</button></div>`;

  const resultado = fim
    ? painelResultado({
        gid: "caso", idx, venceu: ganhou,
        titulo: nome(P.answer),
        veredito: ganhou ? `Resolvido com ${usadas} ${usadas === 1 ? "pista" : "pistas"} de ${MAX_PISTAS}.` : "As cinco pistas acabaram. A resposta é esta.",
        humor: frase("caso", tipo, idx),
        corpo: `<p>${esc(P.explain)}</p>`,
        origem: P.origem_pas, fonte: P.fonte, verificar: P.verificar,
      })
    : "";

  pintar(`<div class="game">
    ${cabecalho("caso", idx, `Caso do Dia: ${P.materia}`)}
    <p class="tema">Matéria de hoje: <b>${esc(P.materia)}</b> • ${esc(P.etapa)}</p>
    <div class="triesrow"><div class="tries" aria-hidden="true">${Array.from({ length: MAX_PISTAS }, (_, i) => `<i class="${i < usadas ? (julgar(P, s.guesses[i]) === "ok" ? "ok" : "bad") : ""}"></i>`).join("")}</div><span>Pista ${visiveis} de ${MAX_PISTAS}</span></div>
    <ol class="pistas" aria-label="Pistas reveladas">${pistas}</ol>
    ${entrada}
    ${palpites ? `<ul class="palps" aria-label="Seus palpites">${palpites}</ul>` : ""}
    ${resultado}
  </div>`);
  ligarCabecalho("caso");

  const primeiraVez = !vistas.has(`caso:${P.id}`);
  vistas.add(`caso:${P.id}`);
  const registrar = (g) => {
    s.guesses.push(g);
    if (g === P.answer) s.status = "won";
    else if (s.guesses.length >= MAX_PISTAS) s.status = "lost";
    if (s.status !== "playing") concluir("caso", P.id, s.status === "won");
    salvar();
    telaCaso(idx);
  };

  if (!fim) {
    main.querySelectorAll("[data-op]").forEach((b) => (b.onclick = () => registrar(b.dataset.op)));
    $("[data-skip]", main).onclick = () => registrar(PULO);
    fx.onda([...main.querySelectorAll(".opcao")].filter(() => primeiraVez), 35);
    const nova = main.querySelector(".pista.nova p");
    if (nova && !primeiraVez) fx.revelar(nova, 60);
    const ult = main.querySelector(".palp");
    if (ult && !primeiraVez) (ult.classList.contains("wrong") ? fx.tremer : fx.pulo).call(fx, ult);
  } else {
    const grid = grelhaCaso(P, s.guesses);
    ligarResultado("caso", idx, montarTexto({
      jogo: `Caso do Dia (${P.materia})`, numero: idx + 1, placar: ganhou ? `${usadas}/${MAX_PISTAS}` : `X/${MAX_PISTAS}`, grade: grid, frase: frase("caso", tipo, idx),
    }));
  }
  void toast;
}
