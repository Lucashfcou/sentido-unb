// Onde fica?: distância, direção e proximidade entre dois lugares.
const R = 6371; // raio médio da Terra, em km
const rad = (g) => (g * Math.PI) / 180;

/** Distância em km pelo círculo máximo (haversine). */
export function distanciaKm(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Rumo inicial de a para b, em graus (0 = norte, 90 = leste). */
export function rumo(a, b) {
  const y = Math.sin(rad(b.lon - a.lon)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lon - a.lon));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

const OITO = [
  { seta: "↑", nome: "norte" }, { seta: "↗", nome: "nordeste" }, { seta: "→", nome: "leste" }, { seta: "↘", nome: "sudeste" },
  { seta: "↓", nome: "sul" }, { seta: "↙", nome: "sudoeste" }, { seta: "←", nome: "oeste" }, { seta: "↖", nome: "noroeste" },
];

/** Uma das 8 direções para o rumo em graus. */
export const direcaoDe = (graus) => OITO[Math.round(graus / 45) % 8];

/** Proximidade de 0 a 100: 100 é o mesmo lugar, 0 é o lado oposto do planeta (cerca de 20.000 km). */
export const proximidade = (km) => {
  const p = Math.max(0, Math.round(100 - (km / 20000) * 100));
  return km >= 1 ? Math.min(99, p) : p; // 100% só para o lugar certo
};

/** Faixa de cor para o compartilhamento. */
export function emojiDistancia(km) {
  return km < 1 ? "🟩" : km <= 500 ? "🟨" : km <= 2000 ? "🟧" : km <= 6000 ? "🟥" : "⬛";
}

/** Palpite em relação ao lugar certo. */
export function comparar(palpite, certo) {
  const km = distanciaKm(palpite, certo);
  const graus = rumo(palpite, certo);
  return { km, graus, direcao: km < 1 ? null : direcaoDe(graus), proximidade: proximidade(km) };
}
