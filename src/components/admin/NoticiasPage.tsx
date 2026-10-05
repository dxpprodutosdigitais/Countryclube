"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_NOTICIAS, ADMIN_USER, NOTICIA_CATEGORIAS, fmtNum, novoId, type Noticia } from "@/data/admin";
import {
  AdminButton, CellRow, CellTitle, Chip, DataTable, Drawer, FilterPill, FiltersRow, FormField, FormRow, PageShell, RowActions,
  SelectInput, StatusBadge, TextArea, TextInput, Thumb, ToggleGroup, ToggleInput, UploadArea, cell,
} from "./primitives";
import p from "./pages.module.css";

type Filtro = "todas" | "publicado" | "rascunho";

const NOVA: Noticia = {
  id: "", tag: "Avisos", titulo: "", data: "hoje", img: "", resumo: "", conteudo: "", autor: ADMIN_USER.nome, status: "rascunho", visualizacoes: 0,
  push: true, email: false, importante: false,
};

const TOOLBAR: Array<{ id: string; label: string; icon?: string; text?: string }> = [
  { id: "heading", label: "Título", text: "H" },
  { id: "bold", label: "Negrito", text: "B" },
  { id: "italic", label: "Itálico", text: "I" },
  { id: "list", label: "Lista", icon: "list" },
  { id: "link", label: "Link", icon: "link" },
  { id: "image", label: "Imagem", icon: "image" },
];

export function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>(ADMIN_NOTICIAS);
  const [filter, setFilter] = useState<Filtro>("todas");
  const [draft, setDraft] = useState<Noticia | null>(null);

  const filtered = filter === "todas" ? noticias : noticias.filter((n) => n.status === filter);
  const counts = {
    todas: noticias.length,
    publicado: noticias.filter((n) => n.status === "publicado").length,
    rascunho: noticias.filter((n) => n.status === "rascunho").length,
  };

  const close = useCallback(() => setDraft(null), []);
  const patch = (partial: Partial<Noticia>) => setDraft((d) => (d ? { ...d, ...partial } : d));
  const save = (status: Noticia["status"]) => {
    if (!draft) return;
    const item = { ...draft, status, id: draft.id || novoId("n") };
    setNoticias((list) => (list.some((n) => n.id === item.id) ? list.map((n) => (n.id === item.id ? item : n)) : [item, ...list]));
    close();
  };

  const insert = (id: string) => {
    const snippets: Record<string, string> = { heading: "\n## Título\n", bold: "**texto**", italic: "*texto*", list: "\n- item\n", link: "[texto](https://)", image: "![legenda](https://)" };
    patch({ conteudo: (draft?.conteudo ?? "") + (snippets[id] ?? "") });
  };

  return (
    <PageShell>
      <FiltersRow right={<AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={() => setDraft({ ...NOVA })}>Nova notícia</AdminButton>}>
        <FilterPill active={filter === "todas"} onClick={() => setFilter("todas")} count={counts.todas}>Todas</FilterPill>
        <FilterPill active={filter === "publicado"} onClick={() => setFilter("publicado")} count={counts.publicado}>Publicadas</FilterPill>
        <FilterPill active={filter === "rascunho"} onClick={() => setFilter("rascunho")} count={counts.rascunho}>Rascunhos</FilterPill>
      </FiltersRow>

      <DataTable<Noticia>
        rows={filtered}
        rowKey={(n) => n.id}
        onRowClick={(n) => setDraft({ ...n })}
        columns={[
          {
            label: "Notícia",
            render: (n) => (
              <CellRow>
                <Thumb src={n.img} />
                <CellTitle sub={<span>{n.autor} · {n.data}</span>}>{n.titulo}</CellTitle>
              </CellRow>
            ),
          },
          { label: "Categoria", width: 130, render: (n) => <Chip>{n.tag}</Chip> },
          { label: "Visualizações", width: 130, align: "right", render: (n) => <span className={cell.strong}>{fmtNum(n.visualizacoes)}</span> },
          { label: "Status", width: 120, render: (n) => <StatusBadge status={n.status} /> },
          { label: "", width: 100, align: "right", render: (n) => <RowActions onView={() => setDraft({ ...n })} onEdit={() => setDraft({ ...n })} /> },
        ]}
      />

      <Drawer
        open={!!draft}
        onClose={close}
        title={draft?.id ? "Editar notícia" : "Nova notícia"}
        subtitle="Notícias e comunicados"
        wide
        footer={
          <>
            <AdminButton variant="ghost" onClick={close}>Cancelar</AdminButton>
            <AdminButton variant="secondary" onClick={() => save("rascunho")}>Salvar rascunho</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="check" size={14} />} onClick={() => save("publicado")} disabled={!draft?.titulo.trim()}>Publicar</AdminButton>
          </>
        }
      >
        {draft && (
          <div>
            <FormField label="Título" required>
              <TextInput value={draft.titulo} onChange={(v) => patch({ titulo: v })} placeholder="Título da notícia" />
            </FormField>
            <FormRow>
              <FormField label="Categoria" required>
                <SelectInput value={draft.tag} onChange={(v) => patch({ tag: v })} options={NOTICIA_CATEGORIAS} />
              </FormField>
              <FormField label="Autor" required>
                <TextInput value={draft.autor} onChange={(v) => patch({ autor: v })} />
              </FormField>
            </FormRow>
            <FormField label="Resumo" hint="Aparece como prévia na home e em listagens (até 200 caracteres).">
              <TextArea value={draft.resumo} onChange={(v) => patch({ resumo: v.slice(0, 200) })} rows={3} />
            </FormField>
            <FormField label="Conteúdo">
              <div className={p.editor}>
                <div className={p.editorBar} role="toolbar" aria-label="Formatação">
                  {TOOLBAR.map((t) => (
                    <button key={t.id} type="button" className={p.editorBtn} title={t.label} aria-label={t.label} onClick={() => insert(t.id)}>
                      {t.icon ? <Icon name={t.icon} size={14} /> : t.text}
                    </button>
                  ))}
                </div>
                <textarea className={p.editorArea} value={draft.conteudo} onChange={(e) => patch({ conteudo: e.target.value })} rows={10} placeholder="Escreva o conteúdo da notícia..." />
              </div>
            </FormField>
            <FormField label="Imagem destacada">
              <UploadArea preview={draft.img || undefined} />
            </FormField>
            <FormField label="Opções">
              <ToggleGroup>
                <ToggleInput label="Enviar notificação push pelo app" value={draft.push} onChange={(v) => patch({ push: v })} />
                <ToggleInput label="Enviar e-mail para todos os associados" value={draft.email} onChange={(v) => patch({ email: v })} />
                <ToggleInput label="Marcar como comunicado importante" value={draft.importante} onChange={(v) => patch({ importante: v })} />
              </ToggleGroup>
            </FormField>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
