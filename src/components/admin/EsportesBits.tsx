"use client";

/** Peças reutilizadas pelas telas de Esportes: avatar, seletor de professores, dias da semana, upload de foto. */
import { useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { DIAS, iniciais, type DiaSemana, type Professor } from "@/data/admin-esportes";
import { AdminButton, TextInput } from "./primitives";
import s from "./esportes.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

/* ---------- Avatar ------------------------------------------------------- */
export function Avatar({ p, size = 36, nome }: { p?: Pick<Professor, "nome" | "foto"> | null; size?: number; nome?: string }) {
  const n = p?.nome ?? nome ?? "";
  const style = { width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.36)) };
  if (p?.foto) return <img src={p.foto} alt={n} className={s.avatar} style={style} />;
  return <span className={cx(s.avatar, s.avatarIni)} style={style} title={n} aria-label={n}>{iniciais(n)}</span>;
}

/** Pilha de avatares com "+N" e nomes no title. */
export function AvatarStack({ profs, max = 4, size = 28 }: { profs: Professor[]; max?: number; size?: number }) {
  if (!profs.length) return <span className={s.semProf}>Sem professor</span>;
  const shown = profs.slice(0, max), rest = profs.length - shown.length;
  return (
    <span className={s.stack} title={profs.map((p) => p.nome).join(", ")}>
      {shown.map((p) => <span key={p.id} className={s.stackItem}><Avatar p={p} size={size} /></span>)}
      {rest > 0 && <span className={cx(s.stackItem, s.stackMore)} style={{ width: size, height: size }}>+{rest}</span>}
    </span>
  );
}

/* ---------- Seletor de professores -------------------------------------- */
/**
 * Multi-seleção por clique: os escolhidos viram chips com foto; abaixo, a lista
 * dos demais filtrada por busca. "Cadastrar novo" cria o professor na hora.
 */
export function ProfessorPicker({ value, onChange, professores, onCreate, compact }: {
  value: string[]; onChange: (ids: string[]) => void; professores: Professor[];
  onCreate?: (nome: string) => Professor; compact?: boolean;
}) {
  const [q, setQ] = useState("");
  const [aberto, setAberto] = useState(!compact);
  const sel = value.map((id) => professores.find((p) => p.id === id)).filter((p): p is Professor => !!p);
  const qn = q.trim().toLowerCase();
  const resto = professores.filter((p) => p.ativo && !value.includes(p.id) && (!qn || p.nome.toLowerCase().includes(qn)));
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  const criar = () => {
    if (!onCreate || !q.trim()) return;
    const p = onCreate(q.trim());
    onChange([...value, p.id]);
    setQ("");
  };
  return (
    <div className={s.picker}>
      <div className={s.chips}>
        {sel.map((p) => (
          <button type="button" key={p.id} className={s.chipProf} onClick={() => toggle(p.id)} title="Remover">
            <Avatar p={p} size={22} /><span>{p.nome}</span><Icon name="x" size={12} />
          </button>
        ))}
        {!sel.length && <span className={s.chipsEmpty}>Nenhum professor selecionado</span>}
        {compact && !aberto && (
          <button type="button" className={s.chipAdd} onClick={() => setAberto(true)}><Icon name="plus" size={12} /> Adicionar</button>
        )}
      </div>
      {aberto && (
        <div className={s.pickerList}>
          <TextInput value={q} onChange={setQ} placeholder="Buscar professor pelo nome…" icon="search" />
          <div className={s.pickerOptions}>
            {resto.slice(0, 12).map((p) => (
              <button type="button" key={p.id} className={s.opt} onClick={() => toggle(p.id)}>
                <Avatar p={p} size={28} />
                <span className={s.optText}><span className={s.optName}>{p.nome}</span>{p.formacao && <span className={s.optSub}>{p.formacao}</span>}</span>
                <Icon name="plus" size={14} />
              </button>
            ))}
            {!resto.length && !qn && <div className={s.pickerHint}>Todos os professores cadastrados já estão selecionados.</div>}
            {!resto.length && qn && !onCreate && <div className={s.pickerHint}>Nenhum professor com esse nome.</div>}
            {qn && onCreate && !professores.some((p) => p.nome.toLowerCase() === qn) && (
              <button type="button" className={cx(s.opt, s.optCreate)} onClick={criar}>
                <span className={cx(s.avatar, s.avatarIni, s.avatarNew)} style={{ width: 28, height: 28, fontSize: 11 }}><Icon name="plus" size={14} /></span>
                <span className={s.optText}><span className={s.optName}>Cadastrar “{q.trim()}”</span><span className={s.optSub}>Cria o professor agora; foto e contato podem ser adicionados depois em Professores.</span></span>
              </button>
            )}
          </div>
          {compact && <button type="button" className={s.linkBtn} onClick={() => setAberto(false)}>Concluir</button>}
        </div>
      )}
    </div>
  );
}

