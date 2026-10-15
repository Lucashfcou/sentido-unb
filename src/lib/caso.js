// Caso do Dia: julgamento de cada palpite.
export const MAX_PISTAS = 5;
export const PULO = "__skip";

/** "ok" (acertou), "near" (conceito vizinho), "wrong", "skip". */
export function julgar(caso, palpite) {
  if (palpite === PULO) return "skip";
  if (palpite === caso.answer) return "ok";
  if (Object.prototype.hasOwnProperty.call(caso.near, palpite)) return "near";
  return "wrong";
}

/** Quantas pistas já estão visíveis: uma a mais que as tentativas gastas, no máximo 5. */
export const pistasVisiveis = (tentativas) => Math.min(MAX_PISTAS, tentativas + 1);

export const N_OPCOES = 8;

/** Mistura estável: o mesmo puzzle mostra as mesmas opções, na mesma ordem, para todo mundo. */
function embaralhar(ids, semente) {
  let h = 2166136261;
  for (const ch of semente) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const chave = (id) => {
    let x = h;
    for (const ch of id) x = Math.imul(x ^ ch.charCodeAt(0), 16777619) >>> 0;
    return x;
  };
  return [...ids].sort((a, b) => chave(a) - chave(b) || a.localeCompare(b));
}

/**
 * Cartela fechada do caso: a resposta, os vizinhos conhecidos e conceitos da mesma matéria até 8 opções.
 * Sem busca livre: o aluno elimina, não pesquisa.
 */
export function opcoesDoCaso(caso, materiaDe) {
  const ids = [caso.answer, ...Object.keys(caso.near)];
  const mesmos = embaralhar(
    Object.keys(materiaDe).filter((id) => materiaDe[id] === caso.materia && !ids.includes(id)),
    caso.id,
  );
  for (const id of mesmos) {
    if (ids.length >= N_OPCOES) break;
    ids.push(id);
  }
  const outros = embaralhar(
    Object.keys(materiaDe).filter((id) => !ids.includes(id)),
    caso.id + "+",
  );
  for (const id of outros) {
    if (ids.length >= N_OPCOES) break;
    ids.push(id);
  }
  return embaralhar(ids, caso.id + "#");
}
