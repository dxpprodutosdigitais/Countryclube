# Country Clube de Formiga — site institucional + painel administrativo

Redesign do site **lagoanossa.com.br** (Country Clube de Formiga, Formiga/MG — fundado em 6 de maio de 1934), construído a partir do handoff de design (`design_handoff_country_clube`), com a **paleta nova** do design system (acento Azul Elétrico `#1E63D8`, fundo branco).

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- Estilo: **CSS Modules** + tokens do design system como CSS custom properties (`src/app/globals.css`)
- Fontes: Cormorant (display) + Montserrat (texto) via `next/font/google`
- Ícones: conjunto Lucide inline (`src/components/ui/Icon.tsx`)
- Sem backend: o site é estático (conteúdo em `src/data/`) e o painel usa dados mock. Modalidades, turmas e professores
  (`src/data/admin-esportes.ts`) são editáveis no painel e persistidos no `localStorage` do navegador (`src/components/admin/esportes-store.tsx`).

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
    content.ts            # TODO o conteúdo do site, montado a partir de real.json (+ listas base do handoff)
    real.json             # conteúdo estruturado coletado do site atual (gerado por scripts/build-content.mjs)
    scraped.json          # coleta bruta do site atual (gerado por scripts/scrape-lagoanossa.mjs)
    images.ts             # mapa de imagens (fotos reais em public/images + Unsplash como último recurso)
    admin.ts              # mock do painel
    admin-esportes.ts     # modelo de esportes: professores, modalidades, turmas → grade derivada
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
| Admin | `/admin` (+ `/admin/login`, eventos, notícias, galeria, faq, modalidades, professores, grade de horários, infraestrutura, diretoria, convênios, ouvidoria, associados, configurações) |

## Conteúdo real (scraping do site atual)

```
npm run scrape                     # baixa textos e fotos de lagoanossa.com.br → src/data/scraped.json, public/images/**
node scripts/compress-images.mjs   # comprime as fotos (sharp)
node scripts/build-content.mjs     # gera src/data/real.json (modalidades, infra, eventos, comunicados, álbuns, FAQ, páginas, fotos)
```

Modalidades (textos, tabelas de horários, professores, retratos), infraestrutura (textos + galerias),
agenda, comunicados, galeria, FAQ, funcionamento/horários das atividades, convênio, direitos/deveres
e história vêm literalmente do site atual. O que ainda não existe lá está em `CONTEUDO-PENDENTE.md`.

## Prévia estática (Artifact)

`npm run preview:export` gera em `out/` uma exportação estática do site e do painel pronta para
a hospedagem de Artifacts do claude.ai, onde o site fica sob um prefixo de caminho desconhecido:

- as fotos reais do clube são servidas localmente; as poucas chaves ainda sem foto real usam SVGs locais (o visualizador bloqueia imagens externas);
- os assets ficam em `n/_next` (nomes iniciados por `_` são reservados na hospedagem);
- `scripts/preview-export.mjs` torna as referências relativas, injeta `<base>` em cada página e faz
  o roteador do Next descobrir o prefixo em tempo de execução (`self.__ccBasePath`).

A prévia atual está em https://claude.ai/artifact/YWM7kjG1qRwqLbotPE2V9w.

## Conteúdo pendente

Veja **[CONTEUDO-PENDENTE.md](./CONTEUDO-PENDENTE.md)** — fotos que não existem no site atual (a gerar no Gamma, prompts em `scripts/gamma-prompts.json`) e decisões a confirmar com o clube.

## Próximos passos sugeridos

1. Gerar no Gamma as 6 fotos que não existem no site atual (futevôlei, peteca, tênis, restaurante, academia, saunas) e apontá-las em `scripts/build-content.mjs`.
2. Conectar os formulários (Ouvidoria e Contato) a um endpoint/e-mail (hoje validam e mostram a mensagem de sucesso no cliente).
3. Painel: ligar a um backend com autenticação e CRUD (Next.js + Prisma/Supabase ou um headless CMS que exponha os mesmos modelos de `src/data/admin.ts` e `src/data/admin-esportes.ts`). Com o backend, a página pública `/funcionamento` e as páginas de modalidade passam a ler a mesma grade derivada das turmas (`gradeSemanal`).
