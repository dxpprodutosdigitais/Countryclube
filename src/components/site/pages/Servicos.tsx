"use client";
import { useMemo, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container, EmptyState, Eyebrow, FilterPills, IconTile, PageHeader } from "@/components/ui/Primitives";
import { CONVENIOS, FAQ, FUNCIONAMENTO } from "@/data/content";
import { SITE } from "@/lib/site";
import s from "./Servicos.module.css";
import p from "./Pages.module.css";

/* ---------- Campo de formulário com validação ---------- */
function Field({ label, name, placeholder, type = "text", textarea, required, error }: { label: string; name: string; placeholder?: string; type?: string; textarea?: boolean; required?: boolean; error?: string }) {
  const id = `f-${name}`;
  const cls = ["field__input", error ? "field__input--error" : ""].join(" ");
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">{label}{required && <span aria-hidden> *</span>}</label>
      {textarea
        ? <textarea id={id} name={name} placeholder={placeholder} rows={5} className={cls} required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
        : <input id={id} name={name} type={type} placeholder={placeholder} className={cls} required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />}
      {error && <span id={`${id}-err`} className="field__error">{error}</span>}
    </div>
  );
}

function useForm(requiredFields: { name: string; label: string; email?: boolean }[]) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    requiredFields.forEach((f) => {
      const v = String(fd.get(f.name) ?? "").trim();
      if (!v) errs[f.name] = `Informe ${f.label.toLowerCase()}.`;
      else if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errs[f.name] = "Informe um e-mail válido.";
    });
    setErrors(errs);
    if (Object.keys(errs).length === 0) { setSent(true); e.currentTarget.reset(); }
  };
  return { errors, sent, onSubmit, reset: () => setSent(false) };
}

