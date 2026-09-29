/**
 * Conteúdo do site público.
 *
 * Fonte principal: `real.json`, gerado a partir do site atual (lagoanossa.com.br)
 * por scripts/scrape-lagoanossa.mjs → scripts/build-content.mjs. Textos, tabelas
 * de horários, professores, eventos, comunicados, álbuns, FAQ, história,
 * direitos/deveres, funcionamento e convênio vêm literalmente de lá.
 * As listas *_BASE abaixo (CONTENT.md do handoff) fornecem categoria, ordem e
 * um texto de reserva usado apenas quando o site atual não traz o dado.
 */
import { FOTOS as OFICIAL, IMG as STOCK, local } from "./images";
import realJson from "./real.json";

/* ---------- Tipos --------------------------------------------------------- */
export interface Tabela { titulo: string; colunas: string[]; linhas: string[][]; nota?: string }
export interface Modalidade {
  id: string; nome: string; cat: string; img: string; desc: string; horario: string; publico: string;
  professor?: string; professores: string[]; profTitulo: string; retrato: string; sobre: string[];
  tabelas: Tabela[]; notas: string[]; inscricao: string; galeria: string[]; fotoDaArea: boolean; fonte: string;
}
export interface Infra {
  id: string; nome: string; cat: string; img: string; tag?: string; desc: string; sobre: string[]; galeria: string[];
  destaque?: { titulo: string; texto: string }; fotoProvisoria: boolean; fonte: string;
}
export interface Evento {
  id: string; data: string; dia: number; mes: string; mesNome: string; ano: number; hora: string; nome: string; cat: string; local: string;
  destaque?: boolean; img: string; desc: string; texto?: string[]; programacao?: string[]; obs?: string; fonte?: string;
}
export interface Noticia { id: string; tag: string; titulo: string; data: string; img: string; resumo: string; texto?: string[]; somenteImagem?: boolean; fonte?: string }
export interface FaqItem { cat: string; q: string; a: string }
export interface Membro { nome: string; cargo: string; gestao: string }
export interface Convenio { nome: string; cat: string; beneficio: string; endereco?: string; site?: string; instrumento?: string }
export interface Album { id: string; titulo: string; data: string; qt: number; cover: string; fotos: string[]; fonte?: string }
export interface RegrasSecao { num: string; titulo: string; itens: { letra: string; texto: string }[] }
export interface Regras { artigo: string; intro: string; secoes: RegrasSecao[] }

type ModalidadeBase = { id: string; nome: string; cat: string; img: string; desc: string; horario: string; publico: string };
type InfraBase = { id: string; nome: string; cat: string; img: string; tag?: string; desc: string; destaque?: { titulo: string; texto: string } };

/* ---------- real.json (site atual) --------------------------------------- */
interface RealModalidade { nome: string; sobre: string[]; tabelas: Tabela[]; notas: string[]; professores: string[]; profTitulo: string; horarioResumo: string; publico: string; retrato: string; foto: string; fotoDaArea: boolean; galeria: string[]; inscricao: string; horariosSite: { colunas: string[]; linhas: string[][]; nota: string } | null }
interface RealInfra { nome: string; subtitulo: string; sobre: string[]; foto: string; fotoProvisoria: boolean; galeria: string[] }
interface RealEvento { id: string; data: string; dia: number; mes: string; mesNome: string; ano: number; hora: string; nome: string; cat: string; local: string; destaque: boolean; img: string; desc: string; texto: string[]; programacao: string[]; obs: string; fonte: string }
interface RealComunicado { id: string; tag: string; titulo: string; data: string; img: string; resumo: string; texto: string[]; fonte: string; somenteImagem: boolean }
interface RealAlbum { id: string; titulo: string; data: string; qt: number; cover: string; fotos: string[]; fonte: string }
interface RealHorario { atividade: string; colunas: string[]; linhas: string[][]; nota: string }
interface Real {
  modalidades: Record<string, RealModalidade>; infra: Record<string, RealInfra>; eventos: RealEvento[]; comunicados: RealComunicado[];
  albuns: RealAlbum[]; faq: { q: string; a: string }[];
  paginas: { historia: string[]; direitos: Regras; deveres: Regras; funcionamento: { dia: string; horario: string }[]; contato: string[]; convenios: string[]; convenio: { nome: string; endereco: string; site: string; instrumento: string }; oportunidade: string[]; ouvidoria: string[]; horarios: RealHorario[] };
  pendentes: string[];
}
const REAL = realJson as unknown as Real;
export const CONTEUDO_PENDENTE = REAL.pendentes;
const SITE_ATUAL = "https://lagoanossa.com.br";

