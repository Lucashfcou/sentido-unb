// Textos de compartilhamento sem spoiler.
import { melhorGrupo } from "./conexoes.js";
import { julgar } from "./caso.js";
import { compararObras, estadosDe } from "./obra.js";
import { compararAno } from "./historia.js";
import { avaliar } from "./formula.js";
import { comparar as compararLugar, emojiDistancia } from "./geo.js";

const NIVEL = { 1: "🟨", 2: "🟩", 3: "🟦", 4: "🟪" };
const FACE = { ok: "🟩", near: "🟨", no: "⬛", nd: "⬜" };

/** Uma linha por tentativa: a cor de cada termo é a cor do grupo a que ele pertence. */
export function grelhaConexoes(P, tentativas) {
  return tentativas.map((t) => t.map((w) => NIVEL[P.groups.find((g) => g.words.includes(w)).lvl]).join("")).join("\n");
}

export function grelhaCaso(caso, palpites) {
  const m = { ok: "🟩", near: "🟧", wrong: "⬛", skip: "⬜" };
  return palpites.map((p) => m[julgar(caso, p)]).join("");
}

export function grelhaObra(P, obras, palpites, continentes = {}) {
  const secreta = obras[P.answer];
  return palpites.map((id) => estadosDe(compararObras(obras[id], secreta, continentes)).map((e) => FACE[e]).join("")).join("\n");
}

/** Uma linha por palpite: seta (a resposta é mais tardia ou mais antiga) e a cor da distância. */
export function grelhaAno(certo, palpites) {
  return palpites.map((a) => {
    const c = compararAno(a, certo);
    return `${c.seta === "up" ? "⬆️" : c.seta === "down" ? "⬇️" : "🎯"}${c.faixa.emoji}`;
  }).join("\n");
}

export function grelhaFormula(certa, tentativas) {
  return tentativas.map((t) => avaliar(t, certa).map((e) => ({ ok: "🟩", near: "🟨", no: "⬛" })[e]).join("")).join("\n");
}

const SETA_EMOJI = { "↑": "⬆️", "↗": "↗️", "→": "➡️", "↘": "↘️", "↓": "⬇️", "↙": "↙️", "←": "⬅️", "↖": "↖️" };
export function grelhaLugar(porId, certoId, palpites) {
  return palpites.map((id) => {
    const c = compararLugar(porId[id], porId[certoId]);
    return `${c.direcao ? SETA_EMOJI[c.direcao.seta] : "🎯"}${emojiDistancia(c.km)}`;
  }).join("\n");
}

/** Placar curto: "3/5", "X/5", "2 erros". */
export function placarConexoes(P, s) {
  const e = s.attempts.filter((t) => melhorGrupo(P, t) < 4).length;
  return s.status === "won" ? (e === 0 ? "sem erros" : `${e} ${e === 1 ? "erro" : "erros"}`) : "X/4";
}

export function montarTexto({ jogo, numero, placar, grade, frase, url }) {
  return `Sentido UnB · ${jogo} nº ${numero}\n${placar}\n\n${grade}\n\n${frase}${url ? `\n${url}` : ""}`;
}
