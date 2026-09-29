import type { Metadata, Viewport } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "Painel · Country Clube de Formiga", template: "%s · Painel · Country Clube" },
  description: "Painel administrativo do site do Country Clube de Formiga.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#001F3F", width: "device-width", initialScale: 1 };

/** Layout do painel: sem header/rodapé do site público. Fontes e globals.css vêm do root layout. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
