/**
 * Conteúdo do site público — migrado de CONTENT.md (handoff) e do site atual
 * lagoanossa.com.br. Os textos marcados com `pendente: true` ainda usam
 * descrição provisória e devem ser substituídos pelo texto literal do site
 * atual (ver CONTEUDO-PENDENTE.md).
 */
import { OFICIAL, STOCK } from "./images";

/* ---------- Tipos --------------------------------------------------------- */
export interface Modalidade {
  id: string; nome: string; cat: string; img: string; desc: string; horario: string; publico: string;
  professor?: string; sobre?: string[]; fotoOficialUrl?: string; pendente?: boolean;
}
export interface Infra {
  id: string; nome: string; cat: string; img: string; tag?: string; desc: string; sobre?: string[]; destaque?: { titulo: string; texto: string }; pendente?: boolean;
}
export interface Evento {
  id: string; data: string; dia: number; mes: string; mesNome: string; ano: number; hora: string; nome: string; cat: string; local: string;
  destaque?: boolean; img: string; desc: string; programacao?: string[]; obs?: string;
}
export interface Noticia { id: string; tag: string; titulo: string; data: string; img: string; resumo: string }
export interface FaqItem { cat: string; q: string; a: string }
export interface Membro { nome: string; cargo: string; gestao: string }
export interface Convenio { nome: string; cat: string; beneficio: string }
export interface Album { id: string; titulo: string; data: string; qt: number; cover: string; fotos: string[] }

/* ---------- Modalidades (21 — CONTENT.md) --------------------------------- */
export const CATEGORIAS_MODALIDADES = ["Quadra", "Praia", "Campo", "Aquáticos", "Fitness", "Artes marciais", "Dança", "Saúde e bem-estar"];