/** Resumo curto (primeira frase) de um texto, para cards. */
function resumo(ps: string[], fallback: string, max = 200): string {
  const t = ps.find((x) => x.length > 40) ?? ps[0];
  if (!t) return fallback;
  const frase = t.match(/^(.{40,}?[.!?])(\s|$)/)?.[1] ?? t;
  return frase.length > max ? frase.slice(0, max - 1).replace(/\s+\S*$/, "") + "…" : frase;
}

/* ---------- Modalidades (21) ---------------------------------------------- */
export const CATEGORIAS_MODALIDADES = ["Quadra", "Praia", "Campo", "Aquáticos", "Fitness", "Artes marciais", "Dança", "Saúde e bem-estar"];

const MODALIDADES_BASE: ModalidadeBase[] = [
  { id: "ballet-jazz", nome: "Ballet/Jazz", cat: "Dança", img: STOCK.ballet, desc: "Turmas de ballet e jazz para crianças e adolescentes, com apresentações anuais no clube.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 4 anos" },
  { id: "basquete", nome: "Basquete", cat: "Quadra", img: STOCK.basquete, desc: "Escolinha e treinos de basquete na quadra poliesportiva coberta.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 8 anos" },
  { id: "beach-tenis", nome: "Beach Tenis", cat: "Praia", img: STOCK.beachTenis, desc: "Quadras à beira da Lagoa, com vista privilegiada. Aulas para todos os níveis, do iniciante ao competitivo.", horario: "Seg–Dom · quadras da praia", publico: "A partir de 8 anos" },
  { id: "fisioterapia", nome: "Fisioterapia", cat: "Saúde e bem-estar", img: STOCK.fisioterapia, desc: "Atendimento fisioterapêutico no Estúdio de Pilates e Fisioterapia do clube.", horario: "Com hora marcada", publico: "Associados" },
  { id: "futebol", nome: "Futebol", cat: "Campo", img: STOCK.futebol, desc: "Escolinha, categorias de base e a tradicional Copa Country nos campos de futebol da Lagoa.", horario: "Consulte a Secretaria de Esportes", publico: "Todas as idades" },
  { id: "futevolei", nome: "Futevôlei", cat: "Praia", img: STOCK.futevolei, desc: "Aulas e jogos livres nas quadras de areia da praia.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 12 anos" },
  { id: "futsal", nome: "Futsal", cat: "Quadra", img: STOCK.futsal, desc: "Escolinha de futsal na quadra poliesportiva, por faixa etária.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 5 anos" },
  { id: "ginastica-funcional", nome: "Ginástica Funcional", cat: "Fitness", img: STOCK.funcional, desc: "Treinos funcionais em grupo na academia, com foco em condicionamento e mobilidade.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 14 anos" },
  { id: "ginastica-localizada", nome: "Ginástica Localizada", cat: "Fitness", img: STOCK.localizada, desc: "Aulas de ginástica localizada para fortalecimento e tonificação.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 14 anos" },
  { id: "hidroginastica", nome: "Hidroginástica", cat: "Aquáticos", img: STOCK.hidro, desc: "Aulas na piscina térmica, com foco em mobilidade, condicionamento e baixo impacto.", horario: "Consulte a Secretaria de Esportes", publico: "Adultos" },
  { id: "jiu-jitsu", nome: "Jiu jitsu", cat: "Artes marciais", img: STOCK.jiujitsu, desc: "Aulas de jiu jitsu nas Escolas de Artes Marciais do clube, infantil e adulto.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 5 anos" },
  { id: "karate", nome: "Karatê", cat: "Artes marciais", img: STOCK.karate, desc: "Escola de karatê com turmas por faixa etária e graduação.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 5 anos" },
  { id: "liberacao-miofascial-drenagem-e-ventosaterapia", nome: "Liberação Miofascial, Drenagem e Ventosaterapia", cat: "Saúde e bem-estar", img: STOCK.massagem, desc: "Terapias manuais para recuperação muscular e bem-estar, com hora marcada.", horario: "Com hora marcada", publico: "Adultos" },
  { id: "massagem-feminina", nome: "Massagem Feminina", cat: "Saúde e bem-estar", img: STOCK.massagem, desc: "Massagem relaxante e terapêutica para associadas, com hora marcada.", horario: "Com hora marcada", publico: "Adultas" },
  { id: "musculacao", nome: "Musculação", cat: "Fitness", img: STOCK.musculacao, desc: "Academia nova (2025) com musculação, orientação profissional e vista para a praia.", horario: "Horário da Academia", publico: "A partir de 14 anos" },
  { id: "natacao", nome: "Natação", cat: "Aquáticos", img: STOCK.natacao, desc: "Escolinha de Natação na piscina térmica, turmas por faixa etária e nível.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 3 anos" },
  { id: "peteca", nome: "Peteca", cat: "Quadra", img: STOCK.peteca, desc: "Jogos e torneios de peteca, tradição mineira, nas quadras do clube.", horario: "Consulte a Secretaria de Esportes", publico: "Todas as idades" },
  { id: "pilates", nome: "Pilates", cat: "Saúde e bem-estar", img: STOCK.pilates, desc: "Aulas de pilates no Estúdio de Pilates e Fisioterapia, em turmas reduzidas.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 16 anos" },
  { id: "tenis", nome: "Tênis", cat: "Quadra", img: STOCK.tenis, desc: "Aulas e jogos nas quadras de tênis do clube, para todas as idades e níveis.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 6 anos" },
  { id: "volei", nome: "Vôlei", cat: "Quadra", img: STOCK.volei, desc: "Escolinha e treinos de vôlei no ginásio e nas quadras da praia.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 10 anos" },
  { id: "yoga", nome: "Yoga", cat: "Saúde e bem-estar", img: STOCK.yoga, desc: "Prática de yoga em turmas reduzidas, com foco em respiração, equilíbrio e bem-estar.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 16 anos" },
];


