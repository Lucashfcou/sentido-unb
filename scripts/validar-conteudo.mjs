// Validador do conteúdo. Uso: node scripts/validar-conteudo.mjs
// Garante estrutura, origem no PAS em cada item e ausência de spoiler nas pistas.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { normalizar } from "../src/lib/texto.js";
import { etapasDe } from "../src/lib/etapa.js";

const lerJSON = (nome) => JSON.parse(readFileSync(new URL(`../src/content/${nome}.json`, import.meta.url), "utf8"));
const texto = (v) => typeof v === "string" && v.trim().length > 0;

export function validarConexoes(dados) {
  const erros = [];
  const ids = new Set();
  for (const d of dados.desafios) {
    const at = `conexões ${d.id}`;
    if (ids.has(d.id)) erros.push(`${at}: id repetido`);
    ids.add(d.id);
    if (!texto(d.etapa) || !texto(d.tema)) erros.push(`${at}: falta etapa ou tema`);
    if (d.groups.length !== 4) erros.push(`${at}: precisa de 4 grupos`);
    const niveis = d.groups.map((g) => g.lvl).sort().join("");
    if (niveis !== "1234") erros.push(`${at}: níveis devem ser 1, 2, 3 e 4`);
    const todos = d.groups.flatMap((g) => g.words);
    if (todos.length !== 16) erros.push(`${at}: precisa de 16 termos (tem ${todos.length})`);
    if (new Set(todos.map(normalizar)).size !== todos.length) erros.push(`${at}: termo repetido`);
    for (const g of d.groups) {
      if (g.words.length !== 4) erros.push(`${at} / ${g.name}: precisa de 4 termos`);
      for (const c of ["name", "explain", "origem_pas", "fonte"]) if (!texto(g[c])) erros.push(`${at} / ${g.name}: falta ${c}`);
      if (typeof g.verificar !== "boolean") erros.push(`${at} / ${g.name}: 'verificar' deve ser true ou false`);
    }
  }
  return erros;
}

export function validarCasos(dados) {
  const erros = [];
  const resp = new Map(dados.respostas.map(([id, nome, materia]) => [id, { nome, materia }]));
  if (resp.size !== dados.respostas.length) erros.push("caso: ids repetidos em 'respostas'");
  const ids = new Set();
  for (const c of dados.casos) {
    const at = `caso ${c.id}`;
    if (ids.has(c.id)) erros.push(`${at}: id repetido`);
    ids.add(c.id);
    const r = resp.get(c.answer);
    if (!r) {
      erros.push(`${at}: resposta '${c.answer}' não está em 'respostas'`);
      continue;
    }
    if (r.materia !== c.materia) erros.push(`${at}: matéria '${c.materia}' difere da matéria da resposta ('${r.materia}')`);
    if (c.hints.length !== 5 || !c.hints.every(texto)) erros.push(`${at}: precisa de 5 pistas preenchidas`);
    // As 4 primeiras pistas não podem conter o nome da resposta.
    const nome = normalizar(r.nome);
    c.hints.slice(0, 4).forEach((h, i) => {
      if (normalizar(h).includes(nome)) erros.push(`${at}: a pista ${i + 1} entrega a resposta`);
    });
    for (const [id, porque] of Object.entries(c.near)) {
      if (!resp.has(id)) erros.push(`${at}: 'near' cita '${id}', que não existe`);
      if (id === c.answer) erros.push(`${at}: 'near' contém a própria resposta`);
      if (!texto(porque)) erros.push(`${at}: 'near' sem explicação para '${id}'`);
    }
    for (const k of ["explain", "origem_pas", "fonte", "etapa"]) if (!texto(c[k])) erros.push(`${at}: falta ${k}`);
    if (typeof c.verificar !== "boolean") erros.push(`${at}: 'verificar' deve ser true ou false`);
  }
  return erros;
}

