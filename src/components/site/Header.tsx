"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";
import { NAV_GROUPS, type NavGroup } from "./nav";
import styles from "./Header.module.css";

function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className={styles.logo} aria-label="Country Clube de Formiga — página inicial">
      <img src={SITE.logo} alt="" width={small ? 32 : 40} height={small ? 32 : 40} className={styles.logoImg} />
      <span className={styles.logoText}>
        <span className={styles.logoName}>Country Clube</span>
        <span className={styles.logoSub}>de Formiga · MG</span>
      </span>
    </Link>
  );
}

function MegaPanel({ group, onClose }: { group: NavGroup; onClose: () => void }) {
  return (
    <div className={[styles.mega, group.items.length > 3 ? styles.megaTwoCols : ""].join(" ")} role="menu" onMouseLeave={onClose}>
      {group.items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={styles.megaItem}
          role="menuitem"
          onClick={onClose}
          target={it.external ? "_blank" : undefined}
          rel={it.external ? "noopener noreferrer" : undefined}
        >
          <span className="icon-tile"><Icon name={it.icon} size={18} /></span>
          <span className={styles.megaText}>
            <span className={styles.megaLabel}>{it.label}{it.external && <Icon name="external" size={11} />}</span>
            <span className={styles.megaDesc}>{it.desc}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpand, setMobileExpand] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpen(null); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setMobileOpen(false); } };
    const onClick = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("click", onClick); };
  }, []);

  const activeGroupId = NAV_GROUPS.find((g) => g.items.some((it) => pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href + "/"))))?.id ?? null;

  return (
    <>
      {/* ---------- Desktop ---------- */}
      <header className={[styles.desktop, scrolled ? styles.scrolled : ""].join(" ")}>
        <nav className={styles.pill} aria-label="Navegação principal" ref={navRef}>
          <Logo />
          <div className={styles.groups} onMouseLeave={() => setOpen(null)}>
            {NAV_GROUPS.map((g) => {
              const active = activeGroupId === g.id;
              const isOpen = open === g.id;
              return (
                <div key={g.id} className={styles.group} onMouseEnter={() => setOpen(g.id)}>
                  <button
                    type="button"
                    className={[styles.groupBtn, active ? styles.groupActive : "", isOpen ? styles.groupOpen : ""].join(" ")}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    onClick={() => setOpen(isOpen ? null : g.id)}
                  >
                    {g.label}
                    <span className={[styles.chev, isOpen ? styles.chevOpen : ""].join(" ")}><Icon name="chevron-down" size={12} stroke={2} /></span>
                  </button>
                  {isOpen && <MegaPanel group={g} onClose={() => setOpen(null)} />}
                </div>
              );
            })}
          </div>
          <Button href="/secretaria" variant="accent" size="sm" iconRight={<Icon name="arrow-right" size={14} />}>Secretaria Web</Button>
        </nav>
      </header>

      {/* ---------- Mobile ---------- */}
      <header className={[styles.mobile, scrolled || mobileOpen ? styles.mobileSolid : ""].join(" ")}>
        <Logo small />
        <button type="button" className={styles.burger} aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen((v) => !v)}>
          <Icon name={mobileOpen ? "x" : "menu"} size={22} />
        </button>
      </header>
      {mobileOpen && (
        <div id="mobile-menu" className={styles.overlay}>
          <div className={styles.overlayInner}>
            {NAV_GROUPS.map((g) => {
              const expanded = mobileExpand === g.id;
              return (
                <div key={g.id} className={[styles.accordion, expanded ? styles.accordionOpen : ""].join(" ")}>
                  <button type="button" className={styles.accordionBtn} aria-expanded={expanded} onClick={() => setMobileExpand(expanded ? null : g.id)}>
                    <span>{g.label}</span>
                    <span className={[styles.chev, expanded ? styles.chevOpen : ""].join(" ")}><Icon name="chevron-down" size={20} /></span>
                  </button>
                  {expanded && (
                    <div className={styles.accordionItems}>
                      {g.items.map((it) => (
                        <Link key={it.href} href={it.href} className={styles.mobileItem} target={it.external ? "_blank" : undefined} rel={it.external ? "noopener noreferrer" : undefined}>
                          <span className="icon-tile" style={{ width: 32, height: 32, borderRadius: 8 }}><Icon name={it.icon} size={16} /></span>
                          <span>
                            <span className={styles.mobileLabel}>{it.label}{it.external && <Icon name="external" size={11} />}</span>
                            <span className={styles.mobileDesc}>{it.desc}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link href="/contato" className={styles.mobileCta}>Fale com a Lagoa <Icon name="arrow-right" size={16} /></Link>
          </div>
        </div>
      )}
    </>
  );
}
