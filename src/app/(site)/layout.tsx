import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Splash } from "@/components/site/Splash";
import { ScrollTop } from "@/components/site/ScrollTop";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      <Splash />
      <ScrollTop />
      <Header />
      <main id="main-content" style={{ minHeight: "60vh" }}>{children}</main>
      <Footer />
    </>
  );
}
