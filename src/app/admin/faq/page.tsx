import type { Metadata } from "next";
import { FaqPage } from "@/components/admin/FaqPage";

export const metadata: Metadata = { title: "Perguntas frequentes" };

export default function Page() {
  return <FaqPage />;
}
