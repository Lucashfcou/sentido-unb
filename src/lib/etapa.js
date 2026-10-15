// Etapas do PAS: PAS 1 = 1º ano, PAS 2 = 2º ano, PAS 3 = 3º ano.
export const ETAPAS = [
  { n: 1, nome: "PAS 1", ano: "1º ano" },
  { n: 2, nome: "PAS 2", ano: "2º ano" },
  { n: 3, nome: "PAS 3", ano: "3º ano" },
];

/**
 * Lê o texto de etapa de um puzzle: "PAS 1", "PAS 2 e 3", "PAS 1 a 3".
 * @returns lista ordenada de números de etapa.
 */
export function etapasDe(texto) {
  const t = String(texto || "");
  const nums = (t.match(/[123]/g) || []).map(Number);
  if (!nums.length) return [];
  if (/\sa\s/.test(t)) {
    const a = Math.min(...nums);
    const b = Math.max(...nums);
    return Array.from({ length: b - a + 1 }, (_, i) => a + i);
  }
  return [...new Set(nums)].sort((x, y) => x - y);
}

/** O puzzle serve para a etapa n? */
export const serveParaEtapa = (texto, n) => etapasDe(texto).includes(n);

/** Posições (em `lista`) dos puzzles que servem para a etapa n. */
export const indicesDaEtapa = (lista, n) => lista.map((p, i) => [p, i]).filter(([p]) => serveParaEtapa(p.etapa, n)).map(([, i]) => i);

/** Índice do puzzle do dia dentro de `lista` para a etapa n e a edição `edicao` (-1 se não houver puzzle). */
export function indiceDoDia(lista, n, edicao) {
  const idx = indicesDaEtapa(lista, n);
  if (!idx.length) return -1;
  return idx[(((edicao - 1) % idx.length) + idx.length) % idx.length];
}
