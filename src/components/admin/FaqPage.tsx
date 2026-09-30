"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_FAQ, ADMIN_USER, FAQ_CATEGORIAS, novoId, type Faq } from "@/data/admin";
import {
  AdminButton, CellRow, CellTitle, Chip, DataTable, Drawer, FilterPill, FiltersRow, FormField, PageShell, RowActions,
  SelectInput, TextArea, TextInput, Tile, cell,
} from "./primitives";

const NOVA: Faq = { id: "", cat: "Associado", q: "", a: "", atualizado: "hoje", autor: ADMIN_USER.nome };

export function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>(ADMIN_FAQ);
  const [cat, setCat] = useState("todas");
  const [draft, setDraft] = useState<Faq | null>(null);

  const cats = ["todas", ...Array.from(new Set(faqs.map((f) => f.cat)))];
  const filtered = cat === "todas" ? faqs : faqs.filter((f) => f.cat === cat);

  const close = useCallback(() => setDraft(null), []);
  const patch = (partial: Partial<Faq>) => setDraft((d) => (d ? { ...d, ...partial } : d));
  const save = () => {
    if (!draft) return;
    const item = { ...draft, id: draft.id || novoId("f"), atualizado: "hoje", autor: ADMIN_USER.nome };
    setFaqs((list) => (list.some((f) => f.id === item.id) ? list.map((f) => (f.id === item.id ? item : f)) : [item, ...list]));
    close();
  };

  return (
    <PageShell>
      <FiltersRow right={<AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={() => setDraft({ ...NOVA })}>Nova pergunta</AdminButton>}>
        {cats.map((c) => (
          <FilterPill key={c} active={cat === c} onClick={() => setCat(c)} count={c === "todas" ? faqs.length : faqs.filter((f) => f.cat === c).length}>
            {c === "todas" ? "Todas" : c}
          </FilterPill>
        ))}
      </FiltersRow>

      <DataTable<Faq>
        rows={filtered}
        rowKey={(f) => f.id}
        onRowClick={(f) => setDraft({ ...f })}
        columns={[
          {
            label: "Pergunta",
            render: (f) => (
              <CellRow>
                <Tile small><Icon name="help-circle" size={16} /></Tile>
                <CellTitle>{f.q}</CellTitle>
              </CellRow>
            ),
          },
          { label: "Categoria", width: 130, render: (f) => <Chip>{f.cat}</Chip> },
          {
            label: "Última atualização", width: 200,
            render: (f) => (
              <div>
                <div className={cell.muted} style={{ color: "var(--color-fg)" }}>{f.atualizado}</div>
                <div className={cell.subtle}>por {f.autor}</div>
              </div>
            ),
          },
          { label: "", width: 80, align: "right", render: (f) => <RowActions onEdit={() => setDraft({ ...f })} /> },
        ]}
      />

      <Drawer
        open={!!draft}
        onClose={close}
        title={draft?.id ? "Editar pergunta" : "Nova pergunta frequente"}
        subtitle="FAQ"
        footer={
          <>
            <AdminButton variant="ghost" onClick={close}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="check" size={14} />} onClick={save} disabled={!draft?.q.trim()}>Salvar</AdminButton>
          </>
        }
      >
        {draft && (
          <div>
            <FormField label="Categoria" required>
              <SelectInput value={draft.cat} onChange={(v) => patch({ cat: v })} options={FAQ_CATEGORIAS} />
            </FormField>
            <FormField label="Pergunta" required>
              <TextInput value={draft.q} onChange={(v) => patch({ q: v })} placeholder="Ex.: Como reservo uma churrasqueira?" />
            </FormField>
            <FormField label="Resposta" required hint="Seja claro e direto. Os associados estão lendo isso porque têm uma dúvida real.">
              <TextArea value={draft.a} onChange={(v) => patch({ a: v })} rows={6} placeholder="Escreva a resposta de forma simples e útil..." />
            </FormField>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
