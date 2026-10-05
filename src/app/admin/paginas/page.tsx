import type { Metadata } from "next";
import { PaginasPage } from "@/components/admin/PaginasPage";

export const metadata: Metadata = { title: "Páginas do site" };

export default function Page() {
  return <PaginasPage />;
}
