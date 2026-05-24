import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MapPin, Calendar, Gift, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/s/$slug")({
  component: PublicSite,
});

function PublicSite() {
  const { slug } = Route.useParams();
  const [site, setSite] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [gifts, setGifts] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  const [pix, setPix] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: s } = await (supabase.from("wedding_sites_public" as any) as any).select("*").eq("slug", slug).maybeSingle();
      if (!s) { setNotFound(true); return; }
      setSite(s);
      const [{ data: p }, { data: g }, { data: pixData }] = await Promise.all([
        supabase.from("site_photos").select("*").eq("site_id", s.id).order("sort_order"),
        supabase.from("gift_items").select("*").eq("site_id", s.id).order("sort_order"),
        (supabase.rpc as any)("get_site_pix", { _slug: slug }),
      ]);
      setPhotos(p ?? []); setGifts(g ?? []);
      setPix((pixData as string | null) ?? null);
    })();
  }, [slug]);

  if (notFound) return <div className="min-h-screen flex items-center justify-center"><p className="font-serif text-2xl">Site não encontrado</p></div>;
  if (!site) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;

  const date = site.wedding_date ? new Date(site.wedding_date + "T00:00:00") : null;
  const days = date ? Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000)) : null;

  return (
    <main className="min-h-screen bg-background">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {site.hero_image_url ? (
          <img src={site.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : <div className="absolute inset-0 gradient-rose" />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
        <div className="relative text-center text-white px-6">
          <p className="text-sm tracking-[0.3em] uppercase mb-6 opacity-80">Nosso casamento</p>
          <h1 className="font-serif text-6xl md:text-8xl leading-none">
            {site.bride_name}
            <span className="italic block text-4xl md:text-5xl my-3 opacity-90">&</span>
            {site.groom_name}
          </h1>
          {date && (
            <p className="mt-8 text-lg opacity-90 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              {date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          {site.location && <p className="mt-2 opacity-80 flex items-center justify-center gap-2"><MapPin className="w-4 h-4" />{site.location}</p>}
          {days !== null && days > 0 && (
            <div className="mt-10 inline-block px-6 py-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/30">
              Faltam <span className="font-serif text-2xl mx-1">{days}</span> dias
            </div>
          )}
        </div>
      </section>

      {site.welcome_message && (
        <section className="py-20 px-6 text-center max-w-3xl mx-auto">
          <Heart className="w-8 h-8 mx-auto text-primary mb-6" />
          <p className="font-serif text-2xl md:text-3xl italic leading-relaxed text-foreground/90">"{site.welcome_message}"</p>
        </section>
      )}

      {site.story && (
        <section className="py-20 px-6 bg-secondary/30">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">Nossa história</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-10">Como tudo começou</h2>
            <div className="prose prose-lg mx-auto text-foreground/80 whitespace-pre-wrap font-light leading-relaxed">{site.story}</div>
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 text-center">Galeria</p>
            <h2 className="font-serif text-4xl md:text-5xl text-center mb-12">Nossos momentos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map(p => (
                <div key={p.id} className="aspect-square overflow-hidden rounded-xl">
                  <img src={p.image_url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {gifts.length > 0 && (
        <section className="py-20 px-6 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <Gift className="w-8 h-8 mx-auto text-primary mb-4" />
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 text-center">Lista de presentes</p>
            <h2 className="font-serif text-4xl md:text-5xl text-center mb-4">Nossos sonhos</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">Sua presença é nosso maior presente, mas se quiser nos brindar, ficamos imensamente gratos.</p>
            {pix && (
              <div className="text-center mb-10 inline-block mx-auto w-full">
                <div className="inline-block px-5 py-3 rounded-full bg-background border text-sm">
                  PIX: <span className="font-mono">{pix}</span>
                </div>
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map(g => (
                <div key={g.id} className="rounded-2xl bg-background border overflow-hidden shadow-soft hover:shadow-lg transition-shadow">
                  {g.image_url && <div className="aspect-square overflow-hidden bg-secondary"><img src={g.image_url} alt={g.name} className="w-full h-full object-cover" /></div>}
                  <div className="p-5">
                    <h3 className="font-serif text-xl">{g.name}</h3>
                    {g.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{g.description}</p>}
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-serif text-2xl text-primary">R$ {Number(g.price).toFixed(2)}</span>
                      {g.link && <a href={g.link} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">Ver <ExternalLink className="w-3 h-3" /></a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="py-10 text-center text-sm text-muted-foreground">
        Feito com <Heart className="w-3 h-3 inline text-primary" /> no <a href="/" className="underline">nossosonho</a>
      </footer>
    </main>
  );
}
