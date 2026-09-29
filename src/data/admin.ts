/**
 * Dados mock do painel administrativo (sem backend ainda).
 * Tipos derivados de "Modelos de dados sugeridos" do handoff.
 * As páginas do painel carregam estes dados em `useState` e editam localmente.
 */
import { SITE } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */
export type StatusConteudo = "publicado" | "rascunho" | "agendado";
export type StatusModalidade = "ativa" | "rascunho";
export type StatusInfra = "publicada" | "rascunho";
export type StatusConvenio = "ativo" | "expirando" | "suspenso";
export type StatusManifestacao = "pendente" | "em-analise" | "respondida" | "arquivada";
export type StatusAssociado = "ativo" | "inadimplente" | "suspenso";
export type TipoManifestacao = "Reclamação" | "Sugestão" | "Elogio";

export interface Modalidade {
  id: string;
  nome: string;
  cat: string;
  img: string;
  desc: string;
  horario: string;
  publico: string;
  professor: string;
  vagas: number | null;
  inscritos: number;
  status: StatusModalidade;
}

export interface Infra {
  id: string;
  nome: string;
  cat: string;
  img: string;
  tag?: string;
  desc: string;
  fotos: string[];
  status: StatusInfra;
}

export interface Evento {
  id: string;
  /** ISO YYYY-MM-DD */
  data: string;
  /** ISO YYYY-MM-DD (eventos de vários dias) */
  dataFim?: string;
  hora: string;
  nome: string;
  cat: string;
  local: string;
  destaque: boolean;
  img: string;
  desc: string;
  capacidade: number | null;
  inscritos: number;
  status: StatusConteudo;
  inscricoesApp: boolean;
  convidados: boolean;
  couvert: boolean;
}

export interface Noticia {
  id: string;
  tag: string;
  titulo: string;
  data: string;
  img: string;
  resumo: string;
  conteudo: string;
  autor: string;
  status: StatusConteudo;
  visualizacoes: number;
  push: boolean;
  email: boolean;
  importante: boolean;
}

export interface Faq {
  id: string;
  cat: string;
  q: string;
  a: string;
  atualizado: string;
  autor: string;
}

export interface Membro {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  gestao: string;
  foto: string;
}

export interface Convenio {
  id: string;
  nome: string;
  cat: string;
  beneficio: string;
  vigencia: string;
  status: StatusConvenio;
  contato: string;
}

export interface Album {
  id: string;
  titulo: string;
  data: string;
  fotos: string[];
  cover: string;
  publicado: boolean;
  destaque: boolean;
}

export interface Manifestacao {
  id: string;
  tipo: TipoManifestacao;
  area: string;
  autor: string;
  data: string;
  status: StatusManifestacao;
  urgente: boolean;
  texto: string;
  resposta: string;
  encaminhado?: string;
}

export interface Associado {
  mat: string;
  nome: string;
  titular: string;
  plano: string;
  status: StatusAssociado;
  desde: string;
  email: string;
  fone: string;
}

export interface HorarioArea {
  area: string;
  seg: string;
  sab: string;
  dom: string;
}

export interface Config {
  contato: { telefone: string; whatsapp: string; email: string; endereco: string; instagram: string; facebook: string };
  horarios: HorarioArea[];
  hero: { eyebrow: string; titulo: string; subtitulo: string; cta1: string; cta2: string };
  redes: { instagram: string; facebook: string; youtube: string; whatsapp: string };
  seo: { titulo: string; descricao: string; palavras: string };
  ultimaAtualizacao: { quando: string; por: string };
}

export interface PaginaSite {
  id: string;
  titulo: string;
  url: string;
  atualizada: string;
  autor: string;
  visualizacoes: number;
}

export interface AtividadeDia {
  dia: string;
  acessos: number;
  eventos: number;
}

export interface AtividadeEquipe {
  hora: string;
  tipo: "evento" | "comunicado" | "ouvidoria" | "foto" | "modalidade" | "pagina";
  autor: string;
  acao: string;
  alvo: string;
  status: string;
}

/* ------------------------------------------------------------------ */
/* Imagens placeholder (Unsplash) — substituir por fotos do clube       */
/* ------------------------------------------------------------------ */
const LOCAL_PLACEHOLDERS = process.env.NEXT_PUBLIC_LOCAL_PLACEHOLDERS === "1";
const U = (id: string, w = 1200) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const ADMIN_IMG_REMOTE = {
  praia: U("photo-1507525428034-b723cf961d3e"),
  lagoa: U("photo-1500530855697-b586d89ba3ee"),
  lagoaSunset: U("photo-1473773508845-188df298d2d1"),
  tenis: U("photo-1554068865-24cecd4e34b8"),
  tenis2: U("photo-1622279457486-62dcc4a431d6"),
  futebol: U("photo-1459865264687-595d652de67e"),
  futebol2: U("photo-1551958219-acbc608c6377"),
  academia: U("photo-1534438327276-14e5300c3a48"),
  academia2: U("photo-1571902943202-507ec2618e8f"),
  piscina: U("photo-1576013551627-0cc20b96c2a7"),
  volei: U("photo-1612872087720-bb876e2e67d1"),
  beachTenis: U("photo-1626224583764-f87db24ac4ea"),
  futevolei: U("photo-1517649763962-0c623066013b"),
  churrasco: U("photo-1529543544282-ea669407fca3"),
  familia: U("photo-1502086223501-7ea6ecd79368"),
  evento: U("photo-1492684223066-81342ee5ff30"),
  show: U("photo-1501281668745-f7f57925c3b4"),
  salao: U("photo-1519671482749-fd09be7ccebf"),
  quadraCoberta: U("photo-1518614846840-bd2f49df1a4d"),
  natacao: U("photo-1530549387789-4c1017266635"),
  hidro: U("photo-1576678927484-cc907957088c"),
  yoga: U("photo-1599901860904-17e6ed7083a0"),
  pilates: U("photo-1518611012118-696072aa579a"),
  basquete: U("photo-1546519638-68e109498ffc"),
  futsal: U("photo-1575361204480-aadea25e6e68"),
  ballet: U("photo-1508807526345-15e9b5f4eaff"),
  jiujitsu: U("photo-1555597673-b21d5c935865"),
  karate: U("photo-1544367567-0f2fcb009e0b"),
  musculacao: U("photo-1581009146145-b5ef050c2e1e"),
  funcional: U("photo-1517836357463-d25dfeac3438"),
  localizada: U("photo-1518310383802-640c2de311b2"),
  fisioterapia: U("photo-1559757148-5c350d0d3c56"),
  massagem: U("photo-1544161515-4ab6ce6db874"),
  peteca: U("photo-1461896836934-ffe607ba8211"),
  bar: U("photo-1514933651103-005eec06c04b"),
  restaurante: U("photo-1552566626-52f8b828add9"),
  quiosque: U("photo-1533105079780-92b9be482077"),
  sinuca: U("photo-1575553939928-d4d1a2bf2c7d"),
  parquinho: U("photo-1596464716127-f2a82984de30"),
  sauna: U("photo-1583417267826-aebc4d1542e1"),
  secretaria: U("photo-1497366216548-37526070297c"),
  ginasio: U("photo-1504450758481-7338eba7524a"),
  artesMarciais: U("photo-1552072092-7f9b8d63efcb"),
  criancas: U("photo-1472162072942-cd5147eb3902"),
  rock: U("photo-1470229722913-7c0e2dbbafd3"),
  festaJunina: U("photo-1533174072545-7a4b6ad7a6c3"),
  copa: U("photo-1489944440615-453fc2b6a9a9"),
  aniversario: U("photo-1464349095431-e9a21285b5f3"),
} as const;
export const ADMIN_IMG = (LOCAL_PLACEHOLDERS
  ? Object.fromEntries(Object.keys(ADMIN_IMG_REMOTE).map((k) => [k, `/images/placeholder/${k}.svg`]))
  : ADMIN_IMG_REMOTE) as typeof ADMIN_IMG_REMOTE;

