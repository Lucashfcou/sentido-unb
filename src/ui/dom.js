import { fx } from "./fx.js";
// Pequenos ajudantes de interface.
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const main = document.getElementById("main");

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

let tToast = 0;
export function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(tToast);
  tToast = setTimeout(() => (el.hidden = true), 2200);
}

const dlg = $("#dlg");
export function abrirFolha(html) {
  $("#dlg-body").innerHTML = html;
  if (!dlg.open) dlg.showModal();
}
$("#dlg-close").onclick = () => dlg.close();
dlg.addEventListener("click", (e) => {
  if (e.target === dlg) dlg.close();
});

/** Troca o conteúdo da tela, mantendo o foco no elemento indicado depois. */
let telaAnterior = "";
const contagens = new Map();

export function pintar(html, focoSel) {
  const foto = fx.fotografar(".cx-w", "w");
  const tela = location.hash;
  const mesma = tela === telaAnterior;
  main.innerHTML = html;
  fx.ajustar(".cx-w, .fslot");
  telaAnterior = tela;
  if (!mesma) {
    contagens.clear();
    fx.escada([...main.querySelector(".game, .home")?.children ?? []]);
    fx.lateral([...main.querySelectorAll(".linha")]);
  } else {
    fx.deslocar(foto);
  }
  // palpite novo: a linha mais nova desliza e as peças viram
  const listas = [[".palpsobra", ".at"], [".palpsano", null], [".palpslug", null]];
  for (const [sel, chips] of listas) {
    const lista = main.querySelector(sel);
    const n = lista ? lista.children.length : 0;
    if (mesma && n > (contagens.get(sel) ?? n)) {
      fx.deslizar(lista.firstElementChild);
      if (chips) fx.virar([...lista.firstElementChild.querySelectorAll(chips)]);
      else fx.pulo(lista.firstElementChild, 1.04);
    }
    contagens.set(sel, n);
  }
  const grade = main.querySelector(".fgrade");
  const nf = grade ? grade.children.length : 0;
  if (mesma && nf > (contagens.get("fgrade") ?? nf)) fx.virar([...grade.lastElementChild.querySelectorAll(".fslot")], 110);
  contagens.set("fgrade", nf);
  const gr = main.querySelector(".cx-done");
  const ng = gr ? gr.children.length : 0;
  if (mesma && ng > (contagens.get("cxdone") ?? ng)) {
    fx.pulo(gr.lastElementChild, 1.05);
    const r = gr.lastElementChild.getBoundingClientRect();
    fx.confete(r.left + r.width / 2, r.top + r.height / 2, 10);
  }
  contagens.set("cxdone", ng);
  if (focoSel) {
    const el = $(focoSel, main);
    if (el) el.focus({ preventScroll: true });
  }
}

export async function copiar(texto) {
  try {
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      await navigator.share({ text: texto });
      return "compartilhado";
    }
    await navigator.clipboard.writeText(texto);
    return "copiado";
  } catch {
    return "erro";
  }
}

/** Foca um campo de texto só em aparelho com mouse. No celular, focar sozinho abre o teclado e ele cobre a tela. */
export function focarCampo(el) {
  if (!el) return;
  if (typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches) return;
  el.focus({ preventScroll: true });
}
