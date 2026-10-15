// Que ano foi?: mais cedo ou mais tarde, com faixas de distância e dicas que se abrem.
import { PUZZLES } from "../jogos.js";
import { estado, salvar, concluir } from "../state.js";
import { compararAno, formatarAno, lerAno } from "../lib/historia.js";
import { grelhaAno, montarTexto } from "../lib/partilha.js";
import { SIM } from "../icons.js";
import { $, main, esc, pintar, toast, focarCampo } from "./dom.js";
import { cabecalho, ligarCabecalho, painelResultado, ligarResultado, frase } from "./comum.js";

const MAX = 6;

export function telaAno(idx) {
  const P = PUZZLES.ano[idx];
  const s = estado("ano", P.id);
  const fim = s.status !== "playing";
  const n = s.guesses.length;
  const ganhou = s.status === "won";
  const tipo = ganhou ? (n <= 3 ? "ok" : "near") : "wrong";
  const liberadas = fim ? P.dicas.length : n >= 4 ? 2 : n >= 2 ? 1 : 0;

  const dicas = P.dicas.slice(0, liberadas).map((d, i) => `<li><b>Dica ${i + 1}:</b> ${esc(d)}</li>`).join("");
  const linhas = [...s.guesses]
    .reverse()
    .map((a) => {
      const c = compararAno(a, P.ano);
      const seta = c.seta === "up" ? `${SIM.up} foi mais tarde` : c.seta === "down" ? `${SIM.down} foi mais cedo` : `${SIM.ok} é esse ano`;
      return `<li class="palpano f-${c.faixa.id}"><b>${esc(formatarAno(a))}</b><span>${seta}</span><small>${esc(c.faixa.rotulo)}</small></li>`;
    })
    .join("");

  const entrada = fim
    ? ""
    : `<form class="anoform" autocomplete="off">
        <label class="sr" for="ano">Seu palpite de ano</label>
        <input id="ano" inputmode="numeric" maxlength="5" placeholder="Ex.: 1789" aria-describedby="anoajuda">
        <label class="ac"><input type="checkbox" id="ac"> a.C.</label>
        <button class="btn" type="submit">Enviar</button>
      </form>
      <p class="meta pequeno" id="anoajuda">Você tem ${MAX - n} ${MAX - n === 1 ? "palpite" : "palpites"}. A próxima dica abre ${n < 2 ? "depois de 2 palpites" : n < 4 ? "depois de 4 palpites" : "agora"}.</p>`;

  const resultado = fim
    ? painelResultado({
        gid: "ano", idx, venceu: ganhou,
        titulo: formatarAno(P.ano),
        veredito: ganhou ? `Acertou em ${n}/${MAX}.` : "Não foi desta. O ano era este.",
        humor: frase("ano", tipo, idx),
        corpo: `<p>${esc(P.explain)}</p>`,
        origem: P.origem_pas, fonte: P.fonte, verificar: P.verificar,
      })
    : "";

  pintar(`<div class="game">
    ${cabecalho("ano", idx)}
    <p class="tema">${esc(P.materia)} • ${esc(P.etapa)}</p>
    <div class="triesrow"><div class="tries" aria-hidden="true">${Array.from({ length: MAX }, (_, i) => `<i class="${i < n ? (s.guesses[i] === P.ano ? "ok" : "bad") : ""}"></i>`).join("")}</div><span>${n}/${MAX} palpites</span></div>
    <blockquote class="cena">${esc(P.cena)}</blockquote>
    ${dicas ? `<ul class="dicas">${dicas}</ul>` : ""}
    ${entrada}
    ${linhas ? `<ul class="palpsano" aria-label="Seus palpites">${linhas}</ul>` : ""}
    ${resultado}
  </div>`);
  ligarCabecalho("ano");

  if (!fim) {
    const campo = $("#ano", main);
    focarCampo(campo);
    $(".anoform", main).onsubmit = (e) => {
      e.preventDefault();
      const ano = lerAno(campo.value, $("#ac", main).checked);
      if (ano === null) return toast("Digite um ano entre 3000 a.C. e 2100 (não existe o ano zero).");
      s.guesses.push(ano);
      if (ano === P.ano) s.status = "won";
      else if (s.guesses.length >= MAX) s.status = "lost";
      if (s.status !== "playing") concluir("ano", P.id, s.status === "won");
      salvar();
      telaAno(idx);
      if (s.status === "playing") focarCampo($("#ano", main));
    };
  } else {
    ligarResultado("ano", idx, montarTexto({
      jogo: "Que ano foi?", numero: idx + 1, placar: ganhou ? `${n}/${MAX}` : `X/${MAX}`, grade: grelhaAno(P.ano, s.guesses), frase: frase("ano", tipo, idx),
    }));
  }
}
