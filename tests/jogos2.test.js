import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { faixaDe, formatarAno, lerAno, compararAno } from "../src/lib/historia.js";
import { avaliar, estadoDasPecas, pecasDoTeclado } from "../src/lib/formula.js";
import { distanciaKm, rumo, direcaoDe, proximidade, emojiDistancia, comparar } from "../src/lib/geo.js";
import { grelhaAno, grelhaFormula, grelhaLugar } from "../src/lib/partilha.js";
import { validarHistoria, validarFormulas, validarLugares, validarTudo } from "../scripts/validar-conteudo.mjs";
import { carregarConteudo } from "../src/content/index.js";

const lerJSON = (nome) => JSON.parse(readFileSync(new URL(`../src/content/${nome}.json`, import.meta.url), "utf8"));
const copia = (x) => JSON.parse(JSON.stringify(x));
const perto = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} não está a ${tol} de ${b}`);

/* ---------- Que ano foi? ---------- */
test("ano: faixas de distância", () => {
  assert.equal(faixaDe(0).id, "certo");
  assert.equal(faixaDe(-10).id, "pertinho");
  assert.equal(faixaDe(11).id, "perto");
  assert.equal(faixaDe(50).id, "perto");
  assert.equal(faixaDe(51).id, "morno");
  assert.equal(faixaDe(200).id, "morno");
  assert.equal(faixaDe(201).id, "longe");
  assert.equal(faixaDe(501).id, "muito-longe");
});

test("ano: leitura do que a pessoa digita", () => {
  assert.equal(lerAno("1789"), 1789);
  assert.equal(lerAno(" 399 ", true), -399);
  assert.equal(lerAno("-399"), -399);
  assert.equal(lerAno("0"), null); // não existe o ano zero
  assert.equal(lerAno("abc"), null);
  assert.equal(lerAno("12345"), null);
  assert.equal(lerAno("3500", true), null);
  assert.equal(lerAno("2200"), null);
  assert.equal(formatarAno(-399), "399 a.C.");
  assert.equal(formatarAno(1500), "1500");
});

test("ano: a seta aponta para o ano certo", () => {
  assert.equal(compararAno(1700, 1789).seta, "up");
  assert.equal(compararAno(1900, 1789).seta, "down");
  assert.equal(compararAno(1789, 1789).seta, "");
  assert.equal(compararAno(-500, 1500).dif, 2000);
});

/* ---------- Fórmula misteriosa ---------- */
test("fórmula: ok, near e no, com peças repetidas", () => {
  assert.deepEqual(avaliar(["a", "b", "c"], ["a", "b", "c"]), ["ok", "ok", "ok"]);
  assert.deepEqual(avaliar(["b", "a", "c"], ["a", "b", "c"]), ["near", "near", "ok"]);
  // uma peça repetida na tentativa só ganha amarelo tantas vezes quanto aparece na fórmula
  assert.deepEqual(avaliar(["·", "·", "x"], ["a", "·", "x"]), ["no", "ok", "ok"]);
  assert.deepEqual(avaliar(["·", "a", "·"], ["a", "·", "x"]), ["near", "near", "no"]);
  assert.deepEqual(avaliar(["z", "z", "z"], ["a", "b", "c"]), ["no", "no", "no"]);
});

test("fórmula: o teclado guarda o melhor estado de cada peça", () => {
  const cor = estadoDasPecas([["b", "a", "c"], ["a", "b", "z"]], ["a", "b", "c"]);
  assert.equal(cor.a, "ok");
  assert.equal(cor.b, "ok");
  assert.equal(cor.c, "ok");
  assert.equal(cor.z, "no");
});

test("fórmula: teclado não repete peça e traz distrações", () => {
  const p = { tokens: ["M", "=", "C", "·", "(1+i)", "ᵗ"], extras: ["J", "+", "t", "(1−i)", "÷", "i"] };
  const k = pecasDoTeclado(p);
  assert.equal(new Set(k).size, k.length);
  assert.equal(k.length, 12);
});

/* Verificação numérica das fórmulas, com referência independente (laço, integração, enumeração). */
const fx = (p) => new Function(...p.variaveis, `return ${p.js};`);
const F = Object.fromEntries(lerJSON("formulas").puzzles.map((p) => [p.id, p]));

test("fórmulas: juros compostos (f01) = aplicar (1+i) a cada período", () => {
  const f = fx(F.f01);
  let saldo = 1000;
  for (let t = 1; t <= 12; t++) {
    saldo *= 1.05;
    perto(f(1000, 0.05, t), saldo, 1e-9);
  }
  perto(f(500, 0.1, 0), 500, 1e-12);
});

test("fórmulas: termo geral da PA (f02) = somar a razão n−1 vezes", () => {
  const f = fx(F.f02);
  let termo = 3;
  for (let n = 1; n <= 20; n++) {
    perto(f(3, n, 4), termo, 1e-12);
    termo += 4;
  }
});

test("fórmulas: termo geral da PG (f03) = multiplicar pela razão n−1 vezes", () => {
  const f = fx(F.f03);
  let termo = 5;
  for (let n = 1; n <= 10; n++) {
    perto(f(5, 3, n), termo, 1e-9);
    termo *= 3;
  }
});

test("fórmulas: área do círculo (f04) = integral numérica de 2√(r²−x²)", () => {
  const f = fx(F.f04);
  for (const r of [1, 2.5]) {
    const passos = 200000;
    const h = (2 * r) / passos;
    let soma = 0;
    for (let i = 0; i < passos; i++) {
      const x = -r + (i + 0.5) * h;
      soma += 2 * Math.sqrt(r * r - x * x) * h;
    }
    perto(f(r), soma, 1e-3 * r * r);
  }
  perto(f(2) / f(1), 4, 1e-12); // dobrar o raio quadruplica a área
});

test("fórmulas: pH (f05) = −log10 [H⁺]", () => {
  const f = fx(F.f05);
  perto(f(1e-7), 7, 1e-12);
  perto(f(1e-3), 3, 1e-12);
  perto(f(1e-5) - f(1e-4), 1, 1e-12); // dividir [H⁺] por 10 sobe uma unidade de pH
});

test("fórmulas: volume do cilindro (f06) = contagem de pontos numa grade", () => {
  const f = fx(F.f06);
  const r = 1, h = 2, passo = 0.02;
  let dentro = 0;
  for (let x = -r; x <= r; x += passo) for (let y = -r; y <= r; y += passo) if (x * x + y * y <= r * r) dentro++;
  const volume = dentro * passo * passo * h;
  perto(f(r, h), volume, 0.03 * f(r, h));
});

test("fórmulas: probabilidade condicional (f07) = contagem em dois dados", () => {
  const f = fx(F.f07);
  let omega = 0, b = 0, ab = 0;
  for (let d1 = 1; d1 <= 6; d1++) for (let d2 = 1; d2 <= 6; d2++) {
    omega++;
    const eB = d1 % 2 === 0; // B: o primeiro dado é par
    const eA = d1 + d2 === 8; // A: a soma é 8
    if (eB) b++;
    if (eA && eB) ab++;
  }
  perto(f(ab / omega, b / omega), ab / b, 1e-12); // contando dentro de B
  assert.equal(ab / b, 3 / 18);
});

test("fórmulas: equação da circunferência (f08) vale r² só sobre a circunferência", () => {
  const f = fx(F.f08);
  const [a, b, r] = [2, -1, 3];
  for (let k = 0; k < 360; k += 15) {
    const t = (k * Math.PI) / 180;
    perto(f(a + r * Math.cos(t), b + r * Math.sin(t), a, b), r * r, 1e-9);
  }
  assert.ok(f(a + 1, b, a, b) < r * r); // ponto dentro
  assert.ok(f(a + 4, b, a, b) > r * r); // ponto fora
});

test("fórmulas: distância entre dois pontos (f09) = Math.hypot e triângulo 3-4-5", () => {
  const f = fx(F.f09);
  perto(f(0, 0, 3, 4), 5, 1e-12);
  for (const [x1, y1, x2, y2] of [[1, 2, -3, 5], [0.5, -2, 7, 3], [-4, -4, -1, 0]]) perto(f(x1, y1, x2, y2), Math.hypot(x2 - x1, y2 - y1), 1e-12);
});

test("fórmulas: função quadrática (f10) tem o mínimo no vértice −b/2a", () => {
  const f = fx(F.f10);
  const [a, b, c] = [2, -8, 3];
  perto(f(a, b, c, 0), c, 1e-12);
  let melhor = Infinity, xm = 0;
  for (let x = -10; x <= 10; x += 0.001) {
    const y = f(a, b, c, x);
    if (y < melhor) ((melhor = y), (xm = x));
  }
  perto(xm, -b / (2 * a), 2e-3);
});

test("fórmulas: lei dos cossenos (f11) = distância ao quadrado entre dois vértices", () => {
  const f = fx(F.f11);
  for (const [a, b, C] of [[3, 4, Math.PI / 2], [5, 7, 1], [2, 2, 2.5], [6, 1, 0.3]]) {
    const P = [a, 0];
    const Q = [b * Math.cos(C), b * Math.sin(C)];
    perto(f(a, b, C), (P[0] - Q[0]) ** 2 + (P[1] - Q[1]) ** 2, 1e-9);
  }
  perto(f(3, 4, Math.PI / 2), 25, 1e-9); // com 90 graus vira Pitágoras
});

test("fórmulas: determinante 2x2 (f12) = área orientada do paralelogramo", () => {
  const f = fx(F.f12);
  assert.equal(f(1, 0, 0, 1), 1); // identidade
  assert.equal(f(2, 3, 4, 5), -2);
  perto(Math.abs(f(2, 0, 0, 3)), 6, 1e-12); // retângulo 2 por 3
  assert.equal(f(1, 2, 3, 4), -f(2, 1, 4, 3)); // trocar as colunas troca o sinal
});

test("fórmulas: módulo de número complexo (f13) = distância à origem", () => {
  const f = fx(F.f13);
  perto(f(3, 4), 5, 1e-12);
  for (const [a, b] of [[1, 1], [-2, 5], [0, -7]]) perto(f(a, b), Math.hypot(a, b), 1e-12);
});

test("fórmulas f01 a f30: todas têm teste numérico (as demais, em formulas3.test.js)", () => {
  assert.deepEqual(Object.keys(F).filter((k) => Number(k.slice(1)) <= 30).sort(), Array.from({ length: 30 }, (_, i) => `f${String(i + 1).padStart(2, "0")}`));
});

/* ---------- Onde fica? ---------- */
test("geo: distâncias conhecidas", () => {
  const L = Object.fromEntries(lerJSON("lugares").lugares.map((r) => [r[0], { lat: r[4], lon: r[5] }]));
  perto(distanciaKm(L.brasilia, L.rio), 930, 40); // Brasília a Rio: cerca de 930 km
  perto(distanciaKm(L.roma, L.paris), 1105, 40);
  assert.equal(distanciaKm(L.roma, L.roma), 0);
  perto(distanciaKm({ lat: 0, lon: 0 }, { lat: 0, lon: 180 }), 20015, 20); // meia volta ao mundo
  assert.ok(distanciaKm(L.brasilia, L.ceilandia) < 30);
});

test("geo: direção e proximidade", () => {
  assert.equal(direcaoDe(0).nome, "norte");
  assert.equal(direcaoDe(359).nome, "norte");
  assert.equal(direcaoDe(90).nome, "leste");
  assert.equal(direcaoDe(225).nome, "sudoeste");
  const L = Object.fromEntries(lerJSON("lugares").lugares.map((r) => [r[0], { lat: r[4], lon: r[5] }]));
  assert.equal(direcaoDe(rumo(L.roma, L.paris)).nome, "noroeste");
  assert.equal(direcaoDe(rumo(L.brasilia, L.sobral)).nome, "nordeste");
  assert.equal(direcaoDe(rumo(L.sobral, L.brasilia)).nome, "sudoeste");
  assert.equal(proximidade(0), 100);
  assert.equal(proximidade(20000), 0);
  assert.equal(proximidade(30000), 0);
  assert.equal(proximidade(25), 99); // perto, mas não é o lugar certo
  assert.equal(emojiDistancia(0), "🟩");
  assert.equal(emojiDistancia(300), "🟨");
  assert.equal(emojiDistancia(1500), "🟧");
  assert.equal(emojiDistancia(5000), "🟥");
  assert.equal(emojiDistancia(9000), "⬛");
  assert.equal(comparar(L.roma, L.roma).direcao, null);
});

/* ---------- compartilhamento sem spoiler ---------- */
test("compartilhamento dos jogos novos só usa emojis", () => {
  const a = grelhaAno(1789, [1700, 1900, 1789]);
  assert.equal(a, "⬆️🟥\n⬇️🟥\n🎯🟩");
  assert.doesNotMatch(a, /[0-9a-z]/i);
  const f = grelhaFormula(["a", "=", "b"], [["b", "=", "a"], ["a", "=", "b"]]);
  assert.equal(f, "🟨🟩🟨\n🟩🟩🟩");
  const L = { a: { lat: 0, lon: 0 }, b: { lat: 0, lon: 10 } };
  assert.equal(grelhaLugar(L, "b", ["a", "b"]), "➡️🟧\n🎯🟩");
});

/* ---------- validador e conteúdo ---------- */
test("conteúdo dos três jogos novos passa no validador", () => {
  const { contagem, erros } = validarTudo();
  assert.deepEqual(erros, []);
  assert.equal(contagem.eventos, 90);
  assert.equal(contagem.formulas, 89);
  assert.equal(contagem.puzzlesLugar, 13);
});

test("validador pega ano escrito na cena de História", () => {
  const d = copia(lerJSON("historia"));
  d.eventos[3].cena = "Em 1789, uma multidão toma uma prisão-fortaleza.";
  assert.ok(validarHistoria(d).some((e) => e.includes("entrega o ano")));
});

test("validador pega fórmula com peça de distração repetida e peças demais", () => {
  const d = copia(lerJSON("formulas"));
  d.puzzles[0].extras.push("M");
  d.puzzles[1].tokens = [...d.puzzles[1].tokens, "x", "y", "z"];
  const e = validarFormulas(d);
  assert.ok(e.some((x) => x.includes("também está na fórmula")));
  assert.ok(e.some((x) => x.includes("de 4 a 9 peças")));
});

test("validador pega lugar entregue no enunciado e coordenada inválida", () => {
  const d = copia(lerJSON("lugares"));
  d.puzzles[1].enunciado = "Onde fica Ravena?";
  d.lugares[0][4] = 120;
  const e = validarLugares(d);
  assert.ok(e.some((x) => x.includes("entrega o lugar")));
  assert.ok(e.some((x) => x.includes("coordenada fora do intervalo")));
});

test("carregarConteudo monta HIST, FORM e LUGARES", async () => {
  const c = await carregarConteudo(async (n) => lerJSON(n));
  assert.equal(c.HIST.length, 90);
  assert.equal(c.FORM.length, 89);
  assert.equal(c.LUGARES.lista.length, 25);
  assert.equal(c.LUGARES.porId.sobral.pais, "Brasil");
  assert.ok(c.LUGARES.respostas.tombuctu.al.includes("timbuktu"));
});

/* ---------- etapas (PAS 1, 2 e 3) ---------- */
import { etapasDe, serveParaEtapa, indicesDaEtapa, indiceDoDia } from "../src/lib/etapa.js";
import { validarTudo as validarTudo2, MIN_POR_ETAPA } from "../scripts/validar-conteudo.mjs";

test("etapa: lê 'PAS 1', 'PAS 2 e 3' e 'PAS 1 a 3'", () => {
  assert.deepEqual(etapasDe("PAS 1"), [1]);
  assert.deepEqual(etapasDe("PAS 2 e 3"), [2, 3]);
  assert.deepEqual(etapasDe("PAS 1 e 2"), [1, 2]);
  assert.deepEqual(etapasDe("PAS 1 a 3"), [1, 2, 3]);
  assert.deepEqual(etapasDe(""), []);
  assert.deepEqual(etapasDe(undefined), []);
  assert.equal(serveParaEtapa("PAS 2 e 3", 3), true);
  assert.equal(serveParaEtapa("PAS 2 e 3", 1), false);
});

test("etapa: puzzle do dia fica dentro da etapa e a lista recomeça", () => {
  const lista = [{ etapa: "PAS 1" }, { etapa: "PAS 2" }, { etapa: "PAS 1 a 3" }, { etapa: "PAS 3" }, { etapa: "PAS 2" }];
  assert.deepEqual(indicesDaEtapa(lista, 1), [0, 2]);
  assert.deepEqual(indicesDaEtapa(lista, 2), [1, 2, 4]);
  assert.deepEqual(indicesDaEtapa(lista, 3), [2, 3]);
  assert.equal(indiceDoDia(lista, 2, 1), 1);
  assert.equal(indiceDoDia(lista, 2, 3), 4);
  assert.equal(indiceDoDia(lista, 2, 4), 1); // recomeça
  assert.equal(indiceDoDia([{ etapa: "PAS 1" }], 3, 1), -1); // etapa sem puzzle
});

test("etapa: cada jogo tem puzzles suficientes em cada etapa", () => {
  const { erros } = validarTudo2();
  assert.deepEqual(erros.filter((e) => e.includes("puzzle(s) para o PAS")), []);
  assert.ok(MIN_POR_ETAPA >= 3);
});

test("etapa: a busca do Qual é a obra? usa só a lista da etapa", async () => {
  const c = await carregarConteudo(async (n) => lerJSON(n));
  const por = (n) => c.OBRAS.lista.filter((o) => o.etapas.includes(`PAS ${n}`));
  assert.equal(por(1).length, 69);
  assert.equal(por(2).length, 49); // 48 só do PAS 2 mais O Cerrado está morrendo, que também é do PAS 1
  assert.ok(por(3).length >= 50);
  assert.ok(!por(1).some((o) => o.titulo === "Memórias póstumas de Brás Cubas")); // é do PAS 2
  assert.ok(por(2).some((o) => o.titulo === "Memórias póstumas de Brás Cubas"));
  // cada puzzle de obra tem a resposta na lista da sua etapa
  for (const p of c.OBRAS.puzzles) assert.ok(c.OBRAS.porId[p.answer].etapas.includes(p.etapa), p.id);
});
