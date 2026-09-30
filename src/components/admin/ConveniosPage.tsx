"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_CONVENIOS, CONVENIO_CATEGORIAS, novoId, type Convenio } from "@/data/admin";
import {
  AdminButton, CellRow, CellTitle, Chip, DataTable, Drawer, FilterPill, FiltersRow, FormField, FormRow, PageShell, RowActions,
  SelectInput, StatusBadge, TextInput, Tile, UploadArea, cell,
} from "./primitives";

const NOVO: Convenio = { id: "", nome: "", cat: "Saúde", beneficio: "", vigencia: "", status: "ativo", contato: "" };

export function ConveniosPage() {
  const [items, setItems] = useState<Convenio[]>(ADMIN_CONVENIOS);
  const [cat, setCat] = useState("todas");
  const [draft, setDraft] = useState<Convenio | null>(null);

  const cats = ["todas", ...Array.from(new Set(items.map((c) => c.cat)))];
  const filtered = cat === "todas" ? items : cat === "expirando" ? items.filter((c) => c.status === "expirando") : items.filter((c) => c.cat === cat);

  const close = useCallback(() => setDraft(null), []);
  const patch = (partial: Partial<Convenio>) => setDraft((d) => (d ? { ...d, ...partial } : d));
  const save = () => {
    if (!draft) return;
    const item = { ...draft, id: draft.id || novoId("c") };
    setItems((list) => (list.some((c) => c.id === item.id) ? list.map((c) => (c.id === item.id ? item : c)) : [...list, item]));
    close();
  };

  return (
    <PageShell>
      <FiltersRow right={<AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={() => setDraft({ ...NOVO })}>Novo convênio</AdminButton>}>
        {cats.map((c) => (
          <FilterPill key={c} active={cat === c} onClick={() => setCat(c)} count={c === "todas" ? items.length : items.filter((x) => x.cat === c).length}>
            {c === "todas" ? "Todos" : c}
          </FilterPill>
        ))}
        <FilterPill active={cat === "expirando"} onClick={() => setCat("expirando")} count={items.filter((x) => x.status === "expirando").length}>Expirando</FilterPill>
      </FiltersRow>

      <DataTable<Convenio>
        rows={filtered}
        rowKey={(c) => c.id}
        onRowClick={(c) => setDraft({ ...c })}
        columns={[
          {
            label: "Parceria",
            render: (c) => (
              <CellRow>
                <Tile>{c.nome.charAt(0)}</Tile>
                <CellTitle>{c.nome}</CellTitle>
              </CellRow>
            ),
          },
          { label: "Categoria", width: 130, render: (c) => <Chip>{c.cat}</Chip> },
          { label: "Benefício", render: (c) => <span style={{ fontSize: 13.5 }}>{c.beneficio}</span> },
          { label: "Vigência", width: 150, render: (c) => <span className={cell.muted}>{c.vigencia}</span> },
          { label: "Status", width: 130, render: (c) => <StatusBadge status={c.status} /> },
          { label: "", width: 80, align: "right", render: (c) => <RowActions onEdit={() => setDraft({ ...c })} /> },
        ]}
      />

      <Drawer
        open={!!draft}
        onClose={close}
        title={draft?.id ? "Editar convênio" : "Novo convênio"}
        subtitle="Convênios"
        footer={
          <>
            <AdminButton variant="ghost" onClick={close}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="check" size={14} />} onClick={save} disabled={!draft?.nome.trim()}>Salvar</AdminButton>
          </>
        }
      >
        {draft && (
          <div>
            <FormField label="Nome da parceria" required><TextInput value={draft.nome} onChange={(v) => patch({ nome: v })} /></FormField>
            <FormField label="Categoria" required>
              <SelectInput value={draft.cat} onChange={(v) => patch({ cat: v })} options={CONVENIO_CATEGORIAS} />
            </FormField>
            <FormField label="Benefício para associados" required><TextInput value={draft.beneficio} onChange={(v) => patch({ beneficio: v })} placeholder="Ex.: 15% em consultas e exames" /></FormField>
            <FormRow>
              <FormField label="Vigência"><TextInput value={draft.vigencia} onChange={(v) => patch({ vigencia: v })} placeholder="Ex.: Até 12/2026" icon="calendar" /></FormField>
              <FormField label="Status">
                <SelectInput
                  value={draft.status}
                  onChange={(v) => patch({ status: v as Convenio["status"] })}
                  options={[{ label: "Ativo", value: "ativo" }, { label: "Expirando", value: "expirando" }, { label: "Suspenso", value: "suspenso" }]}
                />
              </FormField>
            </FormRow>
            <FormField label="Contato no convênio"><TextInput value={draft.contato} onChange={(v) => patch({ contato: v })} placeholder="Pessoa de contato, telefone ou e-mail" icon="phone" /></FormField>
            <FormField label="Logo da empresa"><UploadArea hint="PNG com fundo transparente, até 1 MB" /></FormField>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
