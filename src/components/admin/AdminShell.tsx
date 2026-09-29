"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_USER } from "@/data/admin";
import { AdminButton } from "./primitives";
import s from "./shell.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

/* ---------- Navegação --------------------------------------------------- */
interface NavItem { href: string; label: string; icon: string; badge?: number; tone?: "accent" }
interface NavGroup { label: string; items: NavItem[] }

const NAV: NavGroup[] = [
  { label: "Visão geral", items: [{ href: "/admin", label: "Dashboard", icon: "layout-dashboard" }] },
  {
    label: "Conteúdo do site",
    items: [
      { href: "/admin/paginas", label: "Páginas", icon: "file-text" },
      { href: "/admin/eventos", label: "Eventos", icon: "calendar", badge: 4 },
      { href: "/admin/noticias", label: "Notícias", icon: "newspaper" },
      { href: "/admin/galeria", label: "Galeria", icon: "image" },
      { href: "/admin/faq", label: "FAQ", icon: "help-circle" },
    ],
  },
  {
    label: "Estrutura do clube",
    items: [
      { href: "/admin/modalidades", label: "Modalidades", icon: "dumbbell" },
      { href: "/admin/infraestrutura", label: "Infraestrutura", icon: "building" },
      { href: "/admin/diretoria", label: "Diretoria", icon: "briefcase" },
      { href: "/admin/convenios", label: "Convênios", icon: "handshake" },
    ],
  },
  {
    label: "Comunidade",
    items: [
      { href: "/admin/associados", label: "Associados", icon: "users" },
      { href: "/admin/ouvidoria", label: "Ouvidoria", icon: "megaphone", badge: 7, tone: "accent" },
    ],
  },
  { label: "Sistema", items: [{ href: "/admin/configuracoes", label: "Configurações", icon: "settings" }] },
];

/* ---------- Título / breadcrumb por rota -------------------------------- */
const PAGES: Record<string, { title: string; breadcrumb: string[] }> = {
  "/admin": { title: "Dashboard", breadcrumb: ["Visão geral"] },
  "/admin/paginas": { title: "Páginas do site", breadcrumb: ["Conteúdo"] },
  "/admin/eventos": { title: "Agenda de eventos", breadcrumb: ["Conteúdo"] },
  "/admin/noticias": { title: "Notícias e comunicados", breadcrumb: ["Conteúdo"] },
  "/admin/galeria": { title: "Galeria de fotos", breadcrumb: ["Conteúdo"] },
  "/admin/faq": { title: "Perguntas frequentes", breadcrumb: ["Conteúdo"] },
  "/admin/modalidades": { title: "Modalidades", breadcrumb: ["Estrutura do clube"] },
  "/admin/infraestrutura": { title: "Infraestrutura", breadcrumb: ["Estrutura do clube"] },
  "/admin/diretoria": { title: "Diretoria", breadcrumb: ["Estrutura do clube"] },
  "/admin/convenios": { title: "Convênios e parcerias", breadcrumb: ["Estrutura do clube"] },
  "/admin/associados": { title: "Associados", breadcrumb: ["Comunidade"] },
  "/admin/ouvidoria": { title: "Ouvidoria", breadcrumb: ["Comunidade"] },
  "/admin/configuracoes": { title: "Configurações", breadcrumb: ["Sistema"] },
};

function resolvePage(pathname: string) {
  const clean = pathname.replace(/\/+$/, "") || "/admin";
  if (PAGES[clean]) return PAGES[clean];
  const parent = Object.keys(PAGES).filter((k) => k !== "/admin" && clean.startsWith(k + "/")).sort((a, b) => b.length - a.length)[0];
  return parent ? PAGES[parent] : PAGES["/admin"];
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname === href || pathname.startsWith(href + "/");
}

/* ---------- Shell -------------------------------------------------------- */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/admin";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fecha o menu off-canvas ao navegar.
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Login não usa o shell.
  if (pathname.startsWith("/admin/login")) return <>{children}</>;

  const page = resolvePage(pathname);

  return (
    <div className={s.app}>
      {mobileOpen && <button type="button" className={s.backdrop} aria-label="Fechar menu" onClick={() => setMobileOpen(false)} />}

      <aside className={cx(s.sidebar, collapsed && s.collapsed, mobileOpen && s.sidebarOpen)} aria-label="Navegação do painel">
        <Link href="/admin" className={s.brand}>
          <img src="/logo-country-clube-formiga.png" alt="Country Clube de Formiga" className={s.brandLogo} />
          {!collapsed && (
            <span className={s.brandText}>
              <span className={s.brandName}>Country Clube</span>
              <span className={s.brandTag}>Painel · Admin</span>
            </span>
          )}
        </Link>

        <nav className={s.nav}>
          {NAV.map((group) => (
            <div key={group.label}>
              {!collapsed && <div className={s.groupLabel}>{group.label}</div>}
              <div className={s.groupItems}>
                {group.items.map((it) => {
                  const active = isActive(pathname, it.href);
                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={cx(s.item, active && s.itemActive)}
                      title={collapsed ? it.label : undefined}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className={s.itemIcon}><Icon name={it.icon} size={17} /></span>
                      {!collapsed && <span className={s.itemLabel}>{it.label}</span>}
                      {it.badge != null && <span className={cx(s.badge, it.tone === "accent" && s.badgeAccent)}>{it.badge}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={s.user}>
          <span className={s.avatar} aria-hidden>
            {ADMIN_USER.avatar}
            {ADMIN_USER.online && <span className={s.online} />}
          </span>
          {!collapsed && (
            <>
              <span className={s.userText}>
                <span className={s.userName}>{ADMIN_USER.nome}</span>
                <span className={s.userRole}>{ADMIN_USER.cargo}</span>
              </span>
              <Link href="/admin/login" className={cx(s.logout, "plain")} title="Sair" aria-label="Sair"><Icon name="log-out" size={15} /></Link>
            </>
          )}
        </div>

        <button type="button" className={s.collapseBtn} onClick={() => setCollapsed((c) => !c)} title={collapsed ? "Expandir" : "Recolher"} aria-label={collapsed ? "Expandir menu" : "Recolher menu"}>
          <Icon name={collapsed ? "chevron-right" : "chevron-left"} size={14} />
        </button>
      </aside>

      <div className={s.main}>
        <header className={s.topbar}>
          <button type="button" className={cx(s.iconBtn, s.menuBtn)} onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
            <Icon name="menu" size={18} />
          </button>
          <div className={s.topTitle}>
            <div className={s.crumb}>
              <span>Painel</span>
              {page.breadcrumb.map((b) => (
                <span key={b} style={{ display: "contents" }}>
                  <span className={s.crumbSep}>›</span>
                  <span>{b}</span>
                </span>
              ))}
            </div>
            <h1 className={s.title}>{page.title}</h1>
          </div>

          <div className={s.search}>
            <span className={s.searchIcon}><Icon name="search" size={14} /></span>
            <input type="search" className={s.searchInput} placeholder="Buscar no painel..." aria-label="Buscar no painel" />
          </div>

          <div className={s.actions}>
            <button type="button" className={s.iconBtn} title="Notificações" aria-label="Notificações">
              <Icon name="bell" size={16} />
              <span className={s.dot} aria-hidden />
            </button>
            <AdminButton variant="primary" href="/" target="_blank" iconRight={<Icon name="external" size={13} />}>
              <span className={s.visitLabel}>Visitar o site</span>
            </AdminButton>
          </div>
        </header>

        <div className={s.content}>{children}</div>
      </div>
    </div>
  );
}
