import type { Metadata } from "next";
import { Suspense } from "react";
import { OuvidoriaPage } from "@/components/admin/OuvidoriaPage";

export const metadata: Metadata = { title: "Ouvidoria" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OuvidoriaPage />
    </Suspense>
  );
}
