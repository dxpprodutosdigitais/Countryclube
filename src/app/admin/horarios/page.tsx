import type { Metadata } from "next";
import { HorariosPage } from "@/components/admin/HorariosPage";

export const metadata: Metadata = { title: "Grade de horários" };

export default function Page() {
  return <HorariosPage />;
}
