import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModalidadeDetalhe } from "@/components/site/pages/Vida";
import { MODALIDADES } from "@/data/content";

type Params = { params: Promise<{ id: string }> };
export function generateStaticParams() { return MODALIDADES.map((m) => ({ id: m.id })); }
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const m = MODALIDADES.find((x) => x.id === id);
  return { title: m ? m.nome : "Modalidade", description: m?.desc };
}
export default async function Page({ params }: Params) {
  const { id } = await params;
  const m = MODALIDADES.find((x) => x.id === id);
  if (!m) notFound();
  return <ModalidadeDetalhe m={m} />;
}
