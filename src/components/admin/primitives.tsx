"use client";

import Link from "next/link";
import { useEffect, useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import s from "./primitives.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

/* ============================ PAGE SHELL ============================ */
export function PageShell({ children, padTop = true }: { children: ReactNode; padTop?: boolean }) {
  return <div className={cx(s.page, !padTop && s.pageNoTop)}>{children}</div>;
}

/* ============================ STATUS BADGE ============================ */
const STATUS_MAP: Record<string, { cls: string; label: string }> = {
  publicado: { cls: s.statusGreen, label: "Publicado" },
  publicada: { cls: s.statusGreen, label: "Publicada" },
  ativo: { cls: s.statusGreen, label: "Ativo" },
  ativa: { cls: s.statusGreen, label: "Ativa" },
  enviado: { cls: s.statusGreen, label: "Enviado" },
  respondida: { cls: s.statusGreen, label: "Respondida" },
  rascunho: { cls: s.statusGray, label: "Rascunho" },
  suspenso: { cls: s.statusGray, label: "Suspenso" },
  arquivada: { cls: s.statusGray, label: "Arquivada" },
  agendado: { cls: s.statusMaresia, label: "Agendado" },
  "em-analise": { cls: s.statusAmber, label: "Em análise" },
  expirando: { cls: s.statusAmber, label: "Expirando" },
  pendente: { cls: s.statusAccent, label: "Pendente" },
  urgente: { cls: s.statusRed, label: "Urgente" },
  inadimplente: { cls: s.statusRed, label: "Inadimplente" },
};

export function StatusBadge({ status, size = "md" }: { status: string; size?: "sm" | "md" }) {
  const m = STATUS_MAP[status] ?? { cls: s.statusGray, label: status };
  return <span className={cx(s.status, m.cls, size === "sm" && s.statusSm)}>{m.label}</span>;
}

/* ============================ ADMIN BUTTON ============================ */
export type AdminButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "danger";

interface AdminButtonBase {
  children: ReactNode;
  variant?: AdminButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconRight?: ReactNode;
  full?: boolean;
  className?: string;
}
type AdminButtonAsButton = AdminButtonBase & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };
type AdminButtonAsLink = AdminButtonBase & { href: string; target?: string; rel?: string; onClick?: () => void };
export type AdminButtonProps = AdminButtonAsButton | AdminButtonAsLink;

const VARIANT_CLS: Record<AdminButtonVariant, string> = {
  primary: s.btnPrimary,
  accent: s.btnAccent,
  secondary: s.btnSecondary,
  ghost: s.btnGhost,
  danger: s.btnDanger,
};

export function AdminButton(props: AdminButtonProps) {
  const { children, variant = "primary", size = "md", icon, iconRight, full, className } = props;
  const cls = cx(s.btn, VARIANT_CLS[variant], size === "sm" && s.btnSm, size === "lg" && s.btnLg, full && s.btnFull, className);
  const inner = (
    <>
      {icon && <span className={s.btnIcon} aria-hidden>{icon}</span>}
      {children}
      {iconRight && <span className={s.btnIcon} aria-hidden>{iconRight}</span>}
    </>
  );
  if ("href" in props && props.href !== undefined) {
    const { href, target, rel, onClick } = props;
    if (href.startsWith("http")) {
      return <a href={href} className={cls} target={target} rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)} onClick={onClick}>{inner}</a>;
    }
    return <Link href={href} className={cls} target={target} onClick={onClick}>{inner}</Link>;
  }
  const { variant: _v, size: _s, icon: _i, iconRight: _ir, full: _f, className: _c, type = "button", ...rest } = props as AdminButtonAsButton;
  void _v; void _s; void _i; void _ir; void _f; void _c;
  return (
    <button type={type} className={cls} {...rest}>
      {inner}
    </button>
  );
}

