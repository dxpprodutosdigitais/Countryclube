import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { SITE } from "@/lib/site";
import styles from "./Footer.module.css";

const COLS = [
  { title: "O Clube", items: [
    { label: "História", href: "/historia" }, { label: "Missão e Valores", href: "/missao" }, { label: "Diretoria", href: "/diretoria" }, { label: "Estatuto", href: "/estatuto" },
  ] },
  { title: "Vida no Clube", items: [
    { label: "Infraestrutura", href: "/infraestrutura" }, { label: "Modalidades", href: "/modalidades" }, { label: "Agenda de Eventos", href: "/agenda" }, { label: "Galeria de Fotos", href: "/galeria" },
  ] },
  { title: "Serviços", items: [
    { label: "Funcionamento", href: "/funcionamento" }, { label: "Convênios", href: "/convenios" }, { label: "Perguntas Frequentes", href: "/faq" }, { label: "Oportunidade", href: "/oportunidade" }, { label: "Ouvidoria", href: "/ouvidoria" },
  ] },
  { title: "Associado", items: [
    { label: "Área do Associado", href: "/associado" }, { label: "Direitos", href: "/associado/direitos" }, { label: "Deveres", href: "/associado/deveres" }, { label: "Secretaria Web", href: "/secretaria", external: true }, { label: "App do Country", href: "/associado#app" }, { label: "Contato", href: "/contato" },
  ] },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className={styles.wave} aria-hidden>
        <path d="M0,60 L0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 Z" fill="currentColor" />
      </svg>
      <Container className={styles.inner}>
        <div className={styles.top}>
          <div>
            <div className={styles.brand}>
              <img src={SITE.logo} alt="" width={56} height={56} className={styles.brandImg} />
              <div>
                <div className={styles.brandName}>Country Clube</div>
                <div className={styles.brandSub}>de Formiga · MG</div>
              </div>
            </div>
            <p className={styles.slogan}>Muito lazer e diversão<br />para toda a família — o ano todo.</p>
            <div className={styles.social}>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" size={18} /></a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="facebook" size={18} /></a>
              <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" size={18} /></a>
            </div>
          </div>
          <div className={styles.cols}>
            {COLS.map((col) => (
              <div key={col.title}>
                <Eyebrow light>{col.title}</Eyebrow>
                <ul className={styles.list}>
                  {col.items.map((it) => (
                    <li key={it.label}>
                      <Link href={it.href} className={styles.link} target={"external" in it && it.external ? "_blank" : undefined} rel={"external" in it && it.external ? "noopener noreferrer" : undefined}>
                        {it.label}{"external" in it && it.external && <Icon name="external" size={11} />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.contact}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}><Icon name="map-pin" size={18} /></span>
            <div>
              <div className={styles.contactLabel}>Endereço</div>
              <div className={styles.contactValue}>{SITE.endereco.linha1}<br />{SITE.endereco.bairro} · {SITE.endereco.cidade}<br />CEP {SITE.endereco.cep}</div>
            </div>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}><Icon name="phone" size={18} /></span>
            <div>
              <div className={styles.contactLabel}>Telefone</div>
              <div className={styles.contactValue}><a href={SITE.telefoneHref}>{SITE.telefone}</a><br /><a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.dim}>WhatsApp {SITE.whatsapp}</a></div>
            </div>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}><Icon name="mail" size={18} /></span>
            <div>
              <div className={styles.contactLabel}>E-mail</div>
              <div className={styles.contactValue}><a href={`mailto:${SITE.email}`}>{SITE.email}</a><br /><a href={`mailto:${SITE.emailEventos}`} className={styles.dim}>{SITE.emailEventos}</a></div>
            </div>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}><Icon name="clock" size={18} /></span>
            <div>
              <div className={styles.contactLabel}>Funcionamento</div>
              <div className={styles.contactValue}>Seg 14h–21h · Ter–Sáb 7h–21h30<br />Dom 7h–19h · <Link href="/funcionamento" className={styles.dim}>horários das atividades</Link></div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div>© 1934–2026 Country Clube de Formiga · CNPJ {SITE.cnpj} · Associação privada sem fins lucrativos</div>
          <div className={styles.bottomLinks}>
            <Link href="/estatuto">Estatuto</Link>
            <Link href="/ouvidoria">Ouvidoria</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/admin/login">Painel</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
