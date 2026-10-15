import { test } from "node:test";
import assert from "node:assert/strict";
import { numeroEdicao, somarDias, diasEntre, escolher, dataBrasilia } from "../src/lib/tempo.js";
import { indiceSeculo, rotuloEpoca, compararObras, estadosDe } from "../src/lib/obra.js";
import { julgar, pistasVisiveis } from "../src/lib/caso.js";
import { melhorGrupo, erros, repetida } from "../src/lib/conexoes.js";
import { grelhaConexoes, grelhaCaso, grelhaObra, placarConexoes } from "../src/lib/partilha.js";
import { buscar, indexarRespostas } from "../src/lib/busca.js";
import { sequenciaGlobal, estatisticas } from "../src/lib/progresso.js";

test("tempo: edição 1 no dia do lançamento e lista que recomeça", () => {
  assert.equal(numeroEdicao("2026-10-16", "2026-10-16"), 1);
  assert.equal(numeroEdicao("2026-10-18", "2026-10-16"), 3);
  assert.equal(escolher(["a", "b", "c"], 4), "a");
  assert.equal(somarDias("2026-02-28", 1), "2026-03-01");
  assert.equal(diasEntre("2026-10-16", "2026-10-26"), 10);
});

test("tempo: o dia vira à meia-noite de Brasília, não de UTC", () => {
  // 02:30 UTC de 16/10 ainda é 23:30 de 15/10 em Brasília (UTC-3)
  assert.equal(dataBrasilia(new Date("2026-10-16T02:30:00Z")), "2026-10-15");
  assert.equal(dataBrasilia(new Date("2026-10-16T03:30:00Z")), "2026-10-16");
});

test("obra: índice de século, sem ano zero", () => {
  assert.equal(indiceSeculo(1500), 15);
  assert.equal(indiceSeculo(1600), 16);
  assert.equal(indiceSeculo(1601), 17);
  assert.equal(indiceSeculo(-399), -3); // séc. IV a.C.
  assert.equal(indiceSeculo(-30), 0); // séc. I a.C.
  assert.equal(indiceSeculo(80), 1); // séc. I d.C. fica ao lado do séc. I a.C.
  assert.equal(indiceSeculo(null), null);
  assert.equal(rotuloEpoca(1570), "séc. XVI");
  assert.equal(rotuloEpoca(-399), "séc. IV a.C.");
  assert.equal(rotuloEpoca(null), "sem dado");
});

const secreta = { id: "s", categoria: "Literatura", autor: "Camões", ano: 1570, pais: "Portugal", forma: "Poesia", estilo: "Classicismo" };
const cont = { Portugal: "Europa", Itália: "Europa", Brasil: "América do Sul" };

test("obra: palpite igual à secreta acerta tudo", () => {
  assert.deepEqual(estadosDe(compararObras(secreta, secreta, cont)), ["ok", "ok", "ok", "ok", "ok", "ok"]);
});

test("obra: século vizinho é parecido e a seta aponta para a secreta", () => {
  const g = { ...secreta, id: "g", ano: 1680 }; // séc. XVII, a secreta é do XVI
  const c = compararObras(g, secreta, cont);
  assert.equal(c.epoca.estado, "near");
  assert.equal(c.epoca.seta, "down");
  const longe = compararObras({ ...secreta, ano: 1250 }, secreta, cont); // séc. XIII
  assert.equal(longe.epoca.estado, "no");
  assert.equal(longe.epoca.seta, "up");
});

test("obra: país parecido é o mesmo continente; sem dado não compara", () => {
  assert.equal(compararObras({ ...secreta, pais: "Itália" }, secreta, cont).pais, "near");
  assert.equal(compararObras({ ...secreta, pais: "Brasil" }, secreta, cont).pais, "no");
  assert.equal(compararObras({ ...secreta, pais: null }, secreta, cont).pais, "nd");
  assert.equal(compararObras({ ...secreta, ano: null }, secreta, cont).epoca.estado, "nd");
});

test("obra: estilo compara também \"sem estilo\" (nenhum dos dois tem = igual)", () => {
  assert.equal(compararObras({ ...secreta, estilo: "Barroco" }, secreta, cont).estilo, "no");
  assert.equal(compararObras({ ...secreta, estilo: null }, secreta, cont).estilo, "no");
  assert.equal(compararObras(secreta, { ...secreta, estilo: null }, cont).estilo, "no");
  assert.equal(compararObras({ ...secreta, estilo: null }, { ...secreta, estilo: null }, cont).estilo, "ok");
});

