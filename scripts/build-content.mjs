/**
 * Transforma src/data/scraped.json (coleta bruta do site atual) em src/data/real.json,
 * o conteúdo estruturado consumido por src/data/content.ts.
 * Uso: node scripts/build-content.mjs
 */
import { promises as fs } from "node:fs";

const S = JSON.parse(await fs.readFile("src/data/scraped.json", "utf8"));
const exists = async (p) => fs.stat("public" + p).then(() => true, () => false);
const paras = (t) => (t || "").split(/\n+/).map((x) => x.trim()).filter((x) => x && !/^fotos?$/i.test(x));
const clean = (s) => s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "").replace(/\s+/g, " ").trim();
const MESES = { janeiro: 1, fevereiro: 2, março: 3, marco: 3, abril: 4, maio: 5, junho: 6, julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12 };
const ABREV = ["", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const NOMES = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

/* ---------- Programação (tabelas | professores) ---------- */
function parsePrograma(texto) {
  const lines = (texto || "").split("\n").map((l) => l.trim());
  const i = lines.findIndex((l) => /^(PROGRAMA[ÇC][ÃA]O|HOR[ÁA]RIOS?)\b/i.test(l));
  const sobre = paras(lines.slice(0, i < 0 ? undefined : i).join("\n")).map(clean).filter((p) => p.length > 30 || !/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ\s–-]+$/.test(p));
  const rest = i < 0 ? [] : lines.slice(i + 1);
  const tabelas = []; const notas = []; const professores = []; let profTitulo = "";
  let cur = null; let titulo = ""; let modo = "texto";
  for (const raw of rest) {
    const l = clean(raw);
    if (!l) { if (cur) { tabelas.push(cur); cur = null; } continue; }
    if (/^(Professor(a|es|as)?|Fisioterapeutas?|Massagistas?|Instrutor(a|es)?)$/i.test(l)) { modo = "prof"; profTitulo = l; if (cur) { tabelas.push(cur); cur = null; } continue; }
    if (modo === "prof") { if (l.length < 40) professores.push(l); continue; }
    if (l.includes(" | ")) {
      const cells = l.split("|").map((c) => clean(c)).filter(Boolean);
      if (!cur) cur = { titulo, colunas: cells, linhas: [] }; else cur.linhas.push(cells);
      continue;
    }
    if (cur) { tabelas.push(cur); cur = null; }
    if (/^(Nota|As inscrições|Inscrições|Como participar|Para mais informações|Consulte)/i.test(l) || l.length > 60) notas.push(l); else titulo = l.replace(/^[^\wÀ-ú]+/, "");
  }
  if (cur) tabelas.push(cur);
  // Cabeçalho: primeira linha da tabela é cabeçalho quando contém "Dia"/"Horário"
  for (const t of tabelas) {
    if (!/dia|hor[áa]rio/i.test(t.colunas.join(" "))) { t.linhas.unshift(t.colunas); t.colunas = t.colunas.map((_, k) => ["Dia", "Horário", "Turma"][k] || ""); }
  }
  const primeira = tabelas.find((t) => t.linhas.length)?.linhas[0] || [];
  const cab = tabelas.find((t) => t.linhas.length)?.colunas || [];
  const idxPub = cab.findIndex((c) => /faixa|idade|turma/i.test(c));
  return { sobre, tabelas, notas, professores, profTitulo, horarioResumo: primeira.length >= 2 ? `${primeira[0]} · ${primeira[1]}` : "", publico: idxPub >= 0 && primeira[idxPub] ? primeira[idxPub] : "" };
}

