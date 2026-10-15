import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Verificação numérica das fórmulas f31 a f89. Cada teste calcula a mesma grandeza por outro caminho
// (laços, integração numérica, geometria por coordenadas, contagem, minimização, vetores) e compara com o 'js' da fórmula.
const F = Object.fromEntries(JSON.parse(readFileSync(new URL("../src/content/formulas.json", import.meta.url), "utf8")).puzzles.map((p) => [p.id, p]));
const testadas = new Set();
const fx = (id) => {
  testadas.add(id);
  return new Function(...F[id].variaveis, `return ${F[id].js};`);
};
const perto = (a, b, tol, rotulo = "") => assert.ok(Math.abs(a - b) <= tol, `${rotulo} ${a} não está a ${tol} de ${b}`);
const relativo = (a, b, tol = 1e-9, rotulo = "") => perto(a, b, tol * Math.max(1, Math.abs(b)), rotulo);
const shoelace = (pts) => Math.abs(pts.reduce((s, [x1, y1], i) => s + x1 * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * y1, 0)) / 2;
const integrar = (g, a, b, passos = 200000) => {
  const h = (b - a) / passos;
  let s = 0;
  for (let i = 0; i < passos; i++) s += g(a + (i + 0.5) * h) * h;
  return s;
};

// ---------- PAS 1 ----------
test("f31 soma da PG finita = somar termo a termo", () => {
  const f = fx("f31");
  for (const [a1, q, n] of [[3, 2, 10], [5, 0.5, 8], [2, -3, 7], [1, 1.1, 20]]) {
    let soma = 0, termo = a1;
    for (let k = 0; k < n; k++) { soma += termo; termo *= q; }
    relativo(f(a1, q, n), soma, 1e-9);
  }
});

test("f32 função exponencial = multiplicar pela base x vezes", () => {
  const f = fx("f32");
  for (const [a, b, x] of [[2, 3, 5], [100, 1.05, 12], [7, 0.5, 6]]) {
    let v = a;
    for (let i = 0; i < x; i++) v *= b;
    relativo(f(a, b, x), v, 1e-12);
  }
});

test("f33 circunferência = perímetro de um polígono regular com muitos lados", () => {
  const f = fx("f33");
  for (const r of [1, 2.5, 10]) {
    const n = 1e6;
    perto(f(r), 2 * n * r * Math.sin(Math.PI / n), 1e-9 * r);
  }
});

test("f34 Pitágoras = distância ao quadrado por coordenadas", () => {
  const f = fx("f34");
  for (const [a, b] of [[3, 4], [1, 1], [5.5, 2], [0, 7]]) perto(f(a, b), Math.hypot(a - 0, b - 0) ** 2, 1e-9);
  assert.equal(f(3, 4), 25);
});

test("f35 área do losango = fórmula do cadarço com os vértices nas diagonais", () => {
  const f = fx("f35");
  for (const [D, d] of [[10, 6], [4, 4], [7.5, 2]]) perto(f(D, d), shoelace([[D / 2, 0], [0, d / 2], [-D / 2, 0], [0, -d / 2]]), 1e-9);
});

test("f36 F = m·a = variação de momento por tempo, com a velocidade integrada passo a passo", () => {
  const f = fx("f36");
  for (const [m, a, T] of [[2, 3, 5], [10, 0.5, 20], [0.3, 9.8, 2]]) {
    let v = 0;
    const N = 100000;
    for (let i = 0; i < N; i++) v += a * (T / N);
    relativo(f(m, a), (m * v) / T, 1e-9);
  }
});

test("f37 velocidade média = deslocamento acumulado ÷ tempo", () => {
  const f = fx("f37");
  for (const [v, dt] of [[3, 10], [12.5, 4], [0.7, 100]]) {
    let ds = 0;
    const N = 10000;
    for (let i = 0; i < N; i++) ds += v * (dt / N);
    relativo(f(ds, dt), v, 1e-9);
  }
});

