"use client";

import { Icon } from "@/components/ui/Icon";
import { ADMIN_PAGINAS, fmtNum, type PaginaSite } from "@/data/admin";
import { AdminButton, CellRow, CellTitle, DataTable, FilterPill, FiltersRow, IconBtn, PageShell, Tile, cell } from "./primitives";

export function PaginasPage() {
  const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
  return (
    <PageShell>
      <FiltersRow right={<AdminButton variant="secondary" icon={<Icon name="external" size={14} />} href="/" target="_blank">Abrir o site</AdminButton>}>
        <FilterPill active count={ADMIN_PAGINAS.length}>Todas</FilterPill>
      </FiltersRow>

      <DataTable<PaginaSite>
        rows={ADMIN_PAGINAS}
        rowKey={(pg) => pg.id}
        columns={[
          {
            label: "Página",
            render: (pg) => (
              <CellRow>
                <Tile small><Icon name="file-text" size={16} /></Tile>
                <CellTitle sub={<span>lagoanossa.com.br{pg.url}</span>}>{pg.titulo}</CellTitle>
              </CellRow>
            ),
          },
          {
            label: "Última atualização", width: 200,
            render: (pg) => (
              <div>
                <div className={cell.muted} style={{ color: "var(--color-fg)" }}>{pg.atualizada}</div>
                <div className={cell.subtle}>por {pg.autor}</div>
              </div>
            ),
          },
          { label: "Visualizações", width: 140, align: "right", render: (pg) => <span className={cell.strong}>{fmtNum(pg.visualizacoes)}</span> },
          {
            label: "", width: 120, align: "right",
            render: (pg) => (
              <span style={{ display: "inline-flex", gap: 4 }}>
                <IconBtn icon="eye" title="Visualizar" onClick={() => open(pg.url)} />
                <IconBtn icon="pencil" title="Editar" />
                <IconBtn icon="external" title="Abrir no site" onClick={() => open(pg.url)} />
              </span>
            ),
          },
        ]}
      />
    </PageShell>
  );
}
