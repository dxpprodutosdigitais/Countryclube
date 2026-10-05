"use client";

import { useCallback, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { modalidadesDe, professorVazio, type Professor } from "@/data/admin-esportes";
import { Avatar, InfoBanner, PhotoUpload, Section } from "./EsportesBits";
import { useEsportes } from "./esportes-store";
import { AdminButton, AdminEmpty, Drawer, FilterPill, FiltersRow, FormField, FormRow, PageShell, StatusBadge, TextInput, ToggleInput } from "./primitives";
import s from "./esportes.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

export function ProfessoresPage() {
  const { professores, modalidades, upsertProfessor, removeProfessor, upsertModalidade } = useEsportes();
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "inativos" | "sem">("todos");
  const [draft, setDraft] = useState<Professor | null>(null);
  /** Modalidades marcadas no drawer (ids). */
  const [vinculos, setVinculos] = useState<string[]>([]);

  const lista = useMemo(() => {
    const qn = q.trim().toLowerCase();
    return professores
      .filter((p) => (filtro === "ativos" ? p.ativo : filtro === "inativos" ? !p.ativo : filtro === "sem" ? modalidadesDe(p, modalidades).length === 0 : true))
      .filter((p) => !qn || p.nome.toLowerCase().includes(qn) || p.formacao.toLowerCase().includes(qn))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [professores, modalidades, q, filtro]);

  const abrir = (p: Professor) => { setDraft({ ...p }); setVinculos(modalidadesDe(p, modalidades).map((m) => m.id)); };
  const novo = () => { setDraft(professorVazio()); setVinculos([]); };
  const close = useCallback(() => setDraft(null), []);
  const patch = (partial: Partial<Professor>) => setDraft((d) => (d ? { ...d, ...partial } : d));

  const save = () => {
    if (!draft) return;
    const salvo = upsertProfessor(draft);
    // Sincroniza os vínculos: entra como responsável nas marcadas, sai das desmarcadas.
    for (const m of modalidades) {
      const tem = m.professorIds.includes(salvo.id) || m.turmas.some((t) => t.professorIds.includes(salvo.id));
      const quer = vinculos.includes(m.id);
      if (quer && !m.professorIds.includes(salvo.id) && !tem) upsertModalidade({ ...m, professorIds: [...m.professorIds, salvo.id] });
      else if (!quer && tem) upsertModalidade({ ...m, professorIds: m.professorIds.filter((x) => x !== salvo.id), turmas: m.turmas.map((t) => ({ ...t, professorIds: t.professorIds.filter((x) => x !== salvo.id) })) });
    }
    close();
  };
  const excluir = () => {
    if (!draft?.id) return;
    if (!window.confirm(`Excluir ${draft.nome}? O vínculo com as modalidades e turmas também será removido.`)) return;
    removeProfessor(draft.id);
    close();
  };

  const ativos = professores.filter((p) => p.ativo).length;
  const semVinculo = professores.filter((p) => modalidadesDe(p, modalidades).length === 0).length;

  return (
    <PageShell>
      <InfoBanner icon="users">
        <strong>Professores são um cadastro próprio.</strong> Cada um tem foto, nome e contato e é vinculado às modalidades por seleção — nas telas de Modalidades e Grade de horários eles aparecem com foto, sem digitar nome.
      </InfoBanner>

      <div className={s.stats}>
        <div className={s.stat}><div className={s.statV}>{professores.length}</div><div className={s.statL}>Professores cadastrados</div></div>
        <div className={s.stat}><div className={s.statV}>{ativos}</div><div className={s.statL}>Ativos</div></div>
        <div className={s.stat}><div className={s.statV}>{professores.filter((p) => p.foto).length}</div><div className={s.statL}>Com foto</div></div>
        <div className={s.stat}><div className={s.statV}>{semVinculo}</div><div className={s.statL}>Sem modalidade</div></div>
      </div>

      <FiltersRow right={<AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={novo}>Novo professor</AdminButton>}>
        <FilterPill active={filtro === "todos"} onClick={() => setFiltro("todos")} count={professores.length}>Todos</FilterPill>
        <FilterPill active={filtro === "ativos"} onClick={() => setFiltro("ativos")} count={ativos}>Ativos</FilterPill>
        <FilterPill active={filtro === "inativos"} onClick={() => setFiltro("inativos")} count={professores.length - ativos}>Inativos</FilterPill>
        <FilterPill active={filtro === "sem"} onClick={() => setFiltro("sem")} count={semVinculo}>Sem modalidade</FilterPill>
        <div className={s.toolbarGrow}><TextInput value={q} onChange={setQ} placeholder="Buscar por nome ou formação…" icon="search" /></div>
      </FiltersRow>

      {lista.length ? (
        <div className={s.profGrid}>
          {lista.map((p) => {
            const mods = modalidadesDe(p, modalidades);
            const turmas = mods.reduce((n, m) => n + m.turmas.filter((t) => t.professorIds.includes(p.id)).length, 0);
            return (
              <button type="button" key={p.id} className={cx(s.profCard, !p.ativo && s.profInativo)} onClick={() => abrir(p)}>
                {!p.ativo && <span className={s.profBadge}><StatusBadge status="inativo" size="sm" /></span>}
                <div className={s.profTop}>
                  <Avatar p={p} size={56} />
                  <div style={{ minWidth: 0 }}>
                    <div className={s.profName}>{p.nome}</div>
                    <div className={s.profSub}>{p.formacao || "Formação não informada"}</div>
                  </div>
                </div>
                <div className={s.profMods}>
                  {mods.length ? mods.map((m) => <span key={m.id} className={s.profMod}>{m.nome}</span>) : <span className={s.profNone}>Ainda sem modalidade vinculada</span>}
                </div>
                <div className={s.profFoot}>
                  <span><Icon name="clock" size={12} /> {turmas ? `${turmas} turma${turmas > 1 ? "s" : ""}` : "Responsável geral"}</span>
                  <span>{p.telefone ? <><Icon name="phone" size={12} /> {p.telefone}</> : <em>sem telefone</em>}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <AdminEmpty title="Nenhum professor encontrado" sub="Ajuste a busca ou cadastre um novo professor." action={<AdminButton variant="primary" icon={<Icon name="plus" size={14} />} onClick={novo}>Novo professor</AdminButton>} />
      )}

      <Drawer
        open={!!draft} onClose={close} wide
        title={draft?.id ? draft.nome || "Editar professor" : "Novo professor"} subtitle="Professores"
        footer={
          <>
            {draft?.id && <AdminButton variant="danger" icon={<Icon name="trash" size={14} />} onClick={excluir}>Excluir</AdminButton>}
            <span style={{ flex: 1 }} />
            <AdminButton variant="ghost" onClick={close}>Cancelar</AdminButton>
            <AdminButton variant="primary" icon={<Icon name="check" size={14} />} onClick={save} disabled={!draft?.nome.trim()}>Salvar</AdminButton>
          </>
        }
      >
        {draft && (
          <div>
            <Section title="Foto e identificação" sub="A foto aparece nas turmas, na grade de horários e na página da modalidade no site.">
              <FormField label="Foto do professor">
                <PhotoUpload value={draft.foto} onChange={(v) => patch({ foto: v })} shape="round" label="Enviar foto" hint="Prefira um retrato quadrado, com o rosto centralizado. JPG, PNG ou WEBP até 4 MB." />
              </FormField>
              <FormField label="Nome" required><TextInput value={draft.nome} onChange={(v) => patch({ nome: v })} placeholder="Ex.: Mateus Silva" icon="user" /></FormField>
              <FormRow>
                <FormField label="Formação / registro" hint="Ex.: Educação Física · CREF 00000-G/MG"><TextInput value={draft.formacao} onChange={(v) => patch({ formacao: v })} placeholder="Educação Física" /></FormField>
                <FormField label="Telefone / WhatsApp"><TextInput value={draft.telefone} onChange={(v) => patch({ telefone: v })} placeholder="(37) 9 0000-0000" icon="phone" /></FormField>
              </FormRow>
              <ToggleInput value={draft.ativo} onChange={(v) => patch({ ativo: v })} label="Professor ativo (aparece para seleção nas modalidades)" />
            </Section>

            <Section title="Modalidades em que atua" sub="Marque as modalidades. Para definir a turma e o horário exato, use a tela de Modalidades.">
              <div className={s.chips}>
                {modalidades.map((m) => {
                  const on = vinculos.includes(m.id);
                  return (
                    <button type="button" key={m.id} className={cx(s.dia, on && s.diaOn)} style={{ width: "auto", padding: "0 12px" }} aria-pressed={on}
                      onClick={() => setVinculos((v) => (on ? v.filter((x) => x !== m.id) : [...v, m.id]))}>
                      {m.nome}
                    </button>
                  );
                })}
              </div>
            </Section>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
