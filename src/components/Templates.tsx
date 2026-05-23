import { motion } from "framer-motion";
import templateMobile from "@/assets/template-mobile.jpg";
import bouquet from "@/assets/bouquet.jpg";
import hero from "@/assets/hero-couple.jpg";

const templates = [
  { name: "Bali", style: "Boho minimalista", img: templateMobile, url: "ana-e-lucas" },
  { name: "Belle", style: "Editorial clássico", img: bouquet, url: "marina-e-pedro" },
  { name: "Sereno", style: "Romântico moderno", img: hero, url: "julia-e-rafa" },
];

export function Templates() {
  return (
    <section id="templates" className="py-28 lg:py-40 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.3em] uppercase text-accent-foreground/70">Templates</p>
            <h2 className="mt-4 font-serif text-4xl lg:text-6xl text-balance">
              Designs feitos por quem ama design.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Cada template é desenhado à mão por uma equipe obcecada por
            tipografia, ritmo e detalhe. Personalize tudo em minutos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((t, i) => (
            <motion.a
              key={t.name}
              href="#"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group block"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-card shadow-soft">
                <img
                  src={t.img}
                  alt={`Template ${t.name}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <h3 className="font-serif text-2xl">{t.name}</h3>
                  <p className="text-xs text-muted-foreground tracking-wide mt-1">{t.style}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">nossosonho.com/{t.url}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
