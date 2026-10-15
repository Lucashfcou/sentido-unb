// Que ano foi?: faixas de distância, formatação e leitura do ano digitado.

/** Faixas de distância, da mais perto para a mais longe. */
export const FAIXAS = [
  { max: 0, id: "certo", rotulo: "Acertou", emoji: "🟩" },
  { max: 10, id: "pertinho", rotulo: "Pertinho (até 10 anos)", emoji: "🟨" },
  { max: 50, id: "perto", rotulo: "Perto (até 50 anos)", emoji: "🟧" },
  { max: 200, id: "morno", rotulo: "Morno (até 200 anos)", emoji: "🟥" },
  { max: 500, id: "longe", rotulo: "Longe (até 500 anos)", emoji: "⬛" },
  { max: Infinity, id: "muito-longe", rotulo: "Muito longe (mais de 500 anos)", emoji: "⬛" },
];

export const faixaDe = (dif) => FAIXAS.find((f) => Math.abs(dif) <= f.max);

/** "399 a.C." ou "1789". */
export const formatarAno = (ano) => (ano < 0 ? `${-ano} a.C.` : String(ano));

/**
 * Lê o que a pessoa digitou. Aceita "1789", "399" com a.C. marcado, ou "-399".
 * @returns ano inteiro (negativo = a.C.) ou null se for inválido.
 */
export function lerAno(texto, antesDeCristo = false) {
  const t = String(texto).trim().replace(/\s+/g, "");
  if (!/^-?\d{1,4}$/.test(t)) return null;
  let n = Number.parseInt(t, 10);
  if (n === 0) return null; // não existe o ano zero
  if (antesDeCristo && n > 0) n = -n;
  return n >= -3000 && n <= 2100 ? n : null;
}

/** Compara o palpite com o ano certo: seta "up" (a resposta é mais tardia) ou "down" (mais antiga). */
export function compararAno(palpite, certo) {
  const dif = certo - palpite;
  return { dif, faixa: faixaDe(dif), seta: dif > 0 ? "up" : dif < 0 ? "down" : "" };
}
