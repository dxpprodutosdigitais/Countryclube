# Country Clube de Formiga — site institucional + painel administrativo

Redesign do site **lagoanossa.com.br** (Country Clube de Formiga, Formiga/MG — fundado em 6 de maio de 1934), construído a partir do handoff de design (`design_handoff_country_clube`), com a **paleta nova** do design system (acento Azul Elétrico `#1E63D8`, fundo branco).

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- Estilo: **CSS Modules** + tokens do design system como CSS custom properties (`src/app/globals.css`)
- Fontes: Cormorant (display) + Montserrat (texto) via `next/font/google`
- Ícones: conjunto Lucide inline (`src/components/ui/Icon.tsx`)
- Sem backend: o site é estático (conteúdo em `src/data/`) e o painel usa dados mock em memória.

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck  # tsc --noEmit
npm run lint
```

## Estrutura

```
src/
  app/
    layout.tsx            # fontes + globals.css
    (site)/               # site público — layout com Header/Footer/splash
      page.tsx            # Home (hero Concrete + 7 seções)
      historia | missao | diretoria | estatuto
      infraestrutura | modalidades[/id] | agenda[/id] | galeria
      funcionamento | convenios | faq | oportunidade | ouvidoria | contato
      associado | associado/direitos | associado/deveres | secretaria
      not-found.tsx
    admin/                # painel administrativo (front-end, mock)
  components/
    ui/                   # Button, Badge, Icon, Container, Card, PageHeader, SectionTitle, EmptyState, FilterPills
    site/                 # Header, Footer, Home, Splash, ScrollTop, pages/*
    admin/                # shell e primitivos do painel
  data/
    content.ts            # TODO o conteúdo do site (modalidades, infra, eventos, FAQ, diretoria…)
    images.ts             # mapa de imagens (oficiais + placeholders)
    admin.ts              # mock do painel
  lib/site.ts             # contato oficial, links, CNPJ, Maps embed
```

## Rotas do site público

| Grupo | Rota |
|---|---|
| Home | `/` |
| O Clube | `/historia` · `/missao` · `/diretoria` · `/estatuto` (`/regimento` redireciona) |
| Vida no Clube | `/infraestrutura` · `/modalidades` · `/modalidades/:id` · `/agenda` · `/agenda/:id` · `/galeria` |
| Serviços | `/funcionamento` · `/convenios` · `/faq` · `/oportunidade` · `/ouvidoria` · `/contato` |
| Associado | `/associado` · `/associado/direitos` · `/associado/deveres` · `/secretaria` (aviso → Secretaria Web) |
| Admin | `/admin` (+ `/admin/login`, eventos, notícias, galeria, faq, modalidades, infraestrutura, diretoria, convênios, ouvidoria, associados, configurações) |

## Conteúdo pendente

Veja **[CONTEUDO-PENDENTE.md](./CONTEUDO-PENDENTE.md)** — lista do que ainda precisa ser coletado do site atual (textos literais e fotos de modalidades/infraestrutura) e das decisões a confirmar com o clube.

## Próximos passos sugeridos

1. Substituir as fotos placeholder (Unsplash) pelas fotos reais em `public/images/...` e atualizar `src/data/images.ts`.
2. Conectar os formulários (Ouvidoria e Contato) a um endpoint/e-mail (hoje validam e mostram a mensagem de sucesso no cliente).
3. Painel: ligar a um backend com autenticação e CRUD (Next.js + Prisma/Supabase ou um headless CMS que exponha os mesmos modelos de `src/data/admin.ts`).