export const MODALIDADES: Modalidade[] = [
  { id: "ballet-jazz", nome: "Ballet/Jazz", cat: "Dança", img: STOCK.ballet, desc: "Turmas de ballet e jazz para crianças e adolescentes, com apresentações anuais no clube.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 4 anos", pendente: true },
  { id: "basquete", nome: "Basquete", cat: "Quadra", img: STOCK.basquete, desc: "Escolinha e treinos de basquete na quadra poliesportiva coberta.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 8 anos", pendente: true },
  { id: "beach-tenis", nome: "Beach Tenis", cat: "Praia", img: STOCK.beachTenis, desc: "Quadras à beira da Lagoa, com vista privilegiada. Aulas para todos os níveis, do iniciante ao competitivo.", horario: "Seg–Dom · quadras da praia", publico: "A partir de 8 anos", pendente: true },
  { id: "fisioterapia", nome: "Fisioterapia", cat: "Saúde e bem-estar", img: STOCK.fisioterapia, desc: "Atendimento fisioterapêutico no Estúdio de Pilates e Fisioterapia do clube.", horario: "Com hora marcada", publico: "Associados", pendente: true },
  { id: "futebol", nome: "Futebol", cat: "Campo", img: STOCK.futebol, desc: "Escolinha, categorias de base e a tradicional Copa Country nos campos de futebol da Lagoa.", horario: "Consulte a Secretaria de Esportes", publico: "Todas as idades", pendente: true },
  { id: "futevolei", nome: "Futevôlei", cat: "Praia", img: STOCK.futevolei, desc: "Aulas e jogos livres nas quadras de areia da praia.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 12 anos", pendente: true },
  { id: "futsal", nome: "Futsal", cat: "Quadra", img: STOCK.futsal, desc: "Escolinha de futsal na quadra poliesportiva, por faixa etária.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 5 anos", pendente: true },
  { id: "ginastica-funcional", nome: "Ginástica Funcional", cat: "Fitness", img: STOCK.funcional, desc: "Treinos funcionais em grupo na academia, com foco em condicionamento e mobilidade.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 14 anos", pendente: true },
  { id: "ginastica-localizada", nome: "Ginástica Localizada", cat: "Fitness", img: STOCK.localizada, desc: "Aulas de ginástica localizada para fortalecimento e tonificação.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 14 anos", pendente: true },
  { id: "hidroginastica", nome: "Hidroginástica", cat: "Aquáticos", img: STOCK.hidro, desc: "Aulas na piscina térmica, com foco em mobilidade, condicionamento e baixo impacto.", horario: "Consulte a Secretaria de Esportes", publico: "Adultos", pendente: true },
  { id: "jiu-jitsu", nome: "Jiu jitsu", cat: "Artes marciais", img: STOCK.jiujitsu, desc: "Aulas de jiu jitsu nas Escolas de Artes Marciais do clube, infantil e adulto.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 5 anos", pendente: true },
  { id: "karate", nome: "Karatê", cat: "Artes marciais", img: STOCK.karate, desc: "Escola de karatê com turmas por faixa etária e graduação.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 5 anos", pendente: true },
  { id: "liberacao-miofascial-drenagem-e-ventosaterapia", nome: "Liberação Miofascial, Drenagem e Ventosaterapia", cat: "Saúde e bem-estar", img: STOCK.massagem, desc: "Terapias manuais para recuperação muscular e bem-estar, com hora marcada.", horario: "Com hora marcada", publico: "Adultos", pendente: true },
  { id: "massagem-feminina", nome: "Massagem Feminina", cat: "Saúde e bem-estar", img: STOCK.massagem, desc: "Massagem relaxante e terapêutica para associadas, com hora marcada.", horario: "Com hora marcada", publico: "Adultas", pendente: true },
  { id: "musculacao", nome: "Musculação", cat: "Fitness", img: STOCK.musculacao, desc: "Academia nova (2025) com musculação, orientação profissional e vista para a praia.", horario: "Horário da Academia", publico: "A partir de 14 anos", pendente: true },
  { id: "natacao", nome: "Natação", cat: "Aquáticos", img: STOCK.natacao, desc: "Escolinha de Natação na piscina térmica, turmas por faixa etária e nível.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 3 anos", pendente: true },
  { id: "peteca", nome: "Peteca", cat: "Quadra", img: STOCK.peteca, desc: "Jogos e torneios de peteca, tradição mineira, nas quadras do clube.", horario: "Consulte a Secretaria de Esportes", publico: "Todas as idades", pendente: true },
  { id: "pilates", nome: "Pilates", cat: "Saúde e bem-estar", img: STOCK.pilates, desc: "Aulas de pilates no Estúdio de Pilates e Fisioterapia, em turmas reduzidas.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 16 anos", pendente: true },
  { id: "tenis", nome: "Tênis", cat: "Quadra", img: STOCK.tenis, desc: "Aulas e jogos nas quadras de tênis do clube, para todas as idades e níveis.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 6 anos", pendente: true },
  { id: "volei", nome: "Vôlei", cat: "Quadra", img: STOCK.volei, desc: "Escolinha e treinos de vôlei no ginásio e nas quadras da praia.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 10 anos", pendente: true },
  { id: "yoga", nome: "Yoga", cat: "Saúde e bem-estar", img: STOCK.yoga, desc: "Prática de yoga em turmas reduzidas, com foco em respiração, equilíbrio e bem-estar.", horario: "Consulte a Secretaria de Esportes", publico: "A partir de 16 anos", pendente: true },
];

export const MODALIDADES_HOME = ["beach-tenis", "tenis", "natacao", "futebol", "musculacao", "hidroginastica"];

