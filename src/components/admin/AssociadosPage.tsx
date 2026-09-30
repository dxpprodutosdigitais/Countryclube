"use client";

import { useCallback, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_ASSOCIADOS, iniciais, type Associado } from "@/data/admin";
import {
  AdminButton, CellRow, CellTitle, Chip, DataTable, Drawer, FilterPill, FiltersRow, IconBtn, InfoCell, InfoGrid, PageShell,
  StatusBadge, TextInput, cell,
} from "./primitives";
import p from "./pages.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

type Filtro = "todos" | "ativo" | "inadimplente" | "suspenso";

export function AssociadosPage() {
  const [status, setStatus] = useState<Filtro>("todos");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Associado | null>(null);

  const filtered = useMemo(() => {
    let list = status === "todos" ? ADMIN_ASSOCIADOS : ADMIN_ASSOCIADOS.filter((a) => a.status === status);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((a) => a.nome.toLowerCase().includes(q) || a.titular.toLowerCase().includes(q) || a.mat.includes(q));
    return list;
  }, [status, query]);

  const counts = {
    todos: ADMIN_ASSOCIADOS.length,
    ativo: ADMIN_ASSOCIADOS.filter((a) => a.status === "ativo").length,
    inadimplente: ADMIN_ASSOCIADOS.filter((a) => a.status === "inadimplente").length,
    suspenso: ADMIN_ASSOCIADOS.filter((a) => a.status === "suspenso").length,
  };

  const close = useCallback(() => setDetail(null), []);
  const avatarCls = (mat: string) => { const n = Number(mat.charAt(2)) % 3; return cx(p.avatarSm, n === 1 && p.avatarSm1, n === 2 && p.avatarSm2); };

  return (
    <PageShell>
      <FiltersRow
        right={
          <>
            <AdminButton variant="secondary" icon={<Icon name="download" size={14} />}>Exportar CSV</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="plus" size={14} />}>Cadastrar associado</AdminButton>
          </>
        }
      >
        <FilterPill active={status === "todos"} onClick={() => setStatus("todos")} count={counts.todos}>Todos</FilterPill>
        <FilterPill active={status === "ativo"} onClick={() => setStatus("ativo")} count={counts.ativo}>Ativos</FilterPill>
        <FilterPill active={status === "inadimplente"} onClick={() => setStatus("inadimplente")} count={counts.inadimplente}>Inadimplentes</FilterPill>
        <FilterPill active={status === "suspenso"} onClick={() => setStatus("suspenso")} count={counts.suspenso}>Suspensos</FilterPill>
      </FiltersRow>

      <div className={p.searchBox}>
        <TextInput value={query} onChange={setQuery} placeholder="Buscar por nome, titular ou matrícula..." icon="search" name="busca" />
      </div>

      <DataTable<Associado>
        rows={filtered}
        rowKey={(a) => a.mat}
        onRowClick={setDetail}
        empty={query ? `Nenhum associado encontrado para "${query}".` : "Nenhum associado neste filtro."}
        columns={[
          { label: "Matrícula", width: 110, render: (a) => <span className={cell.mono}>{a.mat}</span> },
          {
            label: "Família / Titular",
            render: (a) => (
              <CellRow>
                <span className={avatarCls(a.mat)} aria-hidden>{iniciais(a.titular)}</span>
                <CellTitle sub={<span>Titular: {a.titular}</span>}>{a.nome}</CellTitle>
              </CellRow>
            ),
          },
          { label: "Plano", width: 130, render: (a) => <Chip>{a.plano}</Chip> },
          { label: "Associado desde", width: 140, render: (a) => <span>{a.desde}</span> },
          {
            label: "Contato", width: 190,
            render: (a) => (
              <div className={p.contactCell}>
                <div>{a.fone}</div>
                <div>{a.email}</div>
              </div>
            ),
          },
          { label: "Status", width: 130, render: (a) => <StatusBadge status={a.status} /> },
          { label: "", width: 60, align: "right", render: (a) => <IconBtn icon="more-vertical" title="Mais opções" onClick={() => setDetail(a)} /> },
        ]}
      />

      <div className={p.footNote}>Exibindo {filtered.length} de {ADMIN_ASSOCIADOS.length} associados · As cotas patrimoniais estão integralizadas.</div>

      <Drawer
        open={!!detail}
        onClose={close}
        title={detail?.nome ?? ""}
        subtitle={`Associado · Matrícula ${detail?.mat ?? ""}`}
        footer={
          <>
            <AdminButton variant="ghost" onClick={close}>Fechar</AdminButton>
            <AdminButton variant="secondary" icon={<Icon name="mail" size={14} />}>Enviar e-mail</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="external" size={14} />} href="https://countryformiga.realclub.app.br/#/" target="_blank">Abrir na Secretaria Web</AdminButton>
          </>
        }
      >
        {detail && (
          <InfoGrid>
            <InfoCell label="Titular" value={detail.titular} />
            <InfoCell label="Status" value={<StatusBadge status={detail.status} />} />
            <InfoCell label="Plano" value={detail.plano} />
            <InfoCell label="Associado desde" value={detail.desde} />
            <InfoCell label="Telefone" value={detail.fone} />
            <InfoCell label="E-mail" value={detail.email} />
          </InfoGrid>
        )}
      </Drawer>
    </PageShell>
  );
}
