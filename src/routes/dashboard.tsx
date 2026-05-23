import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, ExternalLink, Pencil, LogOut, Heart } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Painel — Nosso Sonho" }] }),
});

type Site = {
  id: string; slug: string; bride_name: string; groom_name: string;
  wedding_date: string | null; hero_image_url: string | null;
};

function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const nav = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ bride: "", groom: "", slug: "", date: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading, nav]);

  useEffect(() => {
    if (!user) return;
    supabase.from("wedding_sites").select("id,slug,bride_name,groom_name,wedding_date,hero_image_url")
      .eq("owner_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setSites(data ?? []));
  }, [user]);

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const slug = form.slug || slugify(`${form.bride}-e-${form.groom}`);
      const { data, error } = await supabase.from("wedding_sites").insert({
        owner_id: user.id, slug,
        bride_name: form.bride, groom_name: form.groom,
        wedding_date: form.date || null,
      }).select().single();
      if (error) throw error;
      toast.success("Site criado!");
      setOpen(false);
      nav({ to: "/dashboard/$siteId", params: { siteId: data.id } });
    } catch (err: any) {
      toast.error(err.message);
    } finally { setBusy(false); }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;

  return (
    <main className="min-h-screen bg-secondary/20">
      <header className="border-b border-border/40 bg-background/70 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl">nosso<span className="text-gradient-gold italic">sonho</span></Link>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); nav({ to: "/" }); }}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl">Seus sites</h1>
            <p className="text-muted-foreground mt-1">Gerencie e personalize o site do seu casamento</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full"><Plus className="w-4 h-4 mr-2" />Novo site</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-serif text-2xl">Novo site de casamento</DialogTitle></DialogHeader>
              <form onSubmit={create} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Noiva</Label><Input required value={form.bride} onChange={e => setForm({ ...form, bride: e.target.value })} /></div>
                  <div><Label>Noivo</Label><Input required value={form.groom} onChange={e => setForm({ ...form, groom: e.target.value })} /></div>
                </div>
                <div>
                  <Label>URL do site</Label>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">nossosonho.com/s/</span>
                    <Input placeholder="ana-e-lucas" value={form.slug} onChange={e => setForm({ ...form, slug: slugify(e.target.value) })} />
                  </div>
                </div>
                <div><Label>Data do casamento</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                <Button type="submit" disabled={busy} className="w-full rounded-full">Criar site</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {sites.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-3xl">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-serif text-2xl mb-2">Comece seu site</h2>
            <p className="text-muted-foreground mb-6">Crie um site lindo para celebrar seu amor</p>
            <Button onClick={() => setOpen(true)} className="rounded-full">Criar primeiro site</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map(s => (
              <div key={s.id} className="group rounded-2xl border border-border/60 bg-card overflow-hidden shadow-soft hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                  {s.hero_image_url && <img src={s.hero_image_url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl">{s.bride_name} & {s.groom_name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">/s/{s.slug}</p>
                  <div className="flex gap-2 mt-4">
                    <Button asChild size="sm" variant="outline" className="flex-1 rounded-full">
                      <Link to="/dashboard/$siteId" params={{ siteId: s.id }}><Pencil className="w-3 h-3 mr-1" />Editar</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="rounded-full">
                      <Link to="/s/$slug" params={{ slug: s.slug }}><ExternalLink className="w-3 h-3" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
