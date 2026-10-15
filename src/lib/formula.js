// Fórmula misteriosa: Wordle de símbolos. Cada símbolo é uma peça (token).

/**
 * Compara a tentativa com a fórmula, peça por peça.
 * "ok": peça certa no lugar certo; "near": a peça existe, mas em outro lugar;
 * "no": a peça não está (ou já foi usada todas as vezes que aparece).
 */
export function avaliar(tentativa, certa) {
  const n = certa.length;
  const res = Array(n).fill("no");
  const sobra = new Map();
  for (let i = 0; i < n; i++) {
    if (tentativa[i] === certa[i]) res[i] = "ok";
    else sobra.set(certa[i], (sobra.get(certa[i]) || 0) + 1);
  }
  for (let i = 0; i < n; i++) {
    if (res[i] === "ok") continue;
    const k = sobra.get(tentativa[i]) || 0;
    if (k > 0) {
      res[i] = "near";
      sobra.set(tentativa[i], k - 1);
    }
  }
  return res;
}

const ORDEM = { no: 0, near: 1, ok: 2 };

/** Melhor estado já visto de cada peça do teclado. */
export function estadoDasPecas(tentativas, certa) {
  const m = {};
  for (const t of tentativas) {
    avaliar(t, certa).forEach((e, i) => {
      if (!(t[i] in m) || ORDEM[e] > ORDEM[m[t[i]]]) m[t[i]] = e;
    });
  }
  return m;
}

/** Peças do teclado: as da fórmula mais as de distração, sem repetir. */
export const pecasDoTeclado = (p) => [...new Set([...p.tokens, ...p.extras])];
