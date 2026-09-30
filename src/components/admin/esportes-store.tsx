"use client";

/**
 * Estado compartilhado de Esportes no painel (modalidades, turmas e professores).
 * Sem backend ainda: a semente vem de `real.json` e as edições ficam no
 * localStorage do navegador, para que Modalidades, Professores e Grade de
 * horários enxerguem sempre os mesmos dados.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED, novoId, type ModalidadeAdmin, type Professor } from "@/data/admin-esportes";

const KEY = "cc-admin-esportes-v1";

interface Store {
  modalidades: ModalidadeAdmin[];
  professores: Professor[];
  /** Cria (id vazio) ou atualiza; devolve o registro salvo. */
  upsertModalidade: (m: ModalidadeAdmin) => ModalidadeAdmin;
  removeModalidade: (id: string) => void;
  upsertProfessor: (p: Professor) => Professor;
  removeProfessor: (id: string) => void;
  /** Volta para os dados coletados do site atual. */
  restaurar: () => void;
  /** Última alteração salva (para o aviso "salvo neste navegador"). */
  salvoEm: string | null;
}

const Ctx = createContext<Store | null>(null);

interface Persist { modalidades: ModalidadeAdmin[]; professores: Professor[]; salvoEm: string }

function ler(): Persist | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Persist;
    if (!Array.isArray(p.modalidades) || !Array.isArray(p.professores)) return null;
    return p;
  } catch { return null; }
}
function gravar(p: Persist) {
  try { window.localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* quota / navegação privada */ }
}

export function EsportesProvider({ children }: { children: ReactNode }) {
  const [modalidades, setModalidades] = useState<ModalidadeAdmin[]>(SEED.modalidades);
  const [professores, setProfessores] = useState<Professor[]>(SEED.professores);
  const [salvoEm, setSalvoEm] = useState<string | null>(null);
  const [pronto, setPronto] = useState(false);

  // Hidrata do localStorage depois da montagem (evita divergência com o SSR).
  useEffect(() => {
    const p = ler();
    if (p) { setModalidades(p.modalidades); setProfessores(p.professores); setSalvoEm(p.salvoEm); }
    setPronto(true);
  }, []);
  useEffect(() => {
    if (!pronto) return;
    const agora = new Date().toISOString();
    gravar({ modalidades, professores, salvoEm: agora });
    setSalvoEm(agora);
  }, [modalidades, professores, pronto]);

  const upsertModalidade = useCallback((m: ModalidadeAdmin) => {
    const item = { ...m, id: m.id || novoId("m") };
    setModalidades((list) => (list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item]));
    return item;
  }, []);
  const removeModalidade = useCallback((id: string) => setModalidades((list) => list.filter((x) => x.id !== id)), []);
  const upsertProfessor = useCallback((p: Professor) => {
    const item = { ...p, id: p.id || novoId("p") };
    setProfessores((list) => (list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item]));
    return item;
  }, []);
  const removeProfessor = useCallback((id: string) => {
    setProfessores((list) => list.filter((x) => x.id !== id));
    // Remove o vínculo nas modalidades/turmas.
    setModalidades((list) => list.map((m) => ({
      ...m,
      professorIds: m.professorIds.filter((x) => x !== id),
      turmas: m.turmas.map((t) => ({ ...t, professorIds: t.professorIds.filter((x) => x !== id) })),
    })));
  }, []);
  const restaurar = useCallback(() => { setModalidades(SEED.modalidades); setProfessores(SEED.professores); }, []);

  const value = useMemo<Store>(() => ({ modalidades, professores, upsertModalidade, removeModalidade, upsertProfessor, removeProfessor, restaurar, salvoEm }),
    [modalidades, professores, upsertModalidade, removeModalidade, upsertProfessor, removeProfessor, restaurar, salvoEm]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEsportes(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEsportes precisa estar dentro de <EsportesProvider>");
  return ctx;
}
