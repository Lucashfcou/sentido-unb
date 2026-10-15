// Monta a pasta "site/" com só o que vai para a hospedagem (Vercel ou outra estática).
// Uso: node scripts/montar-site.mjs   (não precisa instalar nada)
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const saida = join(raiz, "site");
rmSync(saida, { recursive: true, force: true });
mkdirSync(saida, { recursive: true });
for (const item of ["index.html", "src", "professores", "revisao"]) {
  if (existsSync(join(raiz, item))) cpSync(join(raiz, item), join(saida, item), { recursive: true });
}
console.log("site/ pronto: index.html, src/, professores/, revisao/");
