import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl tracking-tight">nosso<span className="text-gradient-gold italic">sonho</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-sm text-muted-foreground">
          <a href="#templates" className="hover:text-foreground transition-colors">Templates</a>
          <a href="#features" className="hover:text-foreground transition-colors">Recursos</a>
          <a href="#preco" className="hover:text-foreground transition-colors">Preços</a>
          <a href="#historias" className="hover:text-foreground transition-colors">Histórias</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors">Entrar</Link>
          <Link
            to="/auth"
            className="text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Criar nosso site
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
