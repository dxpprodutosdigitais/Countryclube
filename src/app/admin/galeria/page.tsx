import type { Metadata } from "next";
import { GaleriaPage } from "@/components/admin/GaleriaPage";

export const metadata: Metadata = { title: "Galeria de fotos" };

export default function Page() {
  return <GaleriaPage />;
}
