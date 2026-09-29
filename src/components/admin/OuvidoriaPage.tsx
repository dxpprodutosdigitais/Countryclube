"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_OUVIDORIA, ENCAMINHAMENTOS, type Manifestacao, type TipoManifestacao } from "@/data/admin";
import {
  AdminButton, CellTitle, DataTable, Drawer, FilterPill, FiltersRow, FormField, InfoCell, InfoGrid, PageShell, Quote,
  SelectInput, StatusBadge, TextArea, cell,
} from "./primitives";
import p from "./pages.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

type Filtro = "todas" | "pendente" | "em-analise" | "respondida";

const TIPO_CLS: Record<TipoManifestacao, string> = { "Reclamação": p.tipoReclamacao, "Elogio": p.tipoElogio, "Sugestão": p.tipoSugestao };
const TIPO_ICON: Record<TipoManifestacao, string> = { "Reclamação": "message-circle", "Elogio": "star", "Sugestão": "sparkles" };

export function OuvidoriaPage() {
  const params = useSearchParams();
  const [items, setItems] = useState<Manifestacao[]>(ADMIN_OUVIDORIA);
  const [filter, setFilter] = useState<Filtro>("todas");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [resposta, setResposta] = useState("");
  const [encaminhar, setEncaminhar] = useState(ENCAMINHAMENTOS[0].value);

  useEffect(() => {
    const id = params.get("id");
    if (id && ADMIN_OUVIDORIA.some((o) => o.id === id)) setDetailId(id);
  }, [params]);

  const filtered = useMemo(() => (filter === "todas" ? items : items.filter((o) => o.status === filter)), [items, filter]);
  const counts = {
    todas: items.length,
    pendente: items.filter((o) => o.status === "pendente").length,
    "em-analise": items.filter((o) => o.status === "em-analise").length,
    respondida: items.filter((o) => o.status === "respondida").length,
  };

  const detail = items.find((o) => o.id === detailId) ?? null;

  const open = (o: Manifestacao) => {
    setDetailId(o.id);
    setResposta(o.resposta);
    setEncaminhar(o.encaminhado ?? ENCAMINHAMENTOS[0].value);
  };
  const close = useCallback(() => setDetailId(null), []);

  const update = (partial: Partial<Manifestacao>) => {
    if (!detail) return;
    setItems((list) => list.map((o) => (o.id === detail.id ? { ...o, ...partial } : o)));
  };
  const enviar = () => { update({ status: "respondida", resposta, encaminhado: encaminhar }); close(); };
  const analisar = () => { update({ status: "em-analise", encaminhado: encaminhar }); close(); };
  const arquivar = () => { update({ status: "arquivada" }); close(); };

  return (
    <PageShell>
      <FiltersRow right={<AdminButton variant="secondary" icon={<Icon name="download" size={14} />}>Exportar relatório</AdminButton>}>
        <FilterPill active={filter === "todas"} onClick={() => setFilter("todas")} count={counts.todas}>Todas</FilterPill>
        <FilterPill active={filter === "pendente"} onClick={() => setFilter("pendente")} count={counts.pendente}>Pendentes</FilterPill>
        <FilterPill active={filter === "em-analise"} onClick={() => setFilter("em-analise")} count={counts["em-analise"]}>Em análise</FilterPill>
        <FilterPill active={filter === "respondida"} onClick={() => setFilter("respondida")} count={counts.respondida}>Respondidas</FilterPill>
      </FiltersRow>

      <DataTable<Manifestacao>
        rows={filtered}
        rowKey={(o) => o.id}
        onRowClick={open}
        columns={[
          {
            label: "Tipo", width: 140,
            render: (o) => (
              <span className={cx(p.tipoPill, TIPO_CLS[o.tipo])}><Icon name={TIPO_ICON[o.tipo]} size={11} />{o.tipo}</span>
            ),
          },
          {
            label: "Assunto",
            render: (o) => (
              <CellTitle sub={<span className={p.resumoCell}>{o.texto}</span>}>
                {o.area}
                {o.urgente && <span className={p.urgentIcon} title="Urgente"><Icon name="alert-circle" size={13} /></span>}
              </CellTitle>
            ),
          },
          {
            label: "Autor", width: 170,
            render: (o) => (
              <div>
                <div className={cell.strong} style={{ fontWeight: 500 }}>{o.autor}</div>
                <div className={cell.subtle}>{o.data}</div>
              </div>
            ),
          },
          { label: "Status", width: 140, render: (o) => <StatusBadge status={o.status} /> },
        ]}
      />

      <Drawer
        open={!!detail}
        onClose={close}
        title={detail ? `${detail.tipo} · ${detail.area}` : ""}
        subtitle="Ouvidoria · Manifestação"
        wide
        footer={
          <>
            <AdminButton variant="ghost" onClick={close}>Fechar</AdminButton>
            <AdminButton variant="secondary" onClick={arquivar} icon={<Icon name="archive" size={14} />}>Arquivar</AdminButton>
            {detail?.status === "pendente" && <AdminButton variant="secondary" onClick={analisar}>Marcar em análise</AdminButton>}
            <AdminButton variant="primary" icon={<Icon name="send" size={14} />} onClick={enviar} disabled={!resposta.trim()}>Enviar resposta</AdminButton>
          </>
        }
      >
        {detail && (
          <div>
            <InfoGrid>
              <InfoCell label="Autor" value={detail.autor} />
              <InfoCell label="Status" value={<StatusBadge status={detail.status} />} />
              <InfoCell label="Recebida em" value={detail.data} />
              <InfoCell label="Área" value={detail.area} />
            </InfoGrid>
            {detail.urgente && (
              <div style={{ marginBottom: 18 }}><StatusBadge status="urgente" /></div>
            )}
            <Quote label="Manifestação completa">{detail.texto}</Quote>
            {detail.status === "respondida" && detail.resposta && (
              <div className={p.respostaBox}>
                <div className={cell.subtle} style={{ marginBottom: 6, color: "var(--c-mata-700)", fontFamily: "var(--font-heading)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 10.5 }}>Resposta enviada</div>
                <p className={p.respostaText}>{detail.resposta}</p>
              </div>
            )}
            <FormField label="Sua resposta" required hint="Será enviada por e-mail ao associado e arquivada no histórico.">
              <TextArea value={resposta} onChange={setResposta} rows={5} placeholder="Escreva uma resposta clara, agradeça pelo contato e indique próximos passos..." />
            </FormField>
            <FormField label="Encaminhar para">
              <SelectInput value={encaminhar} onChange={setEncaminhar} options={ENCAMINHAMENTOS} />
            </FormField>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
