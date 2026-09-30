import type { Metadata } from "next";
import { DiretoriaPage } from "@/components/admin/DiretoriaPage";

export const metadata: Metadata = { title: "Diretoria" };

export default function Page() {
  return <DiretoriaPage />;
}
