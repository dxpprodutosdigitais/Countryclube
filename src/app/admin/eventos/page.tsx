import type { Metadata } from "next";
import { Suspense } from "react";
import { EventosPage } from "@/components/admin/EventosPage";

export const metadata: Metadata = { title: "Agenda de eventos" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EventosPage />
    </Suspense>
  );
}