const POOL = Object.values(ADMIN_IMG);
/** Gera uma lista de N fotos placeholder a partir de um deslocamento. */
const fotos = (n: number, offset = 0) => Array.from({ length: n }, (_, i) => POOL[(offset + i) % POOL.length]);

/* ------------------------------------------------------------------ */
/* Usuário logado / KPIs                                               */
/* ------------------------------------------------------------------ */
export const ADMIN_USER = {
  nome: "Ana Paula Ribeiro",
  cargo: "Comunicação · Secretaria",
  avatar: "AR",
  online: true,
};

export const STATS = {
  associados: 4128,
  associadosDelta: "+12",
  associadosSub: "novos este mês",
  eventosAgendados: 18,
  eventosSub: "4 nas próximas 2 semanas",
  reservasMes: 247,
  reservasDelta: "+18%",
  reservasSub: "vs. mês anterior",
  acessosSite: 12840,
  acessosDelta: "+24%",
  acessosSub: "últimos 30 dias",
  ouvidoriaPendente: 7,
  comunicadosAtivos: 3,
  modalidadesAtivas: 21,
  fotosNoAcervo: 4218,
  areasPublicadas: 18,
};

export const SITE_ACTIVITY: AtividadeDia[] = [
  { dia: "Seg", acessos: 1820, eventos: 12 },
  { dia: "Ter", acessos: 1540, eventos: 8 },
  { dia: "Qua", acessos: 1980, eventos: 14 },
  { dia: "Qui", acessos: 1720, eventos: 11 },
  { dia: "Sex", acessos: 2210, eventos: 18 },
  { dia: "Sáb", acessos: 2640, eventos: 26 },
  { dia: "Dom", acessos: 2030, eventos: 21 },
];

export const TIMELINE: AtividadeEquipe[] = [
  { hora: "há 12 min", tipo: "evento", autor: "Ana Paula R.", acao: "publicou o evento", alvo: "Arraiá do Country · 20/jun", status: "publicado" },
  { hora: "há 1 h", tipo: "comunicado", autor: "Roberto C.", acao: "enviou comunicado", alvo: "Manutenção semestral da piscina", status: "enviado" },
  { hora: "há 2 h", tipo: "ouvidoria", autor: "Sistema", acao: "recebeu manifestação", alvo: "Reclamação · Bar da Praia", status: "pendente" },
  { hora: "há 3 h", tipo: "foto", autor: "Jonas A.", acao: "adicionou 24 fotos a", alvo: "Álbum · Aniversário 92 anos", status: "rascunho" },
  { hora: "ontem", tipo: "modalidade", autor: "Helena T.", acao: "atualizou horário de", alvo: "Hidroginástica", status: "publicado" },
  { hora: "ontem", tipo: "evento", autor: "Ana Paula R.", acao: "criou o evento", alvo: "36ª Copa Country de Futebol", status: "rascunho" },
  { hora: "2 dias atrás", tipo: "pagina", autor: "Carlos E.", acao: "atualizou a página", alvo: "História do clube", status: "publicado" },
];