test("f38 v = v₀ + a·t = integração de Euler de dv/dt = a", () => {
  const f = fx("f38");
  for (const [v0, a, t] of [[2, 3, 5], [-4, 1.5, 8], [0, 9.8, 3]]) {
    let v = v0;
    const N = 200000;
    for (let i = 0; i < N; i++) v += a * (t / N);
    relativo(f(v0, a, t), v, 1e-9);
  }
});

test("f39 Torricelli = quadrado da velocidade obtida com o tempo", () => {
  const f = fx("f39");
  for (const [v0, a, t] of [[2, 3, 5], [10, -1, 4], [0, 9.8, 2]]) {
    const s = v0 * t + (a * t * t) / 2;
    relativo(f(v0, a, s), (v0 + a * t) ** 2, 1e-9);
  }
});

test("f40 energia cinética = trabalho da força constante a partir do repouso", () => {
  const f = fx("f40");
  for (const [m, a, s] of [[2, 3, 10], [1500, 2, 50], [0.1, 9.8, 1]]) {
    const v = Math.sqrt(2 * a * s);
    relativo(f(m, v), m * a * s, 1e-9);
  }
});

test("f41 energia potencial = trabalho para erguer a massa, integrado", () => {
  const f = fx("f41");
  for (const [m, g, h] of [[2, 9.8, 10], [70, 9.8, 3], [0.5, 1.6, 100]]) relativo(f(m, g, h), integrar(() => m * g, 0, h, 1000), 1e-9);
});

test("f42 trabalho = produto escalar entre força e deslocamento", () => {
  const f = fx("f42");
  for (const [F1, d, th, fi] of [[10, 5, 0.6, 0.3], [3, 2, 0, 1], [8, 4, Math.PI / 2, 0.2], [5, 5, 2, -0.7]]) {
    const dv = [d * Math.cos(fi), d * Math.sin(fi)];
    const Fv = [F1 * Math.cos(fi + th), F1 * Math.sin(fi + th)];
    perto(f(F1, d, th), Fv[0] * dv[0] + Fv[1] * dv[1], 1e-9);
  }
});

test("f43 quantidade de movimento = impulso a partir do repouso", () => {
  const f = fx("f43");
  for (const [m, F1, dt] of [[2, 10, 3], [0.5, 4, 0.25], [1200, 3000, 6]]) {
    const v = (F1 * dt) / m;
    relativo(f(m, v), F1 * dt, 1e-12);
  }
});

test("f44 gravitação: Terra-Lua e relações de escala", () => {
  const f = fx("f44");
  relativo(f(6.674e-11, 5.972e24, 7.348e22, 3.844e8), 1.98e20, 0.02);
  const base = f(6.674e-11, 5, 7, 2);
  relativo(f(6.674e-11, 5, 7, 4), base / 4, 1e-12);
  relativo(f(6.674e-11, 15, 7, 2), base * 3, 1e-12);
});

test("f45 pressão = força distribuída em células de área", () => {
  const f = fx("f45");
  for (const [F1, A] of [[100, 2], [5, 0.01], [2000, 50]]) {
    const N = 100;
    relativo(f(F1, A), (F1 / N) / (A / N), 1e-12);
  }
});

test("f46 decaimento = dividir por 2 a cada meia-vida", () => {
  const f = fx("f46");
  let n = 1000;
  for (let k = 0; k <= 6; k++) {
    relativo(f(1000, k * 5730, 5730), n, 1e-12);
    n /= 2;
  }
  relativo(f(1000, 5730 / 2, 5730), 1000 / Math.SQRT2, 1e-12);
});

test("f47 decibel: 0 dB no limiar, 120 dB a 1 W/m², e +3 dB ao dobrar", () => {
  const f = fx("f47");
  perto(f(1e-12, 1e-12), 0, 1e-12);
  perto(f(1, 1e-12), 120, 1e-9);
  perto(f(2e-6, 1e-12) - f(1e-6, 1e-12), 10 * Math.log10(2), 1e-9);
});

