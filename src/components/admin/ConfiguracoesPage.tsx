"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_CONFIG, ADMIN_USER, PERMISSOES_USUARIOS, iniciais, type Config, type HorarioArea } from "@/data/admin";
import { AdminButton, FormField, FormRow, IconBtn, PageShell, SavedNote, SelectInput, TextArea, TextInput, UploadArea } from "./primitives";
import p from "./pages.module.css";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

type TabId = "contato" | "horarios" | "hero" | "redes" | "seo" | "usuarios";
const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "contato", label: "Contato", icon: "mail" },
  { id: "horarios", label: "Horários", icon: "clock" },
  { id: "hero", label: "Hero da Home", icon: "image" },
  { id: "redes", label: "Redes sociais", icon: "globe" },
  { id: "seo", label: "SEO", icon: "search" },
  { id: "usuarios", label: "Permissões", icon: "users" },
];

const PAPEIS = [
  { label: "Administrador", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Somente leitura", value: "view" },
];

function agora() {
  const d = new Date();
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${String(d.getDate()).padStart(2, "0")} ${meses[d.getMonth()]} ${d.getFullYear()} · ${hh}h${mm}`;
}

export function ConfiguracoesPage() {
  const [tab, setTab] = useState<TabId>("contato");
  const [config, setConfig] = useState<Config>(ADMIN_CONFIG);
  const [usuarios, setUsuarios] = useState(PERMISSOES_USUARIOS);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof Config>(key: K, value: Config[K]) => {
    setConfig((c) => ({ ...c, [key]: value }));
    setDirty(true);
    setSaved(false);
  };
  const setContato = (k: keyof Config["contato"], v: string) => set("contato", { ...config.contato, [k]: v });
  const setHero = (k: keyof Config["hero"], v: string) => set("hero", { ...config.hero, [k]: v });
  const setRedes = (k: keyof Config["redes"], v: string) => set("redes", { ...config.redes, [k]: v });
  const setSeo = (k: keyof Config["seo"], v: string) => set("seo", { ...config.seo, [k]: v });
  const setHorario = (i: number, k: keyof HorarioArea, v: string) => set("horarios", config.horarios.map((h, j) => (j === i ? { ...h, [k]: v } : h)));
  const addHorario = () => set("horarios", [...config.horarios, { area: "Nova área", seg: "", sab: "", dom: "" }]);
  const removeHorario = (i: number) => set("horarios", config.horarios.filter((_, j) => j !== i));

  const salvar = () => {
    setConfig((c) => ({ ...c, ultimaAtualizacao: { quando: agora(), por: ADMIN_USER.nome } }));
    setDirty(false);
    setSaved(true);
  };

  return (
    <PageShell padTop={false}>
      <div className={p.tabs} role="tablist" aria-label="Seções de configuração">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={cx(p.tab, tab === t.id && p.tabActive)} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      <div className={p.configLayout}>
        <div>
          {tab === "contato" && (
            <SettingsCard title="Informações de contato" desc="Esses dados aparecem no rodapé do site, na página de Contato e nos canais públicos.">
              <FormRow>
                <FormField label="Telefone principal"><TextInput value={config.contato.telefone} onChange={(v) => setContato("telefone", v)} icon="phone" /></FormField>
                <FormField label="WhatsApp"><TextInput value={config.contato.whatsapp} onChange={(v) => setContato("whatsapp", v)} icon="whatsapp" /></FormField>
              </FormRow>
              <FormField label="E-mail"><TextInput type="email" value={config.contato.email} onChange={(v) => setContato("email", v)} icon="mail" /></FormField>
              <FormField label="Endereço"><TextInput value={config.contato.endereco} onChange={(v) => setContato("endereco", v)} icon="map-pin" /></FormField>
              <FormRow>
                <FormField label="Instagram (perfil)"><TextInput value={config.contato.instagram} onChange={(v) => setContato("instagram", v)} icon="instagram" /></FormField>
                <FormField label="Facebook (página)"><TextInput value={config.contato.facebook} onChange={(v) => setContato("facebook", v)} icon="facebook" /></FormField>
              </FormRow>
            </SettingsCard>
          )}

          {tab === "horarios" && (
            <SettingsCard title="Horários de funcionamento" desc="As alterações refletem automaticamente na página de Funcionamento e no rodapé.">
              <div className={p.hoursTable}>
                <div className={p.hoursScroll}>
                  <div className={p.hoursHead}><div>Área</div><div>Seg–Sex</div><div>Sábado</div><div>Domingo</div><div /></div>
                  {config.horarios.map((h, i) => (
                    <div key={i} className={p.hoursRow}>
                      <input className={cx(p.hoursInput, p.hoursArea)} value={h.area} onChange={(e) => setHorario(i, "area", e.target.value)} aria-label="Área" />
                      <input className={p.hoursInput} value={h.seg} onChange={(e) => setHorario(i, "seg", e.target.value)} aria-label={`${h.area} — segunda a sexta`} />
                      <input className={p.hoursInput} value={h.sab} onChange={(e) => setHorario(i, "sab", e.target.value)} aria-label={`${h.area} — sábado`} />
                      <input className={p.hoursInput} value={h.dom} onChange={(e) => setHorario(i, "dom", e.target.value)} aria-label={`${h.area} — domingo`} />
                      <IconBtn icon="trash" title="Remover" onClick={() => removeHorario(i)} />
                    </div>
                  ))}
                </div>
              </div>
              <div className={p.mt14}>
                <AdminButton variant="secondary" icon={<Icon name="plus" size={14} />} onClick={addHorario}>Adicionar área</AdminButton>
              </div>
            </SettingsCard>
          )}

          {tab === "hero" && (
            <SettingsCard title="Hero da página inicial" desc="O bloco principal de boas-vindas. Recomendamos manter o eyebrow e os títulos enxutos.">
              <FormField label="Eyebrow (texto pequeno acima do título)"><TextInput value={config.hero.eyebrow} onChange={(v) => setHero("eyebrow", v)} /></FormField>
              <FormField label="Título principal" required><TextInput value={config.hero.titulo} onChange={(v) => setHero("titulo", v)} /></FormField>
              <FormField label="Subtítulo"><TextArea rows={2} value={config.hero.subtitulo} onChange={(v) => setHero("subtitulo", v)} /></FormField>
              <FormRow>
                <FormField label="CTA primário"><TextInput value={config.hero.cta1} onChange={(v) => setHero("cta1", v)} /></FormField>
                <FormField label="CTA secundário"><TextInput value={config.hero.cta2} onChange={(v) => setHero("cta2", v)} /></FormField>
              </FormRow>
              <FormField label="Galeria de imagens do carrossel" hint="Recomendado: 1920×1080px. Fotos em luz dourada, do entardecer na Lagoa.">
                <UploadArea multiple />
              </FormField>
            </SettingsCard>
          )}

          {tab === "redes" && (
            <SettingsCard title="Redes sociais" desc="Links que aparecem no rodapé e na página de contato.">
              <FormField label="Instagram"><TextInput value={config.redes.instagram} onChange={(v) => setRedes("instagram", v)} icon="instagram" /></FormField>
              <FormField label="Facebook"><TextInput value={config.redes.facebook} onChange={(v) => setRedes("facebook", v)} icon="facebook" /></FormField>
              <FormField label="YouTube"><TextInput value={config.redes.youtube} onChange={(v) => setRedes("youtube", v)} placeholder="https://youtube.com/@countryclube" icon="play" /></FormField>
              <FormField label="WhatsApp Business" hint="Número internacional, sem espaços."><TextInput value={config.redes.whatsapp} onChange={(v) => setRedes("whatsapp", v)} icon="whatsapp" /></FormField>
            </SettingsCard>
          )}

          {tab === "seo" && (
            <SettingsCard title="SEO e compartilhamento" desc="Metadados que aparecem no Google e quando o site é compartilhado em redes sociais.">
              <FormField label="Título do site (meta title)" required><TextInput value={config.seo.titulo} onChange={(v) => setSeo("titulo", v)} /></FormField>
              <FormField label="Descrição (meta description)" hint={`${config.seo.descricao.length}/160 caracteres.`}>
                <TextArea rows={3} value={config.seo.descricao} onChange={(v) => setSeo("descricao", v.slice(0, 160))} />
              </FormField>
              <FormField label="Palavras-chave"><TextInput value={config.seo.palavras} onChange={(v) => setSeo("palavras", v)} /></FormField>
              <FormField label="Imagem para compartilhamento (Open Graph)" hint="1200×630px."><UploadArea /></FormField>
            </SettingsCard>
          )}

          {tab === "usuarios" && (
            <SettingsCard title="Permissões e acesso" desc="Quem pode editar conteúdo no painel administrativo.">
              <div className={p.permList}>
                {usuarios.map((u) => (
                  <div key={u.id} className={p.permRow}>
                    <span className={p.permAvatar} aria-hidden>{iniciais(u.nome)}</span>
                    <div className={p.permText}>
                      <div className={p.permName}>{u.nome}</div>
                      <div className={p.permEmail}>{u.email}</div>
                    </div>
                    <div className={p.permSelect}>
                      <SelectInput value={u.papel} onChange={(v) => { setUsuarios((list) => list.map((x) => (x.id === u.id ? { ...x, papel: v } : x))); setDirty(true); setSaved(false); }} options={PAPEIS} />
                    </div>
                    <IconBtn icon="more-vertical" title="Mais opções" />
                  </div>
                ))}
              </div>
              <div className={p.mt14}>
                <AdminButton variant="secondary" icon={<Icon name="plus" size={14} />}>Convidar usuário</AdminButton>
              </div>
            </SettingsCard>
          )}
        </div>

        <aside className={p.rail}>
          <div className={p.notice}>
            <div className={p.noticeLabel}><Icon name="alert-circle" size={13} /> Atenção</div>
            <p className={p.noticeText}>Alterações nas configurações afetam o site público imediatamente. Revise antes de salvar.</p>
          </div>
          <div className={p.railCard}>
            <div className={p.railLabel}>Última atualização</div>
            <div className={p.railValue}>{config.ultimaAtualizacao.quando}</div>
            <div className={p.railSub}>por {config.ultimaAtualizacao.por}</div>
          </div>
          {saved && <SavedNote>Alterações salvas (simulação)</SavedNote>}
          <AdminButton variant="primary" size="lg" full icon={<Icon name="save" size={15} />} onClick={salvar} disabled={!dirty}>
            Salvar alterações
          </AdminButton>
        </aside>
      </div>
    </PageShell>
  );
}

function SettingsCard({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div className={p.settingsCard}>
      <div className={p.settingsHead}>
        <h3 className={p.settingsTitle}>{title}</h3>
        {desc && <p className={p.settingsDesc}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}