/* ------------------------------------------------------------------ */
/* Eventos                                                              */
/* ------------------------------------------------------------------ */
export const ADMIN_EVENTOS: Evento[] = [
  { id: "e1", data: "2026-05-09", dataFim: "2026-05-10", hora: "10h", nome: "Aniversário de 92 anos do Country", cat: "Tradição", local: "Sede social", destaque: true, img: ADMIN_IMG.aniversario, desc: "Dois dias de festa para celebrar os 92 anos do clube, com programação para toda a família.", capacidade: 800, inscritos: 640, status: "publicado", inscricoesApp: true, convidados: true, couvert: false },
  { id: "e2", data: "2026-05-17", hora: "8h", nome: "1 Ano Academia Country", cat: "Esportes", local: "Academia", destaque: false, img: ADMIN_IMG.academia2, desc: "Aulão comemorativo do primeiro ano da nova academia, com a equipe técnica.", capacidade: 120, inscritos: 96, status: "publicado", inscricoesApp: true, convidados: false, couvert: false },
  { id: "e3", data: "2026-05-30", hora: "15h", nome: "Sábado na Praia com Mateus Oliveira", cat: "Show", local: "Praia", destaque: true, img: ADMIN_IMG.show, desc: "Tarde de música ao vivo na praia do clube com Mateus Oliveira.", capacidade: 500, inscritos: 438, status: "publicado", inscricoesApp: true, convidados: true, couvert: true },
  { id: "e4", data: "2026-06-13", hora: "17h", nome: "Country na Copa — 1º jogo do Brasil", cat: "Festa", local: "Espaço Multiuso", destaque: true, img: ADMIN_IMG.copa, desc: "Telão, bar e torcida organizada para acompanhar o primeiro jogo do Brasil na Copa.", capacidade: 600, inscritos: 512, status: "publicado", inscricoesApp: true, convidados: true, couvert: false },
  { id: "e5", data: "2026-06-19", hora: "19h", nome: "Country na Copa — 2º jogo do Brasil", cat: "Festa", local: "Espaço Multiuso", destaque: false, img: ADMIN_IMG.copa, desc: "Segundo jogo da fase de grupos no telão do clube.", capacidade: 600, inscritos: 210, status: "publicado", inscricoesApp: true, convidados: true, couvert: false },
  { id: "e6", data: "2026-06-20", hora: "18h", nome: "Arraiá do Country", cat: "Festa", local: "Sede social", destaque: true, img: ADMIN_IMG.festaJunina, desc: "Quadrilha, comidas típicas, fogueira e forró para toda a família.", capacidade: 800, inscritos: 412, status: "publicado", inscricoesApp: true, convidados: true, couvert: true },
  { id: "e7", data: "2026-06-24", hora: "17h", nome: "Country na Copa — 3º jogo do Brasil", cat: "Festa", local: "Espaço Multiuso", destaque: false, img: ADMIN_IMG.copa, desc: "Terceiro jogo da fase de grupos no telão do clube.", capacidade: 600, inscritos: 0, status: "agendado", inscricoesApp: true, convidados: true, couvert: false },
  { id: "e8", data: "2026-07-18", hora: "16h", nome: "Festival do Rock na Praia", cat: "Show", local: "Praia", destaque: true, img: ADMIN_IMG.rock, desc: "Bandas locais e convidadas no palco montado na praia do clube.", capacidade: 700, inscritos: 0, status: "agendado", inscricoesApp: true, convidados: true, couvert: true },
  { id: "e9", data: "2026-07-27", dataFim: "2026-07-31", hora: "8h", nome: "35ª Colônia de Férias", cat: "Família", local: "Parquinho e Piscinas", destaque: false, img: ADMIN_IMG.criancas, desc: "Uma semana de atividades recreativas e esportivas para as crianças associadas.", capacidade: 150, inscritos: 118, status: "publicado", inscricoesApp: true, convidados: false, couvert: false },
  { id: "e10", data: "2026-09-29", hora: "19h", nome: "36ª Copa Country de Futebol", cat: "Esportes", local: "Campos de Futebol", destaque: false, img: ADMIN_IMG.futebol2, desc: "Início da tradicional Copa Country. Inscrições de equipes pela Secretaria.", capacidade: 256, inscritos: 0, status: "rascunho", inscricoesApp: false, convidados: false, couvert: false },
];

export const EVENTO_CATEGORIAS = ["Festa", "Show", "Esportes", "Família", "Tradição", "Gastronomia"];

/* ------------------------------------------------------------------ */
/* Notícias                                                             */
/* ------------------------------------------------------------------ */
export const ADMIN_NOTICIAS: Noticia[] = [
  { id: "n1", tag: "Country 92", titulo: "92 anos da nossa Lagoa: o que vem por aí em 2026", data: "12 mai 2026", img: ADMIN_IMG.aniversario, resumo: "A programação de aniversário e as novidades do ano para os associados.", conteudo: "# 92 anos da nossa Lagoa\n\nO Country Clube de Formiga completa 92 anos com uma programação especial...", autor: "Ana Paula Ribeiro", status: "publicado", visualizacoes: 1247, push: true, email: false, importante: false },
  { id: "n2", tag: "Obras", titulo: "Reforma do Salão Azul entra na reta final", data: "06 mai 2026", img: ADMIN_IMG.salao, resumo: "Pintura, iluminação e novo piso devem ser concluídos até o fim do mês.", conteudo: "# Reforma do Salão Azul\n\nAs obras seguem dentro do cronograma...", autor: "Carlos Faria", status: "publicado", visualizacoes: 832, push: false, email: false, importante: false },
  { id: "n3", tag: "Esportes", titulo: "Equipe de natação traz 14 medalhas de Belo Horizonte", data: "28 abr 2026", img: ADMIN_IMG.natacao, resumo: "Atletas do clube brilharam no Campeonato Mineiro de Natação.", conteudo: "# 14 medalhas\n\nNossa equipe de natação...", autor: "Jonas Almeida", status: "publicado", visualizacoes: 1056, push: true, email: false, importante: false },
  { id: "n4", tag: "Comunicado", titulo: "Manutenção semestral da piscina principal", data: "22 abr 2026", img: ADMIN_IMG.piscina, resumo: "A piscina principal ficará fechada entre 27 e 30 de abril para manutenção.", conteudo: "# Manutenção da piscina\n\nInformamos que...", autor: "Roberto Camargo", status: "publicado", visualizacoes: 2418, push: true, email: true, importante: true },
  { id: "n5", tag: "Avisos", titulo: "Resultado da eleição do Conselho Fiscal", data: "15 abr 2026", img: ADMIN_IMG.evento, resumo: "Confira os conselheiros eleitos para o biênio.", conteudo: "", autor: "Mariana Lopes", status: "rascunho", visualizacoes: 0, push: false, email: false, importante: false },
];

export const NOTICIA_CATEGORIAS = ["Avisos", "Comunicado", "Obras", "Esportes", "Country 92", "Eventos"];