// ---------- PAS 2 ----------
test("f48 volume do paralelepípedo = contagem de cubos unitários", () => {
  const f = fx("f48");
  for (const [a, b, c] of [[3, 4, 5], [1, 7, 2], [6, 6, 6]]) {
    let n = 0;
    for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) for (let k = 0; k < c; k++) n++;
    assert.equal(f(a, b, c), n);
  }
});

test("f49 área da esfera = derivada do volume 4/3·π·r³", () => {
  const f = fx("f49");
  const V = (r) => (4 / 3) * Math.PI * r ** 3;
  for (const r of [1, 2.5, 10]) {
    const h = 1e-5;
    relativo(f(r), (V(r + h) - V(r - h)) / (2 * h), 1e-8);
  }
});

test("f50 área lateral do cilindro = perímetro de polígono inscrito × altura", () => {
  const f = fx("f50");
  for (const [r, h] of [[1, 5], [3, 2], [0.5, 10]]) {
    const n = 1e6;
    perto(f(r, h), 2 * n * r * Math.sin(Math.PI / n) * h, 1e-8 * r * h);
  }
});

test("f51 variância = E[x²] − (E[x])²", () => {
  const f = fx("f51");
  for (const x of [[2, 4, 4, 4, 5, 5, 7, 9], [1, 2, 3, 4, 5], [10, 10, 10], [-3, 0, 3, 6]]) {
    const m = x.reduce((s, v) => s + v, 0) / x.length;
    const m2 = x.reduce((s, v) => s + v * v, 0) / x.length;
    perto(f(x), m2 - m * m, 1e-9);
  }
  assert.equal(f([2, 4, 4, 4, 5, 5, 7, 9]), 4);
});

test("f52 coeficiente de variação não depende da unidade", () => {
  const f = fx("f52");
  for (const dados of [[10, 12, 14, 18], [100, 150, 200]]) {
    const m = dados.reduce((s, v) => s + v, 0) / dados.length;
    const s = Math.sqrt(dados.reduce((a, v) => a + (v - m) ** 2, 0) / dados.length);
    relativo(f(s, m), s / m, 1e-12);
    for (const k of [0.001, 2, 1000]) relativo(f(k * s, k * m), f(s, m), 1e-12);
  }
});

test("f53 arranjo simples = contagem de sequências sem repetição", () => {
  const f = fx("f53");
  const conta = (n, p, usados = []) => (usados.length === p ? 1 : Array.from({ length: n }, (_, i) => i).filter((i) => !usados.includes(i)).reduce((s, i) => s + conta(n, p, [...usados, i]), 0));
  for (const [n, p] of [[5, 2], [6, 3], [4, 4], [7, 1]]) assert.equal(f(n, p), conta(n, p));
});

test("f54 permutação simples = contagem de ordenações", () => {
  const f = fx("f54");
  const perms = (xs) => (xs.length <= 1 ? 1 : xs.reduce((s, _, i) => s + perms([...xs.slice(0, i), ...xs.slice(i + 1)]), 0));
  for (let n = 1; n <= 7; n++) assert.equal(f(n), perms(Array.from({ length: n }, (_, i) => i)));
});

test("f55 probabilidade da união = contagem em dois dados", () => {
  const f = fx("f55");
  let a = 0, b = 0, ab = 0, uniao = 0;
  for (let i = 1; i <= 6; i++)
    for (let j = 1; j <= 6; j++) {
      const A = (i + j) % 2 === 0, B = i > 3;
      a += A; b += B; ab += A && B; uniao += A || B;
    }
  perto(f(a / 36, b / 36, ab / 36), uniao / 36, 1e-12);
});