test("caso: julga acerto, vizinho, erro e pulo", () => {
  const c = { answer: "a", near: { b: "porque" } };
  assert.equal(julgar(c, "a"), "ok");
  assert.equal(julgar(c, "b"), "near");
  assert.equal(julgar(c, "z"), "wrong");
  assert.equal(julgar(c, "__skip"), "skip");
  assert.equal(julgar(c, "toString"), "wrong"); // não confunde com propriedades do objeto
});

test("caso: pistas visíveis crescem com as tentativas e param em 5", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 9].map(pistasVisiveis), [1, 2, 3, 4, 5, 5, 5]);
});

const P = { groups: [{ lvl: 1, words: ["a", "b", "c", "d"] }, { lvl: 2, words: ["e", "f", "g", "h"] }, { lvl: 3, words: ["i", "j", "k", "l"] }, { lvl: 4, words: ["m", "n", "o", "p"] }] };

test("conexões: melhor grupo, erros e tentativa repetida", () => {
  assert.equal(melhorGrupo(P, ["a", "b", "c", "d"]), 4);
  assert.equal(melhorGrupo(P, ["a", "b", "c", "e"]), 3);
  assert.equal(erros(P, [["a", "b", "c", "d"], ["a", "b", "c", "e"], ["a", "e", "i", "m"]]), 2);
  assert.equal(repetida([["a", "b", "c", "d"]], ["d", "c", "b", "a"]), true);
});

test("compartilhamento: não revela termos nem nomes, só cores", () => {
  const g = grelhaConexoes(P, [["a", "e", "i", "m"], ["a", "b", "c", "d"]]);
  assert.equal(g, "🟨🟩🟦🟪\n🟨🟨🟨🟨");
  assert.doesNotMatch(g, /[a-z]/i);
  const caso = { answer: "x", near: { y: "p" } };
  assert.equal(grelhaCaso(caso, ["z", "y", "__skip", "x"]), "⬛🟧⬜🟩");
  const obras = { s: secreta, g: { ...secreta, id: "g", ano: 1680, pais: "Itália", estilo: "Barroco", autor: "Outro" } };
  const linha = grelhaObra({ answer: "s" }, obras, ["g", "s"], cont);
  assert.equal(linha, "🟩🟨🟨🟩⬛⬛\n🟩🟩🟩🟩🟩🟩");
  assert.equal(placarConexoes(P, { status: "won", attempts: [["a", "b", "c", "d"]] }), "sem erros");
  assert.equal(placarConexoes(P, { status: "lost", attempts: [] }), "X/4");
});

test("busca: ignora acentos e maiúsculas e acha por apelido", () => {
  const r = indexarRespostas([["o07", "Mudam-se os tempos, mudam-se as vontades", ["Camões"]], ["o35", "Medeia", ["Eurípides"]]]);
  assert.equal(buscar(r, "CAMOES")[0].id, "o07");
  assert.equal(buscar(r, "euripides")[0].id, "o35");
  assert.equal(buscar(r, "medéia")[0].id, "o35");
  assert.deepEqual(buscar(r, "med", ["o35"]), []);
});

test("progresso: sequência e estatísticas (motor reaproveitado)", () => {
  const dias = {
    "2026-10-14": { a: { status: "won" }, b: { status: "won" } },
    "2026-10-15": { a: { status: "won" }, b: { status: "lost" } },
    "2026-10-16": { a: { status: "won" }, b: { status: "playing" } },
  };
  assert.equal(sequenciaGlobal(dias, "2026-10-16", ["a", "b"]), 2); // hoje incompleto: conta até ontem
  const st = estatisticas(dias, "a", "2026-10-16", () => 0);
  assert.equal(st.jogados, 3);
  assert.equal(st.vitorias, 3);
  assert.equal(st.atual, 3);
});

import { opcoesDoCaso, N_OPCOES } from "../src/lib/caso.js";
test("caso: cartela tem 8 opções únicas, com a resposta e os vizinhos, igual para todos", () => {
  const materiaDe = Object.fromEntries(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((id) => [id, "Física"]));
  const caso = { id: "k1", materia: "Física", answer: "a", near: { b: "x", c: "y" } };
  const o = opcoesDoCaso(caso, materiaDe);
  assert.equal(o.length, N_OPCOES);
  assert.equal(new Set(o).size, N_OPCOES);
  for (const id of ["a", "b", "c"]) assert.ok(o.includes(id));
  assert.deepEqual(opcoesDoCaso(caso, materiaDe), o);
});
