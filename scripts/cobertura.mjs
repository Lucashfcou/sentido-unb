// Quantos puzzles cada jogo tem em cada etapa, e quantos dias de lote isso cobre. Uso: node scripts/cobertura.mjs
import { readFileSync } from "node:fs";
import { etapasDe } from "../src/lib/etapa.js";

const lerJSON = (nome) => JSON.parse(readFileSync(new URL(`../src/content/${nome}.json`, import.meta.url), "utf8"));
const jogos = {
  "Conexões PAS": lerJSON("conexoes").desafios,
  "Caso do Dia": lerJSON("caso").casos,
  "Qual é a obra?": lerJSON("obras").puzzles,
  "Que ano foi?": lerJSON("historia").eventos,
  "Fórmula misteriosa": lerJSON("formulas").puzzles,
  "Onde fica? (fora do lote)": lerJSON("lugares").puzzles,
};
const META = 30;

export function cobertura() {
  return Object.entries(jogos).map(([nome, itens]) => ({
    nome,
    porEtapa: [1, 2, 3].map((n) => itens.filter((p) => etapasDe(p.etapa).includes(n)).length),
  }));
}

if (process.argv[1] && process.argv[1].endsWith("cobertura.mjs")) {
  console.log(`| Jogo | PAS 1 | PAS 2 | PAS 3 |\n| --- | --- | --- | --- |`);
  for (const { nome, porEtapa } of cobertura()) {
    console.log(`| ${nome} | ${porEtapa.map((k) => `${k}${k >= META ? "" : ` (faltam ${META - k})`}`).join(" | ")} |`);
  }
  console.log(`\nMeta do lote: ${META} dias por jogo e por etapa. Abaixo da meta, a lista recomeça antes de 30 dias.`);
}
