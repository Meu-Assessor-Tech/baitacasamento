import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Escolham um template", desc: "Comece por uma direção visual que combine com a estética de vocês." },
  { n: "02", title: "Personalizem em minutos", desc: "Editor simples, com preview em tempo real. Sem tecnologia, sem complicação." },
  { n: "03", title: "Compartilhem o link", desc: "Um endereço só seu. Convidados confirmam, presenteiam e celebram com vocês." },
];

export function Steps() {
  return (
    <section className="py-28 lg:py-40">
      <div className="mx-auto max-w-5xl px-6 lg:px-10 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-accent-foreground/70">Como funciona</p>
        <h2 className="mt-4 font-serif text-4xl lg:text-6xl text-balance">
          Três passos. <em className="text-gradient-gold not-italic">Zero estresse.</em>
        </h2>

        <div className="mt-20 grid md:grid-cols-3 gap-12 md:gap-6 text-left">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative"
            >
              <span className="font-serif text-7xl text-accent/40">{s.n}</span>
              <h3 className="font-serif text-2xl mt-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
