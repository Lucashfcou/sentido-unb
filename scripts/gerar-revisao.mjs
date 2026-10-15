// Gera o pacote de revisão para professores em revisao/ (CSV para Excel e HTML para ler no celular).
// Uso: node scripts/gerar-revisao.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const lerJSON = (nome) => JSON.parse(readFileSync(new URL(`../src/content/${nome}.json`, import.meta.url), "utf8"));
const cx = lerJSON("conexoes");
const cs = lerJSON("caso");
const ob = lerJSON("obras");
const hi = lerJSON("historia");
const fo = lerJSON("formulas");
const lu = lerJSON("lugares");
const nomeCaso = Object.fromEntries(cs.respostas.map(([id, nome]) => [id, nome]));
const obras = Object.fromEntries(ob.obras.map((r) => [r[0], Object.fromEntries(ob.colunas.map((c, i) => [c, r[i]]))]));
const sn = (b) => (b ? "sim" : "não");

const COLUNAS_PUZZLES = ["jogo", "id", "etapa", "item", "resposta", "explicacao", "origem_pas", "fonte", "verificar", "ok_ou_erro", "comentario"];
const puzzles = [];

for (const d of cx.desafios) {
  for (const g of d.groups) {
    puzzles.push({
      jogo: "Conexões PAS", id: `${d.id} / nível ${g.lvl}`, etapa: d.etapa, item: `Grupo: ${g.name}`, resposta: g.words.join(" | "),
      explicacao: g.explain, origem_pas: g.origem_pas, fonte: g.fonte, verificar: sn(g.verificar),
    });
  }
}
for (const c of cs.casos) {
  puzzles.push({
    jogo: `Caso do Dia (${c.materia})`, id: c.id, etapa: c.etapa,
    item: c.hints.map((h, i) => `Pista ${i + 1}: ${h}`).join("\n"),
    resposta: nomeCaso[c.answer] + (Object.keys(c.near).length ? `\n\nConceitos vizinhos aceitos como "quase":\n${Object.entries(c.near).map(([k, v]) => `- ${nomeCaso[k]}: ${v}`).join("\n")}` : ""),
    explicacao: c.explain, origem_pas: c.origem_pas, fonte: c.fonte, verificar: sn(c.verificar),
  });
}
for (const p of ob.puzzles) {
  const o = obras[p.answer];
  puzzles.push({
    jogo: "Qual é a obra?", id: p.id, etapa: p.etapa,
    item: `Dicas:\n${p.dicas.map((d, i) => `${i + 1}. ${d}`).join("\n")}`,
    resposta: `${o.titulo} (${o.autor})`, explicacao: p.explain, origem_pas: p.origem_pas, fonte: p.fonte, verificar: sn(p.verificar),
  });
}

for (const e of hi.eventos) {
  const ano = e.ano < 0 ? `${-e.ano} a.C.` : String(e.ano);
  puzzles.push({
    jogo: `Que ano foi? (${e.materia})`, id: e.id, etapa: e.etapa,
    item: `Cena: ${e.cena}
Dica 1: ${e.dicas[0]}
Dica 2: ${e.dicas[1]}`,
    resposta: ano, explicacao: e.explain, origem_pas: e.origem_pas, fonte: e.fonte, verificar: sn(e.verificar),
  });
}
for (const f of fo.puzzles) {
  puzzles.push({
    jogo: `Fórmula misteriosa (${f.materia})`, id: f.id, etapa: f.etapa,
    item: `${f.nome}
Legenda: ${f.legenda}
Peças de distração: ${f.extras.join("  ")}`,
    resposta: f.tokens.join(" "), explicacao: f.explain, origem_pas: f.origem_pas, fonte: f.fonte, verificar: sn(f.verificar),
  });
}
const lugarPorId = Object.fromEntries(lu.lugares.map((r) => [r[0], Object.fromEntries(lu.colunas.map((c, i) => [c, r[i]]))]));
for (const p of lu.puzzles) {
  const l = lugarPorId[p.answer];
  puzzles.push({
    jogo: "Onde fica?", id: p.id, etapa: p.etapa,
    item: `${p.enunciado}
Dica 1: ${p.dicas[0]}
Dica 2: ${p.dicas[1]}`,
    resposta: `${l.nome}, ${l.pais} (lat ${l.lat}, lon ${l.lon}; coordenada aproximada)`, explicacao: p.explain, origem_pas: p.origem_pas, fonte: p.fonte, verificar: sn(p.verificar),
  });
}

