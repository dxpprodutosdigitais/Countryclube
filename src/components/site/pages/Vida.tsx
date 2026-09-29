"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, Container, EmptyState, Eyebrow, FilterPills, IconTile, PageHeader, SectionTitle } from "@/components/ui/Primitives";
import { EVENTOS_ORDENADOS, GALERIA, INFRA, MODALIDADES, type Album, type Evento, type Modalidade } from "@/data/content";
import { IMG as STOCK } from "@/data/images";
import { SITE } from "@/lib/site";
import s from "./Vida.module.css";
import p from "./Pages.module.css";

/* ============================ INFRAESTRUTURA ============================ */
export function Infraestrutura() {
  const cats = ["Todas", ...Array.from(new Set(INFRA.map((i) => i.cat)))];
  const [cat, setCat] = useState("Todas");
  const filtered = cat === "Todas" ? INFRA : INFRA.filter((i) => i.cat === cat);
  const piscinas = INFRA.find((i) => i.id === "piscinas");

  return (
    <>
      <PageHeader eyebrow="200 mil m²" title="Tudo o que cabe na nossa Lagoa." sub="Praia, campos de futebol, quadras, piscinas, saunas, churrasqueiras, quiosques e — desde 2025 — uma academia nova com vista para a praia." breadcrumb={[{ label: "Vida no Clube" }, { label: "Infraestrutura" }]} image={STOCK.praia} />
      <section className="section section--tight">
        <Container size="2xl">
          <div style={{ marginBottom: 32 }}><FilterPills options={cats} value={cat} onChange={setCat} label="Filtrar por categoria" id="infra-grid" /></div>
          <div id="infra-grid" className={s.infraGrid}>
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1 / -1" }}>
                <EmptyState icon="building" title={`Nenhuma área em "${cat}"`} sub="Não há áreas publicadas nesta categoria no momento." action={<Button variant="secondary" size="sm" onClick={() => setCat("Todas")}>Ver todas as áreas</Button>} />
              </div>
            )}
            {filtered.map((it, i) => {
              const isHero = i === 0 && cat === "Todas";
              return (
                <Card key={it.id} interactive className={[s.infraCard, isHero ? s.infraHero : ""].join(" ")}>
                  <div id={it.id} className={s.infraInner} style={{ backgroundImage: `linear-gradient(180deg, transparent 50%, rgba(0,31,63,0.85) 100%), url(${it.img})` }}>
                    <div className={s.badges}><Badge tone="light" size="sm">{it.cat}</Badge>{it.tag && <Badge tone="accent" size="sm">{it.tag}</Badge>}</div>
                    <div>
                      <h3 className={s.infraTitle}>{it.nome}</h3>
                      <p className={s.infraDesc}>{it.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {piscinas?.destaque && (cat === "Todas" || cat === "Aquáticos") && (
            <div className={s.destaque}>
              <div>
                <Eyebrow light>Destaque · Piscinas</Eyebrow>
                <h3 className={s.destaqueTitle}>{piscinas.destaque.titulo}</h3>
              </div>
              <p className={s.destaqueText}>{piscinas.destaque.texto}</p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

/* ============================ MODALIDADES (lista) ============================ */
function ModalidadeCard({ m }: { m: Modalidade }) {
  return (
    <Link href={`/modalidades/${m.id}`} className="plain">
      <Card interactive className={s.modCard}>
        <div className={s.modImg} style={{ backgroundImage: `url(${m.img})` }}>
          <div className={s.badgeTL}><Badge tone="light" size="sm">{m.cat}</Badge></div>
        </div>
        <div className={s.modBody}>
          <h3 className={s.modTitle}>{m.nome}</h3>
          <p className={s.modDesc}>{m.desc}</p>
          <div className={s.modFoot}>
            <div className={s.modMeta}><Icon name="clock" size={13} /> {m.horario}</div>
            <div className={s.modMeta}><Icon name="user" size={13} /> {m.publico}</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function Modalidades() {
  const cats = ["Todas", ...Array.from(new Set(MODALIDADES.map((i) => i.cat)))];
  const [cat, setCat] = useState("Todas");
  const filtered = cat === "Todas" ? MODALIDADES : MODALIDADES.filter((i) => i.cat === cat);
  return (
    <>
      <PageHeader eyebrow={`${MODALIDADES.length} modalidades · vida ativa`} title="Esporte, lazer e bem-estar para toda a família." sub="Aulas regulares e horários livres em todas as nossas instalações. Inscrições na Secretaria de Esportes ou pelo app." breadcrumb={[{ label: "Vida no Clube" }, { label: "Modalidades" }]} image={STOCK.tenis} />
      <section className="section section--tight">
        <Container>
          <div style={{ marginBottom: 32 }}><FilterPills options={cats} value={cat} onChange={setCat} label="Filtrar por categoria" id="mod-grid" /></div>
          <div id="mod-grid" className={s.modGrid}>
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1 / -1" }}>
                <EmptyState icon="dumbbell" title={`Sem modalidades em "${cat}"`} sub="Talvez seja hora de explorar outra categoria — temos mais de vinte atividades regulares." action={<Button variant="secondary" size="sm" onClick={() => setCat("Todas")}>Ver todas as modalidades</Button>} />
              </div>
            )}
            {filtered.map((m) => <ModalidadeCard key={m.id} m={m} />)}
          </div>
        </Container>
      </section>
    </>
  );
}

/* ============================ MODALIDADE (detalhe) ============================ */
export function ModalidadeDetalhe({ m }: { m: Modalidade }) {
  const related = MODALIDADES.filter((x) => x.cat === m.cat && x.id !== m.id).slice(0, 3);
  return (
    <>
      <PageHeader eyebrow={m.cat} title={m.nome} sub={m.desc} breadcrumb={[{ label: "Modalidades", href: "/modalidades" }, { label: m.nome }]} image={m.img} />
      <section className="section" style={{ padding: "80px 0" }}>
        <Container size="lg">
          <div className={p.splitInfo}>
            <div>
              <Eyebrow>Informações</Eyebrow>
              <div className={s.infoCard}>
                {[
                  { label: "Horário", value: m.horario, icon: "clock" },
                  { label: "Público", value: m.publico, icon: "user" },
                  { label: "Categoria", value: m.cat, icon: "flag" },
                  { label: "Professor", value: m.professor ?? "Consulte a Secretaria de Esportes", icon: "users" },
                  { label: "Inscrição", value: "Secretaria de Esportes ou app", icon: "mail" },
                ].map((row) => (
                  <div key={row.label} className={s.infoRow}>
                    <IconTile name={row.icon} size={32} icon={15} />
                    <div style={{ flex: 1 }}><div className={s.infoLabel}>{row.label}</div><div className={s.infoValue}>{row.value}</div></div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}><Button href="/contato" variant="primary" full iconRight={<Icon name="arrow-right" size={14} />}>Inscrever-se</Button></div>
            </div>
            <div>
              <Eyebrow>Sobre</Eyebrow>
              <h2 className={s.detailTitle}>Por que praticar {m.nome.toLowerCase()} aqui na Lagoa.</h2>
              {(m.sobre ?? [
                `${m.desc} Nossas instalações são pensadas pra cada nível — do iniciante curioso ao atleta competitivo.`,
                "Inscrições e horários atualizados na Secretaria de Esportes, pelo app Country Clube de Formiga ou pelos canais de contato do clube.",
              ]).map((t, i) => <p key={i} className={s.detailText}>{t}</p>)}
              {m.pendente && <p className={p.noticeText} style={{ fontSize: 12.5 }}>Texto e foto oficiais desta modalidade serão publicados a partir de {SITE.siteAtual}/modalidades/{m.id}/.</p>}
            </div>
          </div>
        </Container>
      </section>
      {related.length > 0 && (
        <section className="section section--alt" style={{ padding: "40px 0 120px" }}>
          <Container>
            <SectionTitle eyebrow={`Mais em ${m.cat}`} title="Outras modalidades parecidas" />
            <div className={s.relGrid}>
              {related.map((r) => (
                <Link key={r.id} href={`/modalidades/${r.id}`} className="plain">
                  <Card interactive style={{ borderRadius: 16 }}>
                    <div className={s.relImg} style={{ backgroundImage: `url(${r.img})` }} />
                    <div className={s.relBody}><h4 className={s.relTitle}>{r.nome}</h4><div className={s.relMeta}>{r.horario}</div></div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

/* ============================ AGENDA ============================ */
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
function buildCal(year: number, monthIdx: number) {
  const first = new Date(year, monthIdx, 1).getDay();
  const days = new Date(year, monthIdx + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  return cells;
}

export function Agenda() {
  const router = useRouter();
  const cats = ["Todos", ...Array.from(new Set(EVENTOS_ORDENADOS.map((e) => e.cat)))];
  const [cat, setCat] = useState("Todos");
  const [view, setView] = useState<"lista" | "calendario">("lista");
  const filtered = cat === "Todos" ? EVENTOS_ORDENADOS : EVENTOS_ORDENADOS.filter((e) => e.cat === cat);

  const byMonth = useMemo(() => {
    const map = new Map<string, { label: string; ano: number; list: Evento[] }>();
    filtered.forEach((e) => {
      const key = e.data.slice(0, 7);
      if (!map.has(key)) map.set(key, { label: e.mesNome, ano: e.ano, list: [] });
      map.get(key)!.list.push(e);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const months = useMemo(() => {
    const keys = Array.from(new Set(EVENTOS_ORDENADOS.map((e) => e.data.slice(0, 7))));
    return keys.map((k) => { const [y, m] = k.split("-").map(Number); return { key: k, year: y, m: m - 1, label: `${EVENTOS_ORDENADOS.find((e) => e.data.startsWith(k))!.mesNome} ${y}` }; });
  }, []);

  const meses = Array.from(new Set(EVENTOS_ORDENADOS.map((e) => e.mesNome)));

  return (
    <>
      <PageHeader eyebrow={`${meses.join(" · ")} · 2026`} title="A agenda da nossa Lagoa." sub="Torneios, festas tradicionais, shows ao vivo, colônia de férias e a programação esportiva do clube — atualizada toda semana." breadcrumb={[{ label: "Vida no Clube" }, { label: "Agenda de Eventos" }]} image={STOCK.evento} />
      <section className="section section--tight">
        <Container>
          <div className={s.controls}>
            <FilterPills options={cats} value={cat} onChange={setCat} label="Filtrar por categoria" small />
            <div className={s.segment} role="tablist" aria-label="Modo de exibição">
              {[{ v: "lista", label: "Lista", icon: "list" }, { v: "calendario", label: "Calendário", icon: "calendar" }].map((b) => (
                <button key={b.v} type="button" role="tab" aria-selected={view === b.v} className={s.segmentBtn} onClick={() => setView(b.v as "lista" | "calendario")}>
                  <Icon name={b.icon} size={14} /> {b.label}
                </button>
              ))}
            </div>
          </div>

          {view === "lista" && (
            <div className={s.months}>
              {byMonth.length === 0 && (
                <EmptyState icon="calendar" title="Nenhum evento por aqui ainda" sub="Volte em breve — a agenda da Lagoa é generosa." action={<Button variant="secondary" size="sm" onClick={() => setCat("Todos")}>Ver todos os eventos</Button>} />
              )}
              {byMonth.map(([key, g]) => (
                <div key={key}>
                  <div className={s.monthHead}>
                    <h3 className={s.monthTitle}>{g.label} <span>{g.ano}</span></h3>
                    <span className={s.monthCount}>{g.list.length} {g.list.length === 1 ? "evento" : "eventos"}</span>
                  </div>
                  <div className={s.evList}>
                    {g.list.map((e) => (
                      <Link key={e.id} href={`/agenda/${e.id}`} className="plain">
                        <Card interactive className={s.evCard}>
                          <div className={[s.evDate, e.destaque ? s.evDateHot : ""].join(" ")}><div className={s.evDay}>{e.dia}</div><div className={s.evMonth}>{e.mes}</div></div>
                          <div className={s.evBody}>
                            <div className={s.badges}><Badge tone={e.destaque ? "accent" : "areia"} size="sm">{e.cat}</Badge>{e.destaque && <Badge tone="lagoa" size="sm">Destaque</Badge>}</div>
                            <h4 className={s.evTitle}>{e.nome}</h4>
                            <p className={s.evDesc}>{e.desc}</p>
                          </div>
                          <div className={s.evSide}>
                            <div className={s.evTime}><Icon name="clock" size={13} /> {e.hora}</div>
                            <div className={s.evPlace}><Icon name="map-pin" size={13} /> {e.local}</div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === "calendario" && (
            <div className={s.calendar}>
              {months.map(({ key, year, m, label }) => {
                const cells = buildCal(year, m);
                const monthEvents = filtered.filter((e) => e.data.startsWith(key));
                return (
                  <div key={key} className={s.calMonth}>
                    <h3 className={s.calTitle}>{label}</h3>
                    <div className={s.calGrid}>
                      {DIAS.map((d) => <div key={d} className={s.calHead}>{d}</div>)}
                      {cells.map((d, i) => {
                        const ev = d ? monthEvents.find((e) => e.dia === d) : undefined;
                        const cls = [s.calCell, !d ? s.calEmpty : "", ev ? s.calHas : "", ev?.destaque ? s.calHot : ""].join(" ");
                        if (ev) {
                          return (
                            <button key={i} type="button" className={cls} onClick={() => router.push(`/agenda/${ev.id}`)} aria-label={`${d} — ${ev.nome}`}>
                              <div className={s.calDay}>{d}</div>
                              <div className={s.calEv}>{ev.hora} · {ev.nome.slice(0, 26)}{ev.nome.length > 26 ? "…" : ""}</div>
                              <span className={s.calDot} aria-hidden />
                            </button>
                          );
                        }
                        return <div key={i} className={cls}>{d && <div className={s.calDay}>{d}</div>}</div>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

/* ============================ EVENTO (detalhe) ============================ */
function icsFor(e: Evento) {
  const d = e.data.replace(/-/g, "");
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Country Clube de Formiga//Agenda//PT", "BEGIN:VEVENT", `UID:${e.id}@countryclubedeformiga`, `DTSTART;VALUE=DATE:${d}`, `SUMMARY:${e.nome}`, `DESCRIPTION:${e.desc.replace(/\n/g, " ")} (${e.hora})`, `LOCATION:${e.local} - Country Clube de Formiga`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}

export function EventoDetalhe({ e }: { e: Evento }) {
  return (
    <>
      <PageHeader eyebrow={`${e.dia} de ${e.mesNome.toLowerCase()} · ${e.hora}`} title={e.nome} sub={e.desc} breadcrumb={[{ label: "Agenda", href: "/agenda" }, { label: e.nome }]} image={e.img} />
      <section className="section section--tight">
        <Container size="lg">
          <div className={p.splitWide}>
            <div>
              <Eyebrow>Sobre o evento</Eyebrow>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--color-fg)", margin: "14px 0 24px" }}>{e.desc}</p>
              {e.programacao && (
                <>
                  <Eyebrow>Programação</Eyebrow>
                  <ul className={s.program}>{e.programacao.map((x) => <li key={x}>{x}</li>)}</ul>
                </>
              )}
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--color-fg-muted)", marginTop: 24 }}>Inscrições e reservas pelo app Country Clube de Formiga ou diretamente na Secretaria. Dúvidas: <a href={`mailto:${SITE.emailEventos}`}>{SITE.emailEventos}</a>.</p>
            </div>
            <div>
              <div className={s.aside}>
                <div className={s.asideRow}><IconTile name="calendar" size={36} icon={18} /><div><div className={s.asideLabel}>Quando</div><div className={s.asideValue}>{e.obs ?? `${e.dia} de ${e.mesNome.toLowerCase()} · ${e.hora}`}</div></div></div>
                <div className={s.asideRow}><IconTile name="map-pin" size={36} icon={18} /><div><div className={s.asideLabel}>Onde</div><div className={s.asideValue}>{e.local}</div></div></div>
                <div className={s.asideRow}><IconTile name="flag" size={36} icon={18} /><div><div className={s.asideLabel}>Categoria</div><div className={s.asideValue}>{e.cat}</div></div></div>
                <div style={{ paddingTop: 8 }}>
                  <a href={icsFor(e)} download={`${e.id}.ics`} className="btn btn--accent btn--full">Adicionar ao calendário <Icon name="arrow-right" size={14} /></a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ============================ GALERIA ============================ */
export function Galeria() {
  const [active, setActive] = useState<Album | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const n = active.fotos.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % n);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [active]);

  return (
    <>
      <PageHeader eyebrow="Memórias da família Lagoa" title="Galeria de fotos." sub="Domingos, festas, torneios, inaugurações. As melhores imagens dos últimos anos da nossa Lagoa." breadcrumb={[{ label: "Vida no Clube" }, { label: "Galeria de Fotos" }]} image={STOCK.evento} />
      <section className="section section--tight">
        <Container>
          <div className={s.albums}>
            {GALERIA.map((g) => (
              <button key={g.id} type="button" className={s.album} onClick={() => { setActive(g); setIdx(0); }} aria-label={`Abrir álbum ${g.titulo}`}>
                <div className={s.albumImg} style={{ backgroundImage: `url(${g.cover})` }}>
                  <div className={s.albumBadge}><Badge tone="dark" size="sm">{g.qt} fotos</Badge></div>
                </div>
                <div className={s.albumBody}><h4 className={s.albumTitle}>{g.titulo}</h4><div className={s.albumDate}>{g.data}</div></div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {active && (
        <div className={s.lightbox} onClick={() => setActive(null)} role="dialog" aria-modal="true" aria-label={active.titulo}>
          <button type="button" className={s.lbClose} onClick={(e) => { e.stopPropagation(); setActive(null); }} aria-label="Fechar"><Icon name="x" size={22} /></button>
          <div className={s.lbInner} onClick={(e) => e.stopPropagation()}>
            <div style={{ color: "#fff", marginBottom: 4 }}><Eyebrow light>{active.data}</Eyebrow><h3 className={s.lbTitle}>{active.titulo}</h3></div>
            <div className={s.lbStage}>
              <img src={active.fotos[idx]} alt={`${active.titulo} — foto ${idx + 1}`} className={s.lbImg} />
              <button type="button" className={[s.lbArrow, s.lbPrev].join(" ")} onClick={() => setIdx((i) => (i - 1 + active.fotos.length) % active.fotos.length)} aria-label="Anterior"><Icon name="chevron-left" size={22} /></button>
              <button type="button" className={[s.lbArrow, s.lbNext].join(" ")} onClick={() => setIdx((i) => (i + 1) % active.fotos.length)} aria-label="Próxima"><Icon name="chevron-right" size={22} /></button>
            </div>
            <div className={s.lbFoot}><span>Foto {idx + 1} de {active.fotos.length}</span><span className="only-desktop">use ← → · Esc para fechar</span></div>
          </div>
        </div>
      )}
    </>
  );
}
