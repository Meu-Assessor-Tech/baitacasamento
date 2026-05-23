import { motion } from "framer-motion";
import { Heart, MapPin, Camera, Gift, CalendarCheck, Sparkles } from "lucide-react";

const features = [
  { icon: Heart, title: "Sua história", desc: "Conte como tudo começou em um capítulo único, com fotos e datas marcantes." },
  { icon: CalendarCheck, title: "Contagem regressiva", desc: "Um relógio elegante para o grande dia, exibido com tipografia editorial." },
  { icon: MapPin, title: "Cerimônia e festa", desc: "Mapa interativo, horário, dress code e tudo que seus convidados precisam saber." },
  { icon: Gift, title: "Lista de presentes", desc: "Sugestões com faixas de valor, links externos e em breve PIX integrado." },
  { icon: Camera, title: "Galeria do casal", desc: "Suba seus melhores momentos em uma galeria leve, rápida e responsiva." },
  { icon: Sparkles, title: "RSVP simples", desc: "Confirme presenças em segundos. Acompanhe tudo pelo painel em tempo real." },
];

export function Features() {
  return (
    <section id="features" className="py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.3em] uppercase text-accent-foreground/70">Tudo em um lugar</p>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl text-balance">
            Cuidamos dos detalhes.<br />
            <em className="text-gradient-gold not-italic">Vocês cuidam do amor.</em>
          </h2>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-accent/40 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <f.icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
