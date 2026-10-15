// Campo de busca com autocompletar, usável por teclado e leitor de tela.
import { buscar, exata, destacar } from "../lib/busca.js";
import { esc } from "./dom.js";

export function ligarBusca({ input, lista, respostas, excluir = () => [], extra, aoEscolher }) {
  let itens = [];
  let ativo = -1;

  const fechar = () => {
    lista.hidden = true;
    itens = [];
    ativo = -1;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  };

  const pintarLista = () => {
    lista.innerHTML = itens
      .map((a, i) => `<li role="option" id="op-${i}" data-i="${i}" aria-selected="${i === ativo}"><span>${destacar(a.name, input.value)}</span>${extra ? `<small>${esc(extra(a))}</small>` : ""}</li>`)
      .join("");
    if (ativo >= 0) input.setAttribute("aria-activedescendant", `op-${ativo}`);
  };

  const abrir = () => {
    const q = input.value;
    itens = buscar(respostas, q, excluir(), 7);
    if (!itens.length) {
      if (q.trim()) {
        lista.innerHTML = '<li class="vazio" role="presentation">Nada encontrado. Tente outro trecho.</li>';
        lista.hidden = false;
      } else fechar();
      return;
    }
    lista.hidden = false;
    input.setAttribute("aria-expanded", "true");
    pintarLista();
  };

  const escolher = (a) => {
    fechar();
    input.value = "";
    input.blur(); // fecha o teclado do celular; a próxima tela de palpite volta limpa
    aoEscolher(a.id);
  };

  // no celular, sobe o campo para perto do topo: assim a lista de sugestões fica acima do teclado
  input.addEventListener("focus", () => {
    if (typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches) setTimeout(() => input.scrollIntoView({ block: "start", behavior: "smooth" }), 250);
  });
  input.addEventListener("input", () => {
    ativo = -1;
    abrir();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" && itens.length) {
      e.preventDefault();
      ativo = (ativo + 1) % itens.length;
      pintarLista();
    } else if (e.key === "ArrowUp" && itens.length) {
      e.preventDefault();
      ativo = (ativo - 1 + itens.length) % itens.length;
      pintarLista();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const ex = exata(respostas, input.value, excluir());
      if (ativo >= 0) escolher(itens[ativo]);
      else if (ex) escolher(ex);
      else if (itens.length === 1) escolher(itens[0]);
    } else if (e.key === "Escape") fechar();
  });
  input.addEventListener("blur", () => setTimeout(fechar, 120));
  lista.addEventListener("mousedown", (e) => {
    const li = e.target.closest("li[data-i]");
    if (li) {
      e.preventDefault();
      escolher(itens[Number(li.dataset.i)]);
    }
  });
}

/** HTML do campo de busca. */
export const campoBusca = (placeholder, rotulo) => `
  <div class="busca">
    <label class="sr" for="q">${esc(rotulo)}</label>
    <input id="q" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" role="combobox" aria-expanded="false" aria-controls="lista" aria-autocomplete="list" placeholder="${esc(placeholder)}">
    <ul id="lista" role="listbox" hidden></ul>
  </div>`;
