import { test } from "node:test";
import assert from "node:assert/strict";
import { faixaDeDias, montarEvento, classificarVisita, emitir, EVENTOS } from "../src/lib/medicao.js";

test("medição: faixas de dias desde a primeira visita", () => {
  assert.deepEqual([0, 1, 2, 6, 7, 8, 13, 14, 90].map(faixaDeDias), ["0", "1", "2a6", "2a6", "7", "8a13", "8a13", "14mais", "14mais"]);
  assert.equal(faixaDeDias(-1), "0");
});

test("medição: primeira visita é 'novo'; depois 'volta' com a faixa certa", () => {
  assert.deepEqual(classificarVisita("", "2026-12-01"), { tipo: "novo", faixa: "0" });
  assert.deepEqual(classificarVisita("2026-12-01", "2026-12-02"), { tipo: "volta", faixa: "1" });
  assert.deepEqual(classificarVisita("2026-12-01", "2026-12-08"), { tipo: "volta", faixa: "7" });
});

test("medição: o evento só leva campos permitidos e nada que identifique a pessoa", () => {
  const e = montarEvento("concluiu", { jogo: "caso", etapa: 2, venceu: true, nome: "Ana", email: "a@b.c", id: 123, dispositivo: "x" });
  assert.deepEqual(e, { evento: "concluiu", jogo: "caso", etapa: 2, venceu: true });
  assert.equal(montarEvento("inexistente", { a: 1 }), null);
  // valores que não são texto, número ou booleano são descartados
  assert.deepEqual(montarEvento("etapa", { etapa: { x: 1 } }), { evento: "etapa" });
  // nenhum tipo de evento aceita campos de identificação
  for (const campos of Object.values(EVENTOS)) for (const c of campos) assert.doesNotMatch(c, /^(nome|email|id|ip|cpf|telefone|dispositivo)$/i);
});

test("medição: sem provedor plugado, nada é enviado e nada quebra", () => {
  assert.doesNotThrow(() => emitir("visita", { tipo: "novo", faixa: "0", etapa: 1 }));
  const chamadas = [];
  globalThis.window = { __medir: (e) => chamadas.push(e) };
  emitir("compartilhou", { jogo: "obra", etapa: 3, extra: "descartado" });
  globalThis.window = { __medir: () => { throw new Error("falha do provedor"); } };
  assert.doesNotThrow(() => emitir("etapa", { etapa: 1 }));
  delete globalThis.window;
  assert.deepEqual(chamadas, [{ evento: "compartilhou", jogo: "obra", etapa: 3 }]);
});
