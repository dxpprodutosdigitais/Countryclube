import type { Metadata } from "next";
import { NoticiasPage } from "@/components/admin/NoticiasPage";

export const metadata: Metadata = { title: "Notícias e comunicados" };

export default function Page() {
  return <NoticiasPage />;
}