/* ============================ FUNCIONAMENTO ============================ */
export function Funcionamento() {
  return (
    <>
      <PageHeader eyebrow="Funcionamento" title="Horários de todas as áreas do clube." sub="Geralmente abrimos às 6h e fechamos às 22h. Cada área tem seu próprio horário — consulte abaixo." breadcrumb={[{ label: "Serviços" }, { label: "Funcionamento" }]} />
      <section className="section section--tight">
        <Container size="lg">
          <div className={s.table} role="table" aria-label="Horários de funcionamento por área">
            <div className={s.tableHead} role="row"><div role="columnheader">Área</div><div role="columnheader">Seg–Sex</div><div role="columnheader">Sábado</div><div role="columnheader">Domingo</div></div>
            {FUNCIONAMENTO.map((r) => (
              <div key={r.area} className={s.tableRow} role="row">
                <div className={s.area} role="cell">{r.area}</div>
                {[r.seg, r.sab, r.dom].map((v, i) => <div key={i} role="cell" className={v === "Fechado" ? s.closed : ""}>{v}</div>)}
              </div>
            ))}
          </div>
          <div className={p.notice}>
            <span className={p.noticeIcon}><Icon name="megaphone" size={20} /></span>
            <div>
              <h4 className={p.noticeTitle}>Feriados</h4>
              <p className={p.noticeText}>Em feriados, o clube funciona em horário de domingo. Em datas excepcionais, comunicamos com antecedência pelo app, pelas redes sociais e no mural da Secretaria.</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ============================ CONVÊNIOS ============================ */
export function Convenios() {
  const cats = ["Todas", ...Array.from(new Set(CONVENIOS.map((c) => c.cat)))];
  const [cat, setCat] = useState("Todas");
  const filtered = cat === "Todas" ? CONVENIOS : CONVENIOS.filter((c) => c.cat === cat);
  return (
    <>
      <PageHeader eyebrow="Vantagens para a família Lagoa" title="Convênios e parcerias." sub="Empresas e instituições locais oferecem condições especiais para os associados do Country. Apresente sua carteirinha (ou o app) e aproveite." breadcrumb={[{ label: "Serviços" }, { label: "Convênios" }]} />
      <section className="section section--tight">
        <Container>
          <div style={{ marginBottom: 32 }}><FilterPills options={cats} value={cat} onChange={setCat} label="Filtrar por categoria" small /></div>
          <div className={s.convGrid}>
            {filtered.map((c) => (
              <div key={c.nome} className={s.conv}>
                <div className={s.convHead}><h3 className={s.convName}>{c.nome}</h3><Badge tone="areia" size="sm">{c.cat}</Badge></div>
                <div className={s.convBenefit}><Icon name="star" size={14} /><span>{c.beneficio}</span></div>
              </div>
            ))}
          </div>
          <div className={p.darkCta} style={{ marginTop: 48 }}>
            <div>
              <Eyebrow light>Sua empresa aqui</Eyebrow>
              <h3 className={p.darkCtaTitle}>Quer ser parceira do Country?</h3>
              <p className={p.darkCtaText}>Oferecemos exposição da sua marca aos nossos 4 mil associados, em troca de benefícios exclusivos.</p>
            </div>
            <Button href="/oportunidade" variant="accent" size="lg" iconRight={<Icon name="arrow-right" size={14} />}>Quero ser parceira</Button>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ============================ FAQ ============================ */
export function FaqPage() {
  const cats = ["Todas", ...Array.from(new Set(FAQ.map((f) => f.cat)))];
  const [cat, setCat] = useState("Todas");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const filtered = useMemo(() => {
    let list = FAQ.map((f, i) => ({ ...f, i }));
    if (cat !== "Todas") list = list.filter((f) => f.cat === cat);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    return list;
  }, [cat, query]);

  return (
    <>
      <PageHeader eyebrow="Perguntas Frequentes" title="Dúvidas comuns dos associados." sub="Procure pelo assunto ou navegue pelas categorias. Não encontrou o que precisa? Fale com a Secretaria." breadcrumb={[{ label: "Serviços" }, { label: "Perguntas Frequentes" }]} />
      <section className="section section--tight">
        <Container size="md">
          <div className={s.search}>
            <span className={s.searchIcon}><Icon name="search" size={18} /></span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar dúvidas..." className={s.searchInput} aria-label="Buscar dúvidas" />
          </div>
          <div style={{ marginBottom: 32 }}><FilterPills options={cats} value={cat} onChange={setCat} label="Filtrar por categoria" small /></div>
          <div className={s.faqList}>
            {filtered.length === 0 && (
              <EmptyState title="Nada por aqui" sub="Tente outras palavras-chave ou explore as categorias acima." action={<Button variant="secondary" size="sm" onClick={() => { setQuery(""); setCat("Todas"); }}>Limpar filtros</Button>} />
            )}
            {filtered.map((f) => {
              const isOpen = open === f.i;
              return (
                <div key={f.i} className={s.faqItem}>
                  <button type="button" className={s.faqBtn} aria-expanded={isOpen} aria-controls={`faq-${f.i}`} onClick={() => setOpen(isOpen ? null : f.i)}>
                    <span className={s.faqQ}><Badge tone="info" size="sm">{f.cat}</Badge>{f.q}</span>
                    <span className={[s.faqPlus, isOpen ? s.faqPlusOpen : ""].join(" ")}><Icon name="plus" size={18} /></span>
                  </button>
                  {isOpen && <div id={`faq-${f.i}`} className={s.faqA}>{f.a}</div>}
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}

/* ============================ OPORTUNIDADE ============================ */
export function Oportunidade() {
  const mailCv = `mailto:${SITE.email}?subject=${encodeURIComponent("Currículo — Trabalhe conosco")}`;
  const mailParc = `mailto:${SITE.emailEventos}?subject=${encodeURIComponent("Proposta de parceria")}`;
  return (
    <>
      <PageHeader eyebrow="Trabalhe conosco · Parcerias" title="Oportunidades no Country." sub="Vagas, programas de estágio e parcerias institucionais — quem chega para fazer parte da equipe da Lagoa entra na família." breadcrumb={[{ label: "Serviços" }, { label: "Oportunidade" }]} />
      <section className="section section--tight">
        <Container size="lg">
          <div className={s.opGrid}>
            <div className={s.opCard}>
              <IconTile name="briefcase" size={48} icon={22} />
              <h3 className={s.opTitle}>Trabalhe conosco</h3>
              <p className={s.opText}>Procuramos pessoas que gostem de cuidar de pessoas. Guardamos seu currículo no nosso banco e entramos em contato quando abrir uma vaga compatível.</p>
              <div className={s.opList}>{["Atendimento e portaria", "Esportes e professores", "Eventos e gastronomia", "Administração e financeiro"].map((a) => <div key={a}>{a}</div>)}</div>
              <div><Button href={mailCv} variant="primary" iconRight={<Icon name="arrow-right" size={14} />}>Enviar currículo</Button></div>
            </div>
            <div className={[s.opCard, s.opCardDark].join(" ")}>
              <IconTile name="handshake" size={48} icon={22} tint="white" />
              <h3 className={s.opTitle}>Parcerias institucionais</h3>
              <p className={s.opText}>Sua empresa, escola ou instituição pode firmar uma parceria com o Country — convênios comerciais, patrocínio de eventos, programas de visitação e mais.</p>
              <div className={s.opList}>{["Patrocínio de eventos esportivos", "Programa de convênios comerciais", "Cessão de espaços para eventos", "Programas de visitação escolar"].map((a) => <div key={a}>{a}</div>)}</div>
              <div><Button href={mailParc} variant="accent" iconRight={<Icon name="arrow-right" size={14} />}>Proposta de parceria</Button></div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ============================ OUVIDORIA ============================ */
export function Ouvidoria() {
  const [tipo, setTipo] = useState("elogio");
  const tipos = [
    { v: "elogio", label: "Elogio", icon: "star", desc: "Algo que merece ser celebrado" },
    { v: "sugestao", label: "Sugestão", icon: "sparkles", desc: "Como podemos melhorar" },
    { v: "reclamacao", label: "Reclamação", icon: "message-circle", desc: "Algo que precisa de atenção" },
  ];
  const form = useForm([{ name: "nome", label: "Seu nome" }, { name: "email", label: "Seu e-mail", email: true }, { name: "mensagem", label: "A mensagem" }]);
  return (
    <>
      <PageHeader eyebrow="Sua voz, nossa Lagoa" title="Ouvidoria." sub="Aqui você fala com a diretoria do clube — diretamente. Toda manifestação é respondida em até 10 dias úteis." breadcrumb={[{ label: "Serviços" }, { label: "Ouvidoria" }]} />
      <section className="section section--tight">
        <Container size="md">
          <div className={s.types} role="radiogroup" aria-label="Tipo de manifestação">
            {tipos.map((t) => (
              <button key={t.v} type="button" role="radio" aria-checked={tipo === t.v} className={s.type} onClick={() => setTipo(t.v)}>
                <span className={s.typeIcon}><Icon name={t.icon} size={18} /></span>
                <span className={s.typeLabel}>{t.label}</span>
                <span className={s.typeDesc}>{t.desc}</span>
              </button>
            ))}
          </div>
          {form.sent ? (
            <div className="form-success" role="status">
              <Icon name="check-circle" size={22} />
              <div><strong>Recebemos sua manifestação.</strong> Em até 10 dias úteis você terá uma resposta.<div style={{ marginTop: 12 }}><Button variant="secondary" size="sm" onClick={form.reset}>Enviar outra</Button></div></div>
            </div>
          ) : (
            <form className={s.form} onSubmit={form.onSubmit} noValidate>
              <input type="hidden" name="tipo" value={tipo} />
              <Field label="Nome" name="nome" placeholder="Como podemos te chamar?" required error={form.errors.nome} />
              <div className={s.formRow}>
                <Field label="E-mail" name="email" placeholder="voce@email.com" type="email" required error={form.errors.email} />
                <Field label="Matrícula (opcional)" name="matricula" placeholder="000000" />
              </div>
              <Field label="Área do clube" name="area" placeholder="Ex.: Restaurante, Quadra de Tênis, Recepção..." />
              <Field label="Mensagem" name="mensagem" placeholder="Descreva com calma. Estamos lendo." textarea required error={form.errors.mensagem} />
              <label className={s.check}><input type="checkbox" name="anonimo" /> Prefiro que minha manifestação seja tratada de forma anônima.</label>
              <div><Button type="submit" variant="primary" size="lg" iconRight={<Icon name="send" size={14} />}>Enviar manifestação</Button></div>
            </form>
          )}
        </Container>
      </section>
    </>
  );
}

/* ============================ CONTATO ============================ */
export function Contato() {
  const form = useForm([{ name: "nome", label: "Seu nome" }, { name: "email", label: "Seu e-mail", email: true }, { name: "mensagem", label: "A mensagem" }]);
  const cards = [
    { icon: "phone", label: "Telefone", v1: SITE.telefone, v2: "Recepção · todos os dias", href: SITE.telefoneHref },
    { icon: "whatsapp", label: "WhatsApp", v1: SITE.whatsapp, v2: "Seg–Sex · horário comercial", href: SITE.whatsappHref },
    { icon: "mail", label: "E-mail", v1: SITE.email, v2: `Eventos: ${SITE.emailEventos}`, href: `mailto:${SITE.email}` },
    { icon: "map-pin", label: "Endereço", v1: `${SITE.endereco.linha1}, ${SITE.endereco.bairro}`, v2: `${SITE.endereco.cidade} · CEP ${SITE.endereco.cep}`, href: SITE.mapsLink },
  ];
  return (
    <>
      <PageHeader eyebrow="Fale com a Lagoa" title="Estamos aqui — todos os dias." sub="Telefone, e-mail, WhatsApp e o endereço para uma visita. Os nossos canais respondem em horário comercial, mas a recepção atende todos os dias." breadcrumb={[{ label: "Serviços" }, { label: "Contato" }]} />
      <section className="section section--tight">
        <Container>
          <div className={s.contactGrid}>
            <div className={s.contactCards}>
              {cards.map((c) => (
                <a key={c.label} href={c.href} className={s.contactCard} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                  <IconTile name={c.icon} size={38} icon={18} />
                  <div><div className={s.contactLabel}>{c.label}</div><div className={s.contactValue}>{c.v1}</div><div className={s.contactSub}>{c.v2}</div></div>
                </a>
              ))}
              <div className={s.socialRow}>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className={s.socialBtn}><Icon name="instagram" size={18} />{SITE.instagramHandle}</a>
                <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className={s.socialBtn}><Icon name="facebook" size={18} />/{SITE.facebookHandle}</a>
              </div>
            </div>
            <div className={s.formCol}>
              <div className={s.mapWrap}>
                <iframe src={SITE.mapsEmbed} className={s.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen title="Mapa — Country Clube de Formiga" />
                <div className={s.mapCard}>
                  <div><div className={s.mapTitle}>Country Clube de Formiga</div><div className={s.mapSub}>{SITE.endereco.linha1} · {SITE.endereco.cidade}</div></div>
                  <Button href={SITE.mapsLink} external variant="secondary" size="sm" iconRight={<Icon name="external" size={12} />}>Abrir no Maps</Button>
                </div>
              </div>
              {form.sent ? (
                <div className="form-success" role="status"><Icon name="check-circle" size={22} /><div><strong>Mensagem enviada.</strong> Respondemos em até 48h úteis.<div style={{ marginTop: 12 }}><Button variant="secondary" size="sm" onClick={form.reset}>Enviar outra</Button></div></div></div>
              ) : (
                <form className={s.form} style={{ padding: "32px 36px", gap: 14 }} onSubmit={form.onSubmit} noValidate>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--color-fg-strong)", letterSpacing: "-0.01em" }}>Envie uma mensagem rápida</h3>
                  <Field label="Nome" name="nome" placeholder="Seu nome" required error={form.errors.nome} />
                  <Field label="E-mail" name="email" placeholder="voce@email.com" type="email" required error={form.errors.email} />
                  <Field label="Mensagem" name="mensagem" placeholder="Como podemos ajudar?" textarea required error={form.errors.mensagem} />
                  <div><Button type="submit" variant="primary" iconRight={<Icon name="send" size={14} />}>Enviar</Button></div>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ============================ SECRETARIA WEB ============================ */
export function Secretaria() {
  return (
    <>
      <PageHeader eyebrow="Sistema externo" title="Secretaria Web" sub="Você está prestes a sair do site do Country e entrar no sistema de gestão do associado, hospedado em servidor de terceiros." breadcrumb={[{ label: "Associado" }, { label: "Secretaria Web" }]} />
      <section className="section section--tight">
        <Container size="md">
          <div className={s.redirect}>
            <IconTile name="external" size={64} icon={28} tint="accent" style={{ marginBottom: 20 }} />
            <h2 className={s.redirectTitle}>Aviso de redirecionamento</h2>
            <p className={s.redirectText}>No sistema você acessa boletos, dados cadastrais, reservas e histórico financeiro. Use o login e senha cadastrados na Secretaria. Em caso de dúvida, fale conosco antes de prosseguir.</p>
            <div className={s.redirectBtns}>
              <Button href={SITE.secretariaWeb} external variant="primary" size="lg" iconRight={<Icon name="external" size={14} />}>Continuar para a Secretaria Web</Button>
              <Button href="/contato" variant="secondary" size="lg">Fale com a Secretaria</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