export const MODALIDADES: Modalidade[] = MODALIDADES_BASE.map((b): Modalidade => {
  const r = REAL.modalidades[b.id];
  if (!r) return { ...b, professores: [], profTitulo: "", retrato: "", sobre: [], tabelas: [], notas: [], inscricao: "", galeria: [], fotoDaArea: false, fonte: `${SITE_ATUAL}/modalidades/${b.id}/` };
  const tabelas: Tabela[] = r.tabelas.length ? r.tabelas : r.horariosSite ? [{ titulo: "Horários", colunas: r.horariosSite.colunas, linhas: r.horariosSite.linhas, nota: r.horariosSite.nota }] : [];
  return {
    id: b.id, nome: r.nome || b.nome, cat: b.cat,
    img: r.foto ? local(r.foto) : b.img,
    desc: resumo(r.sobre, b.desc),
    horario: r.horarioResumo || b.horario,
    publico: r.publico || b.publico,
    professor: r.professores.length ? r.professores.join(", ") : undefined,
    professores: r.professores, profTitulo: r.profTitulo || "Professores", retrato: r.retrato ? local(r.retrato) : "",
    sobre: r.sobre, tabelas, notas: r.notas, inscricao: r.inscricao, galeria: r.galeria.map(local), fotoDaArea: r.fotoDaArea,
    fonte: `${SITE_ATUAL}/modalidades/${b.id}/`,
  };
});

export const MODALIDADES_HOME = ["beach-tenis", "tenis", "natacao", "futebol", "musculacao", "hidroginastica"];