/* ---------- Dias da semana ---------------------------------------------- */
export function DiasPicker({ value, onChange }: { value: DiaSemana[]; onChange: (d: DiaSemana[]) => void }) {
  const toggle = (id: DiaSemana) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  const set = (ids: DiaSemana[]) => onChange(ids);
  return (
    <div>
      <div className={s.dias} role="group" aria-label="Dias da semana">
        {DIAS.map((d) => (
          <button type="button" key={d.id} className={cx(s.dia, value.includes(d.id) && s.diaOn)} onClick={() => toggle(d.id)} aria-pressed={value.includes(d.id)} title={d.nome}>
            {d.curto}
          </button>
        ))}
      </div>
      <div className={s.diasAtalhos}>
        <button type="button" onClick={() => set(["seg", "ter", "qua", "qui", "sex"])}>Seg a Sex</button>
        <button type="button" onClick={() => set(["ter", "qua", "qui", "sex"])}>Ter a Sex</button>
        <button type="button" onClick={() => set(["seg", "qua", "sex"])}>Seg/Qua/Sex</button>
        <button type="button" onClick={() => set(["ter", "qui"])}>Ter/Qui</button>
        <button type="button" onClick={() => set(["sab", "dom"])}>Fim de semana</button>
        <button type="button" onClick={() => set(["seg", "ter", "qua", "qui", "sex", "sab", "dom"])}>Todos</button>
      </div>
    </div>
  );
}

/* ---------- Upload de foto (real, via FileReader) ----------------------- */
export function PhotoUpload({ value, onChange, shape = "square", label = "Enviar foto", hint = "JPG, PNG ou WEBP · até 4 MB" }: {
  value: string; onChange: (dataUrl: string) => void; shape?: "square" | "round" | "wide"; label?: string; hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();
  const [erro, setErro] = useState("");
  const pick = (file?: File | null) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) { setErro("Envie uma imagem JPG, PNG ou WEBP."); return; }
    if (file.size > 4 * 1024 * 1024) { setErro("A imagem passa de 4 MB. Reduza e tente de novo."); return; }
    setErro("");
    const r = new FileReader();
    r.onload = () => onChange(String(r.result));
    r.readAsDataURL(file);
  };
  return (
    <div className={cx(s.photo, shape === "round" && s.photoRound, shape === "wide" && s.photoWide)}>
      <button
        type="button" className={s.photoDrop}
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}
        aria-describedby={id}
      >
        {value ? <img src={value} alt="" className={s.photoImg} /> : <span className={s.photoEmpty}><Icon name="upload" size={20} /><span>{label}</span></span>}
      </button>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className={s.photoInput} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
      <div className={s.photoSide}>
        <div id={id} className={s.photoHint}>{erro || hint}</div>
        <div className={s.photoBtns}>
          <AdminButton variant="secondary" size="sm" icon={<Icon name="upload" size={13} />} onClick={() => ref.current?.click()}>{value ? "Trocar" : "Escolher arquivo"}</AdminButton>
          {value && <AdminButton variant="ghost" size="sm" icon={<Icon name="trash" size={13} />} onClick={() => onChange("")}>Remover</AdminButton>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Seção com título dentro do drawer --------------------------- */
export function Section({ title, sub, children, action }: { title: ReactNode; sub?: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <section className={s.section}>
      <header className={s.sectionHead}>
        <div><h3 className={s.sectionTitle}>{title}</h3>{sub && <p className={s.sectionSub}>{sub}</p>}</div>
        {action}
      </header>
      {children}
    </section>
  );
}

/* ---------- Faixa informativa ------------------------------------------- */
export function InfoBanner({ icon = "info", children, tone = "brand" }: { icon?: string; children: ReactNode; tone?: "brand" | "green" }) {
  return <div className={cx(s.banner, tone === "green" && s.bannerGreen)}><Icon name={icon} size={16} /><div>{children}</div></div>;
}
