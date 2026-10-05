import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./Primitives.module.css";

/* ---------- Eyebrow ------------------------------------------------------ */
export function Eyebrow({ children, light, className, style }: { children: ReactNode; light?: boolean; className?: string; style?: CSSProperties }) {
  return <span className={["eyebrow", light ? "eyebrow--light" : "", className ?? ""].filter(Boolean).join(" ")} style={style}>{children}</span>;
}

/* ---------- Section title ----------------------------------------------- */
export function SectionTitle({ eyebrow, title, sub, align = "left", light = false, maxWidth = 720, as: Tag = "h2" }: {
  eyebrow?: ReactNode; title: ReactNode; sub?: ReactNode; align?: "left" | "center"; light?: boolean; maxWidth?: number; as?: "h1" | "h2";
}) {
  return (
    <div className={[styles.sectionTitle, align === "center" ? styles.center : "", light ? styles.light : ""].filter(Boolean).join(" ")} style={{ maxWidth }}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <Tag className={styles.title}>{title}</Tag>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  );
}

/* ---------- Container --------------------------------------------------- */
export function Container({ children, size = "xl", className, style, id }: { children: ReactNode; size?: "sm" | "md" | "lg" | "xl" | "2xl"; className?: string; style?: CSSProperties; id?: string }) {
  return (
    <div id={id} className={["container", size !== "xl" ? `container--${size}` : "", className ?? ""].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}

/* ---------- Card -------------------------------------------------------- */
export function Card({ children, interactive, notice, className, style, as: Tag = "div" }: { children: ReactNode; interactive?: boolean; notice?: boolean; className?: string; style?: CSSProperties; as?: "div" | "article" | "li" }) {
  return (
    <Tag className={["card", interactive ? "card--interactive" : "", notice ? "card--notice" : "", className ?? ""].filter(Boolean).join(" ")} style={style}>
      {children}
    </Tag>
  );
}

/* ---------- Empty state ------------------------------------------------- */
export function EmptyState({ icon = "search", title, sub, action }: { icon?: string; title: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}><Icon name={icon} size={28} /></span>
      <h3 className={styles.emptyTitle}>{title}</h3>
      {sub && <p className={styles.emptySub}>{sub}</p>}
      {action}
    </div>
  );
}

/* ---------- Page header (todas as subpáginas) --------------------------- */
export interface Crumb { label: string; href?: string }

export function PageHeader({ eyebrow, title, sub, image, breadcrumb, as = "h1" }: { eyebrow?: ReactNode; title: ReactNode; sub?: ReactNode; image?: string; breadcrumb?: Crumb[]; as?: "h1" | "h2" }) {
  const bg = image
    ? `linear-gradient(180deg, rgba(0,31,63,0.78) 0%, rgba(0,31,63,0.88) 100%), url(${image}) center/cover`
    : "linear-gradient(160deg, var(--c-lagoa-800) 0%, var(--c-lagoa-950) 100%)";
  return (
    <section className={styles.pageHeader} style={{ background: bg }}>
      <Container>
        {breadcrumb && (
          <nav className={styles.crumbs} aria-label="Navegação estrutural">
            <Link href="/">Início</Link>
            {breadcrumb.map((b, i) => (
              <span key={i} className={styles.crumb}>
                <span className={styles.crumbSep} aria-hidden>›</span>
                {b.href ? <Link href={b.href}>{b.label}</Link> : <span className={styles.crumbCurrent} aria-current="page">{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <SectionTitle eyebrow={eyebrow} title={title} sub={sub} light maxWidth={780} as={as} />
      </Container>
    </section>
  );
}

/* ---------- Icon tile --------------------------------------------------- */
export function IconTile({ name, size = 38, icon = 18, tint, className, style }: { name: string; size?: number; icon?: number; tint?: "lagoa" | "accent" | "areia" | "white"; className?: string; style?: CSSProperties }) {
  const tints: Record<string, CSSProperties> = {
    lagoa: {},
    accent: { background: "var(--c-eletrico-100)", color: "var(--color-accent-strong)" },
    areia: { background: "var(--c-areia-200)", color: "var(--c-areia-900)" },
    white: { background: "rgba(255,255,255,0.10)", color: "var(--c-eletrico-300)" },
  };
  return (
    <span className={["icon-tile", className ?? ""].join(" ")} style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), ...(tints[tint ?? "lagoa"]), ...style }}>
      <Icon name={name} size={icon} />
    </span>
  );
}

/* ---------- Filter pills ------------------------------------------------ */
export function FilterPills({ options, value, onChange, label, small, id }: { options: string[]; value: string; onChange: (v: string) => void; label: string; small?: boolean; id?: string }) {
  return (
    <div className="pills" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button key={o} type="button" role="tab" aria-selected={value === o} aria-controls={id} className={["pill", small ? "pill--sm" : ""].join(" ")} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}