test("f56 eventos independentes = contagem em dois dados", () => {
  const f = fx("f56");
  let ab = 0;
  for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) ab += i % 2 === 0 && j > 4;
  perto(f(18 / 36, 12 / 36), ab / 36, 1e-12);
});

test("f57 v = λ·f = comprimento de onda por período", () => {
  const f = fx("f57");
  for (const [lambda, freq] of [[0.75, 440], [3, 10], [6.5e-7, 4.6e14]]) relativo(f(lambda, freq), lambda / (1 / freq), 1e-12);
});

test("f58 Snell = trajeto de tempo mínimo (princípio de Fermat)", () => {
  const f = fx("f58");
  for (const [n1, n2, X] of [[1, 1.5, 2], [1.33, 1, 3], [1.5, 1.33, 1.2]]) {
    const T = (x) => n1 * Math.hypot(x, 1) + n2 * Math.hypot(X - x, 1);
    let lo = 0, hi = X;
    for (let i = 0; i < 200; i++) {
      const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
      if (T(m1) < T(m2)) hi = m2; else lo = m1;
    }
    const x = (lo + hi) / 2;
    const s1 = x / Math.hypot(x, 1), s2 = (X - x) / Math.hypot(X - x, 1);
    perto(f(n1, Math.asin(s1)), n2 * s2, 1e-6);
  }
});

test("f59 Gauss = posição da imagem por traçado de raios", () => {
  const f = fx("f59");
  for (const [dist, p] of [[10, 30], [20, 25], [5, 12]]) {
    // raio 1: do topo do objeto, paralelo ao eixo, até a lente e depois pelo foco; raio 2: pelo centro da lente
    const r1 = (x) => 1 * (1 - x / dist);
    const r2 = (x) => -x / p;
    let lo = 0, hi = 1e6;
    for (let i = 0; i < 300; i++) {
      const m = (lo + hi) / 2;
      if (r1(m) - r2(m) > 0) lo = m; else hi = m;
    }
    const pl = (lo + hi) / 2;
    relativo(f(p, pl), 1 / dist, 1e-9);
  }
});

test("f60 ΔU = Q − W num gás ideal monoatômico isobárico", () => {
  const f = fx("f60");
  for (const [n, R, dT] of [[1, 8.314, 50], [2, 8.314, -30], [0.5, 8.314, 100]]) {
    const Q = n * 2.5 * R * dT, W = n * R * dT, dU = n * 1.5 * R * dT;
    relativo(f(Q, W), dU, 1e-12);
  }
});

test("f61 calor sensível = soma de pequenas trocas de calor", () => {
  const f = fx("f61");
  for (const [m, c, dT] of [[0.5, 4180, 20], [2, 900, -35], [1, 1000, 7]]) {
    let Q = 0;
    const N = 100000;
    for (let i = 0; i < N; i++) Q += m * c * (dT / N);
    relativo(f(m, c, dT), Q, 1e-9);
  }
});

test("f62 lei geral dos gases: P·V÷T = n·R nos dois estados", () => {
  const f = fx("f62");
  const R = 8.314, n = 0.8;
  const [T1, V1] = [300, 0.02], P1 = (n * R * T1) / V1;
  for (const [T2, V2] of [[350, 0.025], [250, 0.015], [600, 0.04]]) {
    const P2 = (n * R * T2) / V2;
    relativo(f(P2, V2, T2), (P1 * V1) / T1, 1e-12);
  }
});

test("f63 Clapeyron = teoria cinética: P·V = 2/3 · N · (3/2)·k·T", () => {
  const f = fx("f63");
  const k = 1.380649e-23, NA = 6.02214076e23, R = NA * k;
  for (const [n, T] of [[1, 273.15], [0.5, 300], [3, 500]]) relativo(f(n, R, T), (2 / 3) * (n * NA) * 1.5 * k * T, 1e-12);
});

