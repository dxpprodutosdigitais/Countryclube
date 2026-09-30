import type { Metadata } from "next";
import { ModalidadesPage } from "@/components/admin/ModalidadesPage";

export const metadata: Metadata = { title: "Modalidades" };

export default function Page() {
  return <ModalidadesPage />;
}