/* ---------- Infraestrutura (18) ------------------------------------------- */
const INFRA_BASE: InfraBase[] = [
  { id: "praia", nome: "Praia", cat: "Lazer", img: STOCK.praia, tag: "Carro-chefe", desc: "Faixa de areia natural à beira da Lagoa do Fundão, com quiosques, decks e quadras de areia." },
  { id: "academia", nome: "Academia", cat: "Esportes", img: STOCK.academia2, tag: "Nova · 2025", desc: "Espaço fitness completo inaugurado em 2025, com musculação e atividades guiadas com vista para a praia." },
  { id: "campos-de-futebol", nome: "Campos de Futebol", cat: "Esportes", img: STOCK.futebol2, desc: "Campos society e sintético iluminados — palco da Copa Country e das escolinhas." },
  { id: "quadra-de-tenis", nome: "Quadra de Tênis", cat: "Esportes", img: STOCK.tenis2, desc: "Quadras de tênis com iluminação noturna para aulas e jogos livres." },
  { id: "piscinas", nome: "Piscinas", cat: "Aquáticos", img: STOCK.piscina, desc: "Piscinas de lazer e a piscina térmica, que recebe a hidroginástica e a Escolinha de Natação.", destaque: { titulo: "Piscina Térmica", texto: "Mais conforto para nossos associados. Com mais de 100 pessoas que utilizam diariamente ao local, que abriga praticantes de hidroginástica e os alunos da Escolinha de Natação." } },
  { id: "churrasqueira", nome: "Churrasqueira", cat: "Lazer", img: STOCK.churrasco2, desc: "Churrasqueiras individuais para reunir a família, reserváveis pelo app e pela Secretaria." },
  { id: "quiosques", nome: "Quiosques", cat: "Lazer", img: STOCK.quiosque, desc: "Quiosques na praia e nas áreas de convivência, com sombra e vista para a Lagoa." },
  { id: "area-familiar", nome: "Área Familiar", cat: "Lazer", img: STOCK.familia, desc: "Espaço de convivência pensado para a família passar o dia no clube." },
  { id: "secretaria", nome: "Secretaria", cat: "Serviços", img: STOCK.secretaria, desc: "Atendimento ao associado: cadastro, boletos, reservas e informações." },
  { id: "bares", nome: "Bares", cat: "Alimentação", img: STOCK.bar, desc: "Bares na praia e nas áreas sociais, para o lanche e a bebida gelada do final de semana." },
  { id: "restaurante", nome: "Restaurante", cat: "Alimentação", img: STOCK.restaurante, desc: "Restaurante do clube para almoços em família e eventos." },
  { id: "sinuca", nome: "Sinuca", cat: "Lazer", img: STOCK.sinuca, desc: "Salão de sinuca para os associados." },
  { id: "quadra-poliesportiva", nome: "Quadra Poliesportiva", cat: "Esportes", img: STOCK.quadraCoberta, desc: "Quadra coberta para futsal, basquete, vôlei e peteca." },
  { id: "escolas-de-artes-marciais", nome: "Escolas de Artes Marciais", cat: "Esportes", img: STOCK.artesMarciais, desc: "Espaço dedicado às aulas de jiu jitsu e karatê." },
  { id: "estudio-de-pilates", nome: "Estúdio de Pilates e Fisioterapia", cat: "Saúde", img: STOCK.pilates, desc: "Estúdio equipado para pilates, fisioterapia e terapias manuais." },
  { id: "parquinho", nome: "Parquinho", cat: "Lazer", img: STOCK.parquinho, desc: "Parquinho infantil para as crianças brincarem em segurança." },
  { id: "ginasio", nome: "Ginásio", cat: "Esportes", img: STOCK.ginasio, desc: "Ginásio coberto para treinos, torneios e eventos esportivos." },
  { id: "saunas", nome: "Saunas", cat: "Lazer", img: STOCK.sauna, desc: "Saunas para relaxar depois do esporte ou de um dia de praia." },
];