/* ------------------------------------------------------------------ */
/* Modalidades (21 — lista real do clube)                               */
/* ------------------------------------------------------------------ */
export const ADMIN_MODALIDADES: Modalidade[] = [
  { id: "ballet-jazz", nome: "Ballet/Jazz", cat: "Dança", img: ADMIN_IMG.ballet, desc: "Turmas de ballet clássico e jazz por faixa etária.", horario: "Seg/Qua 17h–19h", publico: "A partir de 4 anos", professor: "Lívia Andrade", vagas: 40, inscritos: 34, status: "ativa" },
  { id: "basquete", nome: "Basquete", cat: "Esportes", img: ADMIN_IMG.basquete, desc: "Escolinha e treinos no ginásio poliesportivo.", horario: "Ter/Qui 18h–20h", publico: "A partir de 8 anos", professor: "Marcelo Reis", vagas: 30, inscritos: 22, status: "ativa" },
  { id: "beach-tenis", nome: "Beach Tenis", cat: "Praia", img: ADMIN_IMG.beachTenis, desc: "Quadras de areia à beira da Lagoa.", horario: "Seg–Sáb 7h–21h", publico: "A partir de 8 anos", professor: "Lucas Pereira", vagas: 80, inscritos: 62, status: "ativa" },
  { id: "fisioterapia", nome: "Fisioterapia", cat: "Bem-estar", img: ADMIN_IMG.fisioterapia, desc: "Atendimento no Estúdio de Pilates e Fisioterapia.", horario: "Seg–Sex 8h–18h (agendamento)", publico: "Todas as idades", professor: "Dra. Renata Campos", vagas: null, inscritos: 48, status: "ativa" },
  { id: "futebol", nome: "Futebol", cat: "Esportes", img: ADMIN_IMG.futebol, desc: "Escolinha e categorias de base nos campos do clube.", horario: "Seg–Sex 17h–20h", publico: "A partir de 6 anos", professor: "Paulo Henrique", vagas: 160, inscritos: 142, status: "ativa" },
  { id: "futevolei", nome: "Futevôlei", cat: "Praia", img: ADMIN_IMG.futevolei, desc: "Aulas na areia com professor titulado.", horario: "Ter/Qui/Sáb 17h–20h", publico: "A partir de 12 anos", professor: "Rodrigo Salles", vagas: 32, inscritos: 24, status: "ativa" },
  { id: "futsal", nome: "Futsal", cat: "Esportes", img: ADMIN_IMG.futsal, desc: "Treinos no ginásio, turmas por idade.", horario: "Seg/Qua/Sex 18h–21h", publico: "A partir de 6 anos", professor: "Rafael Lima", vagas: 60, inscritos: 51, status: "ativa" },
  { id: "ginastica-funcional", nome: "Ginástica Funcional", cat: "Fitness", img: ADMIN_IMG.funcional, desc: "Circuitos funcionais na academia e ao ar livre.", horario: "Seg–Sex 6h, 8h, 18h, 19h", publico: "A partir de 16 anos", professor: "Camila Tavares", vagas: 60, inscritos: 58, status: "ativa" },
  { id: "ginastica-localizada", nome: "Ginástica Localizada", cat: "Fitness", img: ADMIN_IMG.localizada, desc: "Aulas coletivas de fortalecimento e resistência.", horario: "Seg/Qua/Sex 7h e 19h", publico: "A partir de 16 anos", professor: "Camila Tavares", vagas: 40, inscritos: 29, status: "ativa" },
  { id: "hidroginastica", nome: "Hidroginástica", cat: "Aquáticos", img: ADMIN_IMG.hidro, desc: "Aulas dinâmicas na piscina com foco em mobilidade.", horario: "Seg/Qua/Sex 9h, 10h, 18h", publico: "A partir de 18 anos", professor: "Beatriz Coelho", vagas: 90, inscritos: 78, status: "ativa" },
  { id: "jiu-jitsu", nome: "Jiu jitsu", cat: "Artes marciais", img: ADMIN_IMG.jiujitsu, desc: "Escola de artes marciais — turmas infantil e adulto.", horario: "Ter/Qui 19h–21h", publico: "A partir de 5 anos", professor: "Anderson Braga", vagas: 40, inscritos: 36, status: "ativa" },
  { id: "karate", nome: "Karatê", cat: "Artes marciais", img: ADMIN_IMG.karate, desc: "Karatê tradicional com graduação oficial.", horario: "Seg/Qua 18h–20h", publico: "A partir de 5 anos", professor: "Sensei Hiroshi Tanaka", vagas: 40, inscritos: 27, status: "ativa" },
  { id: "liberacao-miofascial", nome: "Liberação Miofascial, Drenagem e Ventosaterapia", cat: "Bem-estar", img: ADMIN_IMG.massagem, desc: "Terapias manuais no estúdio, com agendamento.", horario: "Seg–Sex 9h–18h (agendamento)", publico: "A partir de 18 anos", professor: "Fernanda Duarte", vagas: null, inscritos: 31, status: "ativa" },
  { id: "massagem-feminina", nome: "Massagem Feminina", cat: "Bem-estar", img: ADMIN_IMG.massagem, desc: "Massagem relaxante e terapêutica para associadas.", horario: "Ter/Qui 9h–17h (agendamento)", publico: "Mulheres a partir de 18 anos", professor: "Fernanda Duarte", vagas: null, inscritos: 19, status: "ativa" },
  { id: "musculacao", nome: "Musculação", cat: "Fitness", img: ADMIN_IMG.musculacao, desc: "Academia completa com acompanhamento da equipe técnica.", horario: "Seg–Sex 5h30–22h · Sáb 7h–14h", publico: "A partir de 14 anos", professor: "Equipe técnica", vagas: null, inscritos: 412, status: "ativa" },
  { id: "natacao", nome: "Natação", cat: "Aquáticos", img: ADMIN_IMG.natacao, desc: "Turmas por faixa etária e nível nas piscinas do clube.", horario: "Seg–Sex 6h–21h", publico: "A partir de 3 anos", professor: "Cláudia Resende", vagas: 240, inscritos: 186, status: "ativa" },
  { id: "peteca", nome: "Peteca", cat: "Esportes", img: ADMIN_IMG.peteca, desc: "Tradição mineira nas quadras do clube.", horario: "Seg–Dom 7h–22h", publico: "Todas as idades", professor: "—", vagas: null, inscritos: 44, status: "ativa" },
  { id: "pilates", nome: "Pilates", cat: "Fitness", img: ADMIN_IMG.pilates, desc: "Pilates de solo e aparelhos no estúdio.", horario: "Seg–Sex 7h–20h", publico: "A partir de 16 anos", professor: "Dra. Renata Campos", vagas: 48, inscritos: 45, status: "ativa" },
  { id: "tenis", nome: "Tênis", cat: "Esportes", img: ADMIN_IMG.tenis, desc: "Quadras iluminadas e aulas para todas as idades.", horario: "Seg–Sex 7h–22h · Sáb 7h–18h", publico: "A partir de 6 anos", professor: "Marcos Andrade", vagas: 96, inscritos: 84, status: "ativa" },
  { id: "volei", nome: "Vôlei", cat: "Esportes", img: ADMIN_IMG.volei, desc: "Treinos no ginásio e ligas internas.", horario: "Ter/Qui 19h–21h", publico: "A partir de 10 anos", professor: "Rafael Lima", vagas: 36, inscritos: 28, status: "ativa" },
  { id: "yoga", nome: "Yoga", cat: "Fitness", img: ADMIN_IMG.yoga, desc: "Turmas com vista para a Lagoa. Vagas limitadas.", horario: "Ter/Qui 7h e 19h", publico: "A partir de 16 anos", professor: "Camila Tavares", vagas: 30, inscritos: 26, status: "ativa" },
];