/* ---------- Infraestrutura (18 — CONTENT.md) ------------------------------ */
export const INFRA: Infra[] = [
  { id: "praia", nome: "Praia", cat: "Lazer", img: STOCK.praia, tag: "Carro-chefe", desc: "Faixa de areia natural à beira da Lagoa do Fundão, com quiosques, decks e quadras de areia.", pendente: true },
  { id: "academia", nome: "Academia", cat: "Esportes", img: STOCK.academia2, tag: "Nova · 2025", desc: "Espaço fitness completo inaugurado em 2025, com musculação e atividades guiadas com vista para a praia.", pendente: true },
  { id: "campos-de-futebol", nome: "Campos de Futebol", cat: "Esportes", img: STOCK.futebol2, desc: "Campos society e sintético iluminados — palco da Copa Country e das escolinhas.", pendente: true },
  { id: "quadra-de-tenis", nome: "Quadra de Tênis", cat: "Esportes", img: STOCK.tenis2, desc: "Quadras de tênis com iluminação noturna para aulas e jogos livres.", pendente: true },
  { id: "piscinas", nome: "Piscinas", cat: "Aquáticos", img: STOCK.piscina, desc: "Piscinas de lazer e a piscina térmica, que recebe a hidroginástica e a Escolinha de Natação.", destaque: { titulo: "Piscina Térmica", texto: "Mais conforto para nossos associados. Com mais de 100 pessoas que utilizam diariamente ao local, que abriga praticantes de hidroginástica e os alunos da Escolinha de Natação." }, pendente: true },
  { id: "churrasqueira", nome: "Churrasqueira", cat: "Lazer", img: STOCK.churrasco2, desc: "Churrasqueiras individuais para reunir a família, reserváveis pelo app e pela Secretaria.", pendente: true },
  { id: "quiosques", nome: "Quiosques", cat: "Lazer", img: STOCK.quiosque, desc: "Quiosques na praia e nas áreas de convivência, com sombra e vista para a Lagoa.", pendente: true },
  { id: "area-familiar", nome: "Área Familiar", cat: "Lazer", img: STOCK.familia, desc: "Espaço de convivência pensado para a família passar o dia no clube.", pendente: true },
  { id: "secretaria", nome: "Secretaria", cat: "Serviços", img: STOCK.secretaria, desc: "Atendimento ao associado: cadastro, boletos, reservas e informações.", pendente: true },
  { id: "bares", nome: "Bares", cat: "Alimentação", img: STOCK.bar, desc: "Bares na praia e nas áreas sociais, para o lanche e a bebida gelada do final de semana.", pendente: true },
  { id: "restaurante", nome: "Restaurante", cat: "Alimentação", img: STOCK.restaurante, desc: "Restaurante do clube para almoços em família e eventos.", pendente: true },
  { id: "sinuca", nome: "Sinuca", cat: "Lazer", img: STOCK.sinuca, desc: "Salão de sinuca para os associados.", pendente: true },
  { id: "quadra-poliesportiva", nome: "Quadra Poliesportiva", cat: "Esportes", img: STOCK.quadraCoberta, desc: "Quadra coberta para futsal, basquete, vôlei e peteca.", pendente: true },
  { id: "escolas-de-artes-marciais", nome: "Escolas de Artes Marciais", cat: "Esportes", img: STOCK.artesMarciais, desc: "Espaço dedicado às aulas de jiu jitsu e karatê.", pendente: true },
  { id: "estudio-de-pilates", nome: "Estúdio de Pilates e Fisioterapia", cat: "Saúde", img: STOCK.pilates, desc: "Estúdio equipado para pilates, fisioterapia e terapias manuais.", pendente: true },
  { id: "parquinho", nome: "Parquinho", cat: "Lazer", img: STOCK.parquinho, desc: "Parquinho infantil para as crianças brincarem em segurança.", pendente: true },
  { id: "ginasio", nome: "Ginásio", cat: "Esportes", img: STOCK.ginasio, desc: "Ginásio coberto para treinos, torneios e eventos esportivos.", pendente: true },
  { id: "saunas", nome: "Saunas", cat: "Lazer", img: STOCK.sauna, desc: "Saunas para relaxar depois do esporte ou de um dia de praia.", pendente: true },
];

export const INFRA_HOME = ["praia", "academia", "campos-de-futebol", "quadra-de-tenis", "piscinas", "churrasqueira", "quiosques"];

/* ---------- Agenda (eventos reais — CONTENT.md) --------------------------- */
const MESES: Record<string, string> = { "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril", "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto", "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro" };
const ABREV: Record<string, string> = { "01": "jan", "02": "fev", "03": "mar", "04": "abr", "05": "mai", "06": "jun", "07": "jul", "08": "ago", "09": "set", "10": "out", "11": "nov", "12": "dez" };
function ev(id: string, data: string, hora: string, nome: string, cat: string, local: string, img: string, desc: string, extra: Partial<Evento> = {}): Evento {
  const [y, m, d] = data.split("-");
  return { id, data, dia: Number(d), mes: ABREV[m], mesNome: MESES[m], ano: Number(y), hora, nome, cat, local, img, desc, ...extra };
}