export const INFRA: Infra[] = INFRA_BASE.map((b): Infra => {
  const r = REAL.infra[b.id];
  if (!r) return { ...b, sobre: [], galeria: [], fotoProvisoria: true, fonte: `${SITE_ATUAL}/instalacoes/${b.id}/` };
  const sobre = r.sobre.length ? r.sobre : r.subtitulo ? [r.subtitulo] : [];
  return { ...b, nome: r.nome || b.nome, img: r.foto ? local(r.foto) : b.img, desc: resumo(sobre, b.desc), sobre, galeria: r.galeria.map(local), fotoProvisoria: r.fotoProvisoria, fonte: `${SITE_ATUAL}/instalacoes/${b.id}/` };
});

export const INFRA_HOME = ["praia", "academia", "campos-de-futebol", "quadra-de-tenis", "piscinas", "churrasqueira", "quiosques"];

/* ---------- Agenda -------------------------------------------------------- */
const MESES: Record<string, string> = { "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril", "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto", "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro" };
const ABREV: Record<string, string> = { "01": "jan", "02": "fev", "03": "mar", "04": "abr", "05": "mai", "06": "jun", "07": "jul", "08": "ago", "09": "set", "10": "out", "11": "nov", "12": "dez" };
function ev(id: string, data: string, hora: string, nome: string, cat: string, local: string, img: string, desc: string, extra: Partial<Evento> = {}): Evento {
  const [y, m, d] = data.split("-");
  return { id, data, dia: Number(d), mes: ABREV[m], mesNome: MESES[m], ano: Number(y), hora, nome, cat, local, img, desc, ...extra };
}

/** Eventos do calendário oficial (CONTENT.md) que não estão como notícia datada no site atual. */
const EVENTOS_CALENDARIO: Evento[] = [
  ev("aniversario-92-anos", "2026-05-09", "Programação completa", "Aniversário 92 anos", "Tradição", "Country Clube de Formiga", STOCK.aniversario, "Dois dias de comemoração pelos 92 anos da nossa Lagoa, em 09 e 10 de maio, com programação completa para toda a família.", { destaque: true, obs: "09 e 10 de maio de 2026" }),
  ev("1-ano-academia-country", "2026-05-17", "8h", "1 Ano Academia Country", "Esportes", "Academia", STOCK.academia, "A Academia Country completa um ano. Coquetel para os associados e DJ Dan Garcia.", { programacao: ["8h · Coquetel", "DJ Dan Garcia"] }),
  ev("sabado-na-praia-mateus-oliveira", "2026-05-30", "15h", "Sábado na Praia com Mateus Oliveira", "Show", "Praia", STOCK.show, "Tarde de música ao vivo na praia da Lagoa com Mateus Oliveira."),
  ev("36-copa-country-de-futebol", "2026-09-29", "Início da competição", "36ª Copa Country de Futebol", "Esportes", "Campos de Futebol", STOCK.futebol2, "A 36ª Copa Country de Futebol reunirá associados e atletas em uma disputa marcada pela integração, espírito esportivo e competitividade. Categorias 40+ e Livre (acima de 15 anos).", { destaque: true, programacao: ["Inscrições: 01 a 19 de agosto", "Categorias: 40+ e Livre (acima de 15 anos)", "Início: 29 de setembro"], fonte: `${SITE_ATUAL}/programacao-esportiva` }),
];

/** Eventos publicados como notícias datadas no site atual (real.json › eventos). */
const EVENTOS_SITE: Evento[] = REAL.eventos.map((e) => ({ ...e, img: e.img ? local(e.img) : STOCK.evento, obs: e.obs || undefined, programacao: e.programacao.length ? e.programacao : undefined }));

export const EVENTOS: Evento[] = [...EVENTOS_CALENDARIO, ...EVENTOS_SITE];
export const EVENTOS_ORDENADOS = [...EVENTOS].sort((a, b) => a.data.localeCompare(b.data) || a.nome.localeCompare(b.nome));

