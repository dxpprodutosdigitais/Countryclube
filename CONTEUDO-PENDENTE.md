# Conteúdo real e pendências

O conteúdo do site foi coletado do site atual (`lagoanossa.com.br`) e integrado
via `src/data/real.json`. Pipeline:

```
npm run scrape                       # scripts/scrape-lagoanossa.mjs → src/data/scraped.json + public/images/**
node scripts/compress-images.mjs     # comprime as fotos baixadas (sharp, 1600px, q80)
node scripts/build-content.mjs       # scraped.json → src/data/real.json (estruturado)
```

`src/data/content.ts` e `src/data/images.ts` leem `real.json`; as listas `*_BASE`
do handoff só fornecem categoria, ordem e texto de reserva.

## Já migrado do site atual (literal)

- **Modalidades (21)** — nome, texto "sobre", tabelas de programação (dia/horário/turma), professores, retrato publicado, notas de inscrição, público (quando informado) e galeria própria (Ballet/Jazz e Futebol).
- **Infraestrutura (18)** — nome, texto e galeria de fotos (15 áreas com fotos próprias).
- **Agenda** — 21 eventos datados de 2026 publicados como notícia (Country na Copa ×3, Arraiá, Festival do Rock, 35ª Colônia de Férias, torneios, amistosos, Passeio Ciclístico…) + 4 do calendário do handoff (Aniversário 92 anos, 1 Ano Academia, Sábado na Praia, 36ª Copa Country).
- **Notícias/comunicados** — 9 posts (36ª Copa Country, Relâmpago de Vôlei, comunicados da Diretoria, Churrasqueiras, Área Familiar, Sala de Jogos).
- **Galeria** — 10 álbuns reais (66 fotos).
- **Funcionamento** — horário do clube (Seg 14h–21h · Ter–Sáb 7h–21h30 · Dom 7h–19h) + 21 blocos de horários das atividades.
- **FAQ** — as 4 perguntas do site + 2 factuais (funcionamento e agenda).
- **Convênios** — Clube dos Oficiais da PM-MG, com endereço, site e o PDF do Instrumento Particular de Convênio.
- **Direitos e Deveres** — arts. 27 e 28 do Estatuto, estruturados por seção e alínea.
- **História** — texto oficial (5 parágrafos) + 6 fotos históricas (cópias locais).
- **Contato** — telefones (37) 3322-1033 / 3321-1629, WhatsApp, e-mail, endereço.

## Fotos ainda provisórias (gerar no Gamma)

Não existem no site atual fotos próprias para: **Futevôlei, Peteca, Tênis
(modalidade), Restaurante, Academia (página da área), Saunas**. Hoje usam uma foto
real de área relacionada (praia, ginásio, quadra de tênis, bares, galeria da
academia, piscinas). Prompts prontos em `scripts/gamma-prompts.json`.

A geração no Gamma (`generate_image`) falhou por falta de créditos (8 restantes
no plano Plus). Após recarregar em https://gamma.app/settings/billing, gerar as
imagens, salvar em `public/images/<pasta>/<slug>.jpg` e apontar em
`scripts/build-content.mjs › MOD_FOTO / INFRA_FOTO` (ou direto em `real.json`).

A lista completa de pendências geradas pelo build está em `real.json › pendentes`.

## Decisões a confirmar

- **Chaves sem foto real**: `caminhada` (não usada em página) permanece no Unsplash.
- **Google Play**: sem URL oficial — o botão aponta para a busca na loja.
- **Estatuto** — sumário de capítulos ilustrativo; extrair os títulos reais do PDF.
- **Estatísticas** (92 anos · 21 modalidades · 4.000+ famílias · 200K m²): confirmar famílias/área.
- **Formulários** (Ouvidoria, Contato, Oportunidade): validam no cliente; definir destino (e-mail/API).
- **Painel administrativo**: front-end com dados mock; precisa de autenticação e backend.
