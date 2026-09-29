import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, Container, Eyebrow, SectionTitle } from "@/components/ui/Primitives";
import { EVENTOS_ORDENADOS, INFRA, INFRA_HOME, MODALIDADES, MODALIDADES_HOME, NOTICIAS, NUMEROS } from "@/data/content";
import { STOCK } from "@/data/images";
import { SITE } from "@/lib/site";
import styles from "./Home.module.css";

/* ============================ HERO — Concrete ============================ */
function Hero() {
  const mosaic = [
    { src: STOCK.praia, label: "Praia da Lagoa", sub: "Vôlei · Beach tênis · Decks" },
    { src: STOCK.tenis2, label: "Quadras", sub: "Tênis · Coberta · Society" },
    { src: STOCK.evento, label: "Eventos", sub: "Festas · Shows · Casamentos" },
    { src: STOCK.lagoaSunset, label: "O entardecer", sub: "92 anos de domingos" },
  ];
  return (
    <section className={styles.hero}>
      <Container size="2xl" className={styles.heroContainer}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <div className={styles.heroEyebrow}><span className={styles.hairline} /><span>Desde 1934 · Formiga / MG</span></div>
            <h1 className={styles.heroTitle}>
              Praia, quadras e família.<br />
              <em>A nossa Lagoa.</em>
            </h1>
            <p className={styles.heroSub}>Mais de vinte modalidades esportivas, agenda generosa, churrasqueiras reserváveis e 200 mil m² de tradição à beira da Lagoa do Fundão.</p>
            <div className={styles.heroCtas}>
              <Link href="/infraestrutura" className={[styles.heroCta, styles.heroCtaSolid].join(" ")}>Conheça o clube <Icon name="arrow-right" size={14} /></Link>
              <Link href="/agenda" className={[styles.heroCta, styles.heroCtaOutline].join(" ")}>Ver agenda</Link>
            </div>
            <div className={styles.heroStats}>
              {[{ v: NUMEROS.anos, l: "anos de tradição" }, { v: NUMEROS.modalidades, l: "modalidades" }, { v: NUMEROS.familias, l: "famílias" }].map((s) => (
                <div key={s.l}><div className={styles.statValue}>{s.v}</div><div className={styles.statLabel}>{s.l}</div></div>
              ))}
            </div>
          </div>
          <div className={styles.mosaic} aria-label="Mosaico de fotos do clube">
            {mosaic.map((m, i) => (
              <div key={m.label} className={[styles.cell, i === 0 ? styles.cellBig : ""].join(" ")}>
                <div className={styles.cellImg} style={{ backgroundImage: `url(${m.src})` }} role="img" aria-label={m.label} />
                <div className={styles.cellOverlay}>
                  <div className={styles.cellLabel}>{m.label}</div>
                  <div className={styles.cellSub}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
      <div className={styles.scrollCue} aria-hidden><div>Explorar</div><div className={styles.scrollLine} /></div>
    </section>
  );
}

/* ============================ QUICK RIBBON ============================ */
function QuickRibbon() {
  const items = [
    { icon: "calendar", label: "Agenda", sub: "Próximos eventos", href: "/agenda" },
    { icon: "dumbbell", label: "Modalidades", sub: "Esportes e fitness", href: "/modalidades" },
    { icon: "utensils", label: "Reservas", sub: "Churrasqueiras e salões", href: "/secretaria" },
    { icon: "image", label: "Galeria", sub: "Memórias da família", href: "/galeria" },
    { icon: "help-circle", label: "Dúvidas", sub: "Perguntas frequentes", href: "/faq" },
  ];
  return (
    <Container className={styles.ribbon}>
      <div className={styles.ribbonGrid}>
        {items.map((it) => (
          <Link key={it.label} href={it.href} className={styles.ribbonCard}>
            <span className="icon-tile" style={{ width: 40, height: 40, borderRadius: 12 }}><Icon name={it.icon} size={20} /></span>
            <span>
              <span className={styles.ribbonLabel}>{it.label}</span>
              <span className={styles.ribbonSub}>{it.sub}</span>
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}

/* ============================ HISTÓRIA BAND ============================ */
function HistoriaBand() {
  const stats = [
    { n: NUMEROS.anos, l: "anos de tradição" },
    { n: NUMEROS.familias, l: "famílias associadas" },
    { n: NUMEROS.modalidades, l: "modalidades esportivas" },
    { n: NUMEROS.area, l: "metros quadrados", sub: "às margens da Lagoa" },
  ];
  return (
    <section className={styles.band}>
      <div className={styles.bandPhoto} style={{ backgroundImage: `url(${STOCK.lagoaSunset})` }} aria-hidden />
      <Container className={styles.bandInner}>
        <div className={styles.bandGrid}>
          <div>
            <Eyebrow light>Nosso legado</Eyebrow>
            <h2 className={styles.bandTitle}>&ldquo;Nosso clube é um <span>legado</span> que atravessa gerações.&rdquo;</h2>
            <p className={styles.bandText}>Em 6 de maio de 1934, algumas famílias tradicionais de Formiga descobriram na Lagoa do Fundão um lugar para o descanso e a diversão. Quase um século depois, a nossa Lagoa continua a ser exatamente isso — um lugar onde os finais de semana têm gosto de casa.</p>
            <Button href="/historia" variant="accent" size="lg" iconRight={<Icon name="arrow-right" size={16} />}>Conheça nossa história</Button>
          </div>
          <div className={styles.bandStats}>
            {stats.map((s) => (
              <div key={s.l} className={styles.bandStat}>
                <div className={styles.bandStatValue}>{s.n}</div>
                <div className={styles.bandStatLabel}>{s.l}</div>
                {s.sub && <div className={styles.bandStatSub}>{s.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================ MODALIDADES PREVIEW ============================ */
function ModalidadesPreview() {
  const featured = MODALIDADES_HOME.map((id) => MODALIDADES.find((m) => m.id === id)!).filter(Boolean);
  return (
    <section className="section">
      <Container>
        <div className="section-head">
          <SectionTitle eyebrow="Vida ativa" title="Modalidades para toda a família" sub="Vinte e uma atividades regulares, com professores dedicados e instalações pensadas pra cada idade." />
          <Button href="/modalidades" variant="secondary" iconRight={<Icon name="arrow-right" size={14} />}>Todas as modalidades</Button>
        </div>
        <div className={styles.modGrid}>
          {featured.map((m) => (
            <Link key={m.id} href={`/modalidades/${m.id}`} className="plain">
              <Card interactive className={styles.modCard}>
                <div className={styles.modImg} style={{ backgroundImage: `url(${m.img})` }}>
                  <div className={styles.badgeTL}><Badge tone="light" size="sm">{m.cat}</Badge></div>
                </div>
                <div className={styles.modBody}>
                  <h3 className={styles.modTitle}>{m.nome}</h3>
                  <p className={styles.modDesc}>{m.desc}</p>
                  <div className={styles.modMeta}><Icon name="clock" size={14} /><span>{m.horario}</span></div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============================ AGENDA PREVIEW ============================ */
function AgendaPreview() {
  const upcoming = EVENTOS_ORDENADOS.slice(0, 4);
  const first = upcoming[0];
  return (
    <section className="section section--alt">
      <Container>
        <div className="section-head">
          <SectionTitle eyebrow="Próximas semanas" title="A agenda da Lagoa" sub="Sempre tem algo acontecendo — torneios, festas tradicionais, shows ao vivo e a programação esportiva do clube." />
          <Button href="/agenda" variant="secondary" iconRight={<Icon name="arrow-right" size={14} />}>Calendário completo</Button>
        </div>
        <div className={styles.agendaGrid}>
          <Link href={`/agenda/${first.id}`} className="plain">
            <Card interactive className={styles.featCard}>
              <div className={styles.featInner} style={{ backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(0,31,63,0.92) 100%), url(${first.img})` }}>
                <div className={styles.badges}><Badge tone="accent">Próximo evento</Badge><Badge tone="dark">{first.cat}</Badge></div>
                <div>
                  <div className={styles.featDate}>
                    <div className={styles.featDay}>{first.dia}</div>
                    <div className={styles.featMeta}>{first.mes} · {first.ano}<br /><span>{first.hora} · {first.local}</span></div>
                  </div>
                  <h3 className={styles.featTitle}>{first.nome}</h3>
                  <p className={styles.featDesc}>{first.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
          <div className={styles.agendaList}>
            {upcoming.slice(1).map((e) => (
              <Link key={e.id} href={`/agenda/${e.id}`} className="plain">
                <Card interactive className={styles.evRow}>
                  <div className={styles.evDate}><div className={styles.evDay}>{e.dia}</div><div className={styles.evMonth}>{e.mes}</div></div>
                  <div className={styles.evBody}>
                    <Badge tone="areia" size="sm">{e.cat}</Badge>
                    <h4 className={styles.evTitle}>{e.nome}</h4>
                    <div className={styles.evMeta}><Icon name="clock" size={12} /> {e.hora} · {e.local}</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================ INFRA STRIP ============================ */
function InfraStrip() {
  const featured = INFRA_HOME.map((id) => INFRA.find((i) => i.id === id)!).filter(Boolean);
  return (
    <section className="section">
      <Container>
        <div className="section-head" style={{ marginBottom: 40 }}>
          <SectionTitle eyebrow="200 mil m²" title="Tudo isso é a nossa Lagoa" sub="Praia, campos de futebol, quadras de tênis, piscinas, quiosques, churrasqueiras e — desde 2025 — uma academia nova com vista para a praia." />
          <Button href="/infraestrutura" variant="secondary" iconRight={<Icon name="arrow-right" size={14} />}>Ver infraestrutura</Button>
        </div>
      </Container>
      <div className={styles.strip}>
        <div className={styles.stripInner}>
          {featured.map((it, i) => (
            <Link key={it.id} href={`/infraestrutura#${it.id}`} className={[styles.stripCard, i === 0 ? styles.stripCardFirst : ""].join(" ")} style={{ backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(0,31,63,0.85) 100%), url(${it.img})` }}>
              <div className={styles.badges}><Badge tone="light" size="sm">{it.cat}</Badge>{it.tag && <Badge tone="accent" size="sm">{it.tag}</Badge>}</div>
              <div>
                <h3 className={styles.stripTitle}>{it.nome}</h3>
                <p className={styles.stripDesc}>{it.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ NOTÍCIAS ============================ */
function NoticiasGrid() {
  return (
    <section className="section section--alt">
      <Container>
        <div className="section-head">
          <SectionTitle eyebrow="Diário da Lagoa" title="Por dentro do clube" sub="Comunicados, amistosos, torneios e novidades para os associados." />
        </div>
        <div className={styles.newsGrid}>
          {NOTICIAS.map((n) => (
            <Card key={n.id} interactive as="article" className={styles.newsCard}>
              <div className={styles.newsImg} style={{ backgroundImage: `url(${n.img})` }} />
              <div className={styles.newsBody}>
                <div className={styles.newsMeta}><Badge tone="info" size="sm">{n.tag}</Badge><span>{n.data}</span></div>
                <h3 className={styles.newsTitle}>{n.titulo}</h3>
                <p className={styles.newsSummary}>{n.resumo}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============================ APP CTA ============================ */
export function AppCTA({ compact = false }: { compact?: boolean }) {
  return (
    <section className="section" id="app" style={compact ? { padding: "48px 0" } : undefined}>
      <Container>
        <div className={styles.app}>
          <div className={styles.appText}>
            <Eyebrow light>App do Country</Eyebrow>
            <h2 className={styles.appTitle}>Sua Lagoa no bolso, todos os dias.</h2>
            <p className={styles.appDesc}>Boletos, agendamento de atividades, reserva de churrasqueiras, ouvidoria, achados e perdidos. Tudo na palma da mão — para iOS e Android.</p>
            <div className={styles.appBtns}>
              <Button href={SITE.appStore} external variant="onDarkSolid" size="lg" icon={<Icon name="external" size={14} />}>App Store</Button>
              <Button href={SITE.googlePlay} external variant="onDark" size="lg" icon={<Icon name="external" size={14} />}>Google Play</Button>
            </div>
          </div>
          {!compact && (
            <div className={styles.phoneWrap} aria-hidden>
              <div className={styles.phone}>
                <div className={styles.phoneScreen}>
                  <div className={styles.phoneHead}><img src={SITE.logo} alt="" width={28} height={28} /><span>Country Clube</span></div>
                  <div className={styles.phoneHello}>Olá, Família Lagoa!</div>
                  {["Boletos", "Reservas", "Agenda", "Ouvidoria", "Carteirinha"].map((item) => (
                    <div key={item} className={styles.phoneRow}>{item}<Icon name="chevron-right" size={12} color="var(--color-accent)" /></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className={styles.glow} aria-hidden />
        </div>
      </Container>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <QuickRibbon />
      <HistoriaBand />
      <ModalidadesPreview />
      <AgendaPreview />
      <InfraStrip />
      <NoticiasGrid />
      <AppCTA />
    </>
  );
}
