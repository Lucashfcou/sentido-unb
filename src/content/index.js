// Conteúdo dos jogos. Os dados vivem em JSON (ver CONTEUDO.md e docs/mapa-de-conteudo.md).
import { indexarRespostas } from "../lib/busca.js";

/** `ler(nome)` devolve o JSON já convertido: no navegador usa fetch, nos testes usa fs. */
export async function carregarConteudo(ler) {
  const [cx, cs, ob, hi, fo, lu] = await Promise.all(["conexoes", "caso", "obras", "historia", "formulas", "lugares"].map(ler));

  const CASO = {
    casos: cs.casos,
    respostas: indexarRespostas(cs.respostas.map(([id, nome]) => [id, nome, []])),
    materiaDe: Object.fromEntries(cs.respostas.map(([id, , materia]) => [id, materia])),
  };

  const lista = ob.obras.map((r) => Object.fromEntries(ob.colunas.map((c, i) => [c, r[i]])));
  const OBRAS = {
    lista,
    porId: Object.fromEntries(lista.map((o) => [o.id, o])),
    continentes: ob.continentes,
    puzzles: ob.puzzles,
    respostas: indexarRespostas(lista.map((o) => [o.id, o.titulo, o.apelidos])),
  };

  const lugares = lu.lugares.map((r) => Object.fromEntries(lu.colunas.map((c, i) => [c, r[i]])));
  const LUGARES = {
    lista: lugares,
    porId: Object.fromEntries(lugares.map((l) => [l.id, l])),
    puzzles: lu.puzzles,
    respostas: indexarRespostas(lugares.map((l) => [l.id, l.nome, l.apelidos])),
  };

  return { CONEX: cx.desafios, CASO, OBRAS, HIST: hi.eventos, FORM: fo.puzzles, LUGARES };
}