test("f64 rendimento de Carnot = W÷Q₁ com Q₂÷Q₁ = T₂÷T₁", () => {
  const f = fx("f64");
  for (const [T1, T2] of [[600, 300], [500, 400], [1000, 300]]) {
    const Q1 = 1000, Q2 = (Q1 * T2) / T1;
    relativo(f(T1, T2), (Q1 - Q2) / Q1, 1e-12);
  }
});

test("f65 E = h·f = h·c÷λ", () => {
  const f = fx("f65");
  const h = 6.62607015e-34, c = 299792458;
  for (const lambda of [500e-9, 700e-9, 4e-7]) relativo(f(h, c / lambda), (h * c) / lambda, 1e-12);
});

test("f66 molaridade = (massa ÷ massa molar) ÷ volume", () => {
  const f = fx("f66");
  for (const [m, mm, V] of [[58.44, 58.44, 1], [10, 40, 0.5], [2.5, 98, 0.25]]) relativo(f(m / mm, V), m / (mm * V), 1e-12);
});

test("f67 diluição = a quantidade de soluto se conserva", () => {
  const f = fx("f67");
  for (const [C1, V1, Vag] of [[2, 0.1, 0.4], [0.5, 1, 1], [10, 0.05, 0.95]]) {
    const n = C1 * V1, V2 = V1 + Vag, C2 = n / V2;
    relativo(f(C2, V2), n, 1e-12);
  }
});

test("f68 ΔH = soma dos passos por qualquer caminho (Lei de Hess)", () => {
  const f = fx("f68");
  for (const [Hp, Hr, Hm] of [[-285, 0, -100], [50, 120, 300], [-890, -75, -500]]) relativo(f(Hp, Hr), (Hm - Hr) + (Hp - Hm), 1e-12);
});

// ---------- PAS 3 ----------
test("f69 Coulomb: 1 C a 1 m dá k, e cai com o quadrado da distância", () => {
  const f = fx("f69");
  const k = 8.9875517923e9;
  relativo(f(k, 1, 1, 1), k, 1e-12);
  relativo(f(k, 1, 1, 2), f(k, 1, 1, 1) / 4, 1e-12);
  relativo(f(k, 2, 3, 1), 6 * k, 1e-12);
});

test("f70 campo elétrico = força de Coulomb por unidade de carga de prova", () => {
  const f = fx("f70");
  const coulomb = fx("f69");
  const k = 8.9875517923e9;
  for (const [Q, d, q0] of [[1e-6, 0.5, 1e-9], [-2e-6, 2, 3e-9], [5e-9, 0.1, 1e-12]]) relativo(f(k, Q, d), coulomb(k, q0, Q, d) / q0, 1e-9);
});

test("f71 potencial = integral do campo, de d até o infinito", () => {
  const f = fx("f71");
  const k = 8.9875517923e9;
  for (const [Q, d] of [[1e-6, 0.5], [-3e-9, 2], [2e-6, 10]]) {
    // r = d·e^s: ∫ k·Q/r² dr = ∫ k·Q/(d·e^s) ds
    const V = integrar((s) => (k * Q) / (d * Math.exp(s)), 0, 45, 400000);
    relativo(f(k, Q, d), V, 1e-6);
  }
});

test("f72 U = R·i = potência dissipada ÷ corrente (P = R·i²)", () => {
  const f = fx("f72");
  for (const [R, i] of [[10, 2], [220, 0.5], [4.7, 3]]) relativo(f(R, i), (R * i * i) / i, 1e-12);
});

test("f73 P = U·i = energia ÷ tempo", () => {
  const f = fx("f73");
  for (const [U, i, t] of [[220, 5, 3600], [12, 2.5, 60], [127, 0.8, 10]]) relativo(f(U, i), (U * i * t) / t, 1e-12);
});

