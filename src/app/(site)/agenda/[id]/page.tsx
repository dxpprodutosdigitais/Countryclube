import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventoDetalhe } from "@/components/site/pages/Vida";
import { EVENTOS } from "@/data/content";

type Params = { params: Promise<{ id: string }> };
export function generateStaticParams() { return EVENTOS.map((e) => ({ id: e.id })); }
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const e = EVENTOS.find((x) => x.id === id);
  return { title: e ? e.nome : "Evento", description: e?.desc };
}
export default async function Page({ params }: Params) {
  const { id } = await params;
  const e = EVENTOS.find((x) => x.id === id);
  if (!e) notFound();
  return <EventoDetalhe e={e} />;
}
