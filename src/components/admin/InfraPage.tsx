"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_INFRA, INFRA_CATEGORIAS, novoId, type Infra } from "@/data/admin";
import {
  AdminButton, CellRow, CellTitle, Chip, DataTable, Drawer, FilterPill, FiltersRow, FormField, FormRow, PageShell, RowActions,
  SelectInput, StatusBadge, TextArea, TextInput, Tile, UploadArea, ViewToggle, cell,
} from "./primitives";
import p from "./pages.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const NOVA: Infra = { id: "", nome: "", cat: "Lazer", img: "", desc: "", fotos: [], status: "rascunho" };

export function InfraPage() {
  const [items, setItems] = useState<Infra[]>(ADMIN_INFRA);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [cat, setCat] = useState("todas");
  const [draft, setDraft] = useState<Infra | null>(null);

  const cats = ["todas", ...INFRA_CATEGORIAS.filter((c) => items.some((i) => i.cat === c))];
  const filtered = cat === "todas" ? items : items.filter((i) => i.cat === cat);

  const close = useCallback(() => setDraft(null), []);
  const patch = (partial: Partial<Infra>) => setDraft((d) => (d ? { ...d, ...partial } : d));
  const save = (status: Infra["status"]) => {
    if (!draft) return;
    const item = { ...draft, status, id: draft.id || novoId("i") };
    setItems((list) => (list.some((i) => i.id === item.id) ? list.map((i) => (i.id === item.id ? item : i)) : [...list, item]));
    close();
  };

  return (
    <PageShell>
      <FiltersRow
        right={
          <>
            <ViewToggle value={view} onChange={setView} />
            <AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={() => setDraft({ ...NOVA })}>Nova área</AdminButton>
          </>
        }
      >
        {cats.map((c) => (
          <FilterPill key={c} active={cat === c} onClick={() => setCat(c)} count={c === "todas" ? items.length : items.filter((i) => i.cat === c).length}>
            {c === "todas" ? "Todas" : c}
          </FilterPill>
        ))}
      </FiltersRow>

      {view === "grid" ? (
        <div className={cx(p.grid, p.gridWide)}>
          {filtered.map((it) => (
            <div
              key={it.id}
              role="button"
              tabIndex={0}
              className={p.mediaCard}
              onClick={() => setDraft({ ...it })}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDraft({ ...it }); } }}
            >
              <div className={cx(p.mediaCover, p.mediaCoverSm)}>
                {it.img && <img src={it.img} alt="" loading="lazy" />}
                <div className={p.mediaTopLeft}>{it.tag && <span className={p.destaqueTag}>{it.tag}</span>}</div>
                <div className={p.mediaTopRight}><StatusBadge status={it.status} size="sm" /></div>
                <span className={cx(p.mediaCount, p.mediaCountLeft)}><Icon name="image" size={11} /> {it.fotos.length}</span>
              </div>
              <div className={p.mediaBody}>
                <div className={p.mediaTitle}>{it.nome}</div>
                <div className={p.mediaMeta}><span>{it.cat}</span></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable<Infra>
          rows={filtered}
          rowKey={(it) => it.id}
          onRowClick={(it) => setDraft({ ...it })}
          columns={[
            {
              label: "Área",
              render: (it) => (
                <CellRow>
                  <Tile><Icon name="building" size={18} /></Tile>
                  <CellTitle sub={it.tag ? <span>{it.tag}</span> : undefined}>{it.nome}</CellTitle>
                </CellRow>
              ),
            },
            { label: "Categoria", width: 140, render: (it) => <Chip>{it.cat}</Chip> },
            { label: "Fotos", width: 100, align: "right", render: (it) => <span className={cell.strong}>{it.fotos.length}</span> },
            { label: "Status", width: 140, render: (it) => <StatusBadge status={it.status} /> },
            { label: "", width: 80, align: "right", render: (it) => <RowActions onEdit={() => setDraft({ ...it })} /> },
          ]}
        />
      )}

      <Drawer
        open={!!draft}
        onClose={close}
        title={draft?.id ? "Editar área" : "Nova área"}
        subtitle="Infraestrutura"
        footer={
          <>
            <AdminButton variant="ghost" onClick={close}>Cancelar</AdminButton>
            <AdminButton variant="secondary" onClick={() => save("rascunho")}>Salvar rascunho</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="check" size={14} />} onClick={() => save("publicada")} disabled={!draft?.nome.trim()}>Publicar</AdminButton>
          </>
        }
      >
        {draft && (
          <div>
            <FormField label="Nome da área" required><TextInput value={draft.nome} onChange={(v) => patch({ nome: v })} placeholder="Ex.: Praia" /></FormField>
            <FormRow>
              <FormField label="Categoria" required>
                <SelectInput value={draft.cat} onChange={(v) => patch({ cat: v })} options={INFRA_CATEGORIAS} />
              </FormField>
              <FormField label="Etiqueta (opcional)">
                <TextInput value={draft.tag ?? ""} onChange={(v) => patch({ tag: v || undefined })} placeholder="Ex.: Nova, Destaque" />
              </FormField>
            </FormRow>
            <FormField label="Descrição"><TextArea value={draft.desc} onChange={(v) => patch({ desc: v })} rows={4} placeholder="Descreva a área para os associados..." /></FormField>
            <FormField label="Imagem principal"><UploadArea preview={draft.img || undefined} /></FormField>
            <FormField label="Galeria de fotos" hint={`${draft.fotos.length} fotos no álbum desta área.`}><UploadArea multiple /></FormField>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