test("f74 segunda lei de Ohm = N fios finos em paralelo", () => {
  const f = fx("f74");
  for (const [rho, L, A] of [[1.7e-8, 10, 1e-6], [5.6e-8, 2, 4e-6], [2.8e-8, 100, 2.5e-5]]) {
    const N = 8;
    const Ri = (rho * L) / (A / N);
    const paralelo = 1 / Array.from({ length: N }, () => 1 / Ri).reduce((a, b) => a + b, 0);
    relativo(f(rho, L, A), paralelo, 1e-12);
  }
});

test("f75 resistores em série = tensão total ÷ corrente", () => {
  const f = fx("f75");
  for (const [R1, R2, i] of [[10, 20, 0.5], [100, 47, 2], [3.3, 6.8, 1.5]]) relativo(f(R1, R2), (i * R1 + i * R2) / i, 1e-12);
});

test("f76 resistores em paralelo = tensão ÷ soma das correntes", () => {
  const f = fx("f76");
  for (const [R1, R2, V] of [[10, 20, 12], [100, 100, 5], [3.3, 6.8, 9]]) relativo(f(R1, R2), V / (V / R1 + V / R2), 1e-12);
});

test("f77 Faraday = −derivada numérica do fluxo", () => {
  const f = fx("f77");
  for (const [B0, kk, A] of [[0.1, 0.5, 0.02], [1, -2, 0.5], [0.3, 4, 0.1]]) {
    const Phi = (t) => (B0 + kk * t) * A;
    const t = 1.5, h = 1e-3;
    relativo(f(Phi(t + h) - Phi(t - h), 2 * h), -A * kk, 1e-9);
  }
});

test("f78 fluxo magnético = produto escalar do campo com o vetor normal", () => {
  const f = fx("f78");
  for (const [B, A, th] of [[0.5, 0.02, 0.4], [2, 1, 1.2], [0.1, 0.3, 0]]) {
    const Bv = [B, 0], n = [Math.cos(th), Math.sin(th)];
    perto(f(B, A, th), A * (Bv[0] * n[0] + Bv[1] * n[1]), 1e-12);
  }
});

test("f79 força magnética = módulo do produto vetorial q·v×B", () => {
  const f = fx("f79");
  for (const [q, v, B, th] of [[1.6e-19, 1e6, 0.5, 0.7], [2, 3, 4, Math.PI / 2], [1, 5, 2, 0.1]]) {
    const vv = [v, 0], Bv = [B * Math.cos(th), B * Math.sin(th)];
    perto(f(q, v, B, th), Math.abs(q * (vv[0] * Bv[1] - vv[1] * Bv[0])), 1e-12 * Math.max(1, Math.abs(q * v * B)));
  }
});

test("f80 transformador ideal: o mesmo fluxo atravessa as duas bobinas", () => {
  const f = fx("f80");
  for (const [Np, Ns] of [[200, 50], [100, 1000], [60, 60]]) {
    const dPhi = 0.37;
    relativo(f(Np, Ns), (Np * dPhi) / (Ns * dPhi), 1e-12);
  }
});

test("f81 dilatação do tempo = relógio de luz (geometria)", () => {
  const f = fx("f81");
  const c = 299792458;
  for (const [dt0, frac] of [[1, 0.6], [10, 0.8], [2, 0.1]]) {
    const v = frac * c;
    const g = (dt) => (c * dt) ** 2 - (v * dt) ** 2 - (c * dt0) ** 2;
    let lo = dt0, hi = dt0 * 100;
    for (let i = 0; i < 200; i++) {
      const m = (lo + hi) / 2;
      if (g(m) < 0) lo = m; else hi = m;
    }
    relativo(f(dt0, v, c), (lo + hi) / 2, 1e-9);
  }
  relativo(f(1, 0.6 * c, c), 1.25, 1e-12);
});

test("f82 E = m·c²: 1 g equivale a cerca de 9×10¹³ J", () => {
  const f = fx("f82");
  relativo(f(1e-3, 299792458), 8.9875517874e13, 1e-9);
  relativo(f(2e-3, 299792458), 2 * f(1e-3, 299792458), 1e-12);
});