export const MODALIDADE_CATEGORIAS = ["Esportes", "Praia", "Aquáticos", "Fitness", "Artes marciais", "Dança", "Bem-estar"];

/* ------------------------------------------------------------------ */
/* Infraestrutura (18 — lista real do clube)                            */
/* ------------------------------------------------------------------ */
export const ADMIN_INFRA: Infra[] = [
  { id: "area-familiar", nome: "Área Familiar", cat: "Lazer", img: ADMIN_IMG.familia, desc: "Espaço de convivência com gramados e sombra para as famílias.", fotos: fotos(14, 0), status: "publicada" },
  { id: "praia", nome: "Praia", cat: "Lazer", img: ADMIN_IMG.praia, tag: "Destaque", desc: "Praia às margens da Lagoa do Fundão, cartão-postal do clube.", fotos: fotos(24, 3), status: "publicada" },
  { id: "secretaria", nome: "Secretaria", cat: "Serviços", img: ADMIN_IMG.secretaria, desc: "Atendimento ao associado, carteirinhas e reservas.", fotos: fotos(4, 6), status: "publicada" },
  { id: "bares", nome: "Bares", cat: "Alimentação", img: ADMIN_IMG.bar, desc: "Bares da praia e da sede com serviço de mesa.", fotos: fotos(8, 9), status: "publicada" },
  { id: "quiosques", nome: "Quiosques", cat: "Lazer", img: ADMIN_IMG.quiosque, desc: "Quiosques cobertos para reuniões e confraternizações.", fotos: fotos(10, 12), status: "publicada" },
  { id: "sinuca", nome: "Sinuca", cat: "Lazer", img: ADMIN_IMG.sinuca, desc: "Salão de sinuca com mesas oficiais.", fotos: fotos(5, 15), status: "publicada" },
  { id: "churrasqueira", nome: "Churrasqueira", cat: "Lazer", img: ADMIN_IMG.churrasco, desc: "Churrasqueiras com reserva pelo app e pela Secretaria.", fotos: fotos(9, 18), status: "publicada" },
  { id: "restaurante", nome: "Restaurante", cat: "Alimentação", img: ADMIN_IMG.restaurante, desc: "Restaurante com vista para a Lagoa.", fotos: fotos(7, 21), status: "publicada" },
  { id: "quadra-poliesportiva", nome: "Quadra Poliesportiva", cat: "Esportes", img: ADMIN_IMG.quadraCoberta, desc: "Quadra para futsal, basquete, vôlei e peteca.", fotos: fotos(6, 24), status: "publicada" },
  { id: "quadra-tenis", nome: "Quadra de Tênis", cat: "Esportes", img: ADMIN_IMG.tenis2, desc: "Quadras iluminadas para aulas e jogos.", fotos: fotos(8, 27), status: "publicada" },
  { id: "artes-marciais", nome: "Escolas de Artes Marciais", cat: "Esportes", img: ADMIN_IMG.artesMarciais, desc: "Tatames para jiu jitsu e karatê.", fotos: fotos(6, 30), status: "publicada" },
  { id: "campos-futebol", nome: "Campos de Futebol", cat: "Esportes", img: ADMIN_IMG.futebol2, desc: "Campos gramados e iluminados, com vestiários.", fotos: fotos(12, 33), status: "publicada" },
  { id: "estudio-pilates", nome: "Estúdio de Pilates e Fisioterapia", cat: "Esportes", img: ADMIN_IMG.pilates, desc: "Estúdio equipado para pilates e reabilitação.", fotos: fotos(6, 36), status: "publicada" },
  { id: "academia", nome: "Academia", cat: "Esportes", img: ADMIN_IMG.academia2, tag: "Nova", desc: "Academia completa inaugurada em 2025.", fotos: fotos(18, 39), status: "publicada" },
  { id: "parquinho", nome: "Parquinho", cat: "Lazer", img: ADMIN_IMG.parquinho, desc: "Brinquedos e área segura para as crianças.", fotos: fotos(7, 42), status: "publicada" },
  { id: "ginasio", nome: "Ginásio", cat: "Esportes", img: ADMIN_IMG.ginasio, desc: "Ginásio coberto para treinos, jogos e eventos.", fotos: fotos(9, 45), status: "publicada" },
  { id: "saunas", nome: "Saunas", cat: "Lazer", img: ADMIN_IMG.sauna, desc: "Saunas seca e a vapor junto às piscinas.", fotos: fotos(4, 2), status: "publicada" },
  { id: "piscinas", nome: "Piscinas", cat: "Aquáticos", img: ADMIN_IMG.piscina, desc: "Piscinas adulto e infantil, com área de descanso.", fotos: fotos(9, 5), status: "publicada" },
];

