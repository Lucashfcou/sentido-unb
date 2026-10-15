// Estado do jogador, guardado só no aparelho (localStorage). Nada vai para servidor.
import { dataBrasilia, numeroEdicao, somarDias } from "./lib/tempo.js";
import { PUZZLES, ORDER } from "./jogos.js";
import { indiceDoDia, indicesDaEtapa } from "./lib/etapa.js";
import { emitir, classificarVisita } from "./lib/medicao.js";

const CHAVE = "pas-diario:v1";

export const armazem = {
  ler(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  gravar(k, v) {
    try {
      localStorage.setItem(k, v);
      return true;
    } catch {
      return false;
    }
  },
};

function carregar() {
  try {
    const d = JSON.parse(armazem.ler(CHAVE) || "{}");
    if (d && typeof d === "object") return { seen: d.seen || {}, jogos: d.jogos || {}, dias: d.dias || {}, primeira: typeof d.primeira === "string" ? d.primeira : "", etapa: [1, 2, 3].includes(d.etapa) ? d.etapa : 1 };
  } catch {
    /* dados corrompidos: começa de novo */
  }
  return { seen: {}, jogos: {}, dias: {}, primeira: "", etapa: 1 };
}

export const S = { store: carregar(), hoje: dataBrasilia() };
export const salvar = () => armazem.gravar(CHAVE, JSON.stringify(S.store));

export const edicao = () => numeroEdicao(S.hoje);

/** Etapa escolhida pelo jogador (1, 2 ou 3), guardada no aparelho. */
export const etapaAtual = () => S.store.etapa;
export function definirEtapa(n) {
  S.store.etapa = n;
  salvar();
  emitir("etapa", { etapa: n });
}

/** Registra a visita de hoje na medição agregada (só a faixa de dias desde a primeira visita) e guarda a data da primeira. */
export function registrarVisita() {
  const v = classificarVisita(S.store.primeira, S.hoje);
  if (!S.store.primeira) {
    S.store.primeira = S.hoje;
    salvar();
  }
  emitir("visita", { tipo: v.tipo, faixa: v.faixa, etapa: etapaAtual() });
}

/** Chamado quando um puzzle termina: marca o dia e avisa a medição. */
export function concluir(gid, puzzleId, venceu) {
  registrarDia(gid, puzzleId);
  emitir("concluiu", { jogo: gid, etapa: etapaAtual(), venceu });
}

/** Posições, em PUZZLES[gid], dos puzzles da etapa escolhida. */
export const indicesDaEtapaAtual = (gid) => indicesDaEtapa(PUZZLES[gid], etapaAtual());

/** Puzzle de hoje do jogo na etapa escolhida (índice em PUZZLES[gid], ou -1 se a etapa não tem puzzle). */
export const indiceDeHoje = (gid) => indiceDoDia(PUZZLES[gid], etapaAtual(), edicao());

const novo = (gid) => (gid === "conex" ? { attempts: [], solved: [], order: null, status: "playing" } : { guesses: [], status: "playing" });

/** Estado de um puzzle (guardado por id do puzzle, não por data). */
export function estado(gid, puzzleId) {
  const k = `${gid}:${puzzleId}`;
  return (S.store.jogos[k] = S.store.jogos[k] || novo(gid));
}
export const espiar = (gid, puzzleId) => S.store.jogos[`${gid}:${puzzleId}`];
export const concluido = (s) => !!s && s.status !== "playing";

/** Marca no calendário que o puzzle de hoje (da etapa escolhida) foi concluído, para a sequência de dias. */
export function registrarDia(gid, puzzleId) {
  const i = indiceDeHoje(gid);
  if (i < 0 || PUZZLES[gid][i].id !== puzzleId) return;
  const d = (S.store.dias[S.hoje] = S.store.dias[S.hoje] || {});
  const e = (d[`E${etapaAtual()}`] = d[`E${etapaAtual()}`] || {});
  e[gid] = 1;
  salvar();
}

/** Jogos que têm puzzle na etapa escolhida (os que contam para a sequência). */
export const jogosDaEtapa = () => ORDER.filter((g) => indiceDeHoje(g) >= 0);

/** Dias seguidos (até hoje) com todos os jogos da etapa escolhida concluídos. */
export function sequencia() {
  const chave = `E${etapaAtual()}`;
  const jogos = jogosDaEtapa();
  const completo = (k) => !!S.store.dias[k] && !!S.store.dias[k][chave] && jogos.length > 0 && jogos.every((g) => S.store.dias[k][chave][g]);
  let n = 0;
  let k = S.hoje;
  if (!completo(k)) k = somarDias(k, -1);
  while (completo(k)) {
    n++;
    k = somarDias(k, -1);
  }
  return n;
}
