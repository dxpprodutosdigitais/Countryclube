import type { Metadata } from "next";
import { InfraPage } from "@/components/admin/InfraPage";

export const metadata: Metadata = { title: "Infraestrutura" };

export default function Page() {
  return <InfraPage />;
}