export const INFRA_CATEGORIAS = ["Lazer", "Esportes", "Aquáticos", "Alimentação", "Serviços", "Eventos"];

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */
export const ADMIN_FAQ: Faq[] = [
  { id: "f1", cat: "Associado", q: "Como atualizo meus dados cadastrais?", a: "Pela Secretaria Web ou presencialmente na Secretaria, com documento com foto.", atualizado: "14 abr 2026", autor: "Ana Paula R." },
  { id: "f2", cat: "Associado", q: "Como emito a segunda via do boleto?", a: "Acesse a Secretaria Web, menu Financeiro, e clique em 2ª via.", atualizado: "02 mar 2026", autor: "Roberto C." },
  { id: "f3", cat: "Reservas", q: "Como reservo uma churrasqueira?", a: "Pelo app do clube ou na Secretaria, com até 30 dias de antecedência.", atualizado: "20 abr 2026", autor: "Ana Paula R." },
  { id: "f4", cat: "Reservas", q: "Posso levar convidados ao clube?", a: "Sim. Convidados devem ser cadastrados na portaria e pagam a taxa vigente.", atualizado: "15 fev 2026", autor: "Ana Paula R." },
  { id: "f5", cat: "Esportes", q: "Como me inscrevo nas escolinhas?", a: "Na Secretaria, apresentando atestado médico e carteirinha do associado.", atualizado: "08 jan 2026", autor: "Jonas A." },
  { id: "f6", cat: "Esportes", q: "A academia exige avaliação física?", a: "Sim, a avaliação inicial é gratuita e agendada com a equipe técnica.", atualizado: "12 mar 2026", autor: "Jonas A." },
  { id: "f7", cat: "Eventos", q: "Posso alugar o Espaço Multiuso?", a: "Sim, associados podem reservar mediante disponibilidade e taxa de uso.", atualizado: "01 fev 2026", autor: "Helena T." },
  { id: "f8", cat: "Eventos", q: "Há programação especial para crianças?", a: "Sim: Colônia de Férias em julho e atividades no parquinho nos fins de semana.", atualizado: "18 abr 2026", autor: "Helena T." },
  { id: "f9", cat: "Acessos", q: "Quais são os horários de funcionamento?", a: "O clube funciona todos os dias, das 6h às 22h. Confira os horários por área.", atualizado: "03 mai 2026", autor: "Ana Paula R." },
  { id: "f10", cat: "Acessos", q: "Preciso da carteirinha para entrar?", a: "Sim, a carteirinha (física ou no app) é obrigatória na portaria.", atualizado: "03 mai 2026", autor: "Ana Paula R." },
];

export const FAQ_CATEGORIAS = ["Associado", "Reservas", "Esportes", "Eventos", "Acessos"];

/* ------------------------------------------------------------------ */
/* Ouvidoria                                                            */
/* ------------------------------------------------------------------ */
export const ADMIN_OUVIDORIA: Manifestacao[] = [
  { id: "o1", tipo: "Reclamação", area: "Bar da Praia", autor: "Família Souza", data: "20 mai 2026 · 14h32", status: "pendente", urgente: true, texto: "Demora no atendimento nos sábados de pico — sugestão de reforço de garçons.", resposta: "" },
  { id: "o2", tipo: "Sugestão", area: "Academia", autor: "Carlos Mendes", data: "20 mai 2026 · 11h08", status: "em-analise", urgente: false, texto: "Aulas de funcional em horário noturno (após 19h).", resposta: "", encaminhado: "esportes" },
  { id: "o3", tipo: "Elogio", area: "Recepção", autor: "Família Tavares", data: "19 mai 2026 · 18h44", status: "respondida", urgente: false, texto: "Acolhimento exemplar da Sra. Lúcia — gostaria de registrar um agradecimento.", resposta: "Agradecemos o carinho! O elogio foi repassado à equipe da recepção." },
  { id: "o4", tipo: "Reclamação", area: "Quadras de Tênis", autor: "José Pereira", data: "19 mai 2026 · 09h12", status: "pendente", urgente: false, texto: "Quadra 2 com pequena rachadura no piso próximo à rede.", resposta: "" },
  { id: "o5", tipo: "Sugestão", area: "Site", autor: "Anônimo", data: "18 mai 2026 · 22h05", status: "em-analise", urgente: false, texto: "Adicionar um link rápido para horários no menu principal.", resposta: "" },
  { id: "o6", tipo: "Reclamação", area: "Estacionamento", autor: "Família Lopes", data: "18 mai 2026 · 16h21", status: "pendente", urgente: false, texto: "Difícil encontrar vagas nos domingos pela manhã.", resposta: "" },
  { id: "o7", tipo: "Elogio", area: "Escolinha de Natação", autor: "Roberta Carvalho", data: "17 mai 2026 · 10h00", status: "respondida", urgente: false, texto: "O progresso da minha filha em 3 meses foi impressionante.", resposta: "Ficamos muito felizes! Parabéns à atleta e à equipe da natação." },
];

export const ENCAMINHAMENTOS = [
  { label: "Diretoria Social", value: "social" },
  { label: "Diretoria de Esportes", value: "esportes" },
  { label: "Tesouraria", value: "tesouraria" },
  { label: "Diretoria de Patrimônio", value: "patrimonio" },
  { label: "Secretaria", value: "secretaria" },
];

/* ------------------------------------------------------------------ */
/* Diretoria — Gestão 2026/2027 (dados reais do clube)                  */
/* ------------------------------------------------------------------ */
const GESTAO = "2026/2027";
export const ADMIN_DIRETORIA: Membro[] = [
  { id: "d1", nome: "Ednaldo Silva Durço", cargo: "Presidente", email: "presidencia@lagoanossa.com.br", gestao: GESTAO, foto: "" },
  { id: "d2", nome: "Jarbas Leal", cargo: "Vice Presidente", email: "vicepresidencia@lagoanossa.com.br", gestao: GESTAO, foto: "" },
  { id: "d3", nome: "Vicente de Paulo Faria", cargo: "1º Tesoureiro", email: "tesouraria@lagoanossa.com.br", gestao: GESTAO, foto: "" },
  { id: "d4", nome: "Gilberto Calixto Ribeiro", cargo: "2º Tesoureiro", email: "tesouraria@lagoanossa.com.br", gestao: GESTAO, foto: "" },
  { id: "d5", nome: "Eduardo Cesar de S. Câmara", cargo: "Secretário", email: SITE.email, gestao: GESTAO, foto: "" },
  { id: "d6", nome: "Simônie Maria Borges", cargo: "Diretor de Patrimônio", email: "patrimonio@lagoanossa.com.br", gestao: GESTAO, foto: "" },
  { id: "d7", nome: "Gustavo Miguel Nepomuceno", cargo: "Diretor Social", email: SITE.emailEventos, gestao: GESTAO, foto: "" },
  { id: "d8", nome: "Paulo Cezar Clarismar", cargo: "Diretor de Esportes", email: "esportes@lagoanossa.com.br", gestao: GESTAO, foto: "" },
  { id: "d9", nome: "Konrado Ribeiro", cargo: "Diretor de Esportes", email: "esportes@lagoanossa.com.br", gestao: GESTAO, foto: "" },
  { id: "d10", nome: "Américo Fonseca Portela Neto", cargo: "Diretor de Esportes", email: "esportes@lagoanossa.com.br", gestao: GESTAO, foto: "" },
  { id: "d11", nome: "Fábio Eustáquio de Melo", cargo: "Diretor de Esportes", email: "esportes@lagoanossa.com.br", gestao: GESTAO, foto: "" },
  { id: "d12", nome: "Kleber de Souza Quadros", cargo: "Diretor de Esportes", email: "esportes@lagoanossa.com.br", gestao: GESTAO, foto: "" },
];