export function validarObras(dados) {
  const erros = [];
  const lista = dados.obras.map((r) => Object.fromEntries(dados.colunas.map((c, i) => [c, r[i]])));
  const porId = new Map();
  for (const o of lista) {
    if (porId.has(o.id)) erros.push(`obra ${o.id}: id repetido`);
    porId.set(o.id, o);
    for (const c of ["titulo", "autor", "categoria", "forma"]) if (!texto(o[c])) erros.push(`obra ${o.id}: falta ${c}`);
    if (o.ano !== null && !Number.isInteger(o.ano)) erros.push(`obra ${o.id}: ano deve ser inteiro ou null`);
    if (o.pais !== null && !dados.continentes[o.pais]) erros.push(`obra ${o.id}: país '${o.pais}' sem continente em 'continentes'`);
    if (!Array.isArray(o.apelidos)) erros.push(`obra ${o.id}: 'apelidos' deve ser lista`);
    if (typeof o.v !== "boolean") erros.push(`obra ${o.id}: 'v' deve ser true ou false`);
    if (!Array.isArray(o.etapas) || !o.etapas.length || !o.etapas.every((e) => [1, 2, 3].includes(etapasDe(e)[0]))) erros.push(`obra ${o.id}: 'etapas' inválido`);
  }
  const ids = new Set();
  for (const p of dados.puzzles) {
    const at = `puzzle ${p.id}`;
    if (ids.has(p.id)) erros.push(`${at}: id repetido`);
    ids.add(p.id);
    const o = porId.get(p.answer);
    if (!o) {
      erros.push(`${at}: obra '${p.answer}' não existe`);
      continue;
    }
    // A obra secreta precisa ter o que comparar.
    for (const c of ["categoria", "ano", "pais", "forma"]) if (o[c] === null) erros.push(`${at}: a obra secreta não tem '${c}' (nada para comparar)`);
    if (!(o.etapas || []).some((e) => etapasDe(e).some((n) => etapasDe(p.etapa).includes(n)))) erros.push(`${at}: a obra secreta não está na lista da etapa do puzzle (${p.etapa})`);
    if (p.dicas.length !== 5 || !p.dicas.every(texto)) erros.push(`${at}: precisa de 5 dicas`);
    const nomes = [o.titulo, ...o.apelidos].map(normalizar).filter((n) => n.length > 3);
    p.dicas.slice(0, 4).forEach((d, i) => {
      if (nomes.some((n) => normalizar(d).includes(n))) erros.push(`${at}: a dica ${i + 1} entrega a obra`);
    });
    for (const k of ["explain", "origem_pas", "fonte", "etapa"]) if (!texto(p[k])) erros.push(`${at}: falta ${k}`);
    if (typeof p.verificar !== "boolean") erros.push(`${at}: 'verificar' deve ser true ou false`);
  }
  return erros;
}

/** O ano (em valor absoluto) não pode aparecer escrito na cena, nas dicas nem na pista de século. */
export function validarHistoria(dados) {
  const erros = [];
  const ids = new Set();
  for (const e of dados.eventos) {
    const at = `evento ${e.id}`;
    if (ids.has(e.id)) erros.push(`${at}: id repetido`);
    ids.add(e.id);
    if (!Number.isInteger(e.ano) || e.ano === 0) erros.push(`${at}: ano inválido (inteiro, sem ano zero)`);
    if (!texto(e.cena)) erros.push(`${at}: falta cena`);
    if (e.dicas.length !== 2 || !e.dicas.every(texto)) erros.push(`${at}: precisa de 2 dicas`);
    const digitos = String(Math.abs(e.ano));
    for (const [nome, t] of [["cena", e.cena], ...e.dicas.map((d, i) => [`dica ${i + 1}`, d])]) {
      if (new RegExp(`(^|\\D)${digitos}(\\D|$)`).test(t)) erros.push(`${at}: ${nome} entrega o ano`);
    }
    for (const k of ["materia", "etapa", "explain", "origem_pas", "fonte"]) if (!texto(e[k])) erros.push(`${at}: falta ${k}`);
    if (typeof e.verificar !== "boolean") erros.push(`${at}: 'verificar' deve ser true ou false`);
  }
  return erros;
}

export function validarFormulas(dados) {
  const erros = [];
  const ids = new Set();
  for (const p of dados.puzzles) {
    const at = `fórmula ${p.id}`;
    if (ids.has(p.id)) erros.push(`${at}: id repetido`);
    ids.add(p.id);
    if (p.tokens.length < 4 || p.tokens.length > 9) erros.push(`${at}: use de 4 a 9 peças (tem ${p.tokens.length})`);
    if (!p.tokens.includes("=")) erros.push(`${at}: a fórmula precisa do sinal de igual`);
    if (p.extras.length < 4) erros.push(`${at}: precisa de pelo menos 4 peças de distração`);
    for (const x of p.extras) if (p.tokens.includes(x)) erros.push(`${at}: a peça de distração '${x}' também está na fórmula`);
    if (!Array.isArray(p.variaveis) || !p.variaveis.length) erros.push(`${at}: falta 'variaveis'`);
    for (const k of ["nome", "legenda", "js", "materia", "etapa", "explain", "origem_pas", "fonte"]) if (!texto(p[k])) erros.push(`${at}: falta ${k}`);
    if (![1, 2, 3].includes(p.nivel)) erros.push(`${at}: nível deve ser 1, 2 ou 3`);
    if (typeof p.verificar !== "boolean") erros.push(`${at}: 'verificar' deve ser true ou false`);
  }
  return erros;
}

