// Medição agregada, sem dados pessoais. Nenhum identificador do jogador sai do aparelho.
// O aparelho guarda a data da primeira visita e só informa a FAIXA de dias desde então (0, 1, 2 a 6, 7, 8 a 13, 14 ou mais).
// Com isso dá para estimar retorno (dia seguinte, dia 7) contando eventos, sem cookie e sem ID.
import { diasEntre } from "./tempo.js";

/** Faixa de dias desde a primeira visita. */
export function faixaDeDias(n) {
  if (n <= 0) return "0";
  if (n === 1) return "1";
  if (n <= 6) return "2a6";
  if (n === 7) return "7";
  if (n <= 13) return "8a13";
  return "14mais";
}

/** Tipos de evento aceitos e os únicos campos permitidos em cada um. Qualquer outro campo é descartado. */
export const EVENTOS = {
  visita: ["tipo", "faixa", "etapa"], // abriu o site (tipo: "novo" ou "volta")
  concluiu: ["jogo", "etapa", "venceu"], // terminou um puzzle
  compartilhou: ["jogo", "etapa"], // copiou o bilhete
  etapa: ["etapa"], // escolheu PAS 1, 2 ou 3
};

/** Monta um evento só com campos permitidos. Devolve null se o tipo não existir. */
export function montarEvento(nome, dados = {}) {
  const permitidos = EVENTOS[nome];
  if (!permitidos) return null;
  const e = { evento: nome };
  for (const k of permitidos) if (dados[k] !== undefined && ["string", "number", "boolean"].includes(typeof dados[k])) e[k] = dados[k];
  return e;
}

/** Visita de hoje: nova se não há registro da primeira visita, senão volta com a faixa de dias. */
export function classificarVisita(primeira, hoje) {
  if (!primeira) return { tipo: "novo", faixa: "0" };
  return { tipo: "volta", faixa: faixaDeDias(diasEntre(primeira, hoje)) };
}

/**
 * Entrega o evento a quem estiver ouvindo (`window.__medir`), se houver. Por padrão não há ninguém: nada é enviado.
 * Plugar um provedor de contagem agregada é uma decisão do dono, depois de definidos custo e privacidade.
 */
export function emitir(nome, dados) {
  const e = montarEvento(nome, dados);
  if (!e) return;
  try {
    if (typeof window !== "undefined" && typeof window.__medir === "function") window.__medir(e);
  } catch {
    /* a medição nunca pode quebrar o jogo */
  }
}
