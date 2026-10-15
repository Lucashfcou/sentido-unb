// Qual é a obra?: compara a obra palpitada com a obra secreta.

/** Índice linear de século: ... -2, -1, 0 (séc. I a.C.), 1 (séc. I d.C.), 2 ... (não existe o ano zero). */
export function indiceSeculo(ano) {
  if (ano === null || ano === undefined) return null;
  const c = ano > 0 ? Math.ceil(ano / 100) : Math.floor(ano / 100);
  return c > 0 ? c : c + 1;
}

const ROMANOS = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
const romano = (n) => {
  let s = "";
  for (const [v, r] of ROMANOS) while (n >= v) ((s += r), (n -= v));
  return s;
};

/** "séc. XVI" ou "séc. IV a.C." */
export function rotuloEpoca(ano) {
  if (ano === null || ano === undefined) return "sem dado";
  if (ano > 0) return `séc. ${romano(Math.ceil(ano / 100))}`;
  return `séc. ${romano(Math.ceil(-ano / 100))} a.C.`;
}

const igual = (a, b) => (a === null || a === undefined || b === null || b === undefined ? "nd" : a === b ? "ok" : "no");

/**
 * @returns campos: categoria, epoca {estado, seta}, pais, forma, estilo, autor.
 * Estados: ok (igual), near (parecido), no (diferente), nd (sem dado para comparar).
 * seta "up": a obra secreta é mais tardia; "down": mais antiga.
 */
export function compararObras(g, s, continentes = {}) {
  const ig = indiceSeculo(g.ano);
  const is = indiceSeculo(s.ano);
  let epoca = { estado: "nd", seta: "" };
  if (ig !== null && is !== null) {
    const dif = is - ig;
    epoca = { estado: dif === 0 ? "ok" : Math.abs(dif) === 1 ? "near" : "no", seta: dif > 0 ? "up" : dif < 0 ? "down" : "" };
  }
  let pais = igual(g.pais, s.pais);
  if (pais === "no" && continentes[g.pais] && continentes[g.pais] === continentes[s.pais]) pais = "near";
  // estilo: "sem estilo" (reportagem, vídeo, música popular) também é uma resposta: sem estilo contra sem estilo é igual
  const estilo = (g.estilo ?? null) === (s.estilo ?? null) ? "ok" : "no";
  return { categoria: igual(g.categoria, s.categoria), epoca, pais, forma: igual(g.forma, s.forma), estilo, autor: igual(g.autor, s.autor) };
}

export const CAMPOS_OBRA = ["categoria", "epoca", "pais", "forma", "estilo", "autor"];

/** Estado de cada campo como texto simples ("ok", "near", "no", "nd"). */
export const estadosDe = (c) => CAMPOS_OBRA.map((k) => (k === "epoca" ? c.epoca.estado : c[k]));
