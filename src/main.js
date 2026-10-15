// Arranque: carrega o conteúdo, liga o roteador por hash e abre a tela certa.
import { fx } from "./ui/fx.js";
import { carregarConteudo } from "./content/index.js";
import { C } from "./ctx.js";
import { PUZZLES, GAMES } from "./jogos.js";
import { S, salvar, registrarVisita } from "./state.js";
import { telaHub } from "./ui/hub.js";
import { telaConexoes } from "./ui/conexoes.js";
import { telaCaso } from "./ui/caso.js";
import { telaObra } from "./ui/obra.js";
import { telaAno } from "./ui/ano.js";
import { telaFormula } from "./ui/formula.js";
import { telaLugar } from "./ui/lugar.js";
import { regras } from "./ui/comum.js";
import { ICONE_AJUDA, ICONE_CHAMA } from "./icons.js";
import { abrirFolha, main, esc } from "./ui/dom.js";

const ler = (nome) => fetch(`./src/content/${nome}.json`).then((r) => {
  if (!r.ok) throw new Error(`${nome}.json: ${r.status}`);
  return r.json();
});

const TELAS = { conex: telaConexoes, caso: telaCaso, obra: telaObra, ano: telaAno, formula: telaFormula, lugar: telaLugar };

function rota() {
  const [gid, n] = (location.hash || "#hub").slice(1).split("/");
  const lista = PUZZLES[gid];
  if (TELAS[gid] && lista) {
    const idx = Math.max(0, Math.min(lista.length - 1, Number.parseInt(n, 10) || 0));
    TELAS[gid](idx);
    if (!S.store.seen[gid]) {
      S.store.seen[gid] = 1;
      salvar();
      fx.depoisDaAbertura(() => regras(gid));
    }
  } else telaHub();
  window.scrollTo(0, 0);
}

function sobre() {
  abrirFolha(`<h2 id="dlg-t">Sentido UnB (protótipo)</h2>
    <p>Minijogos diários para quem vai fazer o PAS da UnB. O conteúdo nasce da Matriz de Referência e das listas de obras publicadas pelo PAS/Cebraspe.</p>
    <p>Sem cadastro e sem anúncios: o seu progresso fica só neste aparelho.</p>
    <p class="nota">Tudo aqui é rascunho e ainda não foi revisado por professores. Projeto independente: não é material oficial da UnB nem do Cebraspe.</p>`);
}

async function iniciar() {
  document.getElementById("home").onclick = () => (location.hash = "hub");
  document.getElementById("btn-help").innerHTML = ICONE_AJUDA;
  document.getElementById("chama").innerHTML = ICONE_CHAMA;
  document.getElementById("btn-help").onclick = sobre;
  try {
    const c = await carregarConteudo(ler);
    C.CONEX = c.CONEX;
    C.CASO = c.CASO;
    C.OBRAS = c.OBRAS;
    C.HIST = c.HIST;
    C.FORM = c.FORM;
    C.LUGARES = c.LUGARES;
    PUZZLES.conex = c.CONEX;
    PUZZLES.caso = c.CASO.casos;
    PUZZLES.obra = c.OBRAS.puzzles;
    PUZZLES.ano = c.HIST;
    PUZZLES.formula = c.FORM;
    PUZZLES.lugar = c.LUGARES.puzzles;
  } catch (e) {
    main.innerHTML = `<div class="panel"><h2>Não deu para carregar o conteúdo</h2><p>${esc(e.message)}</p><p>Se você abriu o arquivo direto (file://), use um servidor local: <code>node serve.mjs</code>.</p></div>`;
    return;
  }
  void GAMES;
  registrarVisita();
  window.addEventListener("hashchange", rota);
  rota();
}

iniciar();