/* ---------- Fotos ---------- */
const gal = (grupo, slug) => (S[grupo]?.[slug]?.galeriaLocal) || (S.galeria?.itens?.[slug]?.galeriaLocal) || [];
const pick = (list, i = 0) => list[Math.min(i, list.length - 1)] || "";
const infraFoto = (slug, i = 0) => pick(gal("infra", slug), i);
const albumFoto = (slug, i = 0) => pick(gal("galeria", slug), i);
const MOD_FOTO = { // modalidades sem galeria própria: foto real da área correspondente
  "beach-tenis": infraFoto("praia", 0), futevolei: infraFoto("praia", 2), peteca: infraFoto("ginasio", 0), volei: infraFoto("ginasio", 1),
  basquete: infraFoto("quadra-poliesportiva", 0), futsal: infraFoto("quadra-poliesportiva", 1), tenis: infraFoto("quadra-de-tenis", 0),
  natacao: infraFoto("piscinas", 0), hidroginastica: infraFoto("piscinas", 1), musculacao: albumFoto("galeria-6", 0), "ginastica-funcional": albumFoto("galeria-6", 1),
  "ginastica-localizada": albumFoto("galeria-6", 2), pilates: infraFoto("estudio-de-pilates", 0), fisioterapia: infraFoto("estudio-de-pilates", 1),
  "massagem-feminina": albumFoto("galeria-2", 0), "liberacao-miofascial-drenagem-e-ventosaterapia": albumFoto("galeria-2", 1),
  "jiu-jitsu": infraFoto("escolas-de-artes-marciais", 1), karate: infraFoto("escolas-de-artes-marciais", 2), yoga: albumFoto("galeria-3", 0),
};
const INFRA_FOTO = { restaurante: infraFoto("bares", 1), academia: albumFoto("galeria-6", 0), saunas: infraFoto("piscinas", 3) };

const real = { geradoEm: new Date().toISOString(), modalidades: {}, infra: {}, eventos: [], comunicados: [], albuns: [], faq: [], paginas: {}, fotos: {}, pendentes: [] };

for (const [slug, v] of Object.entries(S.modalidades || {})) {
  if (v.erro) { real.pendentes.push(`modalidade ${slug}: ${v.erro}`); continue; }
  const p = parsePrograma(v.texto);
  const propria = v.galeriaLocal?.[0] || "";
  const foto = propria || MOD_FOTO[slug] || "";
  if (!foto) real.pendentes.push(`modalidade ${slug}: sem foto`);
  real.modalidades[slug] = { nome: v.titulo, ...p, retrato: v.imagemLocal || "", foto, fotoDaArea: !propria, galeria: v.galeriaLocal || [] };
}
for (const [slug, v] of Object.entries(S.infra || {})) {
  if (v.erro) { real.pendentes.push(`infra ${slug}: ${v.erro}`); continue; }
  const galeria = v.galeriaLocal || [];
  const foto = galeria[0] || INFRA_FOTO[slug] || "";
  if (!galeria[0]) real.pendentes.push(`infra ${slug}: sem foto própria${foto ? " (usando foto de outra área)" : ""}`);
  real.infra[slug] = { nome: v.titulo, subtitulo: clean(v.subtitulo || ""), sobre: paras(v.texto).map(clean), foto, fotoProvisoria: !galeria[0], galeria };
}

