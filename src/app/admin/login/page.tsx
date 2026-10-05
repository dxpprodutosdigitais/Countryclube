import type { Metadata } from "next";
import { LoginPage } from "@/components/admin/LoginPage";

export const metadata: Metadata = { title: "Entrar" };

/** Login mock — placeholder até a autenticação real existir. */
export default function Page() {
  return <LoginPage />;
}
