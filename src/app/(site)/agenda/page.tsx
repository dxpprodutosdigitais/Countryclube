import type { Metadata } from "next";
import { Agenda } from "@/components/site/pages/Vida";
export const metadata: Metadata = { title: "Agenda de Eventos" };
export default function Page() { return <Agenda />; }