export const EVENTOS: Evento[] = [
  ev("aniversario-92-anos", "2026-05-09", "Programação completa", "Aniversário 92 anos", "Tradição", "Country Clube de Formiga", STOCK.aniversario, "Dois dias de comemoração pelos 92 anos da nossa Lagoa, em 09 e 10 de maio, com programação completa para toda a família.", { destaque: true, obs: "09 e 10 de maio de 2026." }),
  ev("1-ano-academia-country", "2026-05-17", "8h", "1 Ano Academia Country", "Esportes", "Academia", STOCK.academia, "A Academia Country completa um ano. Coquetel para os associados e DJ Dan Garcia.", { programacao: ["8h · Coquetel", "DJ Dan Garcia"] }),
  ev("sabado-na-praia-mateus-oliveira", "2026-05-30", "15h", "Sábado na Praia com Mateus Oliveira", "Show", "Praia", STOCK.show, "Tarde de música ao vivo na praia da Lagoa com Mateus Oliveira."),
  ev("country-na-copa-brasil-x-marrocos", "2026-06-13", "17h", "Country na Copa · Brasil x Marrocos", "Festa", "Praia", STOCK.copa, "Telão para o jogo do Brasil e show com Peu Faria.", { destaque: true, programacao: ["17h · Show Peu Faria", "Brasil x Marrocos"] }),
  ev("country-na-copa-brasil-x-haiti", "2026-06-19", "19h", "Country na Copa · Brasil x Haiti", "Festa", "Praia", STOCK.copa, "Telão para o jogo do Brasil e show com Diney & Felipe.", { programacao: ["19h · Show Diney & Felipe", "Brasil x Haiti"] }),
  ev("arraia-do-country", "2026-06-20", "18h", "Arraiá do Country", "Festa", "Espaço Multiuso", STOCK.festaJunina, "A festa junina da Lagoa: Karol Shienna e Banda, área kids e comidas típicas.", { destaque: true, programacao: ["18h · Abertura", "Karol Shienna e Banda", "Área kids", "Comidas típicas"] }),
  ev("country-na-copa-brasil-x-escocia", "2026-06-24", "17h", "Country na Copa · Brasil x Escócia", "Festa", "Praia", STOCK.copa, "Telão para o jogo do Brasil e show com Laís Arantes.", { programacao: ["17h · Show Laís Arantes", "Brasil x Escócia"] }),
  ev("festival-do-rock-na-praia", "2026-07-18", "16h", "Festival do Rock na Praia", "Show", "Praia", STOCK.rock, "Três bandas em uma tarde inteira de rock na areia da Lagoa.", { destaque: true, programacao: ["16h · Peu Faria", "18h30 · 32 Dentes", "21h · Pato Rocco"] }),
  ev("35-colonia-de-ferias", "2026-07-27", "12h30 às 17h", "35ª Colônia de Férias", "Família", "Country Clube de Formiga", STOCK.criancas, "De 27 a 31 de julho, para crianças de 3 a 11 anos. Inscrições de 01 a 17 de julho pelo app.", { obs: "27 a 31/07/2026 · Inscrições 01–17/07 pelo app" }),
  ev("36-copa-country-de-futebol", "2026-09-29", "Início", "36ª Copa Country de Futebol", "Esportes", "Campos de Futebol", STOCK.futebol2, "Categorias 40+ e Livre (15+). Inscrições de 01 a 19 de agosto; início em 29 de setembro.", { destaque: true, obs: "Inscrições 01–19/08 · Categorias 40+ e Livre (15+)" }),
];

export const EVENTOS_ORDENADOS = [...EVENTOS].sort((a, b) => a.data.localeCompare(b.data));

