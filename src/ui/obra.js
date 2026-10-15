// Qual é a obra?: dedução por atributos.
import { PUZZLES } from "../jogos.js";
import { C } from "../ctx.js";
import { estado, salvar, concluir } from "../state.js";
import { compararObras, rotuloEpoca, CAMPOS_OBRA } from "../lib/obra.js";
import { grelhaObra, montarTexto } from "../lib/partilha.js";
import { SIM } from "../icons.js";
import { $, main, esc, pintar, focarCampo } from "./dom.js";
import { cabecalho, ligarCabecalho, painelResultado, ligarResultado, frase } from "./comum.js";
import { campoBusca, ligarBusca } from "./busca.js";
import { indexarRespostas } from "../lib/busca.js";
import { etapasDe } from "../lib/etapa.js";

const MAX = 6;

const porEtapa = {};
/** Só as obras da lista da etapa do puzzle entram na busca (cada etapa tem a sua lista). */
function respostasDaEtapa(O, etapa) {
  const n = etapasDe(etapa)[0];
  if (!porEtapa[n]) porEtapa[n] = indexarRespostas(O.lista.filter((o) => o.etapas.includes(`PAS ${n}`)).map((o) => [o.id, o.titulo, o.apelidos]));
  return porEtapa[n];
}
const ROTULO = { categoria: "Categoria", epoca: "Época", pais: "País", forma: "Forma", estilo: "Estilo", autor: "Autor" };
const TEXTO_ESTADO = { ok: "igual", near: "parecido", no: "diferente", nd: "sem dado" };

function valorDe(o, campo) {
  if (campo === "epoca") return rotuloEpoca(o.ano);
  const v = o[campo];
  return v === null || v === undefined ? (campo === "estilo" ? "sem estilo" : "sem dado") : v;
}

function linhaPalpite(g, secreta) {
  const cmp = compararObras(g, secreta, C.OBRAS.continentes);
  const chips = CAMPOS_OBRA.map((k) => {
    const est = k === "epoca" ? cmp.epoca.estado : cmp[k];
    const seta = k === "epoca" && cmp.epoca.seta ? `<i class="ar" aria-hidden="true">${cmp.epoca.seta === "up" ? SIM.up : SIM.down}</i>` : "";
    const dica = k === "epoca" && cmp.epoca.seta ? (cmp.epoca.seta === "up" ? ", a obra secreta é mais tardia" : ", a obra secreta é mais antiga") : "";
    return `<span class="at ${est}" title="${ROTULO[k]}: ${TEXTO_ESTADO[est]}${dica}"><small>${ROTULO[k]}</small><span class="v"><b aria-hidden="true">${SIM[est]}</b> ${esc(valorDe(g, k))}${seta}</span><em class="sr">${ROTULO[k]} ${esc(valorDe(g, k))}: ${TEXTO_ESTADO[est]}${dica}</em></span>`;
  }).join("");
  return `<li class="palpobra"><p class="ptit">${esc(g.titulo)}</p><div class="attrs">${chips}</div></li>`;
}

export function telaObra(idx) {
  const P = PUZZLES.obra[idx];
  const O = C.OBRAS;
  const secreta = O.porId[P.answer];
  const s = estado("obra", P.id);
  const fim = s.status !== "playing";
  const n = s.guesses.length;
  const ganhou = s.status === "won";
  const tipo = ganhou ? (n <= 3 ? "ok" : "near") : "wrong";
  // pistas em ordem: dica 1 (2 palpites), categoria (3 palpites), dica 2 (4 palpites)
  const pistas = [
    { quando: 2, html: P.dicas[0] ? `<b>Dica 1:</b> ${esc(P.dicas[0])}` : "" },
    { quando: 3, html: `<b>Categoria:</b> ${esc(secreta.categoria)}` },
    { quando: 4, html: P.dicas[1] ? `<b>Dica 2:</b> ${esc(P.dicas[1])}` : "" },
  ].filter((x) => x.html);
  const dicas = pistas.filter((x) => fim || n >= x.quando).map((x) => `<li>${x.html}</li>`).join("");
  const proxima = pistas.find((x) => n < x.quando);

  const entrada = fim
    ? ""
    : `${campoBusca("Digite uma obra ou um autor…", "Seu palpite")}<p class="meta pequeno">Você tem ${MAX - n} ${MAX - n === 1 ? "palpite" : "palpites"}. ${proxima ? `A próxima pista abre depois de ${proxima.quando} palpites.` : ""}</p>`;

  const resultado = fim
    ? painelResultado({
        gid: "obra", idx, venceu: ganhou,
        titulo: secreta.titulo,
        veredito: ganhou ? `Acertou em ${n}/${MAX}. ${secreta.autor}, ${secreta.categoria.toLowerCase()}.` : `Não foi desta. Era: ${secreta.autor}.`,
        humor: frase("obra", tipo, idx),
        corpo: `<p>${esc(P.explain)}</p>`,
        origem: P.origem_pas, fonte: P.fonte, verificar: P.verificar || secreta.v,
      })
    : "";

  pintar(`<div class="game">
    ${cabecalho("obra", idx)}
    <div class="triesrow"><div class="tries" aria-hidden="true">${Array.from({ length: MAX }, (_, i) => `<i class="${i < n ? (s.guesses[i] === P.answer ? "ok" : "bad") : ""}"></i>`).join("")}</div><span>${n}/${MAX} palpites</span></div>
    ${dicas ? `<ul class="dicas">${dicas}</ul>` : ""}
    ${entrada}
    ${n ? `<ul class="palpsobra" aria-label="Seus palpites">${[...s.guesses].reverse().map((id) => linhaPalpite(O.porId[id], secreta)).join("")}</ul>` : ""}
    ${resultado}
  </div>`);
  ligarCabecalho("obra");

  const registrar = (id) => {
    s.guesses.push(id);
    if (id === P.answer) s.status = "won";
    else if (s.guesses.length >= MAX) s.status = "lost";
    if (s.status !== "playing") concluir("obra", P.id, s.status === "won");
    salvar();
    telaObra(idx);
    if (s.status === "playing") focarCampo($("#q", main));
  };

  if (!fim) {
    ligarBusca({
      input: $("#q", main), lista: $("#lista", main), respostas: respostasDaEtapa(O, P.etapa),
      excluir: () => s.guesses, extra: (a) => `${O.porId[a.id].autor} • ${O.porId[a.id].categoria}`,
      aoEscolher: registrar,
    });
    focarCampo($("#q", main));
  } else {
    ligarResultado("obra", idx, montarTexto({
      jogo: "Qual é a obra?", numero: idx + 1, placar: ganhou ? `${n}/${MAX}` : `X/${MAX}`, grade: grelhaObra(P, O.porId, s.guesses, O.continentes), frase: frase("obra", tipo, idx),
    }));
  }
}
