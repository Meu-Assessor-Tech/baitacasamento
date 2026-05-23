import { motion } from "framer-motion";
import bouquet from "@/assets/bouquet.jpg";

export function CTASection() {
  return (
    <section id="comecar" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground p-12 lg:p-20"
        >
          <div className="absolute inset-0 opacity-30">
            <img src={bouquet} alt="" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40" />
          </div>

          <div className="relative max-w-2xl">
            <p className="text-xs tracking-[0.3em] uppercase text-accent">Comece grátis</p>
            <h2 className="mt-4 font-serif text-5xl lg:text-7xl leading-[1.02] text-balance">
              O grande dia merece um site à altura.
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-lg">
              Criem agora o site de casamento de vocês. Sem cartão de crédito, sem fricção.
            </p>
            <a
              href="/auth"
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-background text-foreground text-sm tracking-wide hover:bg-accent transition-colors shadow-soft"
            >
              Criar nosso site agora <span>→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
