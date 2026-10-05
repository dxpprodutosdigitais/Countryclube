"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_DIRETORIA, CARGOS, GESTOES, iniciais, novoId, type Membro } from "@/data/admin";
import { AdminButton, Drawer, FilterPill, FiltersNote, FiltersRow, FormField, FormRow, PageShell, SelectInput, TextInput, UploadArea } from "./primitives";
import p from "./pages.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const NOVO: Membro = { id: "", nome: "", cargo: "Diretor de Esportes", email: "", gestao: GESTOES[0], foto: "" };

export function DiretoriaPage() {
  const [membros, setMembros] = useState<Membro[]>(ADMIN_DIRETORIA);
  const [gestao, setGestao] = useState(GESTOES[0]);
  const [draft, setDraft] = useState<Membro | null>(null);

  const filtered = membros.filter((m) => m.gestao === gestao);

  const close = useCallback(() => setDraft(null), []);
  const patch = (partial: Partial<Membro>) => setDraft((d) => (d ? { ...d, ...partial } : d));
  const save = () => {
    if (!draft) return;
    const item = { ...draft, id: draft.id || novoId("d") };
    setMembros((list) => (list.some((m) => m.id === item.id) ? list.map((m) => (m.id === item.id ? item : m)) : [...list, item]));
    close();
  };
  const remove = () => {
    if (!draft?.id) return;
    setMembros((list) => list.filter((m) => m.id !== draft.id));
    close();
  };

  return (
    <PageShell>
      <FiltersRow right={<AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={() => setDraft({ ...NOVO, gestao })}>Adicionar membro</AdminButton>}>
        {GESTOES.map((g) => (
          <FilterPill key={g} active={gestao === g} onClick={() => setGestao(g)} count={membros.filter((m) => m.gestao === g).length}>Gestão {g}</FilterPill>
        ))}
        <FiltersNote>{filtered.length} membros</FiltersNote>
      </FiltersRow>

      <div className={cx(p.grid, p.gridWide)}>
        {filtered.map((d, i) => (
          <button key={d.id} type="button" className={p.memberCard} onClick={() => setDraft({ ...d })}>
            <span className={cx(p.memberAvatar, i % 3 === 1 && p.memberAvatar1, i % 3 === 2 && p.memberAvatar2)} aria-hidden>
              {d.foto ? <img src={d.foto} alt="" /> : iniciais(d.nome)}
            </span>
            <span className={p.memberText}>
              <span className={p.memberRole} style={{ display: "block" }}>{d.cargo}</span>
              <span className={p.memberName} style={{ display: "block" }}>{d.nome}</span>
              <span className={p.memberEmail} style={{ display: "block" }}>{d.email}</span>
            </span>
          </button>
        ))}
      </div>

      <Drawer
        open={!!draft}
        onClose={close}
        title={draft?.id ? "Editar membro" : "Adicionar membro"}
        subtitle="Diretoria"
        footer={
          <>
            {draft?.id && <AdminButton variant="danger" onClick={remove} icon={<Icon name="trash" size={14} />}>Remover</AdminButton>}
            <AdminButton variant="ghost" onClick={close}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="check" size={14} />} onClick={save} disabled={!draft?.nome.trim()}>Salvar</AdminButton>
          </>
        }
      >
        {draft && (
          <div>
            <FormField label="Nome completo" required><TextInput value={draft.nome} onChange={(v) => patch({ nome: v })} /></FormField>
            <FormField label="Cargo" required>
              <SelectInput value={draft.cargo} onChange={(v) => patch({ cargo: v })} options={CARGOS} />
            </FormField>
            <FormField label="E-mail" required><TextInput type="email" value={draft.email} onChange={(v) => patch({ email: v })} icon="mail" /></FormField>
            <FormRow>
              <FormField label="Gestão">
                <SelectInput value={draft.gestao} onChange={(v) => patch({ gestao: v })} options={GESTOES.map((g) => ({ label: `Gestão ${g}`, value: g }))} />
              </FormField>
              <FormField label="Iniciais"><TextInput value={iniciais(draft.nome || "—")} disabled /></FormField>
            </FormRow>
            <FormField label="Foto" hint="Recomendado: 800×800px, fundo neutro."><UploadArea preview={draft.foto || undefined} /></FormField>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
