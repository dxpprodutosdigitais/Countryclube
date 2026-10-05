"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_EVENTOS, EVENTO_CATEGORIAS, novoId, partesData, type Evento } from "@/data/admin";
import {
  AdminButton, CellTitle, Chip, DataTable, Drawer, FilterPill, FiltersRow, FormField, FormRow, PageShell, ProgressBar, RowActions,
  SelectInput, StarAccent, StatusBadge, TextArea, TextInput, ToggleGroup, ToggleInput, UploadArea, cell,
} from "./primitives";
import p from "./pages.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

type Filtro = "todos" | "publicado" | "agendado" | "rascunho" | "destaque";

const NOVO: Evento = {
  id: "", data: "2026-10-15", hora: "19h", nome: "", cat: "Festa", local: "", destaque: false, img: "", desc: "",
  capacidade: null, inscritos: 0, status: "rascunho", inscricoesApp: true, convidados: true, couvert: false,
};

export function EventosPage() {
  const params = useSearchParams();
  const [eventos, setEventos] = useState<Evento[]>(ADMIN_EVENTOS);
  const [filter, setFilter] = useState<Filtro>("todos");
  const [draft, setDraft] = useState<Evento | null>(null);

  // Abre o evento vindo do dashboard (?id=)
  useEffect(() => {
    const id = params.get("id");
    if (id) {
      const ev = ADMIN_EVENTOS.find((e) => e.id === id);
      if (ev) setDraft({ ...ev });
    }
  }, [params]);

  const filtered = useMemo(() => {
    if (filter === "todos") return eventos;
    if (filter === "destaque") return eventos.filter((e) => e.destaque);
    return eventos.filter((e) => e.status === filter);
  }, [eventos, filter]);

  const counts = {
    todos: eventos.length,
    publicado: eventos.filter((e) => e.status === "publicado").length,
    agendado: eventos.filter((e) => e.status === "agendado").length,
    rascunho: eventos.filter((e) => e.status === "rascunho").length,
    destaque: eventos.filter((e) => e.destaque).length,
  };

  const close = useCallback(() => setDraft(null), []);
  const patch = (partial: Partial<Evento>) => setDraft((d) => (d ? { ...d, ...partial } : d));

  const save = (status: Evento["status"]) => {
    if (!draft) return;
    const item = { ...draft, status, id: draft.id || novoId("e") };
    setEventos((list) => (list.some((e) => e.id === item.id) ? list.map((e) => (e.id === item.id ? item : e)) : [item, ...list]));
    close();
  };

  return (
    <PageShell>
      <FiltersRow
        right={
          <>
            <AdminButton variant="secondary" icon={<Icon name="download" size={14} />}>Exportar</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={() => setDraft({ ...NOVO })}>Novo evento</AdminButton>
          </>
        }
      >
        <FilterPill active={filter === "todos"} onClick={() => setFilter("todos")} count={counts.todos}>Todos</FilterPill>
        <FilterPill active={filter === "publicado"} onClick={() => setFilter("publicado")} count={counts.publicado}>Publicados</FilterPill>
        <FilterPill active={filter === "agendado"} onClick={() => setFilter("agendado")} count={counts.agendado}>Agendados</FilterPill>
        <FilterPill active={filter === "rascunho"} onClick={() => setFilter("rascunho")} count={counts.rascunho}>Rascunhos</FilterPill>
        <FilterPill active={filter === "destaque"} onClick={() => setFilter("destaque")} count={counts.destaque}>Em destaque</FilterPill>
      </FiltersRow>

      <DataTable<Evento>
        rows={filtered}
        rowKey={(e) => e.id}
        onRowClick={(e) => setDraft({ ...e })}
        columns={[
          {
            label: "Data", width: 96,
            render: (e) => {
              const d = partesData(e.data);
              return (
                <span className={cx(p.dateBlock, e.destaque && p.dateBlockAccent)}>
                  <span className={p.dateDay} style={{ display: "block" }}>{d.dia}</span>
                  <span className={p.dateMonth} style={{ display: "block" }}>{d.mes} {d.ano}</span>
                </span>
              );
            },
          },
          {
            label: "Evento",
            render: (e) => (
              <CellTitle sub={<><span><Icon name="clock" size={11} /> {e.hora}</span><span>·</span><span><Icon name="map-pin" size={11} /> {e.local}</span></>}>
                {e.nome}{e.destaque && <StarAccent />}
              </CellTitle>
            ),
          },
          { label: "Categoria", width: 130, render: (e) => <Chip>{e.cat}</Chip> },
          { label: "Inscrições", width: 150, render: (e) => (e.capacidade ? <ProgressBar value={e.inscritos} total={e.capacidade} /> : <span className={cell.subtle}>—</span>) },
          { label: "Status", width: 120, render: (e) => <StatusBadge status={e.status} /> },
          { label: "", width: 100, align: "right", render: (e) => <RowActions onView={() => setDraft({ ...e })} onEdit={() => setDraft({ ...e })} /> },
        ]}
      />

      <Drawer
        open={!!draft}
        onClose={close}
        title={draft?.id ? "Editar evento" : "Novo evento"}
        subtitle="Agenda · Eventos"
        footer={
          <>
            <AdminButton variant="ghost" onClick={close}>Cancelar</AdminButton>
            <AdminButton variant="secondary" onClick={() => save("rascunho")}>Salvar rascunho</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="check" size={14} />} onClick={() => save("publicado")} disabled={!draft?.nome.trim()}>Publicar evento</AdminButton>
          </>
        }
      >
        {draft && (
          <div>
            <FormField label="Nome do evento" required>
              <TextInput value={draft.nome} onChange={(v) => patch({ nome: v })} placeholder="Ex.: Arraiá do Country" />
            </FormField>
            <FormField label="Descrição">
              <TextArea value={draft.desc} onChange={(v) => patch({ desc: v })} placeholder="Conte aos associados o que esse evento é..." />
            </FormField>
            <FormRow>
              <FormField label="Data" required>
                <TextInput type="date" value={draft.data} onChange={(v) => patch({ data: v })} />
              </FormField>
              <FormField label="Horário" required>
                <TextInput value={draft.hora} onChange={(v) => patch({ hora: v })} placeholder="Ex.: 19h" icon="clock" />
              </FormField>
            </FormRow>
            <FormField label="Local" required>
              <TextInput value={draft.local} onChange={(v) => patch({ local: v })} placeholder="Ex.: Espaço Multiuso" icon="map-pin" />
            </FormField>
            <FormRow>
              <FormField label="Categoria" required>
                <SelectInput value={draft.cat} onChange={(v) => patch({ cat: v })} options={EVENTO_CATEGORIAS} />
              </FormField>
              <FormField label="Capacidade">
                <TextInput type="number" value={draft.capacidade ?? ""} onChange={(v) => patch({ capacidade: v === "" ? null : Number(v) })} placeholder="Ex.: 200" />
              </FormField>
            </FormRow>
            <FormField label="Imagem de capa" hint="Recomendado: 1920×1080px, JPG ou WEBP. Foto luminosa do clube em luz dourada.">
              <UploadArea preview={draft.img || undefined} />
            </FormField>
            <FormField label="Configurações de exibição">
              <ToggleGroup>
                <ToggleInput label="Destacar na home" value={draft.destaque} onChange={(v) => patch({ destaque: v })} />
                <ToggleInput label="Permitir inscrições pelo app" value={draft.inscricoesApp} onChange={(v) => patch({ inscricoesApp: v })} />
                <ToggleInput label="Aceitar convidados" value={draft.convidados} onChange={(v) => patch({ convidados: v })} />
                <ToggleInput label="Cobrar couvert" value={draft.couvert} onChange={(v) => patch({ couvert: v })} />
              </ToggleGroup>
            </FormField>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
