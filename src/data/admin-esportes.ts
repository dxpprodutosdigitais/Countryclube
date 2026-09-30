/**
 * Modelo de dados do painel para Esportes: professores, modalidades e turmas.
 *
 * - `Professor` é um cadastro próprio (nome, foto, contato) e é ASSOCIADO à
 *   modalidade/turma por id — nunca por texto livre.
 * - `Turma` guarda todas as variáveis de horário: dias da semana, hora de
 *   início/fim (ou horário livre), faixa etária, professores, período de
 *   vigência (datas), local e vagas.
 * - A grade de horários das atividades é DERIVADA das turmas (ver
 *   `gradeSemanal` e `gradePorModalidade`): cadastrar uma modalidade já a
 *   inclui na grade, sem passo extra.
 *
 * A semente vem de `real.json` (conteúdo coletado do site atual), convertendo
 * as tabelas de programação em turmas estruturadas.
 */
import realJson from "./real.json";
import { local } from "./images";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */
export type DiaSemana = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
export const DIAS: { id: DiaSemana; curto: string; nome: string }[] = [
  { id: "seg", curto: "Seg", nome: "Segunda" }, { id: "ter", curto: "Ter", nome: "Terça" }, { id: "qua", curto: "Qua", nome: "Quarta" },
  { id: "qui", curto: "Qui", nome: "Quinta" }, { id: "sex", curto: "Sex", nome: "Sexta" }, { id: "sab", curto: "Sáb", nome: "Sábado" }, { id: "dom", curto: "Dom", nome: "Domingo" },
];
const ORDEM: Record<DiaSemana, number> = { seg: 0, ter: 1, qua: 2, qui: 3, sex: 4, sab: 5, dom: 6 };

export type FormaInscricao = "app" | "professor" | "secretaria" | "livre";
export const FORMAS_INSCRICAO: { value: FormaInscricao; label: string }[] = [
  { value: "professor", label: "Diretamente com o professor" },
  { value: "app", label: "Agendamento pelo aplicativo" },
  { value: "secretaria", label: "Na Secretaria de Esportes" },
  { value: "livre", label: "Livre, sem agendamento" },
];

export interface Professor {
  id: string;
  nome: string;
  /** URL (ou data URL de upload) da foto; vazio → avatar com iniciais. */
  foto: string;
  /** Ex.: "Educação Física · CREF 000000-G/MG" */
  formacao: string;
  telefone: string;
  ativo: boolean;
}

export interface Turma {
  id: string;
  /** Ex.: "Bebês", "Infantil", "Adulto", "Turma 2012/2013". */
  nome: string;
  faixaEtaria: string;
  dias: DiaSemana[];
  /** "HH:MM"; vazio quando o horário é livre/texto. */
  inicio: string;
  fim: string;
  /** Texto usado quando não há início/fim (ex.: "7h, 9h, 16h e 19h", "Livre"). */
  horarioLivre: string;
  professorIds: string[];
  /** ISO YYYY-MM-DD; vazios = o ano todo. */
  periodoInicio: string;
  periodoFim: string;
  local: string;
  vagas: number | null;
  obs: string;
}

export type StatusModalidade = "ativa" | "rascunho" | "pausada";

export interface ModalidadeAdmin {
  id: string;
  nome: string;
  cat: string;
  img: string;
  desc: string;
  publico: string;
  inscricao: FormaInscricao;
  /** Observação exibida junto da grade (ex.: "Inscrições até 12/06"). */
  nota: string;
  /** Professores responsáveis pela modalidade (além dos das turmas). */
  professorIds: string[];
  turmas: Turma[];
  status: StatusModalidade;
  inscritos: number;
}

export const CATEGORIAS = ["Quadra", "Praia", "Campo", "Aquáticos", "Fitness", "Artes marciais", "Dança", "Saúde e bem-estar"];

/* ------------------------------------------------------------------ */
/* Utilitários                                                          */
/* ------------------------------------------------------------------ */
let seq = 0;
export const novoId = (p: string) => `${p}-${Date.now().toString(36)}${(seq++).toString(36)}`;
export const iniciais = (nome: string) => nome.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";

