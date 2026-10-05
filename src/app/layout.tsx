import type { Metadata, Viewport } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

const cormorant = Cormorant({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  title: { default: "Country Clube de Formiga — Nossa Lagoa", template: "%s · Country Clube de Formiga" },
  description: "Site institucional do Country Clube de Formiga (MG), fundado em 6 de maio de 1934 às margens da Lagoa do Fundão. Praia, quadras, campos, piscinas, academia e agenda para toda a família.",
  icons: { icon: SITE.logo, apple: SITE.logo },
  openGraph: { type: "website", locale: "pt_BR", url: SITE.url, siteName: SITE.nome, title: "Country Clube de Formiga — Nossa Lagoa", description: SITE.slogan },
};

export const viewport: Viewport = { themeColor: "#001F3F", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
