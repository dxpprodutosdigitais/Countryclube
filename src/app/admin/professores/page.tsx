import type { Metadata } from "next";
import { ProfessoresPage } from "@/components/admin/ProfessoresPage";

export const metadata: Metadata = { title: "Professores" };

export default function Page() {
  return <ProfessoresPage />;
}
