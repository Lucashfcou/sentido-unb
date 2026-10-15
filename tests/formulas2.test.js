import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Verificação numérica das fórmulas f14 a f30, com referência independente (geometria por coordenadas, laços, integração e enumeração).
const F = Object.fromEntries(JSON.parse(readFileSync(new URL("../src/content/formulas.json", import.meta.url), "utf8")).puzzles.map((p) => [p.id, p]));
const fx = (id) => new Function(...F[id].variaveis, `return ${F[id].js};`);
const perto = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} não está a ${tol} de ${b}`);
const shoelace = (pts) => Math.abs(pts.reduce((s, [x1, y1], i) => s + x1 * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * y1, 0)) / 2;
const integrar = (g, a, b, passos = 200000) => {
  const h = (b - a) / passos;
  let s = 0;
  for (let i = 0; i < passos; i++) s += g(a + (i + 0.5) * h) * h;
  return s;
};

test("f14 área do triângulo = fórmula do cadarço (coordenadas)", () => {
  const f = fx("f14");
  for (const [b, h, p] of [[4, 3, 1], [10, 2.5, 7], [6, 6, -2]]) perto(f(b, h), shoelace([[0, 0], [b, 0], [p, h]]), 1e-9);
});

test("f15 área do trapézio = fórmula do cadarço (coordenadas)", () => {
  const f = fx("f15");
  for (const [B, d, e, h] of [[10, 2, 3, 4], [8, 1, 1, 5], [12, 0, 4, 2]]) {
    const b = B - d - e;
    perto(f(B, b, h), shoelace([[0, 0], [B, 0], [B - d, h], [e, h]]), 1e-9);
  }
});

test("f16 soma da PA = soma termo a termo", () => {
  const f = fx("f16");
  for (const [a1, r] of [[5, 3], [-2, 0.5], [10, -4]]) {
    let soma = 0;
    for (let n = 1; n <= 25; n++) {
      const an = a1 + (n - 1) * r;
      soma += an;
      perto(f(a1, an, n), soma, 1e-9);
    }
  }
});

test("f17 juros simples = acumular C·i a cada período", () => {
  const f = fx("f17");
  let j = 0;
  for (let t = 1; t <= 24; t++) {
    j += 1000 * 0.03;
    perto(f(1000, 0.03, t), j, 1e-9);
  }
});

test("f18 lei dos senos = razão constante em triângulos por coordenadas", () => {
  const f = fx("f18");
  for (const [cx, x, y] of [[5, 1, 3], [7, 4, 2], [6, -1, 4]]) {
    const A = [0, 0], B = [cx, 0], C = [x, y];
    const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
    const ang = (V, P, Q) => {
      const u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]];
      return Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w)));
    };
    const a = dist(B, C), b = dist(A, C), c = dist(A, B);
    const angA = ang(A, B, C), angB = ang(B, A, C), angC = ang(C, A, B);
    perto(f(a, angA), f(b, angB), 1e-9);
    perto(f(a, angA), f(c, angC), 1e-9);
  }
});

test("f19 função afim: f(0)=b e a inclinação entre dois pontos é a", () => {
  const f = fx("f19");
  perto(f(2.5, 0, -3), -3, 1e-12);
  perto((f(2.5, 7, -3) - f(2.5, 3, -3)) / (7 - 3), 2.5, 1e-12);
});

test("f20 volume do prisma = caixa a·b·c", () => {
  assert.equal(fx("f20")(3 * 4, 5), 60);
});

test("f21 volume da pirâmide = integral das seções A·(1−z/h)²", () => {
  const f = fx("f21");
  for (const [A, h] of [[9, 4], [2.5, 10]]) perto(f(A, h), integrar((z) => A * (1 - z / h) ** 2, 0, h), 1e-3 * A * h);
});

test("f22 volume do cone = integral das seções π·(r(1−z/h))²", () => {
  const f = fx("f22");
  for (const [r, h] of [[2, 5], [1.5, 3]]) perto(f(r, h), integrar((z) => Math.PI * (r * (1 - z / h)) ** 2, 0, h), 1e-3 * f(r, h));
  perto(f(3, 6), Math.PI * 9 * 6 / 3, 1e-9);
});

test("f23 volume da esfera = integral das seções π·(r²−z²)", () => {
  const f = fx("f23");
  for (const r of [1, 2.5]) perto(f(r), integrar((z) => Math.PI * (r * r - z * z), -r, r), 1e-3 * f(r));
  perto(f(2) / f(1), 8, 1e-12); // dobrar o raio multiplica o volume por 8
});

test("f24 média aritmética: valores conhecidos e deslocamento", () => {
  const f = fx("f24");
  const v = [2, 4, 6, 8];
  const soma = v.reduce((s, x) => s + x, 0);
  assert.equal(f(soma, v.length), 5);
  assert.equal(f(soma + 10 * v.length, v.length), 15); // somar 10 a todos soma 10 à média
});

test("f25 combinação = triângulo de Pascal", () => {
  const f = fx("f25");
  const C = (n, p) => (p === 0 || p === n ? 1 : C(n - 1, p - 1) + C(n - 1, p));
  for (let n = 0; n <= 12; n++) for (let p = 0; p <= n; p++) perto(f(n, p), C(n, p), 1e-9);
  assert.equal(f(5, 2), 10);
});

test("f26 equação da reta: a diferença de y entre dois pontos é m·Δx", () => {
  const f = fx("f26");
  for (const [x1, y1, x2, y2] of [[1, 2, 4, 11], [-3, 5, 2, -5]]) {
    const m = (y2 - y1) / (x2 - x1);
    perto(f(m, x2, x1), y2 - y1, 1e-9);
  }
});

test("f27 forma polar: |z|·cosθ e |z|·senθ devolvem a e b", () => {
  const f = fx("f27");
  for (const [a, b] of [[3, 4], [-2, 5], [0, -7], [1.5, -0.5]]) {
    const r = Math.hypot(a, b), t = Math.atan2(b, a);
    perto(f(r, t), a, 1e-9);
    perto(r * Math.sin(t), b, 1e-9);
  }
});

test("f28 distância ponto-reta = menor distância a pontos amostrados da reta", () => {
  const f = fx("f28");
  const [a, b, c, x0, y0] = [3, 4, -12, 0, 0];
  perto(f(a, b, c, x0, y0), 12 / 5, 1e-12);
  let menor = Infinity;
  for (let x = -20; x <= 20; x += 0.0005) menor = Math.min(menor, Math.hypot(x - x0, (-(a * x + c) / b) - y0));
  perto(f(a, b, c, x0, y0), menor, 1e-3);
  perto(f(0, 1, 0, 5, -7), 7, 1e-12); // reta y = 0
});

test("f29 e f30 soma e produto das raízes = valores obtidos pela fórmula resolutiva", () => {
  const soma = fx("f29"), produto = fx("f30");
  for (const [a, b, c] of [[2, -8, 6], [1, -5, 6], [3, 0, -12], [1, 4, 1]]) {
    const delta = b * b - 4 * a * c;
    const x1 = (-b + Math.sqrt(delta)) / (2 * a), x2 = (-b - Math.sqrt(delta)) / (2 * a);
    perto(soma(a, b), x1 + x2, 1e-9);
    perto(produto(a, c), x1 * x2, 1e-9);
  }
});
