"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_ALBUNS, novoId, type Album } from "@/data/admin";
import {
  AdminButton, CellRow, CellTitle, DataTable, Drawer, FilterPill, FiltersRow, FormField, FormRow, IconBtn, PageShell, RowActions,
  StarAccent, StatusBadge, TextInput, Thumb, ToggleGroup, ToggleInput, UploadArea, ViewToggle, cell,
} from "./primitives";
import p from "./pages.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

type Filtro = "todos" | "publicados" | "rascunhos";

const NOVO: Album = { id: "", titulo: "", data: "hoje", fotos: [], cover: "", publicado: false, destaque: false };

export function GaleriaPage() {
  const [albuns, setAlbuns] = useState<Album[]>(ADMIN_ALBUNS);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<Filtro>("todos");
  const [draft, setDraft] = useState<Album | null>(null);

  const filtered = filter === "todos" ? albuns : filter === "publicados" ? albuns.filter((a) => a.publicado) : albuns.filter((a) => !a.publicado);

  const close = useCallback(() => setDraft(null), []);
  const patch = (partial: Partial<Album>) => setDraft((d) => (d ? { ...d, ...partial } : d));
  const save = (publicado: boolean) => {
    if (!draft) return;
    const item = { ...draft, publicado, id: draft.id || novoId("g") };
    setAlbuns((list) => (list.some((a) => a.id === item.id) ? list.map((a) => (a.id === item.id ? item : a)) : [item, ...list]));
    close();
  };

  return (
    <PageShell>
      <FiltersRow
        right={
          <>
            <ViewToggle value={view} onChange={setView} />
            <AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={() => setDraft({ ...NOVO })}>Novo álbum</AdminButton>
          </>
        }
      >
        <FilterPill active={filter === "todos"} onClick={() => setFilter("todos")} count={albuns.length}>Todos</FilterPill>
        <FilterPill active={filter === "publicados"} onClick={() => setFilter("publicados")} count={albuns.filter((a) => a.publicado).length}>Publicados</FilterPill>
        <FilterPill active={filter === "rascunhos"} onClick={() => setFilter("rascunhos")} count={albuns.filter((a) => !a.publicado).length}>Rascunhos</FilterPill>
      </FiltersRow>

      {view === "grid" ? (
        <div className={p.grid}>
          {filtered.map((a) => (
            <div
              key={a.id}
              role="button"
              tabIndex={0}
              className={p.mediaCard}
              onClick={() => setDraft({ ...a })}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDraft({ ...a }); } }}
            >
              <div className={p.mediaCover}>
                {a.cover && <img src={a.cover} alt="" loading="lazy" />}
                <div className={p.mediaTopLeft}>{a.destaque && <span className={p.destaqueTag}>Destaque</span>}</div>
                <div className={p.mediaTopRight}><StatusBadge status={a.publicado ? "publicado" : "rascunho"} size="sm" /></div>
                <span className={p.mediaCount}><Icon name="image" size={11} /> {a.fotos.length}</span>
              </div>
              <div className={p.mediaBody}>
                <h4 className={p.mediaTitle}>{a.titulo}</h4>
                <div className={p.mediaMeta}>
                  <span>{a.data}</span>
                  <span style={{ display: "inline-flex", gap: 2 }}>
                    <IconBtn icon="pencil" title="Editar" onClick={() => setDraft({ ...a })} />
                    <IconBtn icon="more-vertical" title="Mais opções" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable<Album>
          rows={filtered}
          rowKey={(a) => a.id}
          onRowClick={(a) => setDraft({ ...a })}
          columns={[
            {
              label: "Álbum",
              render: (a) => (
                <CellRow>
                  <Thumb src={a.cover} />
                  <CellTitle sub={<span>{a.data}</span>}>{a.titulo}{a.destaque && <StarAccent />}</CellTitle>
                </CellRow>
              ),
            },
            { label: "Fotos", width: 100, align: "right", render: (a) => <span className={cell.strong}>{a.fotos.length}</span> },
            { label: "Status", width: 120, render: (a) => <StatusBadge status={a.publicado ? "publicado" : "rascunho"} /> },
            { label: "", width: 80, align: "right", render: (a) => <RowActions onEdit={() => setDraft({ ...a })} /> },
          ]}
        />
      )}

      <Drawer
        open={!!draft}
        onClose={close}
        title={draft?.id ? "Editar álbum" : "Novo álbum"}
        subtitle="Galeria de fotos"
        footer={
          <>
            <AdminButton variant="ghost" onClick={close}>Cancelar</AdminButton>
            <AdminButton variant="secondary" onClick={() => save(false)}>Salvar rascunho</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="check" size={14} />} onClick={() => save(true)} disabled={!draft?.titulo.trim()}>Publicar</AdminButton>
          </>
        }
      >
        {draft && (
          <div>
            <FormField label="Título do álbum" required>
              <TextInput value={draft.titulo} onChange={(v) => patch({ titulo: v })} placeholder="Ex.: Arraiá do Country 2026" />
            </FormField>
            <FormRow>
              <FormField label="Data do evento">
                <TextInput value={draft.data} onChange={(v) => patch({ data: v })} icon="calendar" />
              </FormField>
              <FormField label="Fotos no álbum">
                <TextInput value={draft.fotos.length} disabled />
              </FormField>
            </FormRow>
            <FormField label="Capa do álbum">
              <UploadArea preview={draft.cover || undefined} />
            </FormField>
            <FormField label="Fotos" hint="Envie várias imagens de uma vez. Recomendado: até 4 MB por foto.">
              <UploadArea multiple hint="Arraste até 200 fotos · JPG, PNG, WEBP" />
            </FormField>
            <FormField label="Exibição">
              <ToggleGroup>
                <ToggleInput label="Destacar na página da galeria" value={draft.destaque} onChange={(v) => patch({ destaque: v })} />
                <ToggleInput label={<span className={cx(cell.muted)}>Publicado no site</span>} value={draft.publicado} onChange={(v) => patch({ publicado: v })} />
              </ToggleGroup>
            </FormField>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