/* ---------- Notícias / comunicados (site atual) --------------------------- */
export const NOTICIAS: Noticia[] = [...REAL.comunicados]
  .sort((a, b) => Number(a.somenteImagem) - Number(b.somenteImagem))
  .map((c) => ({ ...c, img: c.img ? local(c.img) : STOCK.secretaria, data: c.data || "lagoanossa.com.br" }));
export const NOTICIAS_HOME = NOTICIAS.slice(0, 4);

/* ---------- FAQ (perguntas do site atual) --------------------------------- */
const FAQ_CAT = (q: string) => /hor[áa]rio|esportiv/i.test(q) ? "Esportes" : /sal[ãa]o|evento/i.test(q) ? "Eventos" : "Associado";
export const FAQ: FaqItem[] = [
  ...REAL.faq.map((f) => ({ cat: FAQ_CAT(f.q), q: f.q, a: f.a })),
  { cat: "Acessos", q: "Quais são os horários de funcionamento do clube?", a: "Segunda, das 14h às 21h; terça a sábado, das 7h às 21h30; domingo, das 7h às 19h. Os horários de cada atividade estão na página Funcionamento." },
  { cat: "Eventos", q: "Como acompanho a agenda do clube?", a: "Pela página Agenda de Eventos, pelo app Country Clube de Formiga e pelas redes sociais do clube." },
];

/* ---------- Diretoria 2026/2027 (CONTENT.md) ----------------------------- */
export const GESTAO = "Gestão 2026/2027";
export const DIRETORIA: Membro[] = [
  { nome: "Ednaldo Silva Durço", cargo: "Presidente", gestao: GESTAO },
  { nome: "Jarbas Leal", cargo: "Vice Presidente", gestao: GESTAO },
  { nome: "Vicente de Paulo Faria", cargo: "1º Tesoureiro", gestao: GESTAO },
  { nome: "Gilberto Calixto Ribeiro", cargo: "2º Tesoureiro", gestao: GESTAO },
  { nome: "Eduardo Cesar de S. Câmara", cargo: "Secretário", gestao: GESTAO },
  { nome: "Simônie Maria Borges", cargo: "Diretor de Patrimônio", gestao: GESTAO },
  { nome: "Gustavo Miguel Nepomuceno", cargo: "Diretor Social", gestao: GESTAO },
  { nome: "Paulo Cezar Clarismar", cargo: "Diretor de Esportes", gestao: GESTAO },
  { nome: "Konrado Ribeiro", cargo: "Diretor de Esportes", gestao: GESTAO },
  { nome: "Américo Fonseca Portela Neto", cargo: "Diretor de Esportes", gestao: GESTAO },
  { nome: "Fábio Eustáquio de Melo", cargo: "Diretor de Esportes", gestao: GESTAO },
  { nome: "Kleber de Souza Quadros", cargo: "Diretor de Esportes", gestao: GESTAO },
];
export const CONSELHEIROS = [
  "Julio Cezar Ribeiro Andrade", "Ruy Martins Ferreira Junior", "Anderson Souto", "Eugênio Vilela Júnior",
  "Rosilene Cristina Terra Gualberto", "Mariana de Oliveira Veloso Muniz", "Nalvo de Oliveira Azevedo",
];

/* ---------- Convênios (site atual › /convenios) --------------------------- */
export const CONVENIOS: Convenio[] = [
  { nome: REAL.paginas.convenio.nome, cat: "Clube conveniado", beneficio: "Acesso recíproco de associados, conforme o Instrumento Particular de Convênio", endereco: REAL.paginas.convenio.endereco, site: REAL.paginas.convenio.site, instrumento: REAL.paginas.convenio.instrumento },
];

/* ---------- Galeria (álbuns do site atual) -------------------------------- */
export const GALERIA: Album[] = REAL.albuns.map((a) => ({ ...a, data: a.data || "Acervo do clube", cover: local(a.cover), fotos: a.fotos.map(local) }));

/* ---------- História (texto oficial, literal) ----------------------------- */
export const HISTORIA_TEXTO: string[] = REAL.paginas.historia;

