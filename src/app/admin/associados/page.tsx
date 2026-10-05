import type { Metadata } from "next";
import { AssociadosPage } from "@/components/admin/AssociadosPage";

export const metadata: Metadata = { title: "Associados" };

export default function Page() {
  return <AssociadosPage />;
}
