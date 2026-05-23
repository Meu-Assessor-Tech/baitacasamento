export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <span className="font-serif text-2xl tracking-tight">nosso<span className="text-gradient-gold italic">sonho</span></span>
          <p className="text-sm text-muted-foreground mt-4 max-w-sm">
            Sites de casamento que celebram o amor com elegância.
            Feito com cuidado, para um dia inesquecível.
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Produto</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#templates" className="hover:text-accent transition-colors">Templates</a></li>
            <li><a href="#features" className="hover:text-accent transition-colors">Recursos</a></li>
            <li><a href="#preco" className="hover:text-accent transition-colors">Preços</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Empresa</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-accent transition-colors">Sobre</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Contato</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Suporte</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mt-12 pt-8 border-t border-border/60 flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
        <p>© 2026 Nosso Sonho. Feito com amor no Brasil.</p>
        <p>Termos · Privacidade</p>
      </div>
    </footer>
  );
}