/* ---------- Eventos e comunicados (notícias) ---------- */
function parseData(titulo, slug) {
  let m = titulo.match(/(\d{1,2})(?:\s*(?:e|a|-)\s*(\d{1,2}))?\/(\d{1,2})\/(\d{2,4})/);
  if (m) { const y = m[4].length === 2 ? 2000 + +m[4] : +m[4]; return { y, mo: +m[3], d: +m[1], fim: m[2] ? +m[2] : null }; }
  m = titulo.match(/(\d{1,2})(?:\s*(?:e|a|-)\s*(\d{1,2}))?\s+de\s+([A-Za-zçÇ]+)/i);
  if (m && MESES[m[3].toLowerCase()]) return { y: 2026, mo: MESES[m[3].toLowerCase()], d: +m[1], fim: m[2] ? +m[2] : null };
  m = slug.match(/^(\d{2})-(\d{2})-(\d{2,4})/);
  if (m) return { y: m[3].length === 2 ? 2000 + +m[3] : +m[3], mo: +m[2], d: +m[1], fim: null };
  return null;
}
const catDe = (t) => /arrai|festa|copa do mundo|country na copa/i.test(t) ? "Festa" : /rock|show|música/i.test(t) ? "Show" : /col[ôo]nia|fam[íi]lia|passeio/i.test(t) ? "Família" : /assembleia|importante|aten[çc][ãa]o|portaria/i.test(t) ? "Comunicado" : "Esportes";
const localDe = (t, texto) => (texto.match(/Local:\s*([^\n]+)/i)?.[1] || (/beach|praia|futev[ôo]lei|rock/i.test(t) ? "Praia" : /futebol|copa|copinha|relâmpago de futebol/i.test(t) ? "Campos de Futebol" : /futsal|karat|peteca|v[ôo]lei|basquete/i.test(t) ? "Quadra Poliesportiva" : /nata[çc][ãa]o|águas abertas/i.test(t) ? "Lagoa do Fundão" : "Country Clube de Formiga")).trim();
const horaDe = (texto) => (texto.match(/Hor[áa]rio:\s*([^\n]+)/i)?.[1] || texto.match(/a partir das\s+(\d{1,2}h(?:\d{2})?)/i)?.[1] || texto.match(/às\s+(\d{1,2}h(?:\d{2})?)/i)?.[1] || texto.match(/at[ée]\s+(?:as|às)\s+(\d{1,2}h(?:\d{2})?)/i)?.[1] || texto.match(/^\*?\s*(\d{1,2}h(?:\d{2})?)\s*\|/m)?.[1] || "").replace(/^A partir das\s+/i, "a partir das ").trim();
const fotoDe = (t) => /beach|praia|futev/i.test(t) ? infraFoto("praia", 1) : /futebol|copa|copinha/i.test(t) ? infraFoto("campos-de-futebol", 0) : /futsal|basquete/i.test(t) ? infraFoto("quadra-poliesportiva", 2) : /karat|jiu/i.test(t) ? infraFoto("escolas-de-artes-marciais", 0) : /peteca|v[ôo]lei/i.test(t) ? infraFoto("ginasio", 2) : /nata[çc]|águas/i.test(t) ? infraFoto("piscinas", 2) : /cicl|passeio/i.test(t) ? albumFoto("galeria-3", 1) : /col[ôo]nia/i.test(t) ? albumFoto("galeria-9", 0) : /anivers|arrai|rock|show/i.test(t) ? albumFoto("galeria-11", 0) : infraFoto("area-familiar", 0);
for (const [slug, v] of Object.entries(S.noticias?.itens || {})) {
  if (v.erro || !v.titulo) continue;
  const dt = parseData(v.titulo, slug);
  const nome = clean(v.titulo.replace(/^\d{1,2}(?:\s*(?:e|a|-)\s*\d{1,2})?\s+de\s+[A-Za-zçÇ]+\s*[–-]\s*/i, "").replace(/^\d{1,2}(?:\s*(?:e|a|-)\s*\d{1,2})?\/\d{1,2}\/\d{2,4}\s*[–-]?\s*/, ""));
  const texto = (v.texto || "").replace(/Ver todas as Notícias\s*$/i, "").trim();
  const ps = paras(texto).map(clean);
  if (dt && dt.y >= 2026) {
    const bullets = ps.filter((p) => /^\*\s*\d{1,2}h/.test(p)).map((p) => p.replace(/^\*\s*/, "").replace(/\s*\|\s*/, " · "));
    const detalhes = [...ps.filter((p) => /^(Data|Hor[áa]rio|Local|Atra[çc][ãa]o|Categorias?|Inscri[çc][õo]es|In[íi]cio|Programa[çc][ãa]o|Valor|Idade|Faixa|Premia[çc][ãa]o|Homenageada?|Per[íi]odo)\s*:/i.test(p) && !/^Programa[çc][ãa]o:\s*$/i.test(p)), ...bullets];
    const desc = ps.filter((p) => !detalhes.includes(p) && !/^\*/.test(p) && !/^(Programa[çc][ãa]o:\s*$|\d{1,2} de [a-zç]+$)/i.test(p));
    const principal = desc.find((p) => p.length >= 60 && !/^(Prepare|Monte sua|Venha|Participe|Garanta|Chame|Esperamos|Fique atento|Uma programação)/i.test(p)) || desc[0] || "";
    const data = `${dt.y}-${String(dt.mo).padStart(2, "0")}-${String(dt.d).padStart(2, "0")}`;
    real.eventos.push({ id: slug, data, dia: dt.d, mes: ABREV[dt.mo], mesNome: NOMES[dt.mo], ano: dt.y, hora: horaDe(texto) || (dt.fim ? `${dt.d} a ${dt.fim}/${String(dt.mo).padStart(2, "0")}` : ""), nome, cat: catDe(nome), local: localDe(nome, texto), destaque: /copa|arrai|rock|col[ôo]nia|natação/i.test(nome), img: v.imagemLocal || fotoDe(nome), desc: principal, texto: desc, programacao: detalhes, obs: dt.fim ? `${dt.d} a ${dt.fim} de ${NOMES[dt.mo].toLowerCase()} de ${dt.y}` : "", fonte: v.url });
  } else {
    if (/^horario-das-atividades/.test(slug)) continue; // já coberto por paginas.horarios
    const titulo = clean(v.titulo).replace(/\.$/, "");
    const tituloOk = titulo === titulo.toUpperCase() ? titulo.toLowerCase().replace(/(^|\s)(\S)/g, (m, sp, c) => sp + c.toUpperCase()) : titulo;
    const tag = /churrasqueira|área familiar|sala de jogos/i.test(titulo) ? "Estrutura" : catDe(titulo);
    const corpo = ps.filter((x) => x.toLowerCase() !== titulo.toLowerCase());
    real.comunicados.push({ id: slug, tag, titulo: tituloOk, data: "", img: v.imagemLocal || fotoDe(titulo), resumo: corpo[0] || "Comunicado oficial da Diretoria — veja a imagem publicada.", texto: corpo, fonte: v.url, somenteImagem: !corpo.length || (corpo.length === 1 && corpo[0].length < 40) });
  }
}
// Agenda oficial: Country na Copa (3 datas)
const copa = S.agenda?.itens?.["country-na-copa"];
if (copa && !copa.erro) {
  const ps = paras(copa.texto).map(clean);
  const blocos = copa.texto.split(/\n(?=Data:)/).slice(1);
  for (const b of blocos) {
    const dm = b.match(/Data:\s*(\d{1,2})\s+de\s+([A-Za-zç]+)/i); if (!dm) continue;
    const mo = MESES[dm[2].toLowerCase()]; const d = +dm[1];
    const hora = b.match(/Hor[áa]rio:\s*([^\n]+)/i)?.[1] || ""; const show = b.match(/Show[^\n]*com\s+([^\n]+)/i)?.[1] || b.match(/Show:?\s*([^\n]+)/i)?.[1] || "";
    const jogo = b.match(/(Brasil\s*x\s*[^\n]+)/i)?.[1] || "";
    real.eventos.push({ id: `country-na-copa-${d}-${String(mo).padStart(2, "0")}`, data: `2026-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`, dia: d, mes: ABREV[mo], mesNome: NOMES[mo], ano: 2026, hora: hora.replace(/^A partir das\s+/i, "a partir das "), nome: `Country na Copa${jogo ? " · " + clean(jogo) : ""}`, cat: "Festa", local: "Country Clube de Formiga", destaque: true, img: copa.imagemLocal || infraFoto("area-familiar", 1), desc: ps[0] || "", texto: [ps[0] || ""], programacao: paras(b).map(clean).filter((l) => /:/.test(l)), obs: "", fonte: copa.url });
  }
}
real.eventos.sort((a, b) => a.data.localeCompare(b.data));