export const fmtHora = (h: string) => (h ? h.replace(/^(\d{2}):(\d{2})$/, (_, a, b) => (b === "00" ? `${Number(a)}h` : `${Number(a)}h${b}`)) : "");
export function fmtHorario(t: Pick<Turma, "inicio" | "fim" | "horarioLivre">) {
  if (t.inicio && t.fim) return `${fmtHora(t.inicio)} às ${fmtHora(t.fim)}`;
  if (t.inicio) return fmtHora(t.inicio);
  return t.horarioLivre || "Horário a definir";
}
/** "Seg, Qua e Sex" / "Ter a Sex" / "Seg a Dom" */
export function fmtDias(dias: DiaSemana[]) {
  const d = [...new Set(dias)].sort((a, b) => ORDEM[a] - ORDEM[b]);
  if (!d.length) return "Dias a definir";
  const consecutivos = d.length >= 3 && d.every((x, i) => i === 0 || ORDEM[x] === ORDEM[d[i - 1]] + 1);
  const c = (x: DiaSemana) => DIAS.find((k) => k.id === x)!.curto;
  if (consecutivos) return `${c(d[0])} a ${c(d[d.length - 1])}`;
  if (d.length === 1) return c(d[0]);
  return `${d.slice(0, -1).map(c).join(", ")} e ${c(d[d.length - 1])}`;
}
export const fmtData = (iso: string) => (iso ? iso.split("-").reverse().join("/") : "");
export function fmtPeriodo(t: Pick<Turma, "periodoInicio" | "periodoFim">) {
  if (!t.periodoInicio && !t.periodoFim) return "O ano todo";
  if (t.periodoInicio && t.periodoFim) return `${fmtData(t.periodoInicio)} a ${fmtData(t.periodoFim)}`;
  return t.periodoInicio ? `A partir de ${fmtData(t.periodoInicio)}` : `Até ${fmtData(t.periodoFim)}`;
}
/** Situação da vigência em relação a hoje. */
export function vigencia(t: Pick<Turma, "periodoInicio" | "periodoFim">, hoje = new Date().toISOString().slice(0, 10)): "vigente" | "futura" | "encerrada" {
  if (t.periodoInicio && hoje < t.periodoInicio) return "futura";
  if (t.periodoFim && hoje > t.periodoFim) return "encerrada";
  return "vigente";
}

export const turmaVazia = (): Turma => ({ id: novoId("t"), nome: "", faixaEtaria: "", dias: [], inicio: "", fim: "", horarioLivre: "", professorIds: [], periodoInicio: "", periodoFim: "", local: "", vagas: null, obs: "" });
export const modalidadeVazia = (): ModalidadeAdmin => ({ id: "", nome: "", cat: CATEGORIAS[0], img: "", desc: "", publico: "", inscricao: "professor", nota: "", professorIds: [], turmas: [turmaVazia()], status: "rascunho", inscritos: 0 });
export const professorVazio = (): Professor => ({ id: "", nome: "", foto: "", formacao: "", telefone: "", ativo: true });

/* ------------------------------------------------------------------ */
/* Grade de horários (derivada)                                         */
/* ------------------------------------------------------------------ */
export interface ItemGrade { modalidade: ModalidadeAdmin; turma: Turma; dia: DiaSemana; ordem: number }
/** Todos os pares (turma × dia) ordenados por hora, para a visão semanal. */
export function gradeSemanal(modalidades: ModalidadeAdmin[], professores: Professor[]): Record<DiaSemana, ItemGrade[]> {
  const out = Object.fromEntries(DIAS.map((d) => [d.id, [] as ItemGrade[]])) as Record<DiaSemana, ItemGrade[]>;
  for (const m of modalidades) {
    if (m.status !== "ativa") continue;
    for (const t of m.turmas) for (const dia of t.dias) out[dia].push({ modalidade: m, turma: t, dia, ordem: t.inicio ? Number(t.inicio.replace(":", "")) : 9999 });
  }
  for (const d of DIAS) out[d.id].sort((a, b) => a.ordem - b.ordem || a.modalidade.nome.localeCompare(b.modalidade.nome));
  void professores;
  return out;
}
/** Todos os professores vinculados a uma modalidade (responsáveis + turmas), sem repetição. */
export function professoresDa(m: ModalidadeAdmin, professores: Professor[]) {
  const ids = [...new Set([...m.professorIds, ...m.turmas.flatMap((t) => t.professorIds)])];
  return ids.map((id) => professores.find((p) => p.id === id)).filter((p): p is Professor => !!p);
}
/** Modalidades em que um professor atua. */
export function modalidadesDe(p: Professor, modalidades: ModalidadeAdmin[]) {
  return modalidades.filter((m) => m.professorIds.includes(p.id) || m.turmas.some((t) => t.professorIds.includes(p.id)));
}