/* ============================ ICON BUTTON / ROW ACTIONS ============================ */
export function IconBtn({ icon, title, onClick, size = 15 }: { icon: string; title?: string; onClick?: () => void; size?: number }) {
  return (
    <button
      type="button"
      className={s.iconBtn}
      title={title}
      aria-label={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

export function RowActions({ onView, onEdit, onMore }: { onView?: () => void; onEdit?: () => void; onMore?: () => void }) {
  return (
    <div className={s.rowActions}>
      {onView && <IconBtn icon="eye" title="Visualizar" onClick={onView} />}
      <IconBtn icon="pencil" title="Editar" onClick={onEdit} />
      <IconBtn icon="more-vertical" title="Mais opções" onClick={onMore} />
    </div>
  );
}

/* ============================ DATA TABLE ============================ */
export interface Column<T> {
  label: string;
  width?: number;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
}

export function DataTable<T>({ columns, rows, rowKey, onRowClick, empty = "Nada por aqui ainda." }: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
}) {
  const alignCls = (a?: string) => (a === "right" ? s.alignRight : a === "center" ? s.alignCenter : undefined);
  return (
    <div className={s.tableWrap}>
      <div className={s.tableScroll}>
        <table className={s.table}>
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i} className={alignCls(c.align)} style={{ width: c.width }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className={onRowClick ? s.rowClickable : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => { if (e.key === "Enter") onRowClick(row); } : undefined}
              >
                {columns.map((c, j) => (
                  <td key={j} className={alignCls(c.align)}>{c.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <div className={s.tableEmpty}>{empty}</div>}
    </div>
  );
}

/* ============================ CELL HELPERS ============================ */
export function CellTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div className={s.cellTitle}>{children}</div>
      {sub && <div className={s.cellSub}>{sub}</div>}
    </div>
  );
}
export function CellRow({ children }: { children: ReactNode }) {
  return <div className={s.cellRow}>{children}</div>;
}
export function Chip({ children }: { children: ReactNode }) {
  return <span className={s.chip}>{children}</span>;
}
export function Tile({ children, tone, small }: { children: ReactNode; tone?: "mata" | "accent"; small?: boolean }) {
  return <span className={cx(s.tile, tone === "mata" && s.tileMata, tone === "accent" && s.tileAccent, small && s.tileSm)}>{children}</span>;
}
export function Thumb({ src, alt = "" }: { src: string; alt?: string }) {
  return <img src={src} alt={alt} className={s.thumb} loading="lazy" />;
}
export function StarAccent() {
  return <span className={s.starAccent} title="Em destaque"><Icon name="star" size={13} /></span>;
}
export function ProgressBar({ value, total, tone = "auto" }: { value: number; total: number; tone?: "auto" | "green" }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  const cls = tone === "green"
    ? (pct > 85 ? s.progressAccent : s.progressGreen)
    : (pct > 85 ? s.progressAccent : pct > 65 ? s.progressAmber : undefined);
  return (
    <div className={s.progress}>
      <div className={s.progressLabel}>
        <span>{value}/{total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className={s.progressTrack}>
        <div className={cx(s.progressFill, cls)} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}
export const cell = {
  muted: s.cellMuted,
  subtle: s.cellSubtle,
  strong: s.cellStrong,
  mono: s.cellMono,
};

/* ============================ STAT CARD ============================ */
export function StatCard({ label, value, delta, icon, tone = "lagoa", sub }: {
  label: string; value: ReactNode; delta?: string; icon: string; tone?: "lagoa" | "accent" | "mata" | "maresia"; sub?: string;
}) {
  const toneCls = { lagoa: undefined, accent: s.statIconAccent, mata: s.statIconMata, maresia: s.statIconMaresia }[tone];
  return (
    <div className={s.stat}>
      <div className={s.statTop}>
        <span className={cx(s.statIcon, toneCls)}><Icon name={icon} size={16} /></span>
        {delta && (
          <span className={s.statDelta}>
            <Icon name={delta.startsWith("-") ? "trending-down" : "trending-up"} size={11} />
            {delta}
          </span>
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div className={s.statValue}>{value}</div>
        <div className={s.statLabel}>{label}</div>
        {sub && <div className={s.statSub}>{sub}</div>}
      </div>
    </div>
  );
}

/* ============================ CARD ============================ */
export function AdminCard({ children, padding, className }: { children: ReactNode; padding?: boolean; className?: string }) {
  return <div className={cx(s.card, className)}>{padding ? <div className={s.cardPad}>{children}</div> : children}</div>;
}
export function CardHeader({ title, sub, action, flat }: { title: ReactNode; sub?: ReactNode; action?: ReactNode; flat?: boolean }) {
  return (
    <div className={cx(s.cardHead, flat && s.cardHeadFlat)}>
      <div style={{ minWidth: 0 }}>
        <h3 className={s.cardTitle}>{title}</h3>
        {sub && <p className={s.cardSub}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ============================ DRAWER ============================ */
export function Drawer({ open, onClose, title, subtitle, wide, children, footer }: {
  open: boolean; onClose: () => void; title: ReactNode; subtitle?: ReactNode; wide?: boolean; children: ReactNode; footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <button type="button" className={s.overlay} aria-label="Fechar painel" onClick={onClose} />
      <aside className={cx(s.drawer, wide && s.drawerWide)} role="dialog" aria-modal="true">
        <div className={s.drawerHead}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {subtitle && <div className={s.drawerEyebrow}>{subtitle}</div>}
            <h2 className={s.drawerTitle}>{title}</h2>
          </div>
          <button type="button" className={s.drawerClose} onClick={onClose} aria-label="Fechar"><Icon name="x" size={18} /></button>
        </div>
        <div className={s.drawerBody}>{children}</div>
        {footer && <div className={s.drawerFoot}>{footer}</div>}
      </aside>
    </>
  );
}

/* ============================ FORM ============================ */
export function FormField({ label, hint, required, children }: { label: ReactNode; hint?: ReactNode; required?: boolean; children: ReactNode }) {
  return (
    <label className={s.field}>
      <span className={s.fieldLabel}>{label} {required && <span className={s.fieldReq}>*</span>}</span>
      {children}
      {hint && <span className={s.fieldHint}>{hint}</span>}
    </label>
  );
}
export function FormRow({ children }: { children: ReactNode }) {
  return <div className={s.grid2}>{children}</div>;
}

export function TextInput({ value, onChange, placeholder, type = "text", icon, name, disabled }: {
  value: string | number; onChange?: (v: string) => void; placeholder?: string; type?: string; icon?: string; name?: string; disabled?: boolean;
}) {
  return (
    <div className={s.inputWrap}>
      {icon && <span className={s.inputIcon}><Icon name={icon} size={15} /></span>}
      <input
        type={type}
        name={name}
        className={cx(s.input, icon && s.inputWithIcon)}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={!onChange}
      />
    </div>
  );
}

export function TextArea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange?: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea className={s.textarea} value={value} placeholder={placeholder} rows={rows} onChange={(e) => onChange?.(e.target.value)} readOnly={!onChange} />;
}

export function SelectInput({ value, onChange, options }: { value: string; onChange?: (v: string) => void; options: Array<{ label: string; value: string } | string> }) {
  const opts = options.map((o) => (typeof o === "string" ? { label: o, value: o } : o));
  return (
    <div className={s.inputWrap}>
      <select className={s.select} value={value} onChange={(e) => onChange?.(e.target.value)}>
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className={s.selectChevron}><Icon name="chevron-down" size={15} /></span>
    </div>
  );
}

export function ToggleInput({ value, onChange, label }: { value: boolean; onChange?: (v: boolean) => void; label: ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={value} className={cx(s.toggle, value && s.toggleOn)} onClick={() => onChange?.(!value)}>
      <span className={s.toggleTrack} aria-hidden />
      {label}
    </button>
  );
}
export function ToggleGroup({ children }: { children: ReactNode }) {
  return <div className={s.toggleGroup}>{children}</div>;
}

/** Placeholder de upload — sem backend; apenas simula a seleção. */
export function UploadArea({ multiple, preview, hint = "Até 4 MB · JPG, PNG, WEBP" }: { multiple?: boolean; preview?: string; hint?: string }) {
  const [picked, setPicked] = useState<string | null>(null);
  const id = useId();
  return (
    <button type="button" className={s.upload} onClick={() => setPicked(multiple ? "3 imagens selecionadas (simulação)" : "imagem-capa.jpg (simulação)")} aria-describedby={id}>
      {preview && <img src={preview} alt="" className={s.uploadPreview} />}
      <Icon name="upload" size={24} />
      <div className={s.uploadTitle}>{picked ?? (multiple ? "Arraste imagens ou clique para selecionar" : "Arraste uma imagem ou clique para selecionar")}</div>
      <div id={id} className={s.uploadSub}>{hint}</div>
    </button>
  );
}

/* ============================ FILTERS ============================ */
export function FiltersRow({ children, right }: { children?: ReactNode; right?: ReactNode }) {
  return (
    <div className={s.filters}>
      <div className={s.filtersLeft}>{children}</div>
      {right && <div className={s.filtersRight}>{right}</div>}
    </div>
  );
}
export function FilterPill({ active, onClick, children, count }: { active?: boolean; onClick?: () => void; children: ReactNode; count?: number }) {
  return (
    <button type="button" className={cx(s.pill, active && s.pillActive)} onClick={onClick} aria-pressed={active}>
      {children}
      {count != null && <span className={s.pillCount}>{count}</span>}
    </button>
  );
}
export function FiltersNote({ children }: { children: ReactNode }) {
  return <span className={s.filtersNote}>{children}</span>;
}
export function ViewToggle({ value, onChange }: { value: "grid" | "list"; onChange: (v: "grid" | "list") => void }) {
  return (
    <div className={s.viewToggle} role="group" aria-label="Modo de exibição">
      {(["grid", "list"] as const).map((v) => (
        <button key={v} type="button" className={cx(s.viewBtn, value === v && s.viewBtnActive)} onClick={() => onChange(v)} aria-pressed={value === v} title={v === "grid" ? "Grade" : "Lista"}>
          <Icon name={v} size={14} />
        </button>
      ))}
    </div>
  );
}

/* ============================ INFO / MISC ============================ */
export function InfoGrid({ children }: { children: ReactNode }) {
  return <div className={s.infoGrid}>{children}</div>;
}
export function InfoCell({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div>
      <div className={s.infoLabel}>{label}</div>
      <div className={s.infoValue}>{value}</div>
    </div>
  );
}
export function Quote({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className={s.quote}>
      <div className={s.infoLabel}>{label}</div>
      <p className={s.quoteText}>{children}</p>
    </div>
  );
}
export function SavedNote({ children }: { children: ReactNode }) {
  return <span className={s.savedNote}><Icon name="check-circle" size={13} />{children}</span>;
}
export function AdminEmpty({ title, sub, action }: { title: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className={s.empty}>
      <div className={s.emptyTitle}>{title}</div>
      {sub && <p className={s.emptySub}>{sub}</p>}
      {action}
    </div>
  );
}
