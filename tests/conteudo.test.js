import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validarTudo, validarConexoes, validarCasos, validarObras } from "../scripts/validar-conteudo.mjs";
import { carregarConteudo } from "../src/content/index.js";

const lerJSON = (nome) => JSON.parse(readFileSync(new URL(`../src/content/${nome}.json`, import.meta.url), "utf8"));
const copia = (x) => JSON.parse(JSON.stringify(x));

test("conteúdo atual passa no validador", () => {
  const { contagem, erros } = validarTudo();
  assert.deepEqual(erros, []);
  assert.equal(contagem.conexoes, 86);
  assert.equal(contagem.casos, 89);
  assert.equal(contagem.puzzlesObra, 90);
});

test("validador pega termo repetido nas Conexões", () => {
  const d = copia(lerJSON("conexoes"));
  d.desafios[0].groups[1].words[0] = d.desafios[0].groups[0].words[0];
  assert.ok(validarConexoes(d).some((e) => e.includes("termo repetido")));
});

test("validador pega grupo sem origem no PAS", () => {
  const d = copia(lerJSON("conexoes"));
  d.desafios[2].groups[0].origem_pas = "";
  assert.ok(validarConexoes(d).some((e) => e.includes("falta origem_pas")));
});

test("validador pega pista que entrega a resposta", () => {
  const d = copia(lerJSON("caso"));
  d.casos[0].hints[1] = "É a gravitação universal, claro.";
  assert.ok(validarCasos(d).some((e) => e.includes("entrega a resposta")));
});

test("validador pega 'near' que aponta para resposta inexistente", () => {
  const d = copia(lerJSON("caso"));
  d.casos[3].near.nao_existe = "x";
  assert.ok(validarCasos(d).some((e) => e.includes("nao_existe")));
});

test("validador pega obra secreta sem dado para comparar e dica que entrega o título", () => {
  const d = copia(lerJSON("obras"));
  const col = d.colunas.indexOf("pais");
  const alvo = d.obras.find((o) => o[0] === d.puzzles[0].answer);
  alvo[col] = null;
  assert.ok(validarObras(d).some((e) => e.includes("não tem 'pais'")));
  const e = copia(lerJSON("obras"));
  e.puzzles[2].dicas[0] = "Leia a Apologia de Sócrates com calma.";
  assert.ok(validarObras(e).some((x) => x.includes("entrega a obra")));
});

test("as listas de obras: 69 no PAS 1 (oficial), todas com categoria conhecida", () => {
  const d = lerJSON("obras");
  const col = d.colunas.indexOf("etapas");
  assert.equal(d.obras.filter((o) => o[col].includes("PAS 1")).length, 69);
  assert.equal(d.obras.length, 173);
  const cats = new Set(d.obras.map((o) => o[3]));
  assert.deepEqual([...cats].sort(), ["Artes visuais", "Audiovisual", "Literatura", "Música", "Teatro", "Texto"]);
});

test("carregarConteudo monta os índices usados pela interface", async () => {
  const c = await carregarConteudo(async (nome) => lerJSON(nome));
  assert.equal(c.CONEX.length, 86);
  assert.equal(c.CASO.casos.length, 89);
  assert.ok(c.CASO.respostas.gravitacao);
  assert.equal(c.CASO.materiaDe.cerrado, "Geografia");
  assert.equal(c.OBRAS.lista.length, 173);
  assert.equal(c.OBRAS.porId.o10.autor, "Pero Vaz de Caminha");
  assert.ok(c.OBRAS.respostas.o07.al.includes("camoes"));
});
