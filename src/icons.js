// Ícones desenhados à mão: traço único de 2 px, grade de 24 px, herdam a cor do texto.
const svg = (corpo) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${corpo}</svg>`;

export const ICONES = {
  conex: svg('<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>'),
  caso: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>'),
  obra: svg('<path d="M12 6.5C10 5 7 4.5 4 4.5v13c3 0 6 .5 8 2 2-1.5 5-2 8-2v-13c-3 0-6 .5-8 2zM12 6.5v13"/>'),
  ano: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  formula: svg('<path d="M4.5 7.5h15M9 7.5L8 18M15 7.5v8.5c0 1.2.7 2 2.2 2"/>'),
  lugar: svg('<path d="M12 21s7-6.1 7-11.2a7 7 0 1 0-14 0C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.4"/>'),
};

export const ICONE_CHAMA = svg('<path d="M12 3c.5 3-2.5 4.5-2.5 8a3 3 0 0 0 6 0c0-1-.4-1.800-1-2.500 2.500 1.200 4.500 3.500 4.500 6.500A7 7 0 0 1 5 15c0-4 3.500-5.500 4.500-9 1 .8 1.800 1.500 2.500-3z"/>');
export const ICONE_AJUDA = svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>');
export const ICONE_SETA = svg('<path d="M9 5l7 7-7 7"/>');
export const ICONE_VOLTAR = svg('<path d="M15 5l-7 7 7 7"/>');

/** Símbolos de estado no mesmo traço dos ícones (substituem ✓ ✕ ≈ – ↑ ↓ …). */
const sim = (corpo) => `<span class="sim">${svg(corpo)}</span>`;
export const SIM = {
  ok: sim('<path d="M5 12.5l4.5 4.5L19 7.500"/>'),
  no: sim('<path d="M6.500 6.500l11 11M17.500 6.500l-11 11"/>'),
  near: sim('<path d="M5 9.500c2.500-2 4.500-2 7 0s4.500 2 7 0M5 15.500c2.500-2 4.500-2 7 0s4.500 2 7 0"/>'),
  nd: sim('<path d="M6 12h12"/>'),
  skip: sim('<path d="M6 12h12"/>'),
  play: sim('<path d="M6 12h.01M12 12h.01M18 12h.01"/>'),
  up: sim('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  down: sim('<path d="M12 5v14M6 13l6 6 6-6"/>'),
  new: "",
};
SIM.won = SIM.ok;
SIM.lost = SIM.no;
