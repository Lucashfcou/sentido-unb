// Movimento do site, sem biblioteca: Web Animations API + CSS.
// Tudo é opcional. Com "reduzir movimento" ou se algo falhar, a página segue funcionando.
const RM = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: true };
const ligado = () => !RM.matches && !globalThis.__SEM_FX;
const seguro = (fn) => {
  try {
    return fn();
  } catch {
    return null;
  }
};
const SAIDA = "cubic-bezier(0.16, 1, 0.3, 1)";
const MOLA = "cubic-bezier(0.34, 1.56, 0.64, 1)";

export const fx = {
  /** Palavras entram subindo de uma máscara (pistas e títulos). */
  revelar(el, atraso = 0) {
    if (!el || !ligado()) return;
    seguro(() => {
      const palavras = el.textContent.trim().split(/\s+/);
      el.setAttribute("aria-label", el.textContent.trim());
      el.innerHTML = palavras.map((w) => `<span class="fx-m" aria-hidden="true"><span>${w.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span></span>`).join(" ");
      el.querySelectorAll(".fx-m > span").forEach((s, i) => {
        s.animate({ transform: ["translateY(105%)", "translateY(0)"] }, { duration: 700, delay: atraso + i * 45, easing: SAIDA, fill: "backwards" });
      });
    });
  },

  /** Letras trocam até assentar no texto certo (título do resultado). */
  decifrar(el, duracao = 700) {
    if (!el || !ligado()) return;
    seguro(() => {
      const alvo = el.textContent;
      const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      el.setAttribute("aria-label", alvo);
      const t0 = performance.now();
      const passo = (agora) => {
        const p = Math.min(1, (agora - t0) / duracao);
        const fixas = Math.floor(p * alvo.length);
        el.textContent = [...alvo].map((c, i) => (i < fixas || c === " " ? c : letras[Math.floor(Math.random() * letras.length)])).join("");
        if (p < 1) requestAnimationFrame(passo);
        else el.textContent = alvo;
      };
      requestAnimationFrame(passo);
    });
  },

  /** Treme de lado: palpite errado. */
  tremer(el) {
    if (!el || !ligado()) return;
    seguro(() => el.animate({ transform: ["translateX(0)", "translateX(-8px)", "translateX(7px)", "translateX(-5px)", "translateX(3px)", "translateX(0)"] }, { duration: 420, easing: "ease-out" }));
  },

  /** Salto curto: acerto ou item que mudou de estado. */
  pulo(el, escala = 1.08) {
    if (!el || !ligado()) return;
    seguro(() => el.animate({ transform: [`scale(${escala})`, "scale(0.98)", "scale(1)"] }, { duration: 340, easing: MOLA }));
  },

  /** Onda: itens sobem em sequência (grade de opções, linhas). */
  onda(els, passo = 40) {
    if (!els.length || !ligado()) return;
    seguro(() => els.forEach((el, i) => el.animate({ opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: 420, delay: i * passo, easing: SAIDA, fill: "backwards" })));
  },

  /** Chuva de paradas: quadradinhos nas cores das linhas, saindo do ponto (x, y). */
  confete(x, y, quantidade = 18) {
    if (!ligado()) return;
    seguro(() => {
      if (matchMedia("(pointer: coarse)").matches) quantidade = Math.ceil(quantidade * 0.6);
      let camada = document.getElementById("fxcamada");
      if (!camada) {
        camada = document.createElement("div");
        camada.id = "fxcamada";
        camada.setAttribute("aria-hidden", "true");
        document.body.appendChild(camada);
      }
      const cores = ["--conex", "--caso", "--obra", "--ano", "--formula", "--lugar", "--led"];
      const pecas = [];
      for (let i = 0; i < quantidade; i++) {
        const b = document.createElement("i");
        b.className = "fx-peca" + (i % 3 === 0 ? " redonda" : "");
        b.style.background = `var(${cores[i % cores.length]}, #ffb000)`;
        b.style.left = `${x - 5}px`;
        b.style.top = `${y - 5}px`;
        camada.appendChild(b);
        pecas.push(b);
        const dx = (Math.random() - 0.5) * 320;
        const dy = -(Math.random() * 220) - 40;
        b.animate(
          [
            { transform: "translate(0,0) rotate(0deg) scale(.4)", opacity: 1 },
            { transform: `translate(${dx * 0.6}px,${dy}px) rotate(${Math.random() * 300}deg) scale(1)`, opacity: 1, offset: 0.45 },
            { transform: `translate(${dx}px,${dy + 220}px) rotate(${Math.random() * 540}deg) scale(.8)`, opacity: 0 },
          ],
          { duration: 1100 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.4,1)", fill: "forwards" },
        ).onfinish = () => b.remove();
      }
      setTimeout(() => pecas.forEach((p) => p.remove()), 2200);
    });
  },

  /** Contador rolante: cada dígito é uma coluna que desliza até o valor. */
  rolar(el, valor) {
    if (!el) return;
    const texto = String(valor);
    if (!ligado()) {
      el.textContent = texto;
      return;
    }
    seguro(() => {
      el.setAttribute("aria-label", texto);
      el.innerHTML = [...texto]
        .map((ch) => (/\d/.test(ch) ? `<span class="fx-d" aria-hidden="true"><span class="fx-col">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<span>${n}</span>`).join("")}</span></span>` : `<span aria-hidden="true">${ch}</span>`))
        .join("");
      el.querySelectorAll(".fx-col").forEach((col, i) => {
        const dig = Number([...texto].filter((c) => /\d/.test(c))[i]);
        col.animate({ transform: ["translateY(0)", `translateY(${-dig * 10}%)`] }, { duration: 700 + i * 120, easing: SAIDA, fill: "forwards" });
      });
    });
  },

  vibrar(tipo) {
    seguro(() => {
      if (!navigator.vibrate || RM.matches) return;
      navigator.vibrate(tipo === "ok" ? [12] : tipo === "ruim" ? [28] : tipo === "vitoria" ? [12, 50, 12, 50, 24] : [0]);
    });
  },

  /** Roda `cb` quando a animação de abertura de jogo (o círculo de cor) acabar; se não há animação, roda já. */
  depoisDaAbertura(cb) {
    if (this._abrindo && this._fila) this._fila.push(cb);
    else cb();
  },

  /** Entrada em escada: filhos sobem um a um (troca de tela). */
  escada(els, y = 14, passo = 50, inicio = 0) {
    if (!els.length || !ligado()) return;
    seguro(() => els.forEach((el, i) => el.animate({ opacity: [0, 1], transform: [`translateY(${y}px)`, "none"] }, { duration: 500, delay: inicio + i * passo, easing: SAIDA, fill: "backwards" })));
  },

  /** Entrada lateral: linhas do início vêm da esquerda, como ônibus chegando. */
  lateral(els, inicio = 250, passo = 80) {
    if (!els.length || !ligado()) return;
    seguro(() => els.forEach((el, i) => el.animate({ opacity: [0, 1], transform: ["translateX(-40px)", "none"] }, { duration: 650, delay: inicio + i * passo, easing: SAIDA, fill: "backwards" })));
  },

  /** Cartas viram em sequência (estado de cada atributo ou peça). */
  virar(els, passo = 90) {
    if (!els.length || !ligado()) return;
    seguro(() => els.forEach((el, i) => el.animate({ transform: ["rotateX(90deg)", "rotateX(0deg)"], opacity: [0.2, 1] }, { duration: 460, delay: i * passo, easing: SAIDA, fill: "backwards" })));
  },

  /** Entra deslizando da esquerda (linha de palpite novo). */
  deslizar(el) {
    if (!el || !ligado()) return;
    seguro(() => el.animate({ opacity: [0.3, 1], transform: ["translateX(-16px)", "none"] }, { duration: 450, easing: SAIDA }));
  },

  /** FLIP: peças deslizam do lugar antigo para o novo. `antes` vem de fotografar(). */
  fotografar(sel, chave) {
    const m = new Map();
    document.querySelectorAll(sel).forEach((e) => m.set(e.dataset[chave], e.getBoundingClientRect()));
    return { m, sel, chave };
  },
  deslocar(foto) {
    if (!foto || !ligado()) return;
    seguro(() =>
      document.querySelectorAll(foto.sel).forEach((e) => {
        const a = foto.m.get(e.dataset[foto.chave]);
        if (!a) return;
        const b = e.getBoundingClientRect();
        const dx = a.left - b.left;
        const dy = a.top - b.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        e.animate({ transform: [`translate(${dx}px,${dy}px)`, "none"] }, { duration: 420, easing: "cubic-bezier(.3,1.3,.5,1)" });
      }),
    );
  },

  /** Faíscas radiais no ponto do toque. */
  fagulha(x, y, cor) {
    if (!ligado()) return;
    seguro(() => {
      let camada = document.getElementById("fxcamada");
      if (!camada) {
        camada = document.createElement("div");
        camada.id = "fxcamada";
        camada.setAttribute("aria-hidden", "true");
        document.body.appendChild(camada);
      }
      const feitas = [];
      for (let i = 0; i < 8; i++) {
        const f = document.createElement("i");
        f.className = "fx-fagulha";
        f.style.cssText = `left:${x}px;top:${y}px;background:${cor};rotate:${i * 45}deg`;
        camada.appendChild(f);
        feitas.push(f);
        f.animate({ transform: ["translateX(8px) scaleX(1)", "translateX(30px) scaleX(.25)"], opacity: [1, 0] }, { duration: 500, easing: SAIDA, fill: "forwards" }).onfinish = () => f.remove();
      }
      setTimeout(() => feitas.forEach((f) => f.remove()), 700);
    });
  },

  /** Círculo na cor da linha cresce do toque e cobre a tela; depois `feito()` troca a tela. */
  abrir(x, y, cor, feito) {
    if (this._abrindo) return;
    if (!ligado()) return feito();
    this._abrindo = true;
    this._fila = [];
    const tok = (this._tok = (this._tok || 0) + 1);
    const terminou = () => {
      if (this._tok !== tok || !this._abrindo) return;
      this._abrindo = false;
      const fila = this._fila || [];
      this._fila = [];
      setTimeout(() => fila.forEach((cb) => seguro(cb)), 150);
    };
    setTimeout(terminou, 2500);
    seguro(() => {
      const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 24;
      const c = document.createElement("div");
      c.className = "fx-onda";
      c.setAttribute("aria-hidden", "true");
      c.style.cssText = `left:${x - R}px;top:${y - R}px;width:${2 * R}px;height:${2 * R}px;background:${cor}`;
      document.body.appendChild(c);
      let disparou = false;
      const dispara = () => {
        if (!disparou) {
          disparou = true;
          feito();
        }
      };
      c.animate({ transform: [`scale(${18 / R})`, "scale(1)"] }, { duration: 420, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" }).finished
        .then(() => {
          dispara();
          return c.animate({ opacity: [1, 0] }, { duration: 380, fill: "forwards" }).finished;
        })
        .then(() => { c.remove(); terminou(); }, () => { c.remove(); terminou(); });
      setTimeout(() => {
        dispara();
        setTimeout(() => { c.remove(); terminou(); }, 700);
      }, 800);
    }) ?? feito();
  },

  /** Encolhe a letra até cada palavra caber na peça, sem quebrar no meio. */
  ajustar(sel) {
    seguro(() =>
      document.querySelectorAll(sel).forEach((t) => {
        t.style.fontSize = "";
        let fs = parseFloat(getComputedStyle(t).fontSize);
        while (t.scrollWidth > t.clientWidth + 0.5 && fs > 9) {
          fs -= 0.5;
          t.style.fontSize = `${fs}px`;
        }
      }),
    );
  },

  /** Chamado quando um puzzle termina: título decifra, ganhou solta confete, celular vibra. */
  depoisDoResultado(painel, venceu) {
    if (!painel) return;
    this.decifrar(painel.querySelector("h3"), 750);
    this.pulo(painel.querySelector(".rsym"), 1.3);
    this.vibrar(venceu ? "vitoria" : "ruim");
    if (venceu) {
      const r = painel.getBoundingClientRect();
      this.confete(Math.min(innerWidth - 40, Math.max(40, r.left + r.width - 60)), Math.max(120, r.top + 60), 20);
    }
  },
};

// Fagulhas em todo botão e peça tocada, na cor da linha (ou do texto).
if (typeof document !== "undefined") {
  document.addEventListener(
    "pointerdown",
    (e) => {
      const t = e.target.closest?.(".btn, .opcao, .cx-w, .linha, .pz, .tecla, .sign, .etapa-b, .icon-btn");
      if (!t || t.disabled) return;
      const c = getComputedStyle(t);
      const linha = c.getPropertyValue("--c").trim() || (t.querySelector("[style*=\"--c\"]") && getComputedStyle(t.querySelector("[style*=\"--c\"]")).getPropertyValue("--c").trim());
      fx.fagulha(e.clientX, e.clientY, linha || c.color);
    },
    { passive: true },
  );
}