test("f83 Kc = razão entre as constantes de velocidade no equilíbrio", () => {
  const f = fx("f83");
  for (const [A, B, C, D, a, b, c, d] of [[0.5, 0.4, 0.3, 0.2, 1, 1, 1, 1], [0.1, 0.2, 0.6, 0.3, 2, 1, 1, 2], [1, 0.5, 0.25, 0.5, 1, 2, 2, 1]]) {
    const kf = 1;
    const kr = (kf * A ** a * B ** b) / (C ** c * D ** d);
    relativo(f(A, B, C, D, a, b, c, d), kf / kr, 1e-9);
  }
});

test("f84 lei de velocidade = −dA/dt nas curvas de 1ª e 2ª ordem", () => {
  const f = fx("f84");
  for (const [k, A0] of [[0.3, 2], [1.2, 0.5], [0.05, 10]]) {
    const h = 1e-6;
    const a1 = (t) => A0 * Math.exp(-k * t);
    relativo(f(k, A0, 1), -(a1(h) - a1(-h)) / (2 * h), 1e-6);
    const k2 = k / A0;
    const a2 = (t) => 1 / (1 / A0 + k2 * t);
    relativo(f(k2, A0, 2), -(a2(h) - a2(-h)) / (2 * h), 1e-6);
  }
});

test("f85 pilha de Daniell e invariância pela escolha do zero de potencial", () => {
  const f = fx("f85");
  perto(f(0.34, -0.76), 1.1, 1e-12);
  for (const x of [-1, 0.5, 3]) perto(f(0.34 + x, -0.76 + x), 1.1, 1e-12);
});

test("f86 eletrólise = carga ÷ (n·F) mols, vezes a massa molar", () => {
  const f = fx("f86");
  const F1 = 96485;
  for (const [M, i, t, n] of [[63.5, 2, 3600, 2], [27, 10, 1800, 3], [107.9, 0.5, 600, 1]]) {
    const carga = i * t, molsDeEletrons = carga / F1, molsDeMetal = molsDeEletrons / n;
    relativo(f(M, i, t, n, F1), molsDeMetal * M, 1e-12);
  }
});

test("f87 λ = ln2 ÷ T = valor que faz a quantidade cair à metade em T", () => {
  const f = fx("f87");
  for (const T of [5730, 1, 8.02]) {
    let lo = 0, hi = 10;
    for (let i = 0; i < 200; i++) {
      const m = (lo + hi) / 2;
      if (Math.exp(-m * T) > 0.5) lo = m; else hi = m;
    }
    relativo(f(T), (lo + hi) / 2, 1e-9);
  }
});

test("f88 Hardy-Weinberg = soma das probabilidades dos genótipos", () => {
  const f = fx("f88");
  for (const p of [0.1, 0.3, 0.5, 0.9]) {
    const q = 1 - p;
    const alelos = { A: p, a: q };
    let soma = 0;
    for (const x of ["A", "a"]) for (const y of ["A", "a"]) soma += alelos[x] * alelos[y];
    perto(f(p, q), soma, 1e-12);
    perto(f(p, q), 1, 1e-12);
  }
});

test("f89 frequência de A = contagem de alelos na população", () => {
  const f = fx("f89");
  for (const [AA, Aa, aa] of [[36, 48, 16], [10, 20, 70], [0, 50, 50]]) {
    const N = AA + Aa + aa;
    relativo(f(AA / N, Aa / N), (2 * AA + Aa) / (2 * N), 1e-12);
  }
});

test("fórmulas f31 a f89: todas foram testadas aqui", () => {
  const todas = Object.keys(F).filter((k) => Number(k.slice(1)) >= 31).sort();
  assert.deepEqual([...testadas].sort(), todas);
  assert.equal(todas.length, 59);
});
