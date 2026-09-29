"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { AdminButton, FormField, TextInput } from "./primitives";
import p from "./pages.module.css";

/**
 * Tela de login MOCK — placeholder para a autenticação real.
 * Não valida credenciais: qualquer envio redireciona para /admin.
 */
export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    router.push("/admin");
  };

  return (
    <main className={p.login}>
      <div className={p.loginGlow} aria-hidden />
      <form className={p.loginCard} onSubmit={submit}>
        <div className={p.loginBrand}>
          <img src="/logo-country-clube-formiga.png" alt="Country Clube de Formiga" className={p.loginLogo} />
          <div>
            <div className={p.loginTag}>Painel · Admin</div>
            <h1 className={p.loginTitle}>Country Clube de Formiga</h1>
          </div>
          <p className={p.loginSub}>Entre com o e-mail cadastrado pela Secretaria para gerenciar o conteúdo do site.</p>
        </div>

        <FormField label="E-mail">
          <TextInput type="email" value={email} onChange={setEmail} placeholder="voce@lagoanossa.com.br" icon="mail" name="email" />
        </FormField>
        <FormField label="Senha">
          <TextInput type="password" value={senha} onChange={setSenha} placeholder="••••••••" icon="lock" name="senha" />
        </FormField>

        <AdminButton variant="primary" size="lg" full type="submit" icon={<Icon name="log-in" size={15} />}>Entrar no painel</AdminButton>

        <div className={p.loginFoot}>
          <Link href="/admin/login">Esqueci minha senha</Link>
          <Link href="/">Voltar ao site</Link>
        </div>

        <div className={p.loginNote}>
          <span><Icon name="alert-circle" size={14} /></span>
          <div>Tela de demonstração: a autenticação real ainda não foi implementada. Qualquer envio abre o painel.</div>
        </div>
      </form>
    </main>
  );
}
