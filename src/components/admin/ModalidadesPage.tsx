"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  CATEGORIAS, FORMAS_INSCRICAO, fmtDias, fmtHorario, fmtPeriodo, modalidadeVazia, novoId, professoresDa, turmaVazia, vigencia,
  type ModalidadeAdmin, type Professor, type StatusModalidade, type Turma,
} from "@/data/admin-esportes";
import { Avatar, AvatarStack, DiasPicker, InfoBanner, PhotoUpload, ProfessorPicker, Section } from "./EsportesBits";
import { useEsportes } from "./esportes-store";
import {
  AdminButton, CellRow, CellTitle, Chip, DataTable, Drawer, FilterPill, FiltersRow, FormField, FormRow, IconBtn, PageShell, SelectInput,
  StatusBadge, TextArea, TextInput, Tile, ToggleInput,
} from "./primitives";
import s from "./esportes.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

/** Resumo curto de uma turma: "Seg e Qua · 18h às 19h". */
const resumoTurma = (t: Turma) => `${fmtDias(t.dias)} · ${fmtHorario(t)}`;

export function ModalidadesPage() {
  const { modalidades, professores, upsertModalidade, removeModalidade, upsertProfessor } = useEsportes();
  const [cat, setCat] = useState("todas");
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<ModalidadeAdmin | null>(null);

  // A Grade de horários abre uma modalidade por hash: /admin/modalidades#editar=<id>
  useEffect(() => {
    const m = window.location.hash.match(/editar=([^&]+)/);
    if (!m) return;
    const alvo = modalidades.find((x) => x.id === decodeURIComponent(m[1]));
    if (alvo) setDraft(structuredClone(alvo));
    history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cats = ["todas", ...CATEGORIAS.filter((c) => modalidades.some((m) => m.cat === c))];
  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase();
    return modalidades
      .filter((m) => cat === "todas" || m.cat === cat)
      .filter((m) => !qn || m.nome.toLowerCase().includes(qn) || professoresDa(m, professores).some((p) => p.nome.toLowerCase().includes(qn)))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [modalidades, professores, cat, q]);

  const close = useCallback(() => setDraft(null), []);
  const patch = (partial: Partial<ModalidadeAdmin>) => setDraft((d) => (d ? { ...d, ...partial } : d));
  const patchTurma = (id: string, partial: Partial<Turma>) => setDraft((d) => (d ? { ...d, turmas: d.turmas.map((t) => (t.id === id ? { ...t, ...partial } : t)) } : d));
  const addTurma = () => setDraft((d) => (d ? { ...d, turmas: [...d.turmas, turmaVazia()] } : d));
  const dupTurma = (t: Turma) => setDraft((d) => {
    if (!d) return d;
    const i = d.turmas.findIndex((x) => x.id === t.id);
    const copia = { ...t, id: novoId("t"), nome: t.nome ? `${t.nome} (cópia)` : "" };
    return { ...d, turmas: [...d.turmas.slice(0, i + 1), copia, ...d.turmas.slice(i + 1)] };
  });
  const rmTurma = (id: string) => setDraft((d) => (d ? { ...d, turmas: d.turmas.filter((t) => t.id !== id) } : d));

  const save = () => {
    if (!draft) return;
    upsertModalidade({ ...draft, nome: draft.nome.trim() });
    close();
  };
  const excluir = () => {
    if (!draft?.id) return;
    if (!window.confirm(`Excluir a modalidade ${draft.nome}? Ela também sai da grade de horários.`)) return;
    removeModalidade(draft.id);
    close();
  };
  const criarProfessor = (nome: string): Professor => upsertProfessor({ id: "", nome, foto: "", formacao: "", telefone: "", ativo: true });

  const turmasTotal = modalidades.reduce((n, m) => n + m.turmas.length, 0);

  return (
    <PageShell>
      <InfoBanner icon="calendar" tone="green">
        <strong>A grade de horários é montada sozinha.</strong> Cada turma cadastrada aqui (dias, horário, professor e período) entra automaticamente na <a href="/admin/horarios">Grade de horários das atividades</a> e na página da modalidade no site.
      </InfoBanner>

      <div className={s.stats}>
        <div className={s.stat}><div className={s.statV}>{modalidades.length}</div><div className={s.statL}>Modalidades</div></div>
        <div className={s.stat}><div className={s.statV}>{modalidades.filter((m) => m.status === "ativa").length}</div><div className={s.statL}>Ativas na grade</div></div>
        <div className={s.stat}><div className={s.statV}>{turmasTotal}</div><div className={s.statL}>Turmas / horários</div></div>
        <div className={s.stat}><div className={s.statV}>{modalidades.filter((m) => professoresDa(m, professores).length === 0).length}</div><div className={s.statL}>Sem professor</div></div>
      </div>

      <FiltersRow right={
        <>
          <div style={{ minWidth: 260 }}><TextInput value={q} onChange={setQ} placeholder="Buscar modalidade ou professor…" icon="search" /></div>
          <AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={() => setDraft(modalidadeVazia())}>Nova modalidade</AdminButton>
        </>
      }>
        {cats.map((c) => (
          <FilterPill key={c} active={cat === c} onClick={() => setCat(c)} count={c === "todas" ? modalidades.length : modalidades.filter((m) => m.cat === c).length}>
            {c === "todas" ? "Todas" : c}
          </FilterPill>
        ))}
      </FiltersRow>

      <DataTable<ModalidadeAdmin>
        rows={filtered}
        rowKey={(m) => m.id}
        onRowClick={(m) => setDraft(structuredClone(m))}
        empty="Nenhuma modalidade com esse filtro."
        columns={[
          {
            label: "Modalidade",
            render: (m) => (
              <CellRow>
                {m.img ? <img src={m.img} alt="" className={s.modThumb} /> : <Tile tone="mata"><Icon name="dumbbell" size={18} /></Tile>}
                <CellTitle sub={<span>{m.turmas.length} turma{m.turmas.length !== 1 ? "s" : ""}{m.publico ? ` · ${m.publico}` : ""}</span>}>{m.nome}</CellTitle>
              </CellRow>
            ),
          },
          { label: "Categoria", width: 140, render: (m) => <Chip>{m.cat}</Chip> },
          { label: "Professores", width: 150, render: (m) => <AvatarStack profs={professoresDa(m, professores)} /> },
          {
            label: "Dias e horários", width: 300,
            render: (m) => (
              <div className={s.horChips}>
                {m.turmas.slice(0, 3).map((t) => <span key={t.id} className={s.horChip}><b>{fmtDias(t.dias)}</b> · {fmtHorario(t)}</span>)}
                {m.turmas.length > 3 && <span className={s.horMore}>+{m.turmas.length - 3}</span>}
                {!m.turmas.length && <span className={s.semProf}>Sem turma cadastrada</span>}
              </div>
            ),
          },
          { label: "Status", width: 110, render: (m) => <StatusBadge status={m.status} /> },
          { label: "", width: 60, align: "right", render: (m) => <IconBtn icon="edit" title="Editar" onClick={() => setDraft(structuredClone(m))} /> },
        ]}
      />

      <Drawer
        open={!!draft} onClose={close} xl
        title={draft?.id ? draft.nome || "Editar modalidade" : "Nova modalidade"} subtitle="Modalidades"
        footer={
          <>
            {draft?.id && <AdminButton variant="danger" icon={<Icon name="trash" size={14} />} onClick={excluir}>Excluir</AdminButton>}
            <span style={{ flex: 1 }} />
            <AdminButton variant="ghost" onClick={close}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="check" size={14} />} onClick={save} disabled={!draft?.nome.trim()}>
              {draft?.status === "ativa" ? "Salvar e publicar na grade" : "Salvar"}
            </AdminButton>
          </>
        }
      >
        {draft && (
          <div>
            {/* ---------------- Informações ---------------- */}
            <Section title="Informações" sub="O que aparece no cabeçalho da página da modalidade no site.">
              <FormRow>
                <FormField label="Nome" required><TextInput value={draft.nome} onChange={(v) => patch({ nome: v })} placeholder="Ex.: Tênis" /></FormField>
                <FormField label="Categoria" required><SelectInput value={draft.cat} onChange={(v) => patch({ cat: v })} options={CATEGORIAS} /></FormField>
              </FormRow>
              <FormField label="Descrição" hint="Um parágrafo curto: o que é, para quem, onde acontece.">
                <TextArea value={draft.desc} onChange={(v) => patch({ desc: v })} rows={3} placeholder="Descreva a modalidade…" />
              </FormField>
              <FormRow>
                <FormField label="Público"><TextInput value={draft.publico} onChange={(v) => patch({ publico: v })} placeholder="Ex.: A partir de 6 anos" icon="users" /></FormField>
                <FormField label="Como se inscrever">
                  <SelectInput value={draft.inscricao} onChange={(v) => patch({ inscricao: v as ModalidadeAdmin["inscricao"] })} options={FORMAS_INSCRICAO} />
                </FormField>
              </FormRow>
              <FormRow>
                <FormField label="Observação na grade" hint="Ex.: “Inscrições até 12/06” ou “Traga atestado médico”."><TextInput value={draft.nota} onChange={(v) => patch({ nota: v })} placeholder="Opcional" /></FormField>
                <FormField label="Status" hint="Só modalidades ativas entram na grade e no site.">
                  <SelectInput value={draft.status} onChange={(v) => patch({ status: v as StatusModalidade })} options={[{ label: "Ativa (na grade e no site)", value: "ativa" }, { label: "Pausada (fora da grade, segue no site)", value: "pausada" }, { label: "Rascunho (não publicada)", value: "rascunho" }]} />
                </FormField>
              </FormRow>
              <FormField label="Foto de capa">
                <PhotoUpload value={draft.img} onChange={(v) => patch({ img: v })} shape="wide" label="Enviar foto de capa" hint="Foto horizontal (16:9) da atividade ou do espaço. JPG, PNG ou WEBP até 4 MB." />
              </FormField>
            </Section>

            {/* ---------------- Professores ---------------- */}
            <Section title="Professores responsáveis" sub="Escolha na lista (com foto) ou cadastre um novo na hora. Cada turma pode ter professores diferentes, logo abaixo.">
              <ProfessorPicker value={draft.professorIds} onChange={(ids) => patch({ professorIds: ids })} professores={professores} onCreate={criarProfessor} compact />
            </Section>

            {/* ---------------- Turmas ---------------- */}
            <Section
              title="Turmas e horários"
              sub="Uma turma para cada combinação de dias, horário, faixa etária ou professor. Pode duplicar para variar só o que muda."
              action={<AdminButton variant="secondary" size="sm" icon={<Icon name="plus" size={13} />} onClick={addTurma}>Adicionar turma</AdminButton>}
            >
              <div className={s.turmas}>
                {draft.turmas.map((t, i) => (
                  <TurmaEditor key={t.id} n={i + 1} t={t} professores={professores} onCreate={criarProfessor}
                    onChange={(p) => patchTurma(t.id, p)} onDup={() => dupTurma(t)} onRemove={draft.turmas.length > 1 ? () => rmTurma(t.id) : undefined} />
                ))}
                {!draft.turmas.length && <div className={s.previaEmpty}>Nenhuma turma. Sem turmas a modalidade fica fora da grade de horários.</div>}
              </div>
              <div className={s.addTurma}><AdminButton variant="ghost" size="sm" icon={<Icon name="plus" size={13} />} onClick={addTurma}>Adicionar outra turma</AdminButton></div>
            </Section>

            {/* ---------------- Prévia ---------------- */}
            <Section title="Como vai aparecer na grade" sub="Prévia gerada a partir das turmas acima. Ao salvar, é isto que entra na Grade de horários.">
              <PreviaGrade m={draft} professores={professores} />
            </Section>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}

/* ---------- Editor de uma turma ------------------------------------------ */
function TurmaEditor({ n, t, professores, onChange, onDup, onRemove, onCreate }: {
  n: number; t: Turma; professores: Professor[]; onChange: (p: Partial<Turma>) => void; onDup: () => void; onRemove?: () => void; onCreate: (nome: string) => Professor;
}) {
  const [aberta, setAberta] = useState(true);
  const livre = !t.inicio && !!t.horarioLivre;
  const [modo, setModo] = useState<"horas" | "livre">(livre ? "livre" : "horas");
  const anoTodo = !t.periodoInicio && !t.periodoFim;
  const profs = t.professorIds.map((id) => professores.find((p) => p.id === id)).filter((p): p is Professor => !!p);

  return (
    <div className={s.turma}>
      <div className={s.turmaHead}>
        <span className={s.turmaNum}>{n}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={s.turmaTitle}>{t.nome || "Turma sem nome"}{t.faixaEtaria ? ` · ${t.faixaEtaria}` : ""}</div>
          <div className={s.turmaResumo}>{resumoTurma(t)}{profs.length ? ` · ${profs.map((p) => p.nome).join(", ")}` : ""} · {fmtPeriodo(t)}</div>
        </div>
        <AvatarStack profs={profs} size={24} max={3} />
        <div className={s.turmaActions}>
          <IconBtn icon="clipboard-list" title="Duplicar turma" onClick={onDup} />
          {onRemove && <IconBtn icon="trash" title="Remover turma" onClick={onRemove} />}
          <IconBtn icon={aberta ? "chevron-down" : "chevron-right"} title={aberta ? "Recolher" : "Expandir"} onClick={() => setAberta((a) => !a)} />
        </div>
      </div>
      {aberta && (
        <div className={s.turmaBody}>
          <FormRow>
            <FormField label="Nome da turma" hint="Ex.: Infantil, Adulto, Turma 2012/2013, Rachas."><TextInput value={t.nome} onChange={(v) => onChange({ nome: v })} placeholder="Ex.: Infantil" /></FormField>
            <FormField label="Faixa etária" hint="Ex.: 8 a 14 anos, acima de 35 anos."><TextInput value={t.faixaEtaria} onChange={(v) => onChange({ faixaEtaria: v })} placeholder="Ex.: 8 a 14 anos" /></FormField>
          </FormRow>

          <FormField label="Dias da semana" required>
            <DiasPicker value={t.dias} onChange={(dias) => onChange({ dias })} />
          </FormField>

          <FormField label="Horário" required>
            <div className={s.modoHorario} role="tablist">
              <button type="button" className={cx(modo === "horas" && s.modoOn)} onClick={() => { setModo("horas"); onChange({ horarioLivre: "" }); }}>Início e fim</button>
              <button type="button" className={cx(modo === "livre" && s.modoOn)} onClick={() => { setModo("livre"); onChange({ inicio: "", fim: "" }); }}>Texto livre</button>
            </div>
            {modo === "horas" ? (
              <div className={s.horaRow}>
                <FormField label="Início"><TextInput type="time" value={t.inicio} onChange={(v) => onChange({ inicio: v })} /></FormField>
                <FormField label="Fim" hint="Deixe vazio para mostrar só o início."><TextInput type="time" value={t.fim} onChange={(v) => onChange({ fim: v })} /></FormField>
              </div>
            ) : (
              <TextInput value={t.horarioLivre} onChange={(v) => onChange({ horarioLivre: v })} placeholder="Ex.: 7h, 9h, 16h e 19h · Livre durante o dia" icon="clock" />
            )}
          </FormField>

          <FormField label="Professores desta turma" hint="Se ficar vazio, valem os professores responsáveis pela modalidade.">
            <ProfessorPicker value={t.professorIds} onChange={(ids) => onChange({ professorIds: ids })} professores={professores} onCreate={onCreate} compact />
          </FormField>

          <FormField label="Período">
            <ToggleInput value={anoTodo} onChange={(v) => onChange(v ? { periodoInicio: "", periodoFim: "" } : { periodoInicio: new Date().toISOString().slice(0, 10), periodoFim: "" })} label="Acontece o ano todo" />
            {!anoTodo && (
              <div className={s.horaRow} style={{ marginTop: 12 }}>
                <FormField label="De"><TextInput type="date" value={t.periodoInicio} onChange={(v) => onChange({ periodoInicio: v })} /></FormField>
                <FormField label="Até" hint="Ex.: temporada, curso de férias, campeonato."><TextInput type="date" value={t.periodoFim} onChange={(v) => onChange({ periodoFim: v })} /></FormField>
              </div>
            )}
          </FormField>

          <FormRow>
            <FormField label="Local"><TextInput value={t.local} onChange={(v) => onChange({ local: v })} placeholder="Ex.: Ginásio, Piscina, Quadra 2" icon="map-pin" /></FormField>
            <FormField label="Vagas" hint="Vazio = sem limite."><TextInput type="number" value={t.vagas ?? ""} onChange={(v) => onChange({ vagas: v === "" ? null : Number(v) })} placeholder="Sem limite" /></FormField>
          </FormRow>
          <FormField label="Observação da turma"><TextInput value={t.obs} onChange={(v) => onChange({ obs: v })} placeholder="Ex.: Trazer toca e óculos" /></FormField>
        </div>
      )}
    </div>
  );
}

/* ---------- Prévia da grade ---------------------------------------------- */
function PreviaGrade({ m, professores }: { m: ModalidadeAdmin; professores: Professor[] }) {
  const responsaveis = m.professorIds.map((id) => professores.find((p) => p.id === id)).filter((p): p is Professor => !!p);
  const linhas = m.turmas.flatMap((t) => {
    const profs = (t.professorIds.length ? t.professorIds : m.professorIds).map((id) => professores.find((p) => p.id === id)).filter((p): p is Professor => !!p);
    return t.dias.length ? [{ t, profs }] : [];
  });
  return (
    <div className={s.previa}>
      <div className={s.previaHead}>
        <Icon name="calendar" size={14} /> Grade de horários · {m.nome || "Nova modalidade"}
        <span style={{ flex: 1 }} />
        {m.status !== "ativa" && <span style={{ opacity: 0.8, fontWeight: 500 }}>fora da grade ({m.status})</span>}
      </div>
      {linhas.length ? (
        <table className={s.previaTable}>
          <thead><tr><th>Dias</th><th>Horário</th><th>Turma</th><th>Professor</th><th>Período</th></tr></thead>
          <tbody>
            {linhas.map(({ t, profs }) => {
              const v = vigencia(t);
              return (
                <tr key={t.id}>
                  <td><strong>{fmtDias(t.dias)}</strong></td>
                  <td>{fmtHorario(t)}</td>
                  <td>{t.nome || "—"}{t.faixaEtaria && <span style={{ color: "var(--color-fg-subtle)" }}> · {t.faixaEtaria}</span>}</td>
                  <td>
                    {profs.length ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        {profs.map((p) => <span key={p.id} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Avatar p={p} size={20} />{p.nome}</span>)}
                      </span>
                    ) : <span className={s.semProf}>a definir</span>}
                  </td>
                  <td>{fmtPeriodo(t)} {v !== "vigente" && <span className={cx(s.vig, v === "futura" ? s.vigFutura : s.vigEncerrada)}>{v === "futura" ? "em breve" : "encerrada"}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className={s.previaEmpty}>Marque os dias da semana de pelo menos uma turma para ela aparecer na grade.</div>
      )}
      {(m.nota || responsaveis.length) ? (
        <div className={s.previaEmpty} style={{ borderTop: "1px solid var(--color-divider)" }}>
          {responsaveis.length ? <>Responsáveis: {responsaveis.map((p) => p.nome).join(", ")}. </> : null}{m.nota}
        </div>
      ) : null}
    </div>
  );
}
