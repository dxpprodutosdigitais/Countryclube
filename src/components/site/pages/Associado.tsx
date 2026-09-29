import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, IconTile, PageHeader } from "@/components/ui/Primitives";
import { AppCTA } from "@/components/site/Home";
import { DEVERES, DIREITOS } from "@/data/content";
import { STOCK } from "@/data/images";
import { SITE } from "@/lib/site";
import s from "./Servicos.module.css";
import p from "./Pages.module.css";

export function Associado() {
  const shortcuts = [
    { label: "2ª via do boleto", sub: "Via Secretaria Web", icon: "file-text", href: "/secretaria" },
    { label: "Reservar churrasqueira", sub: "Pelo app ou Secretaria", icon: "utensils", href: "/secretaria" },
    { label: "Calendário de eventos", sub: "Próximos meses", icon: "calendar", href: "/agenda" },
    { label: "Falar com a ouvidoria", sub: "Resposta em 10 dias", icon: "message-circle", href: "/ouvidoria" },
  ];
  const beneficios = [
    { titulo: "Acesso às áreas do clube", desc: "Praia, quadras, campos, piscinas, saunas, academia — todos os dias, conforme o horário de cada área.", icon: "home" },
    { titulo: "App oficial Country Clube", desc: "Boletos, reservas, ouvidoria, achados e perdidos. iOS e Android.", icon: "sparkles" },
    { titulo: "Convênios comerciais", desc: "Saúde, gastronomia, hospedagem, mobilidade — desconto na carteirinha.", icon: "handshake" },
    { titulo: "Reservas de espaços", desc: "Churrasqueiras, quiosques e espaços para eventos pelo app ou pela Secretaria.", icon: "calendar" },
    { titulo: "Atividades e escolinhas", desc: "Mais de vinte modalidades regulares, do ballet à natação, para todas as idades.", icon: "dumbbell" },
    { titulo: "Convidados", desc: "Cada associado pode trazer convidados respeitando o regulamento e as tarifas vigentes.", icon: "user" },
  ];
  return (
    <>
      <PageHeader eyebrow="Para você, associado" title="Tudo o que faz parte da família Lagoa." sub="Esta é a sua casa: serviços, benefícios, regras e atalhos para tudo o que você precisa saber como associado do Country." breadcrumb={[{ label: "Associado" }, { label: "Área do Associado" }]} image={STOCK.familia} />
      <section className="section" style={{ padding: "80px 0 48px" }}>
        <Container>
          <Eyebrow>Atalhos rápidos</Eyebrow>
          <h2 className={p.h2} style={{ marginBottom: 36 }}>O que você procura?</h2>
          <div className={s.shortcuts}>
            {shortcuts.map((it) => (
              <Link key={it.label} href={it.href} className={s.shortcut}>
                <IconTile name={it.icon} size={36} icon={18} />
                <div><div className={s.shortcutLabel}>{it.label}</div><div className={s.shortcutSub}>{it.sub}</div></div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <AppCTA compact />
      <section className="section" style={{ padding: "48px 0 80px" }}>
        <Container>
          <Eyebrow>Por que ser associado</Eyebrow>
          <h2 className={p.h2}>Seis benefícios da família Lagoa.</h2>
          <div className={s.benefits}>
            {beneficios.map((b) => (
              <div key={b.titulo} className={s.benefit}>
                <IconTile name={b.icon} size={44} icon={20} tint="accent" />
                <h3 className={s.benefitTitle}>{b.titulo}</h3>
                <p className={s.benefitText}>{b.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section style={{ padding: "0 0 40px" }}>
        <Container size="lg">
          <div className={p.grid2}>
            <Link href="/associado/direitos" className={p.box} style={{ textDecoration: "none", color: "inherit" }}>
              <IconTile name="check-circle" size={44} icon={20} style={{ marginBottom: 14 }} />
              <h3 className={p.boxTitle}>Direitos do associado</h3>
              <p className={p.boxText}>O que você pode esperar do clube: acesso, atividades, reservas, convidados e participação nas assembleias.</p>
            </Link>
            <Link href="/associado/deveres" className={p.box} style={{ textDecoration: "none", color: "inherit" }}>
              <IconTile name="clipboard-list" size={44} icon={20} style={{ marginBottom: 14 }} />
              <h3 className={p.boxTitle}>Deveres do associado</h3>
              <p className={p.boxText}>O que o clube espera de você: contribuições em dia, cuidado com o patrimônio e convivência familiar.</p>
            </Link>
          </div>
        </Container>
      </section>
      <section style={{ padding: "40px 0 120px" }}>
        <Container size="lg">
          <div className={p.softCta}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <IconTile name="shield" size={48} icon={22} tint="areia" />
              <div>
                <h3 className={p.softCtaTitle}>Cotas patrimoniais</h3>
                <p className={p.softCtaText} style={{ maxWidth: 560 }}>As cotas do Country estão integralizadas. Eventuais transferências entre famílias acontecem pela Secretaria conforme o Estatuto.</p>
              </div>
            </div>
            <Button href="/contato" variant="primary" iconRight={<Icon name="arrow-right" size={14} />}>Falar com a Secretaria</Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function RuleList({ items }: { items: string[] }) {
  return (
    <ol className={p.ruleList}>
      {items.map((t, i) => <li key={i} className={p.ruleItem}><span className={p.ruleNum} aria-hidden>{i + 1}</span><span>{t}</span></li>)}
    </ol>
  );
}

export function Direitos() {
  return (
    <>
      <PageHeader eyebrow="Associado" title="Direitos do associado." sub="O que o Country Clube de Formiga garante a cada associado, nos termos do Estatuto." breadcrumb={[{ label: "Associado", href: "/associado" }, { label: "Direitos" }]} />
      <section className="section section--tight">
        <Container size="md">
          <RuleList items={DIREITOS} />
          <div className={p.notice}>
            <span className={p.noticeIcon}><Icon name="file-text" size={20} /></span>
            <div><h4 className={p.noticeTitle}>Texto completo no Estatuto</h4><p className={p.noticeText}>Esta lista é um resumo. A redação oficial está no <Link href="/estatuto">Estatuto do clube</Link> e em <a href={`${SITE.siteAtual}/direitos/`} target="_blank" rel="noopener noreferrer">lagoanossa.com.br/direitos</a>.</p></div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            <Button href="/associado/deveres" variant="secondary" iconRight={<Icon name="arrow-right" size={14} />}>Ver deveres</Button>
            <Button href="/estatuto" variant="ghost">Estatuto</Button>
          </div>
        </Container>
      </section>
    </>
  );
}

export function Deveres() {
  return (
    <>
      <PageHeader eyebrow="Associado" title="Deveres do associado." sub="O que o clube espera de cada associado para que a Lagoa continue sendo a casa de todos." breadcrumb={[{ label: "Associado", href: "/associado" }, { label: "Deveres" }]} />
      <section className="section section--tight">
        <Container size="md">
          <RuleList items={DEVERES} />
          <div className={p.notice}>
            <span className={p.noticeIcon}><Icon name="file-text" size={20} /></span>
            <div><h4 className={p.noticeTitle}>Texto completo no Estatuto</h4><p className={p.noticeText}>Esta lista é um resumo. A redação oficial está no <Link href="/estatuto">Estatuto do clube</Link> e em <a href={`${SITE.siteAtual}/deveres/`} target="_blank" rel="noopener noreferrer">lagoanossa.com.br/deveres</a>.</p></div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            <Button href="/associado/direitos" variant="secondary" iconRight={<Icon name="arrow-right" size={14} />}>Ver direitos</Button>
            <Button href="/estatuto" variant="ghost">Estatuto</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