/* ---------- Notícias (CONTENT.md) ---------------------------------------- */
export const NOTICIAS: Noticia[] = [
  { id: "amistoso-formiga-tenis-clube", tag: "Esportes", titulo: "Amistoso de Futebol vs. Formiga Tênis Clube", data: "03 out 2026 · 8h30", img: STOCK.futebol, resumo: "Nossa equipe recebe o Formiga Tênis Clube nos campos da Lagoa. Venha torcer." },
  { id: "amistoso-futebol-infantil", tag: "Esportes", titulo: "Amistoso de Futebol Infantil", data: "26 set 2026 · 8h30", img: STOCK.criancas, resumo: "As categorias de base da escolinha entram em campo em um amistoso na manhã de sábado." },
  { id: "torneio-relampago-futebol", tag: "Esportes", titulo: "Torneio Relâmpago de Futebol", data: "20 set 2026", img: STOCK.futebol2, resumo: "Um dia inteiro de jogos rápidos entre os times do clube nos campos society." },
  { id: "estatuto-2026", tag: "Comunicado", titulo: "Estatuto 2026 disponível para consulta", data: "Maio 2026", img: STOCK.secretaria, resumo: "A versão consolidada do Estatuto do clube já pode ser baixada em PDF na página Estatuto." },
];

