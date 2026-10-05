import type { Metadata } from "next";
import { ConfiguracoesPage } from "@/components/admin/ConfiguracoesPage";

export const metadata: Metadata = { title: "Configurações" };

export default function Page() {
  return <ConfiguracoesPage />;
}
