import type { Metadata } from "next";
import { Galeria } from "@/components/site/pages/Vida";
export const metadata: Metadata = { title: "Galeria de Fotos" };
export default function Page() { return <Galeria />; }