/* ---------- Álbuns ---------- */
for (const [slug, v] of Object.entries(S.galeria?.itens || {})) {
  const fotos = [v.imagemLocal, ...(v.galeriaLocal || [])].filter((x, i, a) => x && a.indexOf(x) === i);
  if (!fotos.length) continue;
  const t = clean(v.titulo).replace(/\s+-\s*JULHO/i, " – Julho");
  real.albuns.push({ id: slug, titulo: t.charAt(0) + t.slice(1).toLowerCase().replace(/\b(country|clube|formiga)\b/gi, (m) => m[0].toUpperCase() + m.slice(1)), data: (v.texto.match(/\d{4}/) || [""])[0] || (/2025/.test(t) ? "2025" : ""), qt: fotos.length, cover: fotos[0], fotos, fonte: v.url });
}

/* ---------- FAQ e páginas ---------- */
real.faq = (S.faq?.itens || []).map((f) => ({ q: clean(f.pergunta.replace(/^\d+\s*-\s*/, "")), a: clean(f.resposta) }));
const pg = (k) => S.paginas?.[k] && !S.paginas[k].erro ? S.paginas[k] : null;
real.paginas.historia = pg("historia") ? paras(pg("historia").texto).map(clean) : [];
function estrutura(lines) { // "ART. 27 – ..." / "I – ..." / "a) – ..."
  const out = { artigo: "", intro: "", secoes: [] }; let sec = null;
  for (const l of lines) {
    let m;
    if ((m = l.match(/^ART\.\s*(\d+)\s*[–-]\s*(.+)$/i))) { out.artigo = `Art. ${m[1]}`; out.intro = m[2].trim(); continue; }
    if ((m = l.match(/^([IVX]+)\s*[–-]\s*(.+?):?$/))) { sec = { num: m[1], titulo: m[2].trim().replace(/:$/, ""), itens: [] }; out.secoes.push(sec); continue; }
    if ((m = l.match(/^([a-z])\)\s*[–-]?\s*(.+)$/))) { if (!sec) { sec = { num: "", titulo: "", itens: [] }; out.secoes.push(sec); } sec.itens.push({ letra: m[1], texto: m[2].trim().replace(/\s+,/g, ",").replace(/,\s*,/g, ",") }); continue; }
    if (sec && sec.itens.length) sec.itens[sec.itens.length - 1].texto += " " + l; else out.intro += " " + l;
  }
  return out;
}
for (const k of ["direitos", "deveres"]) real.paginas[k] = pg(k) ? estrutura(paras(pg(k).texto).map(clean)) : { artigo: "", intro: "", secoes: [] };
real.paginas.funcionamento = pg("funcionamento") ? paras(pg("funcionamento").texto).map(clean).map((l) => {
  const m = l.match(/^(.+?)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*[ÁA]S\s*(\d{1,2})(?::(\d{2}))?\s*H?$/i); if (!m) return { dia: l, horario: "" };
  const dia = m[1].trim().toLowerCase().replace(/\s+[áa]\s+/, " a ").replace(/(^|\s)(\S)/g, (x, sp, c) => sp + c.toUpperCase()).replace(/ A /, " a ");
  return { dia, horario: `${m[2]}h${m[3] ? m[3] : ""} às ${m[4]}h${m[5] ? m[5] : ""}` };
}) : [];
real.paginas.convenio = { nome: "Clube dos Oficiais da Polícia Militar de Minas Gerais", endereco: "Rua Diábase, 200 – Prado – Belo Horizonte/MG", site: "https://www.clubedosoficiais.org.br", instrumento: "https://lagoanossa.com.br/images/instrumento-particular-de-convenio.pdf" };
real.paginas.contato = pg("contato") ? paras(pg("contato").texto).map(clean) : [];
real.paginas.convenios = pg("convenios") ? paras(pg("convenios").texto).map(clean) : [];
real.paginas.oportunidade = pg("oportunidade") ? paras(pg("oportunidade").texto).map(clean).slice(0, 2) : [];
real.paginas.ouvidoria = pg("ouvidoria") ? paras(pg("ouvidoria").texto).map(clean).slice(0, 1) : [];
real.paginas.horarios = [];
if (pg("horarios")) {
  const lines = pg("horarios").texto.split("\n").map((l) => l.trim()).filter(Boolean).slice(1);
  let atual = null;
  for (const l of lines) {
    if (/^[|\s]*$/.test(l)) continue;
    if (l.includes(" | ")) { const cells = l.split("|").map(clean).filter(Boolean); if (!atual) continue; if (!atual.colunas.length) atual.colunas = cells; else atual.linhas.push(cells); }
    else if (/^Como participar/i.test(l)) { if (atual) atual.nota = clean(l.replace(/^Como participar:\s*/i, "")); }
    else { atual = { atividade: clean(l), colunas: [], linhas: [], nota: "" }; real.paginas.horarios.push(atual); }
  }
}
// Público e forma de inscrição a partir da página de horários (bloco correspondente à modalidade)
const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");
const BLOCO = { natacao: "natacao", hidroginastica: "hidroginastica", yoga: "ioga", musculacao: "musculacao", futebol: "escolinhadefutebol", futsal: "futsal", "massagem-feminina": "massagemfeminina", "ginastica-localizada": "ginasticalocalizada", volei: "volei", "jiu-jitsu": "jiujitsu", pilates: "pilates", "ginastica-funcional": "ginasticafuncional", karate: "karate", fisioterapia: "fisioterapia", tenis: "tenis", "beach-tenis": "beachtennis", basquete: "basquete", "ballet-jazz": "balletejazz", "liberacao-miofascial-drenagem-e-ventosaterapia": "liberacaomiofascial" };
for (const [slug, m] of Object.entries(real.modalidades)) {
  const b = real.paginas.horarios.find((h) => norm(h.atividade).startsWith(BLOCO[slug] || "\u0000"));
  const fonte = [b?.atividade || "", b?.nota || "", ...m.notas, ...m.sobre.slice(-1)].join(" ");
  const idade = fonte.match(/(?:\(|\b)((?:acima de|a partir de)\s+\d+\s+anos?|\d+\s+a\s+\d+\s+anos)\)?/i)?.[1];
  if (!m.publico && idade) m.publico = idade.charAt(0).toUpperCase() + idade.slice(1);
  const insc = (b?.nota || "").match(/(Agendamento pelo aplicativo|Inscrições diretamente com (?:o|a) professor(?:a)?|Não é necessário agendamento)/i)?.[1] || m.notas.find((n) => /inscri|agendamento/i.test(n)) || "";
  m.inscricao = insc ? insc.replace(/\.$/, "") : "";
  m.horariosSite = b ? { colunas: b.colunas, linhas: b.linhas, nota: b.nota } : null;
}

