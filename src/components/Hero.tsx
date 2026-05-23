import { motion } from "framer-motion";
import heroImg from "@/assets/hero-couple.jpg";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-rose opacity-60" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-cream to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur text-xs tracking-[0.2em] uppercase text-muted-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Sites de casamento · 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-balance"
          >
            O seu <em className="text-gradient-gold not-italic">para sempre</em>,
            <br /> em um site inesquecível.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed"
          >
            Crie em minutos um mini site elegante para o seu casamento.
            Conte sua história, receba confirmações, organize a lista
            de presentes — tudo em um endereço só seu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="/auth"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground text-sm tracking-wide hover:opacity-90 transition-all shadow-soft"
            >
              Começar nosso site
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#templates"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full border border-border text-sm tracking-wide hover:bg-secondary transition-colors"
            >
              Ver templates
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 flex items-center gap-6 text-xs text-muted-foreground"
          >
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-beige to-rose-gold-soft" />
              ))}
            </div>
            <span>+ de 4.000 casais já criaram o site dos seus sonhos</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft">
            <img
              src={heroImg}
              alt="Casal de noivos caminhando ao pôr do sol"
              width={1080}
              height={1920}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute -left-4 sm:-left-10 bottom-10 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-soft w-60"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Faltam</p>
            <p className="font-serif text-4xl mt-1">128 <span className="text-base text-muted-foreground">dias</span></p>
            <p className="text-xs text-muted-foreground mt-2">Ana & Lucas · 14 de junho</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute -right-4 sm:-right-8 top-10 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-soft"
          >
            <p className="text-xs text-muted-foreground">RSVP confirmados</p>
            <p className="font-serif text-3xl">142<span className="text-accent">/180</span></p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