export const CARGOS = ["Presidente", "Vice Presidente", "1º Tesoureiro", "2º Tesoureiro", "Secretário", "Diretor de Patrimônio", "Diretor Social", "Diretor de Esportes", "Conselho Fiscal"];
export const GESTOES = ["2026/2027", "2024/2025", "2022/2023"];

/* ------------------------------------------------------------------ */
/* Convênios                                                            */
/* ------------------------------------------------------------------ */
export const ADMIN_CONVENIOS: Convenio[] = [
  { id: "c1", nome: "Hospital São Vicente", cat: "Saúde", beneficio: "15% em consultas e exames", vigencia: "Até 12/2026", status: "ativo", contato: "(37) 3322-0000" },
  { id: "c2", nome: "Drogaria Pacheco", cat: "Saúde", beneficio: "10% em medicamentos", vigencia: "Até 03/2027", status: "ativo", contato: "" },
  { id: "c3", nome: "Restaurante Sabor da Lagoa", cat: "Gastronomia", beneficio: "20% no almoço executivo", vigencia: "Até 06/2026", status: "expirando", contato: "" },
  { id: "c4", nome: "Pousada Vista da Serra", cat: "Hospedagem", beneficio: "12% em diárias", vigencia: "Até 10/2026", status: "ativo", contato: "" },
  { id: "c5", nome: "Auto Escola Formiga", cat: "Educação", beneficio: "15% em pacotes", vigencia: "Até 02/2027", status: "ativo", contato: "" },
  { id: "c6", nome: "Academia Corpo & Mente", cat: "Saúde", beneficio: "Acesso recíproco", vigencia: "Até 12/2026", status: "ativo", contato: "" },
  { id: "c7", nome: "Sicoob Credicom", cat: "Financeiro", beneficio: "Tarifa zero por 6 meses", vigencia: "Indeterminado", status: "ativo", contato: "" },
];

export const CONVENIO_CATEGORIAS = ["Saúde", "Gastronomia", "Hospedagem", "Educação", "Financeiro", "Mobilidade", "Bem-estar"];

/* ------------------------------------------------------------------ */
/* Páginas do site                                                      */
/* ------------------------------------------------------------------ */
export const ADMIN_PAGINAS: PaginaSite[] = [
  { id: "home", titulo: "Home", url: "/", atualizada: "18 mai 2026", autor: "Ana Paula R.", visualizacoes: 8420 },
  { id: "historia", titulo: "História", url: "/historia", atualizada: "02 mai 2026", autor: "Carlos E.", visualizacoes: 1842 },
  { id: "missao", titulo: "Missão e Valores", url: "/missao", atualizada: "15 abr 2026", autor: "Carlos E.", visualizacoes: 624 },
  { id: "diretoria", titulo: "Diretoria", url: "/diretoria", atualizada: "10 jan 2026", autor: "Mariana L.", visualizacoes: 412 },
  { id: "regimento", titulo: "Regimento Interno", url: "/regimento", atualizada: "08 mar 2026", autor: "Mariana L.", visualizacoes: 198 },
  { id: "associado", titulo: "Área do Associado", url: "/associado", atualizada: "12 mai 2026", autor: "Ana Paula R.", visualizacoes: 3210 },
  { id: "funcionamento", titulo: "Funcionamento", url: "/funcionamento", atualizada: "03 mai 2026", autor: "Ana Paula R.", visualizacoes: 1820 },
  { id: "oportunidade", titulo: "Oportunidade", url: "/oportunidade", atualizada: "20 fev 2026", autor: "Mariana L.", visualizacoes: 284 },
];

/* ------------------------------------------------------------------ */
/* Galeria                                                              */
/* ------------------------------------------------------------------ */
export const ADMIN_ALBUNS: Album[] = [
  { id: "g1", titulo: "92 Anos · Festa de Aniversário", data: "10 mai 2026", fotos: fotos(84, 1), cover: ADMIN_IMG.aniversario, publicado: true, destaque: true },
  { id: "g2", titulo: "Sábado na Praia com Mateus Oliveira", data: "30 mai 2026", fotos: fotos(96, 4), cover: ADMIN_IMG.show, publicado: true, destaque: false },
  { id: "g3", titulo: "Arraiá do Country 2025", data: "21 jun 2025", fotos: fotos(212, 7), cover: ADMIN_IMG.festaJunina, publicado: true, destaque: false },
  { id: "g4", titulo: "Inauguração da Academia", data: "17 mai 2025", fotos: fotos(47, 10), cover: ADMIN_IMG.academia2, publicado: true, destaque: false },
  { id: "g5", titulo: "Torneio de Beach Tenis", data: "25 jan 2026", fotos: fotos(98, 13), cover: ADMIN_IMG.beachTenis, publicado: true, destaque: false },
  { id: "g6", titulo: "Domingo na Praia · Verão 2026", data: "08 fev 2026", fotos: fotos(63, 16), cover: ADMIN_IMG.praia, publicado: true, destaque: false },
  { id: "g7", titulo: "35ª Copa Country de Futebol", data: "12 out 2025", fotos: fotos(121, 19), cover: ADMIN_IMG.futebol, publicado: true, destaque: false },
  { id: "g8", titulo: "Colônia de Férias 2025", data: "31 jul 2025", fotos: fotos(140, 22), cover: ADMIN_IMG.criancas, publicado: true, destaque: false },
  { id: "g9", titulo: "Country na Copa — bastidores", data: "13 jun 2026", fotos: fotos(12, 25), cover: ADMIN_IMG.copa, publicado: false, destaque: false },
];

