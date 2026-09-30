"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_EVENTOS, ADMIN_OUVIDORIA, SITE_ACTIVITY, STATS, TIMELINE, fmtNum, partesData, type AtividadeEquipe, type TipoManifestacao } from "@/data/admin";
import { AdminButton, AdminCard, CardHeader, PageShell, StatCard, StatusBadge } from "./primitives";
import p from "./pages.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const TIPO_CLS: Record<TipoManifestacao, string> = { "Reclamação": p.tipoReclamacao, "Elogio": p.tipoElogio, "Sugestão": p.tipoSugestao };
const TIPO_ICON: Record<TipoManifestacao, string> = { "Reclamação": "message-circle", "Elogio": "star", "Sugestão": "sparkles" };

const TL_CLS: Record<AtividadeEquipe["tipo"], string> = {
  evento: p.tlEvento, comunicado: p.tlComunicado, ouvidoria: p.tlOuvidoria, foto: p.tlFoto, modalidade: p.tlModalidade, pagina: p.tlPagina,
};
const TL_ICON: Record<AtividadeEquipe["tipo"], string> = {
  evento: "calendar", comunicado: "megaphone", ouvidoria: "message-circle", foto: "image", modalidade: "dumbbell", pagina: "file-text",
};

export function DashboardPage() {
  const maxAccess = Math.max(...SITE_ACTIVITY.map((d) => d.acessos));
  const maxEventos = Math.max(...SITE_ACTIVITY.map((d) => d.eventos));
  const upcoming = ADMIN_EVENTOS.filter((e) => e.status !== "rascunho").slice(0, 4);
  const pending = ADMIN_OUVIDORIA.filter((o) => o.status === "pendente").slice(0, 3);

  return (
    <PageShell>
      <div className={p.kpis}>
        <StatCard label="Associados ativos" value={fmtNum(STATS.associados)} delta={STATS.associadosDelta} sub={STATS.associadosSub} icon="users" tone="lagoa" />
        <StatCard label="Eventos agendados" value={STATS.eventosAgendados} sub={STATS.eventosSub} icon="calendar" tone="accent" />
        <StatCard label="Reservas no mês" value={STATS.reservasMes} delta={STATS.reservasDelta} sub={STATS.reservasSub} icon="archive" tone="mata" />
        <StatCard label="Acessos ao site" value={fmtNum(STATS.acessosSite)} delta={STATS.acessosDelta} sub={STATS.acessosSub} icon="globe" tone="maresia" />
      </div>

      <div className={p.twoCol}>
        <AdminCard padding>
          <CardHeader
            flat
            title="Atividade no site"
            sub="Acessos e ações dos últimos 7 dias"
            action={
              <select className={p.chartSelect} aria-label="Período" defaultValue="7">
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="mes">Este mês</option>
              </select>
            }
          />
          <div className={p.chart} role="img" aria-label="Gráfico de barras: acessos ao site e visualizações de eventos por dia da semana">
            {SITE_ACTIVITY.map((d) => (
              <div key={d.dia} className={p.chartCol}>
                <div className={p.chartBars}>
                  <div className={cx(p.bar, p.barAcessos)} style={{ height: `${(d.acessos / maxAccess) * 100}%` }} title={`${fmtNum(d.acessos)} acessos`}>
                    <span className={p.barValue}>{(d.acessos / 1000).toFixed(1)}k</span>
                  </div>
                  <div className={cx(p.bar, p.barEventos)} style={{ height: `${(d.eventos / maxEventos) * 100}%` }} title={`${d.eventos} visualizações de eventos`} />
                </div>
                <div className={p.chartDay}>{d.dia}</div>
              </div>
            ))}
          </div>
          <div className={p.legend}>
            <div className={p.legendItem}><span className={p.legendSwatch} />Acessos ao site</div>
            <div className={p.legendItem}><span className={cx(p.legendSwatch, p.legendSwatchAccent)} />Visualizações de eventos</div>
          </div>
        </AdminCard>

        <AdminCard>
          <CardHeader
            title="Ouvidoria"
            sub={`${STATS.ouvidoriaPendente} manifestações esperando resposta`}
            action={<AdminButton variant="ghost" size="sm" href="/admin/ouvidoria" iconRight={<Icon name="arrow-right" size={12} />}>Ver todas</AdminButton>}
          />
          <div>
            {pending.map((o) => (
              <Link key={o.id} href={`/admin/ouvidoria?id=${o.id}`} className={cx(p.ouvItem, "plain")}>
                <div className={p.ouvHead}>
                  <div className={p.ouvLeft}>
                    <span className={cx(p.ouvIcon, TIPO_CLS[o.tipo])}><Icon name={TIPO_ICON[o.tipo]} size={13} /></span>
                    <div style={{ minWidth: 0 }}>
                      <div className={p.ouvTitle}>{o.tipo} · {o.area}</div>
                      <div className={p.ouvMeta}>{o.autor} · {o.data.split("·")[1]?.trim()}</div>
                    </div>
                  </div>
                  {o.urgente && <StatusBadge status="urgente" size="sm" />}
                </div>
                <p className={p.ouvText}>{o.texto.length > 90 ? o.texto.slice(0, 87) + "..." : o.texto}</p>
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>

      <div className={p.twoCol}>
        <AdminCard>
          <CardHeader
            title="Próximos eventos"
            sub="Agenda das próximas semanas"
            action={<AdminButton variant="ghost" size="sm" href="/admin/eventos" iconRight={<Icon name="arrow-right" size={12} />}>Ver agenda</AdminButton>}
          />
          <div>
            {upcoming.map((e) => {
              const d = partesData(e.data);
              const pct = e.capacidade ? Math.min(100, (e.inscritos / e.capacidade) * 100) : 0;
              return (
                <Link key={e.id} href={`/admin/eventos?id=${e.id}`} className={cx(p.evRow, "plain")}>
                  <span className={cx(p.dateBlock, e.destaque && p.dateBlockAccent)}>
                    <span className={p.dateDay} style={{ display: "block" }}>{d.dia}</span>
                    <span className={p.dateMonth} style={{ display: "block" }}>{d.mes}</span>
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span className={p.evName} style={{ display: "block" }}>{e.nome}</span>
                    <span className={p.evMeta} style={{ display: "block" }}>{e.hora} · {e.local}</span>
                  </span>
                  <span>
                    {e.capacidade && (
                      <>
                        <span className={p.evCount} style={{ display: "block" }}>{e.inscritos}<span>/{e.capacidade}</span></span>
                        <span className={p.miniTrack} style={{ display: "block" }}><span className={cx(p.miniFill, pct > 85 && p.miniFillAccent)} style={{ width: `${pct}%`, display: "block" }} /></span>
                      </>
                    )}
                  </span>
                  <StatusBadge status={e.status} size="sm" />
                </Link>
              );
            })}
          </div>
        </AdminCard>

        <AdminCard>
          <CardHeader title="Atividade da equipe" sub="Últimas ações" />
          <div className={p.timeline}>
            {TIMELINE.slice(0, 6).map((t, i, arr) => (
              <div key={i} className={p.tlItem}>
                {i < arr.length - 1 && <span className={p.tlLine} aria-hidden />}
                <span className={cx(p.tlDot, TL_CLS[t.tipo])}><Icon name={TL_ICON[t.tipo]} size={11} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={p.tlText}><b>{t.autor}</b> <i>{t.acao}</i> <b>{t.alvo}</b></div>
                  <div className={p.tlTime}>{t.hora}</div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <div className={p.miniStats}>
        <MiniStat label="Comunicados ativos" value={STATS.comunicadosAtivos} icon="megaphone" />
        <MiniStat label="Modalidades ativas" value={STATS.modalidadesAtivas} icon="dumbbell" />
        <MiniStat label="Fotos no acervo" value={fmtNum(STATS.fotosNoAcervo)} icon="image" />
        <MiniStat label="Áreas publicadas" value={STATS.areasPublicadas} icon="building" />
      </div>
    </PageShell>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className={p.miniStat}>
      <span className={p.miniStatIcon}><Icon name={icon} size={17} /></span>
      <div>
        <div className={p.miniStatValue}>{value}</div>
        <div className={p.miniStatLabel}>{label}</div>
      </div>
    </div>
  );
}