/* ---------- Fotos para o site (chaves de images.ts) ---------- */
real.fotos = {
  praia: infraFoto("praia", 0), lagoa: infraFoto("praia", 5), lagoaSunset: albumFoto("galeria-3", 0), entardecer: infraFoto("praia", 4),
  tenis: infraFoto("quadra-de-tenis", 0), tenis2: infraFoto("quadra-de-tenis", 1), futebol: infraFoto("campos-de-futebol", 0), futebol2: infraFoto("campos-de-futebol", 1),
  academia: albumFoto("galeria-6", 0), academia2: albumFoto("galeria-6", 1), piscina: infraFoto("piscinas", 0), volei: infraFoto("ginasio", 1), beachTenis: infraFoto("praia", 1),
  futevolei: infraFoto("praia", 2), churrasco: infraFoto("churrasqueira", 0), churrasco2: infraFoto("churrasqueira", 1), familia: infraFoto("area-familiar", 0),
  evento: albumFoto("galeria-11", 0), show: albumFoto("galeria-11", 1), salao: infraFoto("area-familiar", 2), quadraCoberta: infraFoto("quadra-poliesportiva", 0),
  deck: infraFoto("quiosques", 0), natacao: infraFoto("piscinas", 1), hidro: infraFoto("piscinas", 2), yoga: albumFoto("galeria-3", 1), pilates: infraFoto("estudio-de-pilates", 0),
  diretoria: albumFoto("galeria-1", 0), basquete: infraFoto("quadra-poliesportiva", 1), futsal: infraFoto("quadra-poliesportiva", 2), ballet: gal("modalidades", "ballet-jazz")[0] || "",
  jiujitsu: infraFoto("escolas-de-artes-marciais", 1), karate: infraFoto("escolas-de-artes-marciais", 2), musculacao: albumFoto("galeria-6", 2), funcional: albumFoto("galeria-6", 3),
  localizada: albumFoto("galeria-6", 4), fisioterapia: infraFoto("estudio-de-pilates", 2), massagem: albumFoto("galeria-2", 0), peteca: infraFoto("ginasio", 0), bar: infraFoto("bares", 0),
  restaurante: infraFoto("bares", 1), quiosque: infraFoto("quiosques", 1), sinuca: infraFoto("sinuca", 0), parquinho: infraFoto("parquinho", 0), sauna: infraFoto("piscinas", 3),
  secretaria: infraFoto("secretaria", 0), ginasio: infraFoto("ginasio", 2), artesMarciais: infraFoto("escolas-de-artes-marciais", 0), criancas: albumFoto("galeria-9", 0),
  rock: infraFoto("praia", 3), festaJunina: albumFoto("galeria-11", 1), copa: infraFoto("area-familiar", 1), aniversario: albumFoto("galeria-11", 0),
};
for (const [k, v] of Object.entries(real.fotos)) if (!v || !(await exists(v))) { delete real.fotos[k]; real.pendentes.push(`foto do site "${k}" sem imagem real`); }
for (const s of ["futevolei", "peteca", "tenis", "restaurante", "academia", "saunas"]) real.pendentes.push(`${s}: foto própria não existe no site atual (gerar no Gamma — scripts/gamma-prompts.json)`);

await fs.writeFile("src/data/real.json", JSON.stringify(real, null, 2) + "\n");
console.log("real.json:", Object.keys(real.modalidades).length, "modalidades,", Object.keys(real.infra).length, "áreas,", real.eventos.length, "eventos,", real.comunicados.length, "comunicados,", real.albuns.length, "álbuns,", real.faq.length, "FAQ,", real.paginas.horarios.length, "blocos de horários");
console.log("pendências:", real.pendentes.length); for (const p of real.pendentes) console.log(" -", p);