/* ------------------------------------------------------------------ */
/* Associados                                                           */
/* ------------------------------------------------------------------ */
export const ADMIN_ASSOCIADOS: Associado[] = [
  { mat: "001284", nome: "Família Souza Carvalho", titular: "Roberto Carvalho", plano: "Familiar", status: "ativo", desde: "1998", email: "roberto@email.com", fone: "(37) 99812-3344" },
  { mat: "002841", nome: "Família Almeida", titular: "Júlia Almeida", plano: "Familiar", status: "ativo", desde: "2012", email: "julia.almeida@email.com", fone: "(37) 99731-2211" },
  { mat: "004182", nome: "Família Tavares", titular: "Marcos Tavares", plano: "Familiar", status: "ativo", desde: "2008", email: "marcos.t@email.com", fone: "(37) 98112-4455" },
  { mat: "005920", nome: "Família Resende Lopes", titular: "Mariana Lopes", plano: "Familiar", status: "ativo", desde: "1995", email: "mariana@email.com", fone: "(37) 99988-1234" },
  { mat: "008341", nome: "Família Mendes Faria", titular: "Patrícia Mendes", plano: "Patrimonial", status: "ativo", desde: "2001", email: "patricia@email.com", fone: "(37) 99762-8800" },
  { mat: "011204", nome: "João Pedro Silva", titular: "João Pedro Silva", plano: "Individual", status: "inadimplente", desde: "2018", email: "joao@email.com", fone: "(37) 99511-2233" },
  { mat: "012987", nome: "Família Coelho", titular: "Beatriz Coelho", plano: "Familiar", status: "ativo", desde: "2020", email: "bia.coelho@email.com", fone: "(37) 98844-1100" },
  { mat: "013441", nome: "Família Pereira", titular: "Lucas Pereira", plano: "Familiar", status: "ativo", desde: "2015", email: "lucas.p@email.com", fone: "(37) 99622-4040" },
  { mat: "014205", nome: "Família Salles", titular: "Rodrigo Salles", plano: "Familiar", status: "suspenso", desde: "2017", email: "rodrigo.s@email.com", fone: "(37) 98711-2002" },
  { mat: "015118", nome: "Camila Tavares", titular: "Camila Tavares", plano: "Individual", status: "ativo", desde: "2022", email: "camila.t@email.com", fone: "(37) 99988-7766" },
];

/* ------------------------------------------------------------------ */
/* Configurações (contato oficial de src/lib/site.ts)                   */
/* ------------------------------------------------------------------ */
export const ADMIN_CONFIG: Config = {
  contato: {
    telefone: SITE.telefone,
    whatsapp: SITE.whatsapp,
    email: SITE.email,
    endereco: `${SITE.endereco.linha1} — ${SITE.endereco.bairro} — ${SITE.endereco.cidade} — CEP ${SITE.endereco.cep}`,
    instagram: SITE.instagramHandle,
    facebook: SITE.facebookHandle,
  },
  horarios: [
    { area: "Portaria", seg: "6h – 22h", sab: "6h – 22h", dom: "6h – 22h" },
    { area: "Praia", seg: "6h – 22h", sab: "6h – 22h", dom: "6h – 22h" },
    { area: "Piscinas", seg: "6h – 21h", sab: "7h – 20h", dom: "7h – 19h" },
    { area: "Academia", seg: "5h30 – 22h", sab: "7h – 14h", dom: "Fechado" },
    { area: "Restaurante", seg: "11h – 22h", sab: "11h – 23h", dom: "9h – 19h" },
    { area: "Secretaria", seg: "8h – 18h", sab: "8h – 12h", dom: "Fechado" },
  ],
  hero: {
    eyebrow: "Desde 1934 · 92 anos",
    titulo: "Aqui a sua família tem 92 anos de Lagoa.",
    subtitulo: "Praia, quadras, churrasqueiras e quase um século de bons domingos às margens da Lagoa do Fundão, em Formiga / MG.",
    cta1: "Conheça o clube",
    cta2: "Ver agenda",
  },
  redes: {
    instagram: SITE.instagram,
    facebook: SITE.facebook,
    youtube: "",
    whatsapp: "+5537999622146",
  },
  seo: {
    titulo: "Country Clube de Formiga — Nossa Lagoa há 92 anos",
    descricao: "Country Clube de Formiga · Tradição familiar à beira da Lagoa do Fundão desde 1934. Praia, quadras, eventos e modalidades para toda a família.",
    palavras: "clube, formiga, lagoa do fundão, lazer, esporte, família",
  },
  ultimaAtualizacao: { quando: "18 mai 2026 · 14h22", por: ADMIN_USER.nome },
};

export const PERMISSOES_USUARIOS = [
  { id: "u1", nome: ADMIN_USER.nome, email: SITE.email, papel: "admin" },
  { id: "u2", nome: "Ednaldo Silva Durço", email: "presidencia@lagoanossa.com.br", papel: "admin" },
  { id: "u3", nome: "Gustavo Miguel Nepomuceno", email: SITE.emailEventos, papel: "editor" },
  { id: "u4", nome: "Eduardo Cesar de S. Câmara", email: SITE.email, papel: "editor" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "2026-06-13" → { dia: "13", mes: "jun", ano: "26" } */
export function partesData(iso: string) {
  const [y, m, d] = iso.split("-");
  return { dia: String(Number(d)), mes: MESES[Number(m) - 1] ?? "", ano: y.slice(2), anoCompleto: y };
}

/** 12840 → "12.840" (sem depender de ICU) */
export function fmtNum(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function iniciais(nome: string) {
  return nome
    .split(" ")
    .filter((p) => p.length > 2 || /^[A-ZÀ-Ú]\.?$/.test(p))
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function novoId(prefix: string) {
  return `${prefix}${Date.now().toString(36)}`;
}
