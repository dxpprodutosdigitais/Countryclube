import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Container, EmptyState, PageHeader } from "@/components/ui/Primitives";

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="Erro 404" title="Essa página não está na Lagoa." sub="O endereço pode ter mudado ou nunca existiu. Use o menu para encontrar o que procura." breadcrumb={[{ label: "Página não encontrada" }]} />
      <section className="section section--tight">
        <Container size="md">
          <EmptyState icon="compass" title="Nada por aqui" sub="Volte para o início ou fale com a gente." action={<Button href="/" variant="primary" iconRight={<Icon name="arrow-right" size={14} />}>Ir para o início</Button>} />
        </Container>
      </section>
    </>
  );
}
