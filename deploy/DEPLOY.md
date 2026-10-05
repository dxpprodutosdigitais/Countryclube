# Publicar em countryclube.dxp.dev.br

Site e painel são o **mesmo build estático**: o site na raiz e o painel em `/admin` (login em `/admin/login`).
Hospedagem recomendada: **Firebase Hosting** (conta já existente), que atende tanto a prévia para o cliente quanto
a hospedagem definitiva. As opções de servidor próprio (Caddy/Nginx/cPanel/Docker) ficam ao final.

## Prévia pública imediata (GitHub Pages, grátis)

Sem servidor e sem conta extra: a cada push neste branch (ou na `main`) o workflow `.github/workflows/pages.yml`
publica o build em **https://dxpprodutosdigitais.github.io/Countryclube/** (painel em `/Countryclube/admin/`).
É uma prévia para o cliente avaliar: o `robots.txt` bloqueia indexação nesse endereço.

**Ativação (uma vez, pelo dono do repositório):** o token do workflow não consegue criar o site do Pages. Abra
https://github.com/dxpprodutosdigitais/Countryclube/settings/pages e em **Build and deployment → Source** escolha
**GitHub Actions**. Depois rode **Actions → "Pages (prévia)" → Run workflow** (ou faça qualquer push). Em 1 a 2 minutos
o link acima fica no ar e passa a se atualizar sozinho a cada push.

## Por que Firebase Hosting

| | Plano Spark (grátis) | Plano Blaze (pago por uso) |
|---|---|---|
| Armazenamento do site | 10 GB | US$ 0,026/GB-mês além dos 10 GB |
| Tráfego | 360 MB/dia (~10 GB/mês) | US$ 0,15/GB além do grátis |
| Domínio próprio + SSL | incluso, renovação automática | incluso |
| Storage para fotos/eventos | 5 GB grátis (Cloud Storage) | US$ 0,026/GB-mês |
| Banco (Firestore) para o painel | 1 GiB + 50 mil leituras/dia grátis | centavos acima disso |

O build do site tem ~40 MB. Para um clube de cidade média, o custo mensal fica entre zero e poucos dólares, muito abaixo
da mensalidade de R$ 300. Um projeto Firebase por cliente mantém dados, fotos e domínio isolados por contrato.

## 1. Primeira publicação (uma vez, no seu computador)

```bash
npm ci
npx firebase-tools login                  # abre o navegador para autorizar a conta do Firebase
npx firebase-tools use --add              # escolha o projeto e dê o apelido "default" (grava em .firebaserc)
npm run deploy                            # build estático + firebase deploy --only hosting
```

Ao final o CLI mostra a URL provisória `https://<projeto>.web.app`. Já dá para o cliente abrir.

## 2. Domínio countryclube.dxp.dev.br

1. Console do Firebase → **Hosting → Adicionar domínio personalizado** → `countryclube.dxp.dev.br`.
2. O Firebase mostra um registro **TXT** (verificação) e os registros **A** dele.
3. No painel do registro.br do domínio `dxp.dev.br`, edite a zona:
   - troque o registro **A** de `countryclube` (hoje `185.158.133.1`) pelos IPs que o Firebase mostrou;
   - adicione o **TXT** de verificação.
4. Aguarde a propagação (minutos a algumas horas). O certificado SSL é emitido sozinho.

Quando o cliente aprovar e quiser o domínio definitivo dele (ex.: `countryclubeformiga.com.br`), basta repetir o passo 2 com o
novo domínio: nada muda no projeto.

## 3. Publicação automática (GitHub Actions)

`.github/workflows/deploy.yml` já está pronto. Em **Settings → Secrets and variables → Actions** do repositório:

- Variable `FIREBASE_PROJECT_ID` = id do projeto (o mesmo do `.firebaserc`).
- Secret `FIREBASE_SERVICE_ACCOUNT` = conteúdo do JSON gerado em *Configurações do projeto → Contas de serviço → Gerar nova chave privada*.

Depois disso:
- cada **push na `main`** publica no domínio;
- cada **pull request** ganha uma URL de prévia temporária (30 dias), comentada no próprio PR: ideal para o cliente comentar antes de ir ao ar.

Prévia manual sem PR: `npm run deploy:preview` (canal `cliente`, expira em 30 dias).

## 4. Próximo passo para o painel (após aprovação)

O painel ainda guarda as edições no navegador (localStorage) e o login não autentica. Com o Firebase o caminho natural é:
**Authentication** (login dos administradores), **Firestore** (modalidades, turmas, professores, eventos, notícias) e
**Cloud Storage** (fotos). O site estático passa a ler esses dados, ou é republicado automaticamente a cada alteração.

---

## Alternativa: servidor próprio

`npm run build:static` gera `out/`. Envie o conteúdo para a raiz do domínio:

| Hospedagem | O que fazer |
|---|---|
| **VPS com Caddy** | `deploy/Caddyfile` em `/etc/caddy/Caddyfile`; `out/*` em `/var/www/countryclube`; `systemctl reload caddy`. HTTPS automático. |
| **VPS com Nginx** | `deploy/nginx.conf` em `sites-available`; `out/*` em `/var/www/countryclube`; `certbot --nginx -d countryclube.dxp.dev.br`. |
| **cPanel / Hostinger / Apache** | Envie `out/` (inclusive o `.htaccess`) para a pasta do domínio e ative o SSL no painel. |
| **Docker** | `docker compose -f deploy/docker-compose.yml up -d` (Next em Node + Caddy). |

Deploy automático por SSH ou FTP: variable `DEPLOY_METHOD` = `ssh` ou `ftp` e os secrets `DEPLOY_HOST`, `DEPLOY_USER`,
`DEPLOY_SSH_KEY`, `DEPLOY_PATH` (SSH) ou `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_DIR` (FTP).
