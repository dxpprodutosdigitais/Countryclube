"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_MODALIDADES, MODALIDADE_CATEGORIAS, novoId, type Modalidade } from "@/data/admin";
import {
  AdminButton, CellRow, CellTitle, Chip, DataTable, Drawer, FilterPill, FiltersRow, FormField, FormRow, PageShell, ProgressBar, RowActions,
  SelectInput, StatusBadge, TextArea, TextInput, Tile, UploadArea, cell,
} from "./primitives";

const NOVA: Modalidade = { id: "", nome: "", cat: "Esportes", img: "", desc: "", horario: "", publico: "", professor: "", vagas: null, inscritos: 0, status: "rascunho" };

export function ModalidadesPage() {
  const [items, setItems] = useState<Modalidade[]>(ADMIN_MODALIDADES);
  const [cat, setCat] = useState("todas");
  const [draft, setDraft] = useState<Modalidade | null>(null);

  const cats = ["todas", ...MODALIDADE_CATEGORIAS.filter((c) => items.some((m) => m.cat === c))];
  const filtered = cat === "todas" ? items : items.filter((m) => m.cat === cat);

  const close = useCallback(() => setDraft(null), []);
  const patch = (partial: Partial<Modalidade>) => setDraft((d) => (d ? { ...d, ...partial } : d));
  const save = () => {
    if (!draft) return;
    const item = { ...draft, id: draft.id || novoId("m") };
    setItems((list) => (list.some((m) => m.id === item.id) ? list.map((m) => (m.id === item.id ? item : m)) : [...list, item]));
    close();
  };

  return (
    <PageShell>
      <FiltersRow right={<AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={() => setDraft({ ...NOVA })}>Nova modalidade</AdminButton>}>
        {cats.map((c) => (
          <FilterPill key={c} active={cat === c} onClick={() => setCat(c)} count={c === "todas" ? items.length : items.filter((m) => m.cat === c).length}>
            {c === "todas" ? "Todas" : c}
          </FilterPill>
        ))}
      </FiltersRow>

      <DataTable<Modalidade>
        rows={filtered}
        rowKey={(m) => m.id}
        onRowClick={(m) => setDraft({ ...m })}
        columns={[
          {
            label: "Modalidade",
            render: (m) => (
              <CellRow>
                <Tile tone="mata"><Icon name="dumbbell" size={18} /></Tile>
                <CellTitle sub={<span>Professor: {m.professor}</span>}>{m.nome}</CellTitle>
              </CellRow>
            ),
          },
          { label: "Categoria", width: 130, render: (m) => <Chip>{m.cat}</Chip> },
          {
            label: "Inscritos / Vagas", width: 170,
            render: (m) => (m.vagas == null
              ? <span className={cell.strong}>{m.inscritos} <span className={cell.subtle} style={{ fontWeight: 500 }}>· livre</span></span>
              : <ProgressBar value={m.inscritos} total={m.vagas} tone="green" />),
          },
          { label: "Status", width: 120, render: (m) => <StatusBadge status={m.status} /> },
          { label: "", width: 80, align: "right", render: (m) => <RowActions onEdit={() => setDraft({ ...m })} /> },
        ]}
      />

      <Drawer
        open={!!draft}
        onClose={close}
        title={draft?.id ? "Editar modalidade" : "Nova modalidade"}
        subtitle="Modalidades"
        footer={
          <>
            <AdminButton variant="ghost" onClick={close}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="check" size={14} />} onClick={save} disabled={!draft?.nome.trim()}>Salvar</AdminButton>
          </>
        }
      >
        {draft && (
          <div>
            <FormField label="Nome" required><TextInput value={draft.nome} onChange={(v) => patch({ nome: v })} placeholder="Ex.: Tênis" /></FormField>
            <FormRow>
              <FormField label="Categoria" required>
                <SelectInput value={draft.cat} onChange={(v) => patch({ cat: v })} options={MODALIDADE_CATEGORIAS} />
              </FormField>
              <FormField label="Professor responsável">
                <TextInput value={draft.professor} onChange={(v) => patch({ professor: v })} placeholder="Nome do(a) professor(a)" />
              </FormField>
            </FormRow>
            <FormField label="Descrição" hint="Aparece na página da modalidade no site público.">
              <TextArea value={draft.desc} onChange={(v) => patch({ desc: v })} rows={4} placeholder="Descreva a modalidade, público-alvo e benefícios..." />
            </FormField>
            <FormRow>
              <FormField label="Horários" required><TextInput value={draft.horario} onChange={(v) => patch({ horario: v })} placeholder="Ex.: Seg–Sex 7h–22h" icon="clock" /></FormField>
              <FormField label="Público"><TextInput value={draft.publico} onChange={(v) => patch({ publico: v })} placeholder="Ex.: A partir de 6 anos" icon="users" /></FormField>
            </FormRow>
            <FormRow>
              <FormField label="Vagas totais" hint="Deixe vazio se não houver limite.">
                <TextInput type="number" value={draft.vagas ?? ""} onChange={(v) => patch({ vagas: v === "" ? null : Number(v) })} placeholder="Sem limite" />
              </FormField>
              <FormField label="Status">
                <SelectInput value={draft.status} onChange={(v) => patch({ status: v as Modalidade["status"] })} options={[{ label: "Ativa", value: "ativa" }, { label: "Rascunho", value: "rascunho" }]} />
              </FormField>
            </FormRow>
            <FormField label="Imagem"><UploadArea preview={draft.img || undefined} /></FormField>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