/** Linha do tempo reduzida aos marcos confirmados pelo texto oficial + Academia (2025). */
export const HISTORIA_TIMELINE = [
  { ano: "1934", titulo: "A descoberta da Lagoa do Fundão", texto: "Famílias tradicionais de Formiga, sem espaço para o lazer, encontram na Lagoa do Fundão o lugar ideal para o descanso e a diversão." },
  { ano: "1934", titulo: "A estrada, o barracão e o trampolim", texto: "Abertura da estrada no meio da mata, limpeza das margens, construção do barracão de abrigo e o primeiro trampolim de madeira." },
  { ano: "1934", titulo: "Fundação oficial em 6 de maio", texto: "Com o lugar já tomado pelos formiguenses nos finais de semana, o clube é fundado oficialmente no sistema de sociedade por cotas." },
  { ano: "Hoje", titulo: "Gestões que deixam legado", texto: "A cada gestão, novas diretrizes. Grandes nomes passaram pela administração e são lembrados em placas que dão nome às instalações." },
  { ano: "2025", titulo: "Academia Country", texto: "Inauguração da academia nova com vista para a praia — o primeiro aniversário foi comemorado em 17 de maio de 2026." },
  { ano: "2026", titulo: "92 anos da nossa Lagoa", texto: "Comemoração dos 92 anos em 09 e 10 de maio, com programação para toda a família." },
];

export const HISTORIA_FOTOS = [
  { src: OFICIAL.historia1, cap: "Acervo histórico do Country Clube" },
  { src: OFICIAL.historia2, cap: "Os primeiros anos na Lagoa do Fundão" },
  { src: OFICIAL.historia3, cap: "A praia e o trampolim" },
  { src: OFICIAL.historia4, cap: "Finais de semana na Lagoa" },
  { src: OFICIAL.historia5, cap: "As instalações crescem com o clube" },
  { src: OFICIAL.historia6, cap: "Gerações de formiguenses" },
];

/* ---------- Estatuto (sumário ilustrativo — extrair títulos reais do PDF) - */
export const ESTATUTO_CAPITULOS = [
  { num: "I", titulo: "Da Associação e seus Fins", desc: "Natureza jurídica, denominação social, sede e duração da associação." },
  { num: "II", titulo: "Dos Associados", desc: "Categorias de associação, direitos, deveres e processo de admissão." },
  { num: "III", titulo: "Do Patrimônio e da Manutenção", desc: "Receitas, mensalidades, taxas e regras de contribuição." },
  { num: "IV", titulo: "Da Administração", desc: "Assembleias, presidência, diretoria, conselhos e processo eleitoral." },
  { num: "V", titulo: "Das Penalidades", desc: "Advertências, suspensões e exclusões — sempre com direito de defesa." },
  { num: "VI", titulo: "Do Uso das Dependências", desc: "Horários, convidados, vestimenta, reservas e responsabilidade civil." },
  { num: "VII", titulo: "Da Praia e dos Esportes Aquáticos", desc: "Normas específicas para o uso da Lagoa, decks e piscinas." },
  { num: "VIII", titulo: "Das Disposições Finais", desc: "Vigência, revisões periódicas e foro para questões litigiosas." },
];

/* ---------- Funcionamento (site atual › /funcionamento e /horarios) ------- */
export const FUNCIONAMENTO: { dia: string; horario: string }[] = REAL.paginas.funcionamento;
export const FUNCIONAMENTO_RESUMO = FUNCIONAMENTO.map((f) => `${f.dia}: ${f.horario}`).join(" · ");
export const HORARIOS_ATIVIDADES: Tabela[] = REAL.paginas.horarios.map((h) => ({ titulo: h.atividade, colunas: h.colunas, linhas: h.linhas, nota: h.nota }));

/* ---------- Direitos e Deveres (Estatuto, arts. 27 e 28 — site atual) ----- */
export const DIREITOS: Regras = REAL.paginas.direitos;
export const DEVERES: Regras = REAL.paginas.deveres;

/* ---------- Números do clube ---------------------------------------------- */
export const NUMEROS = { anos: "92", familias: "4.000+", modalidades: String(MODALIDADES.length), area: "200K" };