const COLUNAS_OBRAS = ["id", "etapas", "titulo", "autor", "categoria", "ano_aproximado", "pais", "forma", "estilo", "verificar", "ok_ou_erro", "comentario"];
const listaObras = ob.obras.map((r) => {
  const o = Object.fromEntries(ob.colunas.map((c, i) => [c, r[i]]));
  return { id: o.id, etapas: (o.etapas || []).join(", "), titulo: o.titulo, autor: o.autor, categoria: o.categoria, ano_aproximado: o.ano ?? "", pais: o.pais ?? "", forma: o.forma, estilo: o.estilo ?? "", verificar: sn(o.v) };
});

const csvCelula = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const csv = (cols, linhas) => "﻿" + [cols.join(";"), ...linhas.map((l) => cols.map((c) => csvCelula(l[c])).join(";"))].join("\r\n") + "\r\n";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>");
const tabela = (cols, linhas, titulos) =>
  `<div class="rolagem"><table><thead><tr>${cols.map((c) => `<th>${esc(titulos[c] || c)}</th>`).join("")}</tr></thead><tbody>${linhas
    .map((l) => `<tr>${cols.map((c) => `<td${c === "ok_ou_erro" || c === "comentario" ? ' class="preencher"' : ""}>${esc(l[c])}</td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;
const titulos = { jogo: "Jogo", id: "Id", etapa: "Etapa", item: "Item", resposta: "Resposta", explicacao: "Explicação", origem_pas: "Origem no PAS", fonte: "Fonte", verificar: "A verificar?", ok_ou_erro: "OK ou erro", comentario: "Comentário", titulo: "Título", autor: "Autor", categoria: "Categoria", ano_aproximado: "Ano (aprox.; negativo = a.C.)", pais: "País", forma: "Forma", estilo: "Estilo", etapas: "Etapa(s)" };

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PAS Diário: pacote de revisão</title>
<style>body{font:15px/1.45 system-ui,sans-serif;margin:16px;max-width:1200px;color:#1b1f27}h1,h2{line-height:1.2}table{border-collapse:collapse;width:100%;min-width:900px}th,td{border:1px solid #ccc;padding:6px 8px;vertical-align:top;text-align:left}th{background:#f0ede4;position:sticky;top:0}.rolagem{overflow-x:auto}.preencher{background:#fffbe6;min-width:120px}.aviso{background:#fff4d6;border:1px solid #e5c76b;padding:10px 12px;border-radius:8px}</style></head><body>
<h1>PAS Diário: pacote de revisão (rascunho)</h1>
<p class="aviso"><b>Como revisar.</b> Em cada linha, preencha "OK ou erro" e, se houver erro, diga o que corrigir. Onde está "A verificar? sim", há fato que não vem do PAS (data, biografia, classificação) e precisa de confirmação. A coluna "Origem no PAS" mostra o trecho da Matriz ou da lista de obras que justifica o item. Itens sem origem não entram. Nenhum conteúdo foi copiado de provas do Cebraspe ou do Inep.</p>
<h2>1. Puzzles (${puzzles.length} linhas)</h2>${tabela(COLUNAS_PUZZLES, puzzles, titulos)}
<h2>2. Atributos das ${listaObras.length} obras do PAS 1 (usados no "Qual é a obra?")</h2>
<p>Esses dados (ano, país, forma, estilo) não vêm do PAS: são do redator. Confira principalmente os marcados "sim".</p>${tabela(COLUNAS_OBRAS, listaObras, titulos)}
</body></html>`;

mkdirSync(new URL("../revisao/", import.meta.url), { recursive: true });
writeFileSync(new URL("../revisao/revisao-puzzles.csv", import.meta.url), csv(COLUNAS_PUZZLES, puzzles));
writeFileSync(new URL("../revisao/revisao-obras.csv", import.meta.url), csv(COLUNAS_OBRAS, listaObras));
writeFileSync(new URL("../revisao/pacote-de-revisao.html", import.meta.url), html);
console.log(`revisao/: ${puzzles.length} linhas de puzzles, ${listaObras.length} obras. Arquivos: revisao-puzzles.csv, revisao-obras.csv, pacote-de-revisao.html`);
