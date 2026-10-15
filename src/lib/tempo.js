// Datas do jogo. O dia vira à meia-noite de Brasília, em qualquer aparelho.
export const FUSO = "America/Sao_Paulo";

// Data do desafio nº 1 (AAAA-MM-DD). Para publicar, mude aqui. Está 10 dias antes do primeiro teste para o puzzle de hoje ser outro (edição nº 11).
export const LANCAMENTO = "2026-10-05";

const pad2 = (n) => String(n).padStart(2, "0");
const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: FUSO, year: "numeric", month: "2-digit", day: "2-digit" });

/** Data civil (AAAA-MM-DD) em Brasília para um instante. */
export const dataBrasilia = (instante = new Date()) => fmt.format(instante);

const utc = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

/** Soma dias a uma data AAAA-MM-DD (aritmética de calendário, sem fuso). */
export function somarDias(k, n) {
  const t = new Date(utc(k) + n * 864e5);
  return `${t.getUTCFullYear()}-${pad2(t.getUTCMonth() + 1)}-${pad2(t.getUTCDate())}`;
}

/** Quantos dias de calendário vão de a até b. */
export const diasEntre = (a, b) => Math.round((utc(b) - utc(a)) / 864e5);

/** Número da edição (1 no dia do lançamento). */
export const numeroEdicao = (k, lancamento = LANCAMENTO) => diasEntre(lancamento, k) + 1;

/** Escolhe o item n (1, 2, 3...) da lista, recomeçando do início quando ela acaba. */
export function escolher(lista, n) {
  const t = lista.length;
  return lista[(((n - 1) % t) + t) % t];
}

/** "sexta-feira, 16 de outubro" */
export function dataPorExtenso(k) {
  const [y, m, d] = k.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}
