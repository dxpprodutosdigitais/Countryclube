# Publicar em countryclube.dxp.dev.br

O DNS já aponta `countryclube.dxp.dev.br` (registro A) para `185.158.133.1`. Site e painel são o **mesmo build**:
o site fica na raiz e o painel em `/admin` (login em `/admin/login`). Falta apenas colocar os arquivos no servidor e ativar o HTTPS.

## 1. Gerar o build de produção

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://countryclube.dxp.dev.br npm run build:static   # gera out/
```

`out/` contém HTML estático + JS/CSS (`/_next/`), imagens (`/images/`), `robots.txt`, `sitemap.xml` e um `.htaccess` (usado só no Apache).

## 2. Enviar para o servidor (escolha um)

| Hospedagem | O que fazer |
|---|---|
| **VPS com Caddy** (mais simples, HTTPS automático) | `apt install caddy`; copie `deploy/Caddyfile` para `/etc/caddy/Caddyfile`; envie `out/*` para `/var/www/countryclube`; `systemctl reload caddy`. |
| **VPS com Nginx** | Copie `deploy/nginx.conf` para `/etc/nginx/sites-available/countryclube`, ative, envie `out/*` para `/var/www/countryclube`, rode `certbot --nginx -d countryclube.dxp.dev.br`. |
| **cPanel / Hostinger / Apache** | Envie o conteúdo de `out/` (inclusive o `.htaccess`) para a pasta do domínio (`public_html` ou a pasta do subdomínio). Ative o SSL (Let's Encrypt/AutoSSL) no painel. |
| **Docker** | `docker compose -f deploy/docker-compose.yml up -d` (Next em Node + Caddy com HTTPS). |

Enviar manualmente por SSH:

```bash
rsync -az --delete out/ usuario@185.158.133.1:/var/www/countryclube/
```

## 3. Deploy automático (GitHub Actions)

`.github/workflows/deploy.yml` faz build e publica a cada push na `main`. Em **Settings → Secrets and variables → Actions**:

- Variable `DEPLOY_METHOD` = `ssh` ou `ftp`.
- SSH: secrets `DEPLOY_HOST` (`185.158.133.1`), `DEPLOY_USER`, `DEPLOY_SSH_KEY` (chave privada cuja pública está no `~/.ssh/authorized_keys` do servidor), `DEPLOY_PATH` (`/var/www/countryclube`), opcional `DEPLOY_PORT`.
- FTP: secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, opcional `FTP_DIR`.

Depois, **Actions → Deploy → Run workflow** publica na hora.

## 4. Conferir

- https://countryclube.dxp.dev.br — site
- https://countryclube.dxp.dev.br/admin — painel (bloqueado para buscadores no `robots.txt`)
- https://countryclube.dxp.dev.br/sitemap.xml

> O painel ainda não tem backend: as edições ficam no navegador de quem edita (localStorage). O login não autentica de verdade; antes de divulgar o endereço do `/admin`, proteja-o (ex.: senha básica no Caddy/Nginx) ou aguarde a integração com backend.
