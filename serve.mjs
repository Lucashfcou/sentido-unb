// Servidor estático mínimo para testar o protótipo, sem dependências.
// Uso: node serve.mjs [porta]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL(".", import.meta.url));
const porta = Number(process.argv[2]) || 5173;
const tipos = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  let caminho = normalize(decodeURIComponent(url.pathname));
  if (caminho.endsWith("/") || caminho === "\\") caminho = join(caminho, "index.html");
  const arquivo = join(raiz, caminho);
  if (!arquivo.startsWith(raiz) || /[\\/](\.git|node_modules|tests|scripts|docs)[\\/]/.test(arquivo)) {
    res.writeHead(403).end("proibido");
    return;
  }
  try {
    const dados = await readFile(arquivo);
    res.writeHead(200, { "Content-Type": tipos[extname(arquivo)] || "application/octet-stream", "Cache-Control": "no-store" }).end(dados);
  } catch {
    res.writeHead(404).end("não encontrado");
  }
}).listen(porta, () => console.log(`PAS Diário em http://localhost:${porta}`));