export function validarLugares(dados) {
  const erros = [];
  const lugares = dados.lugares.map((r) => Object.fromEntries(dados.colunas.map((c, i) => [c, r[i]])));
  const porId = new Map();
  for (const l of lugares) {
    if (porId.has(l.id)) erros.push(`lugar ${l.id}: id repetido`);
    porId.set(l.id, l);
    if (!(l.lat >= -90 && l.lat <= 90 && l.lon >= -180 && l.lon <= 180)) erros.push(`lugar ${l.id}: coordenada fora do intervalo`);
    for (const c of ["nome", "pais", "continente"]) if (!texto(l[c])) erros.push(`lugar ${l.id}: falta ${c}`);
  }
  const ids = new Set();
  for (const p of dados.puzzles) {
    const at = `puzzle de lugar ${p.id}`;
    if (ids.has(p.id)) erros.push(`${at}: id repetido`);
    ids.add(p.id);
    const l = porId.get(p.answer);
    if (!l) {
      erros.push(`${at}: lugar '${p.answer}' não existe`);
      continue;
    }
    if (l.so_palpite) erros.push(`${at}: '${p.answer}' é só opção de palpite`);
    if (p.dicas.length !== 2 || !p.dicas.every(texto)) erros.push(`${at}: precisa de 2 dicas`);
    const nome = normalizar(l.nome.replace(/\s*\(.*\)/, ""));
    for (const [rot, t] of [["enunciado", p.enunciado], ...p.dicas.map((d, i) => [`dica ${i + 1}`, d])]) {
      if (nome.length > 3 && normalizar(t).includes(nome)) erros.push(`${at}: ${rot} entrega o lugar`);
    }
    for (const k of ["enunciado", "explain", "origem_pas", "fonte", "etapa"]) if (!texto(p[k])) erros.push(`${at}: falta ${k}`);
    if (typeof p.verificar !== "boolean") erros.push(`${at}: 'verificar' deve ser true ou false`);
  }
  return erros;
}

/** Toda etapa lida de um puzzle precisa ser reconhecida (PAS 1, 2 ou 3). */
function validarEtapas(nome, itens) {
  const erros = [];
  for (const p of itens) if (!etapasDe(p.etapa).length) erros.push(`${nome} ${p.id}: etapa '${p.etapa}' não reconhecida`);
  return erros;
}

/** Cada jogo precisa de pelo menos MIN_POR_ETAPA puzzles em cada etapa. */
export const MIN_POR_ETAPA = 3;
function validarCobertura(jogos) {
  const erros = [];
  for (const [nome, itens] of Object.entries(jogos)) {
    for (const n of [1, 2, 3]) {
      const k = itens.filter((p) => etapasDe(p.etapa).includes(n)).length;
      if (k < MIN_POR_ETAPA) erros.push(`${nome}: só ${k} puzzle(s) para o PAS ${n} (mínimo ${MIN_POR_ETAPA})`);
    }
  }
  return erros;
}

export function validarTudo() {
  const cx = lerJSON("conexoes");
  const cs = lerJSON("caso");
  const ob = lerJSON("obras");
  const hi = lerJSON("historia");
  const fo = lerJSON("formulas");
  const lu = lerJSON("lugares");
  return {
    contagem: {
      conexoes: cx.desafios.length, casos: cs.casos.length, respostasCaso: cs.respostas.length, obras: ob.obras.length, puzzlesObra: ob.puzzles.length,
      eventos: hi.eventos.length, formulas: fo.puzzles.length, lugares: lu.lugares.length, puzzlesLugar: lu.puzzles.length,
    },
    erros: [
      ...validarConexoes(cx), ...validarCasos(cs), ...validarObras(ob), ...validarHistoria(hi), ...validarFormulas(fo), ...validarLugares(lu),
      ...validarEtapas("conexões", cx.desafios), ...validarEtapas("caso", cs.casos), ...validarEtapas("obra", ob.puzzles),
      ...validarEtapas("evento", hi.eventos), ...validarEtapas("fórmula", fo.puzzles), ...validarEtapas("lugar", lu.puzzles),
      ...validarCobertura({ "Conexões PAS": cx.desafios, "Caso do Dia": cs.casos, "Qual é a obra?": ob.puzzles, "Que ano foi?": hi.eventos, "Fórmula misteriosa": fo.puzzles, "Onde fica?": lu.puzzles }),
    ],
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { contagem, erros } = validarTudo();
  console.log("Conteúdo:", JSON.stringify(contagem));
  if (erros.length) {
    console.error(`\n${erros.length} problema(s):`);
    for (const e of erros) console.error(" - " + e);
    process.exit(1);
  }
  console.log("Validador: tudo certo.");
}
