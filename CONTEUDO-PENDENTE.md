# Conteúdo pendente / a confirmar com o clube

Durante a construção, o site atual (`lagoanossa.com.br`) e o Unsplash **não eram acessíveis** a partir do ambiente de desenvolvimento. Tudo o que o `CONTENT.md` do handoff trazia literalmente já está no site; o restante ficou marcado abaixo.

## Já migrado (oficial)

- História — texto oficial literal + 6 fotos históricas (`foto_historia1..6.jpg`, referenciadas pela URL original).
- Diretoria 2026/2027 — 12 diretores + 7 conselheiros.
- Agenda — 10 eventos reais de 2026 (Country na Copa ×3, Arraiá, Festival do Rock, 35ª Colônia de Férias, 36ª Copa Country, Sábado na Praia, 1 Ano Academia, Aniversário 92 anos).
- Notícias — amistosos e torneio relâmpago de set/out 2026.
- Contato oficial (endereço, telefone, WhatsApp, e-mails, Instagram, Facebook, Secretaria Web, Google Maps embed, CNPJ).
- Estatuto — link do PDF oficial (`ESTATUTO-2026.pdf`); menu e página renomeados de "Regimento Interno" para "Estatuto".
- Piscina Térmica — texto oficial como destaque em Piscinas.
- Lista das 21 modalidades e 18 áreas de infraestrutura com os nomes oficiais e categorias sugeridas.

## A coletar (texto literal + foto destacada)

Para cada item, buscar `<h1>`, `.entry-content` e `og:image`, salvar a foto em `public/images/<pasta>/<slug>.jpg` e preencher `desc`, `horario`, `publico`, `professor`, `sobre[]` e `img` em `src/data/content.ts` (remover `pendente: true`).

- **Modalidades (21)** — `https://lagoanossa.com.br/modalidades/<slug>/` → `public/images/modalidades/`
- **Infraestrutura (18)** — `https://lagoanossa.com.br/infraestrutura/<slug>/` → `public/images/infraestrutura/`
- **Fotos do hero da Home** (Praia, Quadra de Tênis, evento da galeria, entardecer) — hoje placeholders em `src/data/images.ts › STOCK`.
- **Galeria** — álbuns `galeria-1 … galeria-11` e `fotos-oficiais-do-evento-ja-estao-disponiveis` (títulos, datas e fotos reais; hoje 6 placeholders por álbum).
- **Funcionamento** — tabela de horários por área (`/funcionamento/`); a atual é ilustrativa.
- **Convênios** — lista real (`/convenios/`); a atual é ilustrativa.
- **Perguntas Frequentes** — `/categoria/perguntas-frequentes/`; as 10 atuais são genéricas.
- **Direitos e Deveres** — `/direitos/` e `/deveres/`; as listas atuais são resumos provisórios.
- **Oportunidade / Ouvidoria / Contato** — conferir textos literais.
- **Estatuto** — extrair os títulos reais dos capítulos do PDF (sumário atual é ilustrativo).
- **Linha do tempo da História** — reduzida aos marcos do texto oficial + Academia (2025) + 92 anos (2026); confirmar outros marcos.

## Decisões a confirmar

- **Telefone**: o site usa `(37) 3321-1629` (site oficial). O design system trazia `(37) 3322-1033`.
- **Google Play**: sem URL oficial no handoff — o botão aponta para a busca na loja; trocar pelo link direto do app.
- **Estatísticas do hero/faixa** (92 anos · 21 modalidades · 4.000+ famílias · 200K m²): confirmar número de famílias.
- **Formulários** (Ouvidoria e Contato): hoje validam no cliente e mostram a mensagem de sucesso; definir destino (e-mail/API).
- **Painel administrativo**: é um front-end com dados mock e login de demonstração; precisa de autenticação e backend.