/* ------------------------------------------------------------------ */
/* Semente a partir do site atual (real.json)                           */
/* ------------------------------------------------------------------ */
interface RealTabela { titulo: string; colunas: string[]; linhas: string[][] }
interface RealModalidade { nome: string; sobre: string[]; tabelas: RealTabela[]; notas: string[]; professores: string[]; retrato: string; foto: string; publico: string; inscricao: string; horariosSite: { colunas: string[]; linhas: string[][]; nota: string } | null }
const REAL = (realJson as unknown as { modalidades: Record<string, RealModalidade> }).modalidades;

const CAT_POR_ID: Record<string, string> = {
  "ballet-jazz": "Dança", basquete: "Quadra", "beach-tenis": "Praia", fisioterapia: "Saúde e bem-estar", futebol: "Campo", futevolei: "Praia", futsal: "Quadra",
  "ginastica-funcional": "Fitness", "ginastica-localizada": "Fitness", hidroginastica: "Aquáticos", "jiu-jitsu": "Artes marciais", karate: "Artes marciais",
  "liberacao-miofascial-drenagem-e-ventosaterapia": "Saúde e bem-estar", "massagem-feminina": "Saúde e bem-estar", musculacao: "Fitness", natacao: "Aquáticos",
  peteca: "Quadra", pilates: "Saúde e bem-estar", tenis: "Quadra", volei: "Quadra", yoga: "Saúde e bem-estar",
};
const NOME_DIA: [RegExp, DiaSemana][] = [[/segunda|\bseg\b/i, "seg"], [/ter[çc]a|\bter\b/i, "ter"], [/quarta|\bqua\b/i, "qua"], [/quinta|\bqui\b/i, "qui"], [/sexta|\bsex\b/i, "sex"], [/s[áa]bado|\bs[áa]b\b/i, "sab"], [/domingo|\bdom\b/i, "dom"]];
const TODOS: DiaSemana[] = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];
/** "Terça a Sexta-feira" → [ter,qua,qui,sex]; "Segunda e Quarta" → [seg,qua]; "Segunda a Domingo" → todos. */
export function parseDias(texto: string): DiaSemana[] {
  const t = texto.replace(/-feira/gi, "");
  const achados = NOME_DIA.filter(([re]) => re.test(t)).map(([, d]) => d).sort((a, b) => ORDEM[a] - ORDEM[b]);
  if (/\s(a|à|até)\s/i.test(t) && achados.length === 2) return TODOS.slice(ORDEM[achados[0]], ORDEM[achados[1]] + 1);
  return achados;
}
const hhmm = (h: string, m?: string) => `${h.padStart(2, "0")}:${(m ?? "00").padStart(2, "0")}`;
/** "07:00h e 08:00h" → "7h e 8h" (texto livre mais legível). */
const bonitoLivre = (t: string) => t.replace(/(?<!\d)(\d{1,2}):(\d{2})\s*h?(?!\d)/g, (_, h, m) => (m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`)).replace(/\s+/g, " ").trim();
/** "08:00 às 12:00h" → {inicio,fim}; "18:45h" → {inicio}; "7h, 9h e 19h" / "Livre" → horarioLivre. */
export function parseHorario(texto: string): Pick<Turma, "inicio" | "fim" | "horarioLivre"> {
  const horas = [...texto.matchAll(/(?<!\d)(\d{1,2})(?::(\d{2}))?\s*h?(?!\d)/g)].filter((m) => Number(m[1]) <= 23);
  const intervalo = /\s(às|as|a|até)\s|–|-/i.test(texto);
  if (horas.length === 2 && intervalo) return { inicio: hhmm(horas[0][1], horas[0][2]), fim: hhmm(horas[1][1], horas[1][2]), horarioLivre: "" };
  if (horas.length === 1) return { inicio: hhmm(horas[0][1], horas[0][2]), fim: "", horarioLivre: "" };
  return { inicio: "", fim: "", horarioLivre: bonitoLivre(texto) };
}
/** Chave para deduplicar nomes de professores ("Luís Felipe" ≈ "Luiz Felipe"). */
const chave = (n: string) => n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/z/g, "s").replace(/[^a-z0-9]+/g, " ").trim();

function seed(): { professores: Professor[]; modalidades: ModalidadeAdmin[] } {
  const professores: Professor[] = [];
  /** Encontra/cria o professor. `contexto` = nomes completos da modalidade: "Laís" casa com "Laís Pacheco". */
  const idDe = (nome: string, contexto: string[] = [], foto = "") => {
    let n = nome.trim();
    const k = chave(n);
    if (!k.includes(" ")) { const completo = contexto.find((c) => chave(c).split(" ")[0] === k); if (completo) n = completo; }
    let p = professores.find((x) => chave(x.nome) === chave(n));
    if (!p) { p = { id: "p-" + chave(n).replace(/\s+/g, "-"), nome: n, foto, formacao: "", telefone: "", ativo: true }; professores.push(p); }
    else if (!p.foto && foto) p.foto = foto;
    return p.id;
  };
  const ehFaixa = (t: string) => /\d|anos|idade|livre|acima|abaixo|iniciante|avan[çc]ado|intermedi/i.test(t);
  const modalidades: ModalidadeAdmin[] = [];
  for (const [id, r] of Object.entries(REAL)) {
    // Professores da modalidade; a foto publicada só é atribuída quando há um único professor.
    const fotoUnica = r.professores.length === 1 && r.retrato ? local(r.retrato) : "";
    const professorIds = r.professores.map((n) => idDe(n, [], fotoUnica));
    const turmas: Turma[] = [];
    const tabelas: RealTabela[] = r.tabelas.length ? r.tabelas : r.horariosSite ? [{ titulo: "", colunas: r.horariosSite.colunas, linhas: r.horariosSite.linhas }] : [];
    for (const tab of tabelas) {
      const cols = tab.colunas.map((c) => c.toLowerCase());
      const iDia = cols.findIndex((c) => /dia|profissional/.test(c)), iHora = cols.findIndex((c) => /hor[áa]rio/.test(c));
      const iProf = cols.findIndex((c) => /professor/.test(c)), iCat = cols.findIndex((c) => /categoria|turma|faixa|idade/.test(c));
      // Título da tabela sem o nome da modalidade e sem parênteses: "Jiu-Jitsu (Inscrições…)" → "".
      const titulo = tab.titulo && !/^hor[áa]rios?$/i.test(tab.titulo)
        ? tab.titulo.replace(/\s*\([^)]*\)/g, "").replace(new RegExp(`^${r.nome.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&")}\\s*(para|-|·)?\\s*`, "i"), "").replace(/^jiu-?jitsu$/i, "").replace(/^para\s+/i, "").trim()
        : "";
      for (const linha of tab.linhas) {
        const diaTxt = iDia >= 0 ? linha[iDia] ?? "" : "", horaTxt = iHora >= 0 ? linha[iHora] ?? "" : "";
        const profTxt = iProf >= 0 ? linha[iProf] ?? "" : (diaTxt.match(/^([^(]+)\(/)?.[1] ?? "");
        const catTxt = (iCat >= 0 ? linha[iCat] ?? "" : "").trim();
        const profs = profTxt.split(/\s*\/\s*|\s+e\s+/).map((s) => s.trim()).filter((s) => s && !/^(dia|hor)/i.test(s));
        // "Infantil (A partir de 7 anos)" → nome "Infantil", faixa "A partir de 7 anos".
        const par = catTxt.match(/^(.*?)\s*\((.+)\)$/);
        const nome = par ? par[1] : ehFaixa(catTxt) ? titulo : catTxt;
        const faixa = par ? par[2] : ehFaixa(catTxt) ? catTxt : "";
        const obs = horaTxt.match(/\(([^)]*)\)/)?.[1] ?? "";
        turmas.push({
          ...turmaVazia(), id: `t-${id}-${turmas.length + 1}`,
          nome: nome || titulo || "Geral", faixaEtaria: faixa,
          dias: parseDias(diaTxt), ...parseHorario(horaTxt.replace(/\([^)]*\)/g, "")),
          professorIds: profs.map((n) => idDe(n, r.professores)), obs,
        });
      }
    }
    if (!turmas.length) turmas.push({ ...turmaVazia(), id: `t-${id}-1`, nome: "Geral", horarioLivre: "Consulte a Secretaria de Esportes" });
    const insc: FormaInscricao = /aplicativo/i.test(r.inscricao) ? "app" : /professor/i.test(r.inscricao) ? "professor" : /n[ãa]o [ée] necess/i.test(r.inscricao) ? "livre" : "secretaria";
    modalidades.push({
      id, nome: r.nome, cat: CAT_POR_ID[id] ?? "Quadra", img: r.foto ? local(r.foto) : "", desc: r.sobre[0] ?? "", publico: r.publico,
      inscricao: insc, nota: r.notas[0] ?? "", professorIds, turmas, status: "ativa", inscritos: 0,
    });
  }
  return { professores, modalidades };
}

export const SEED = seed();
