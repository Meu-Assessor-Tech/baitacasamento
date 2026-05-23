import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Templates } from "@/components/Templates";
import { Steps } from "@/components/Steps";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nosso Sonho — Sites de casamento elegantes em minutos" },
      { name: "description", content: "Crie um mini site de casamento sofisticado, com RSVP, lista de presentes, galeria e contagem regressiva. Templates premium, editor simples." },
      { property: "og:title", content: "Nosso Sonho — Sites de casamento elegantes" },
      { property: "og:description", content: "Crie o site dos seus sonhos em minutos. Templates premium, RSVP, lista de presentes e mais." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Templates />
      <Steps />
      <CTASection />
      <Footer />
    </main>
  );
}
