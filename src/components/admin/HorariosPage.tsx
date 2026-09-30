"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIAS, DIAS, fmtDias, fmtHorario, fmtPeriodo, gradeSemanal, professoresDa, vigencia, type Professor, type Turma } from "@/data/admin-esportes";
import { Avatar, AvatarStack, InfoBanner } from "./EsportesBits";
import { useEsportes } from "./esportes-store";
import { AdminButton, AdminEmpty, FilterPill, FiltersRow, PageShell, SelectInput, TextInput } from "./primitives";
import s from "./esportes.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

export function HorariosPage() {
  const { modalidades, professores, salvoEm } = useEsportes();
  const [visao, setVisao] = useState<"semana" | "modalidade">("semana");
  const [cat, setCat] = useState("todas");
  const [prof, setProf] = useState("todos");
  const [q, setQ] = useState("");

  const ativas = useMemo(() => {
    const qn = q.trim().toLowerCase();
    return modalidades
      .filter((m) => m.status === "ativa")
      .filter((m) => cat === "todas" || m.cat === cat)
      .filter((m) => !qn || m.nome.toLowerCase().includes(qn))
      .map((m) => (prof === "todos" ? m : { ...m, turmas: m.turmas.filter((t) => (t.professorIds.length ? t.professorIds : m.professorIds).includes(prof)) }))
      .filter((m) => m.turmas.length)
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [modalidades, cat, prof, q]);

  const grade = useMemo(() => gradeSemanal(ativas, professores), [ativas, professores]);
  const totalSlots = DIAS.reduce((n, d) => n + grade[d.id].length, 0);
  const profsOpts = [{ label: "Todos os professores", value: "todos" }, ...professores.filter((p) => p.ativo).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")).map((p) => ({ label: p.nome, value: p.id }))];
  const profsDe = (m: (typeof ativas)[number], t: Turma): Professor[] =>
    (t.professorIds.length ? t.professorIds : m.professorIds).map((id) => professores.find((p) => p.id === id)).filter((p): p is Professor => !!p);

  return (
    <PageShell>
      <InfoBanner icon="check-circle" tone="green">
        <strong>Esta grade não é editada aqui.</strong> Ela é gerada automaticamente a partir das turmas cadastradas em cada modalidade. Para mudar um horário, clique no bloco (abre a modalidade) ou vá em <Link href="/admin/modalidades">Modalidades</Link>.
        {salvoEm && <span className={s.saved} style={{ marginLeft: 8 }}><Icon name="save" size={12} /> atualizada {new Date(salvoEm).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>}
      </InfoBanner>

      <div className={s.stats}>
        <div className={s.stat}><div className={s.statV}>{ativas.length}</div><div className={s.statL}>Modalidades na grade</div></div>
        <div className={s.stat}><div className={s.statV}>{ativas.reduce((n, m) => n + m.turmas.length, 0)}</div><div className={s.statL}>Turmas</div></div>
        <div className={s.stat}><div className={s.statV}>{totalSlots}</div><div className={s.statL}>Blocos na semana</div></div>
        <div className={s.stat}><div className={s.statV}>{new Set(ativas.flatMap((m) => professoresDa(m, professores).map((p) => p.id))).size}</div><div className={s.statL}>Professores envolvidos</div></div>
      </div>

      <FiltersRow right={<AdminButton variant="secondary" href="/funcionamento" target="_blank" iconRight={<Icon name="external" size={13} />}>Ver no site</AdminButton>}>
        <FilterPill active={visao === "semana"} onClick={() => setVisao("semana")}>Semana</FilterPill>
        <FilterPill active={visao === "modalidade"} onClick={() => setVisao("modalidade")}>Por modalidade</FilterPill>
        <div style={{ minWidth: 190 }}><SelectInput value={cat} onChange={setCat} options={[{ label: "Todas as categorias", value: "todas" }, ...CATEGORIAS.map((c) => ({ label: c, value: c }))]} /></div>
        <div style={{ minWidth: 210 }}><SelectInput value={prof} onChange={setProf} options={profsOpts} /></div>
        <div className={s.toolbarGrow}><TextInput value={q} onChange={setQ} placeholder="Buscar modalidade…" icon="search" /></div>
      </FiltersRow>

      {!ativas.length ? (
        <AdminEmpty title="Nada na grade com esses filtros" sub="Modalidades em rascunho ou pausadas não entram na grade. Cadastre turmas em Modalidades." action={<AdminButton variant="primary" href="/admin/modalidades">Ir para Modalidades</AdminButton>} />
      ) : visao === "semana" ? (
        <div className={s.semana}>
          {DIAS.map((d) => (
            <div key={d.id} className={s.col}>
              <div className={s.colHead}>{d.nome}<small>{grade[d.id].length}</small></div>
              <div className={s.colBody}>
                {grade[d.id].map((it) => {
                  const v = vigencia(it.turma);
                  const profs = profsDe(it.modalidade, it.turma);
                  return (
                    <Link key={`${it.turma.id}-${d.id}`} href={`/admin/modalidades#editar=${encodeURIComponent(it.modalidade.id)}`} className={cx(s.slot, "plain", v === "futura" && s.slotFutura, v === "encerrada" && s.slotEncerrada)} title={`Editar ${it.modalidade.nome}`}>
                      <div className={s.slotHora}>{fmtHorario(it.turma)}</div>
                      <div className={s.slotNome}>{it.modalidade.nome}</div>
                      <div className={s.slotSub}>
                        {it.turma.nome && it.turma.nome !== "Geral" && <span>{it.turma.nome}</span>}
                        {it.turma.faixaEtaria && <span>{it.turma.faixaEtaria}</span>}
                        {profs.length > 0 && <AvatarStack profs={profs} size={18} max={3} />}
                        {v !== "vigente" && <span className={cx(s.vig, v === "futura" ? s.vigFutura : s.vigEncerrada)}>{v === "futura" ? `a partir de ${fmtPeriodo(it.turma).replace(/^A partir de /, "")}` : "encerrada"}</span>}
                      </div>
                    </Link>
                  );
                })}
                {!grade[d.id].length && <div className={s.colEmpty}>Sem atividades</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.porMod}>
          {ativas.map((m) => (
            <div key={m.id} className={s.modBloco}>
              <div className={s.modBlocoHead}>
                {m.img ? <img src={m.img} alt="" className={s.modThumb} /> : <span className={s.modThumb} />}
                <div className={s.modBlocoNome}>{m.nome}<small>{m.cat}{m.publico ? ` · ${m.publico}` : ""}{m.nota ? ` · ${m.nota}` : ""}</small></div>
                <AvatarStack profs={professoresDa(m, professores)} />
                <AdminButton variant="ghost" size="sm" href={`/admin/modalidades#editar=${encodeURIComponent(m.id)}`} icon={<Icon name="edit" size={13} />}>Editar</AdminButton>
              </div>
              <table className={s.modTable}>
                <thead><tr><th>Turma</th><th>Dias</th><th>Horário</th><th>Professor</th><th>Período</th><th>Local</th></tr></thead>
                <tbody>
                  {m.turmas.map((t) => {
                    const v = vigencia(t);
                    const profs = profsDe(m, t);
                    return (
                      <tr key={t.id}>
                        <td><strong>{t.nome || "—"}</strong>{t.faixaEtaria && <span style={{ color: "var(--color-fg-subtle)" }}> · {t.faixaEtaria}</span>}</td>
                        <td>{fmtDias(t.dias)}</td>
                        <td>{fmtHorario(t)}</td>
                        <td>{profs.length ? <span style={{ display: "inline-flex", gap: 8, flexWrap: "wrap" }}>{profs.map((p) => <span key={p.id} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Avatar p={p} size={20} />{p.nome}</span>)}</span> : <span className={s.semProf}>a definir</span>}</td>
                        <td>{fmtPeriodo(t)} {v !== "vigente" && <span className={cx(s.vig, v === "futura" ? s.vigFutura : s.vigEncerrada)}>{v === "futura" ? "em breve" : "encerrada"}</span>}</td>
                        <td>{t.local || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
