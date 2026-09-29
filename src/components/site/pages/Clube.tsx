import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, IconTile, PageHeader } from "@/components/ui/Primitives";
import { CONSELHEIROS, DIRETORIA, ESTATUTO_CAPITULOS, GESTAO, HISTORIA_FOTOS, HISTORIA_TEXTO, HISTORIA_TIMELINE } from "@/data/content";
import { OFICIAL, STOCK } from "@/data/images";
import { SITE } from "@/lib/site";
import s from "./Pages.module.css";

const initials = (nome: string) => nome.split(" ").filter((p) => p.length > 2 || /^[A-Z]\.?$/.test(p)).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

/* ============================ HISTÓRIA ============================ */
export function Historia() {
  return (
    <>
      <PageHeader eyebrow="Desde 1934 · 92 anos" title="Quase um século à beira da Lagoa do Fundão." sub="A história do Country Clube de Formiga se confunde com a história da cidade. Conheça os momentos que nos trouxeram até aqui." breadcrumb={[{ label: "O Clube" }, { label: "História" }]} image={OFICIAL.historia1} />
      <section className="section">
        <Container size="lg">
          <div className={s.split}>
            <div>
              <Eyebrow>História</Eyebrow>
              <h2 className={s.h2Italic}>Um legado<br />que atravessa gerações.</h2>
            </div>
            <div className={s.prose}>
              {HISTORIA_TEXTO.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <Eyebrow>Linha do tempo</Eyebrow>
            <h3 className={s.h2} style={{ margin: "12px 0 48px", fontSize: "clamp(28px, 3vw, 36px)" }}>Da trilha na mata aos 92 anos</h3>
            <div className={s.timeline}>
              <div className={s.timelineLine} aria-hidden />
              {HISTORIA_TIMELINE.map((t, i) => (
                <div key={i} className={s.tlItem}>
                  <div className={s.tlYear}>{t.ano}</div>
                  <div className={s.tlDotWrap}><div className={s.tlDot} /></div>
                  <div>
                    <div className={s.tlYearMobile}>{t.ano}</div>
                    <h4 className={s.tlTitle}>{t.titulo}</h4>
                    <p className={s.tlText}>{t.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section style={{ padding: "0 0 120px" }}>
        <Container size="2xl">
          <div className={s.photoStrip}>
            {HISTORIA_FOTOS.map((p) => (
              <figure key={p.src} className={s.photo} style={{ margin: 0 }}>
                <div className={s.photoImg} style={{ backgroundImage: `url(${p.src})` }} role="img" aria-label={p.cap} />
                <figcaption className={s.photoCap}>{p.cap}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

/* ============================ MISSÃO E VALORES ============================ */
export function Missao() {
  const valores = [
    { titulo: "Família", desc: "Tudo no Country foi pensado para juntar gerações. Aqui, avós, pais e filhos compartilham a mesma água, a mesma sombra e a mesma mesa.", icon: "heart" },
    { titulo: "Tradição", desc: "92 anos de história não são feitos por acaso. Honramos cada acerto do passado e cuidamos do clube como um patrimônio coletivo.", icon: "shield" },
    { titulo: "Comunidade", desc: "O Country é uma associação privada sem fins lucrativos. Tudo que arrecadamos volta para o clube — em obras, eventos e cuidado diário.", icon: "handshake" },
    { titulo: "Vida ativa", desc: "Acreditamos que esporte e lazer são caminhos de saúde para a vida inteira. Por isso, mantemos mais de vinte modalidades regulares.", icon: "dumbbell" },
    { titulo: "Natureza", desc: "A Lagoa do Fundão é o nosso bem maior. Cuidamos da água, dos jardins e das árvores como quem cuida da casa da família.", icon: "waves" },
    { titulo: "Hospitalidade", desc: "Cada associado, cada convidado, cada visita — todos são recebidos com o mesmo carinho. É o nosso jeito de Formiga de ser.", icon: "sparkles" },
  ];
  return (
    <>
      <PageHeader eyebrow="O Clube" title="Por que existimos e o que nos move." sub="Missão, visão e valores do Country Clube de Formiga — escritos para serem vividos, não enquadrados na parede." breadcrumb={[{ label: "O Clube" }, { label: "Missão e Valores" }]} image={STOCK.lagoa} />
      <section className="section">
        <Container size="lg">
          <div className={s.splitEven}>
            <div><Eyebrow>Nossa Missão</Eyebrow><p className={s.quote}>&ldquo;Oferecer à família formiguense um espaço de lazer, esporte e convivência, preservando a Lagoa do Fundão e o legado de quase um século de tradição.&rdquo;</p></div>
            <div><Eyebrow>Nossa Visão</Eyebrow><p className={s.quote}>&ldquo;Ser o clube de referência na região centro-oeste mineira — moderno na gestão, tradicional no acolhimento e impecável no cuidado com o associado.&rdquo;</p></div>
          </div>
          <Eyebrow>Nossos Valores</Eyebrow>
          <h2 className={s.h2}>Seis pilares para sustentar 92 anos.</h2>
          <div className={s.gridAuto280}>
            {valores.map((v) => (
              <div key={v.titulo} className={s.box}>
                <IconTile name={v.icon} size={48} icon={22} style={{ marginBottom: 16 }} />
                <h3 className={s.boxTitle}>{v.titulo}</h3>
                <p className={s.boxText}>{v.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

/* ============================ DIRETORIA ============================ */
export function Diretoria() {
  const grads = ["var(--c-lagoa-500), var(--c-lagoa-700)", "var(--c-lagoa-600), var(--c-lagoa-800)", "var(--c-lagoa-700), var(--c-lagoa-900)", "var(--c-lagoa-800), var(--c-lagoa-950)"];
  return (
    <>
      <PageHeader eyebrow={GESTAO} title="Diretoria 2026/2027" sub="Diretoria eleita pelos associados em assembleia. Encontre quem é responsável por cada área do clube." breadcrumb={[{ label: "O Clube" }, { label: "Diretoria" }]} image={STOCK.diretoria} />
      <section className="section">
        <Container size="lg">
          <Eyebrow>Diretores</Eyebrow>
          <h2 className={s.h2}>A diretoria que cuida da Lagoa.</h2>
          <div className={s.gridAuto260}>
            {DIRETORIA.map((d, i) => (
              <div key={d.nome} className={s.memberCard}>
                <div className={s.memberHead} style={{ background: `linear-gradient(135deg, ${grads[i % grads.length]})` }} aria-hidden>
                  <div className={s.memberInitials}>{initials(d.nome)}</div>
                </div>
                <div className={s.memberBody}>
                  <Eyebrow>{d.cargo}</Eyebrow>
                  <h3 className={s.memberName}>{d.nome}</h3>
                  <div className={s.memberTerm}>{d.gestao}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={s.softCta} style={{ marginTop: 48, flexDirection: "column", alignItems: "stretch" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div>
                <h3 className={s.softCtaTitle}>Conselho</h3>
                <p className={s.softCtaText}>Conselheiros da {GESTAO}. Atas das reuniões disponíveis na Secretaria.</p>
              </div>
              <Button href="/contato" variant="primary" iconRight={<Icon name="arrow-right" size={14} />}>Fale com a Secretaria</Button>
            </div>
            <ul className={s.council} style={{ listStyle: "none", padding: 0 }}>
              {CONSELHEIROS.map((c) => (
                <li key={c} className={s.councilItem}><span className={s.councilInitials} aria-hidden>{initials(c)}</span>{c}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ============================ ESTATUTO ============================ */
export function Estatuto() {
  return (
    <>
      <PageHeader eyebrow="Documento oficial" title="Estatuto do Country Clube." sub="Estatuto, normas de uso e direitos do associado. Documento aprovado em Assembleia Geral — versão 2026." breadcrumb={[{ label: "O Clube" }, { label: "Estatuto" }]} />
      <section className="section">
        <Container size="lg">
          <div className={s.darkCta} style={{ marginBottom: 56 }}>
            <div>
              <Eyebrow light>PDF · Estatuto 2026</Eyebrow>
              <h3 className={s.darkCtaTitle}>Estatuto completo do clube</h3>
              <p className={s.darkCtaText}>Versão consolidada 2026, em PDF, para leitura e download.</p>
            </div>
            <Button href={SITE.estatutoPdf} external variant="accent" size="lg" icon={<Icon name="external" size={16} />}>Baixar PDF</Button>
          </div>
          <Eyebrow>Sumário</Eyebrow>
          <h2 className={s.h2} style={{ marginBottom: 36 }}>Oito capítulos, um clube só.</h2>
          <div className={s.chapters}>
            {ESTATUTO_CAPITULOS.map((c) => (
              <a key={c.num} href={SITE.estatutoPdf} target="_blank" rel="noopener noreferrer" className={s.chapter}>
                <div className={s.chapterNum}>{c.num}</div>
                <div style={{ flex: 1 }}>
                  <h4 className={s.chapterTitle}>{c.titulo}</h4>
                  <p className={s.chapterDesc}>{c.desc}</p>
                </div>
                <Icon name="chevron-right" size={16} color="var(--color-fg-subtle)" />
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
