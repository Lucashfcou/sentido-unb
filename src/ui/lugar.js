// Onde fica?: distância, direção e proximidade até o lugar certo.
import { PUZZLES } from "../jogos.js";
import { C } from "../ctx.js";
import { estado, salvar, concluir } from "../state.js";
import { comparar } from "../lib/geo.js";
import { grelhaLugar, montarTexto } from "../lib/partilha.js";
import { SIM } from "../icons.js";
import { $, main, esc, pintar, focarCampo } from "./dom.js";
import { cabecalho, ligarCabecalho, painelResultado, ligarResultado, frase } from "./comum.js";
import { campoBusca, ligarBusca } from "./busca.js";

const MAX = 6;
const km = (v) => `${Math.round(v).toLocaleString("pt-BR")} km`;

function bussola(graus) {
  return `<svg class="bussola" viewBox="0 0 24 24" aria-hidden="true" style="transform:rotate(${Math.round(graus)}deg)"><path d="M12 2l6 11h-4.2v9h-3.6v-9H6z"/></svg>`;
}

export function telaLugar(idx) {
  const P = PUZZLES.lugar[idx];
  const L = C.LUGARES;
  const certo = L.porId[P.answer];
  const s = estado("lugar", P.id);
  const fim = s.status !== "playing";
  const n = s.guesses.length;
  const ganhou = s.status === "won";
  const tipo = ganhou ? (n <= 3 ? "ok" : "near") : "wrong";
  const liberadas = fim ? P.dicas.length : n >= 5 ? 2 : n >= 3 ? 1 : 0;
  const dicas = P.dicas.slice(0, liberadas).map((d, i) => `<li><b>Dica ${i + 1}:</b> ${esc(d)}</li>`).join("");

  const linhas = [...s.guesses]
    .reverse()
    .map((id) => {
      const g = L.porId[id];
      const c = comparar(g, certo);
      const onde = c.direcao ? `${km(c.km)} a ${c.direcao.nome}` : "é aqui";
      return `<li class="palplug ${c.km < 1 ? "ok" : ""}">
        <span class="bus">${c.direcao ? bussola(c.graus) : SIM.ok}</span>
        <span class="lt"><b>${esc(g.nome)}</b><small>${esc(g.pais)}</small><span class="onde">${esc(onde)}</span></span>
        <span class="prox" role="img" aria-label="Proximidade ${c.proximidade} de 100"><i style="width:${c.proximidade}%"></i><em>${c.proximidade}%</em></span>
      </li>`;
    })
    .join("");

  const entrada = fim
    ? ""
    : `${campoBusca("Digite uma cidade ou local…", "Seu palpite de lugar")}<p class="meta pequeno">Você tem ${MAX - n} ${MAX - n === 1 ? "palpite" : "palpites"}. A próxima dica abre ${n < 3 ? "depois de 3 palpites" : n < 5 ? "depois de 5 palpites" : "agora"}.</p>`;

  const resultado = fim
    ? painelResultado({
        gid: "lugar", idx, venceu: ganhou,
        titulo: certo.nome,
        veredito: ganhou ? `Acertou em ${n}/${MAX}.` : `Não foi desta. Era ${certo.nome}, ${certo.pais}.`,
        humor: frase("lugar", tipo, idx),
        corpo: `<p>${esc(P.explain)}</p>`,
        origem: P.origem_pas, fonte: P.fonte, verificar: P.verificar || certo.v,
      })
    : "";

  pintar(`<div class="game">
    ${cabecalho("lugar", idx)}
    <p class="tema">${esc(P.etapa)}</p>
    <div class="triesrow"><div class="tries" aria-hidden="true">${Array.from({ length: MAX }, (_, i) => `<i class="${i < n ? (s.guesses[i] === P.answer ? "ok" : "bad") : ""}"></i>`).join("")}</div><span>${n}/${MAX} palpites</span></div>
    <blockquote class="cena">${esc(P.enunciado)}</blockquote>
    ${dicas ? `<ul class="dicas">${dicas}</ul>` : ""}
    ${entrada}
    ${linhas ? `<ul class="palpslug" aria-label="Seus palpites">${linhas}</ul>` : ""}
    ${resultado}
  </div>`);
  ligarCabecalho("lugar");

  const registrar = (id) => {
    s.guesses.push(id);
    if (id === P.answer) s.status = "won";
    else if (s.guesses.length >= MAX) s.status = "lost";
    if (s.status !== "playing") concluir("lugar", P.id, s.status === "won");
    salvar();
    telaLugar(idx);
    if (s.status === "playing") focarCampo($("#q", main));
  };

  if (!fim) {
    ligarBusca({
      input: $("#q", main), lista: $("#lista", main), respostas: L.respostas,
      excluir: () => s.guesses, extra: (a) => L.porId[a.id].pais, aoEscolher: registrar,
    });
    focarCampo($("#q", main));
  } else {
    ligarResultado("lugar", idx, montarTexto({
      jogo: "Onde fica?", numero: idx + 1, placar: ganhou ? `${n}/${MAX}` : `X/${MAX}`, grade: grelhaLugar(L.porId, P.answer, s.guesses), frase: frase("lugar", tipo, idx),
    }));
  }
}
