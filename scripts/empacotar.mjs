// Empacota o protótipo em UM arquivo HTML (CSS, JS e JSON embutidos) para abrir no celular.
// Uso: node scripts/empacotar.mjs   ->  previa/pas-diario-previa.html
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const src = join(raiz, "src");
const ler = (p) => readFileSync(p, "utf8");

const IMPORT = /^import\s+(?:\{([^}]*)\}\s*from\s*)?["']([^"']+)["'];?[ \t]*$/gm;
const EXPORT_DECL = /^export\s+((?:async\s+)?(?:function|const|let|class)\s+)([A-Za-z_$][\w$]*)/gm;

const modulos = new Map(); // id -> { codigo, deps, nomes }
const ordem = [];

function carregar(caminho) {
  const id = relative(src, caminho).replace(/\\/g, "/");
  if (modulos.has(id)) return id;
  let codigo = ler(caminho);
  const deps = [];
  codigo = codigo.replace(IMPORT, (_, nomes, spec) => {
    const alvo = normalize(join(dirname(caminho), spec));
    const dep = carregar(alvo);
    deps.push(dep);
    const lista = (nomes || "").split(",").map((s) => s.trim()).filter(Boolean).map((s) => s.replace(/\s+as\s+/, ": "));
    return lista.length ? `const { ${lista.join(", ")} } = __m[${JSON.stringify(dep)}];` : "";
  });
  const nomes = [];
  codigo = codigo.replace(EXPORT_DECL, (_, tipo, nome) => {
    nomes.push(nome);
    return `${tipo}${nome}`;
  });
  if (/^export\s/m.test(codigo)) throw new Error(`${id}: export não suportado pelo empacotador`);
  modulos.set(id, { codigo, deps, nomes });
  ordem.push(id);
  return id;
}

carregar(join(src, "main.js"));

const json = {};
for (const n of ["conexoes", "caso", "obras", "historia", "formulas", "lugares"]) json[n] = JSON.parse(ler(join(src, "content", `${n}.json`)));

let js = `"use strict";\nconst __m = {};\nconst __JSON = ${JSON.stringify(json).replace(/<\/(script)/gi, "<\\/$1")};\n`;
for (const id of ordem) {
  let { codigo, nomes } = modulos.get(id);
  if (id === "main.js") {
    // no arquivo único não há fetch: o conteúdo já vem embutido
    codigo = codigo.replace(/const ler = \(nome\) => fetch[\s\S]*?\r?\n\}\);\r?\n/, "const ler = (nome) => Promise.resolve(__JSON[nome]);\n");
    if (!codigo.includes("__JSON")) throw new Error("não achei o carregador de conteúdo em main.js");
  }
  js += `\n// ---- ${id}\n__m[${JSON.stringify(id)}] = (() => {\n${codigo}\nreturn { ${nomes.join(", ")} };\n})();\n`;
}

const b64 = (f) => readFileSync(join(src, "fonts", f)).toString("base64");
const fontesCss = `@font-face { font-family: "Overpass"; font-weight: 100 900; font-display: swap; src: url(data:font/woff2;base64,${b64("overpass-latin.woff2")}) format("woff2"); }
@font-face { font-family: "Doto"; font-weight: 100 900; font-display: swap; src: url(data:font/woff2;base64,${b64("doto-latin.woff2")}) format("woff2"); }
`;
let css = fontesCss + ler(join(src, "styles/app.css")) + "\n" + ler(join(src, "styles/jogos2.css"));
// cópia do tema escuro para quando o visualizador define data-theme="dark"
const escuros = [...css.matchAll(/@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{([^}]*)\}\s*\}/g)].map((m) => m[1]);
css += `\n:root[data-theme="dark"] {${escuros.join("\n")} color-scheme: dark; }\n`;
css = css.replace(/(:root:not\(\[data-theme="light"\]\) \{)/g, "$1 color-scheme: dark;");
css += `
/* gutter lateral seguro para o visualizador */
body { padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.top, main, .foot { padding-left: 0; padding-right: 0; }
`;

const html = ler(join(raiz, "index.html"));
const corpo = html.match(/<body>([\s\S]*?)<script type="module"/)[1].trim();
const icone = html.match(/<link rel="icon"[^>]*>/)[0];

const saida = `<title>Sentido UnB</title>
<meta name="claude:viewport-fit-sides" content="cover">
${icone}
<style>
${css}
</style>
${corpo}
<script>
globalThis.__MOSTRAR_TODAS = true;
${js}
</script>
`;
mkdirSync(join(raiz, "previa"), { recursive: true });
const destino = join(raiz, "previa/pas-diario-previa.html");
writeFileSync(destino, saida);
console.log(`previa/pas-diario-previa.html: ${(saida.length / 1024).toFixed(0)} KB, ${ordem.length} módulos`);
