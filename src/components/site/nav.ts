export interface NavItem { href: string; label: string; desc: string; icon: string; external?: boolean }
export interface NavGroup { id: string; label: string; items: NavItem[] }

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "clube",
    label: "O Clube",
    items: [
      { href: "/historia", label: "História", desc: "92 anos à beira da Lagoa do Fundão", icon: "sail" },
      { href: "/missao", label: "Missão e Valores", desc: "O que move a família Lagoa", icon: "compass" },
      { href: "/diretoria", label: "Diretoria", desc: "Gestão 2026/2027", icon: "briefcase" },
      { href: "/estatuto", label: "Estatuto", desc: "Estatuto e normas do clube", icon: "file-text" },
    ],
  },
  {
    id: "vida",
    label: "Vida no Clube",
    items: [
      { href: "/infraestrutura", label: "Infraestrutura", desc: "Praia, quadras, piscinas, campos", icon: "home" },
      { href: "/modalidades", label: "Modalidades", desc: "Esportes, fitness, aquáticos", icon: "dumbbell" },
      { href: "/agenda", label: "Agenda de Eventos", desc: "Próximos eventos e calendário", icon: "calendar" },
      { href: "/galeria", label: "Galeria de Fotos", desc: "Memórias recentes da família", icon: "image" },
    ],
  },
  {
    id: "servicos",
    label: "Serviços",
    items: [
      { href: "/funcionamento", label: "Funcionamento", desc: "Horários de todas as áreas", icon: "clock" },
      { href: "/convenios", label: "Convênios", desc: "Parcerias e descontos", icon: "handshake" },
      { href: "/faq", label: "Perguntas Frequentes", desc: "Dúvidas comuns dos associados", icon: "help-circle" },
      { href: "/oportunidade", label: "Oportunidade", desc: "Trabalhe conosco e parcerias", icon: "briefcase" },
      { href: "/ouvidoria", label: "Ouvidoria", desc: "Sugestões, elogios e reclamações", icon: "megaphone" },
      { href: "/contato", label: "Contato", desc: "Telefone, e-mail e endereço", icon: "mail" },
    ],
  },
  {
    id: "socio",
    label: "Associado",
    items: [
      { href: "/associado", label: "Área do Associado", desc: "Tudo o que você precisa saber", icon: "user" },
      { href: "/associado/direitos", label: "Direitos", desc: "O que o associado pode esperar", icon: "check-circle" },
      { href: "/associado/deveres", label: "Deveres", desc: "O que o clube espera de você", icon: "clipboard-list" },
      { href: "/secretaria", label: "Secretaria Web", desc: "Boletos, cadastro, reservas", icon: "external", external: true },
    ],
  },
];