/* ---------- FAQ (a confirmar com o texto do site atual) ------------------- */
export const FAQ: FaqItem[] = [
  { cat: "Associado", q: "Como atualizo meus dados cadastrais?", a: "Você pode atualizar seus dados pelo app Country Clube de Formiga, pela Secretaria Web ou diretamente na Secretaria do clube." },
  { cat: "Associado", q: "Como emito a segunda via do boleto?", a: "O boleto está disponível no app e na Secretaria Web. Em caso de vencimento atrasado, procure a Secretaria." },
  { cat: "Reservas", q: "Como reservo uma churrasqueira?", a: "Pelo app, na aba Reservas, ou na Secretaria. As reservas seguem o regulamento interno e a disponibilidade do dia." },
  { cat: "Reservas", q: "Posso levar convidados ao clube?", a: "Sim. Cada associado pode levar convidados conforme as regras e tarifas vigentes. O cadastro do convidado é feito na portaria." },
  { cat: "Esportes", q: "Como me inscrevo nas modalidades?", a: "As inscrições são feitas na Secretaria de Esportes ou pelo app. Consulte a página de cada modalidade para horários e público." },
  { cat: "Esportes", q: "A academia exige avaliação física?", a: "Sim. A primeira sessão é uma avaliação com a equipe técnica. Traga roupa confortável e uma toalha." },
  { cat: "Eventos", q: "Como acompanho a agenda do clube?", a: "Pela página Agenda de Eventos, pelo app e pelas redes sociais do Country (@countryclubedeformiga)." },
  { cat: "Eventos", q: "Posso alugar um espaço para uma festa privada?", a: "Sim, mediante reserva e pagamento da taxa de cessão. Fale com a Secretaria de Eventos (eventoslagoanossa@hotmail.com)." },
  { cat: "Acessos", q: "Quais são os horários de funcionamento?", a: "Consulte a página Funcionamento — cada área do clube tem o seu horário." },
  { cat: "Acessos", q: "Preciso da carteirinha para entrar?", a: "O app é a sua carteirinha digital. A versão física continua sendo aceita na portaria." },
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

/* ---------- Convênios (a confirmar com o site atual) ----------------------- */
export const CONVENIOS: Convenio[] = [
  { nome: "Hospital São Vicente", cat: "Saúde", beneficio: "15% em consultas e exames" },
  { nome: "Drogaria Pacheco", cat: "Saúde", beneficio: "10% em medicamentos" },
  { nome: "Restaurante Sabor da Lagoa", cat: "Gastronomia", beneficio: "20% no almoço executivo" },
  { nome: "Pousada Vista da Serra", cat: "Hospedagem", beneficio: "12% em diárias" },
  { nome: "Auto Escola Formiga", cat: "Educação", beneficio: "15% em pacotes" },
  { nome: "Academia Corpo & Mente", cat: "Saúde", beneficio: "Acesso recíproco" },
  { nome: "Sicoob Credicom", cat: "Financeiro", beneficio: "Tarifa zero por 6 meses" },
  { nome: "Ótica Visão Real", cat: "Saúde", beneficio: "20% em armações" },
  { nome: "Posto Centroeste", cat: "Mobilidade", beneficio: "Desconto no litro do etanol" },
  { nome: "Floricultura Bela Vista", cat: "Bem-estar", beneficio: "10% em arranjos" },
];

/* ---------- Galeria (álbuns do site atual: galeria-1 … galeria-11) -------- */
const fotosDe = (...keys: string[]) => keys;
export const GALERIA: Album[] = [
  { id: "fotos-oficiais-do-evento", titulo: "Fotos oficiais do evento já estão disponíveis", data: "2026", qt: 6, cover: STOCK.aniversario, fotos: fotosDe(STOCK.aniversario, STOCK.evento, STOCK.show, STOCK.familia, STOCK.praia, STOCK.lagoaSunset) },
  { id: "galeria-11", titulo: "Galeria 11", data: "2026", qt: 6, cover: STOCK.rock, fotos: fotosDe(STOCK.rock, STOCK.show, STOCK.evento, STOCK.praia, STOCK.deck, STOCK.entardecer) },
  { id: "galeria-10", titulo: "Galeria 10", data: "2026", qt: 6, cover: STOCK.festaJunina, fotos: fotosDe(STOCK.festaJunina, STOCK.evento, STOCK.familia, STOCK.criancas, STOCK.quiosque, STOCK.praia) },
  { id: "galeria-9", titulo: "Galeria 9", data: "2025", qt: 6, cover: STOCK.academia2, fotos: fotosDe(STOCK.academia2, STOCK.academia, STOCK.musculacao, STOCK.funcional, STOCK.localizada, STOCK.praia) },
  { id: "galeria-8", titulo: "Galeria 8", data: "2025", qt: 6, cover: STOCK.beachTenis, fotos: fotosDe(STOCK.beachTenis, STOCK.futevolei, STOCK.volei, STOCK.praia, STOCK.tenis, STOCK.tenis2) },
  { id: "galeria-7", titulo: "Galeria 7", data: "2025", qt: 6, cover: STOCK.futebol2, fotos: fotosDe(STOCK.futebol2, STOCK.futebol, STOCK.copa, STOCK.criancas, STOCK.ginasio, STOCK.quadraCoberta) },
  { id: "galeria-6", titulo: "Galeria 6", data: "2025", qt: 6, cover: STOCK.piscina, fotos: fotosDe(STOCK.piscina, STOCK.natacao, STOCK.hidro, STOCK.familia, STOCK.parquinho, STOCK.sauna) },
  { id: "galeria-5", titulo: "Galeria 5", data: "2024", qt: 6, cover: STOCK.lagoaSunset, fotos: fotosDe(STOCK.lagoaSunset, STOCK.lagoa, STOCK.deck, STOCK.entardecer, STOCK.praia, STOCK.quiosque) },
  { id: "galeria-4", titulo: "Galeria 4", data: "2024", qt: 6, cover: STOCK.churrasco, fotos: fotosDe(STOCK.churrasco, STOCK.churrasco2, STOCK.restaurante, STOCK.bar, STOCK.familia, STOCK.quiosque) },
  { id: "galeria-3", titulo: "Galeria 3", data: "2024", qt: 6, cover: STOCK.salao, fotos: fotosDe(STOCK.salao, STOCK.casamento, STOCK.evento, STOCK.show, STOCK.familia, STOCK.aniversario) },
  { id: "galeria-2", titulo: "Galeria 2", data: "2023", qt: 6, cover: STOCK.evento, fotos: fotosDe(STOCK.evento, STOCK.show, STOCK.rock, STOCK.festaJunina, STOCK.praia, STOCK.familia) },
  { id: "galeria-1", titulo: "Galeria 1", data: "2023", qt: 6, cover: OFICIAL.historia1, fotos: fotosDe(OFICIAL.historia1, OFICIAL.historia2, OFICIAL.historia3, OFICIAL.historia4, OFICIAL.historia5, OFICIAL.historia6) },
];

/* ---------- História (texto oficial — usar literalmente) ------------------ */
export const HISTORIA_TEXTO = [
  "Em 6 de maio de 1934 o Country Clube foi fundado. Conta-se que algumas famílias tradicionais da cidade, sem ter espaço para o lazer, descobriram na “Lagoa do Fundão” a possibilidade de se criar um local apropriado ao descanso e à diversão. Tais famílias seriam as de Carlos Camarão, Tarcísio Cardoso, Zé Cuca, Omar Soares, Edmundo Lins, Lauro Coelho e João Pautilho Silva.",
  "O acesso à lagoa praticamente não existia. Havia apenas uma trilha no meio da mata. O passo inicial foi providenciar a abertura da estrada. Depois, a limpeza das margens do lago, a construção de um barracão que serviria de abrigo contra a chuva e o sol forte e a colocação do primeiro trampolim de madeira.",
  "Logo, o lugar já era ponto de encontro para vários formiguenses durante os finais de semana. Surgiu, então, a necessidade de ampliar as suas instalações. Assim, o clube foi fundado oficialmente no sistema de sociedade por cotas. Daí para frente, as benfeitorias foram aumentando e, consequentemente, o número de associados.",
  "Durante todos esses anos, a Lagoa não parou de crescer. A cada gestão, são traçadas novas diretrizes. Grandes nomes passaram pela administração do clube e deixaram sua parcela de progresso. Eles são lembrados em placas que dão nome às instalações do clube.",
];

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

/* ---------- Funcionamento (a confirmar com lagoanossa.com.br/funcionamento) */
export const FUNCIONAMENTO = [
  { area: "Portaria · Acesso Geral", seg: "6h – 22h", sab: "6h – 22h", dom: "6h – 22h" },
  { area: "Praia", seg: "6h – 22h", sab: "6h – 22h", dom: "6h – 22h" },
  { area: "Piscinas", seg: "6h – 21h", sab: "7h – 20h", dom: "7h – 19h" },
  { area: "Academia", seg: "5h30 – 22h", sab: "7h – 14h", dom: "Fechado" },
  { area: "Quadra de Tênis", seg: "7h – 22h", sab: "7h – 21h", dom: "7h – 20h" },
  { area: "Quadra Poliesportiva", seg: "7h – 23h", sab: "7h – 22h", dom: "7h – 21h" },
  { area: "Campos de Futebol", seg: "7h – 23h", sab: "7h – 22h", dom: "7h – 21h" },
  { area: "Restaurante", seg: "11h – 22h", sab: "11h – 23h", dom: "9h – 19h" },
  { area: "Bares", seg: "10h – 22h", sab: "9h – 23h", dom: "9h – 21h" },
  { area: "Secretaria", seg: "8h – 18h", sab: "8h – 12h", dom: "Fechado" },
  { area: "Saunas", seg: "Sob consulta", sab: "Sob consulta", dom: "Sob consulta" },
];

/* ---------- Direitos e Deveres (texto literal a coletar de /direitos e /deveres) */
export const DIREITOS = [
  "Frequentar as dependências do clube e utilizar suas instalações, observadas as normas do Estatuto e do regulamento interno.",
  "Participar das atividades sociais, esportivas e culturais promovidas pelo clube.",
  "Inscrever-se nas modalidades esportivas e escolinhas oferecidas, conforme vagas e regulamento de cada atividade.",
  "Reservar churrasqueiras e espaços do clube, na forma prevista pelo regulamento.",
  "Trazer convidados, respeitando os limites e as tarifas estabelecidos pela diretoria.",
  "Votar e ser votado nas assembleias, nos termos do Estatuto.",
  "Apresentar sugestões, elogios e reclamações pela Ouvidoria e receber resposta da diretoria.",
];
export const DEVERES = [
  "Cumprir e fazer cumprir o Estatuto, os regulamentos e as decisões da diretoria e das assembleias.",
  "Manter em dia as contribuições e taxas devidas ao clube.",
  "Zelar pelo patrimônio do clube, respondendo por danos causados por si, seus dependentes e convidados.",
  "Apresentar a carteirinha (física ou digital) sempre que solicitado pela portaria ou pela administração.",
  "Manter conduta compatível com o ambiente familiar do clube, respeitando associados, funcionários e convidados.",
  "Comunicar à Secretaria qualquer alteração de dados cadastrais e de dependentes.",
  "Respeitar os horários de funcionamento e as normas específicas de cada área.",
];

/* ---------- Números do clube ---------------------------------------------- */
export const NUMEROS = { anos: "92", familias: "4.000+", modalidades: String(MODALIDADES.length), area: "200K" };
