import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Upload, Trash2, Plus, ExternalLink, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/$siteId")({
  component: Editor,
  head: () => ({ meta: [{ title: "Editar site — Nosso Sonho" }] }),
});

type Site = any;
type Photo = { id: string; image_url: string; caption: string | null };
type Gift = { id: string; name: string; description: string | null; price: number; image_url: string | null; link: string | null };
type Suggestion = { id: string; name: string; description: string | null; category: string | null; suggested_price: number; image_url: string };

function Editor() {
  const { siteId } = Route.useParams();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: s } = await supabase.from("wedding_sites").select("*").eq("id", siteId).single();
      setSite(s);
      const { data: p } = await supabase.from("site_photos").select("*").eq("site_id", siteId).order("sort_order");
      setPhotos(p ?? []);
      const { data: g } = await supabase.from("gift_items").select("*").eq("site_id", siteId).order("sort_order");
      setGifts(g ?? []);
      const { data: sug } = await supabase.from("gift_suggestions").select("*").order("suggested_price");
      setSuggestions(sug ?? []);
    })();
  }, [user, siteId]);

  const save = async () => {
    if (!site) return;
    setSaving(true);
    const { error } = await supabase.from("wedding_sites").update({
      bride_name: site.bride_name, groom_name: site.groom_name,
      wedding_date: site.wedding_date, location: site.location,
      story: site.story, welcome_message: site.welcome_message,
      pix_key: site.pix_key, slug: site.slug,
    }).eq("id", siteId);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Salvo!");
  };

  const uploadImage = async (file: File, prefix: string) => {
    if (!user) return null;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${siteId}/${prefix}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("wedding-media").upload(path, file);
    if (error) { toast.error(error.message); return null; }
    const { data } = supabase.storage.from("wedding-media").getPublicUrl(path);
    return data.publicUrl;
  };

  const onHeroUpload = async (f: File) => {
    const url = await uploadImage(f, "hero");
    if (!url) return;
    setSite({ ...site, hero_image_url: url });
    await supabase.from("wedding_sites").update({ hero_image_url: url }).eq("id", siteId);
    toast.success("Foto principal atualizada");
  };

  const onPhotoUpload = async (f: File) => {
    const url = await uploadImage(f, "photo");
    if (!url) return;
    const { data, error } = await supabase.from("site_photos").insert({ site_id: siteId, image_url: url }).select().single();
    if (error) { toast.error(error.message); return; }
    setPhotos([...photos, data]);
  };

  const deletePhoto = async (id: string) => {
    await supabase.from("site_photos").delete().eq("id", id);
    setPhotos(photos.filter(p => p.id !== id));
  };

  const addGift = async (g?: Partial<Gift>) => {
    const { data, error } = await supabase.from("gift_items").insert({
      site_id: siteId,
      name: g?.name ?? "Novo presente",
      description: g?.description ?? "",
      price: g?.price ?? 0,
      image_url: g?.image_url ?? null,
      link: g?.link ?? null,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setGifts([...gifts, data]);
  };

  const updateGift = async (id: string, patch: Partial<Gift>) => {
    setGifts(gifts.map(g => g.id === id ? { ...g, ...patch } : g));
  };

  const saveGift = async (g: Gift) => {
    await supabase.from("gift_items").update({
      name: g.name, description: g.description, price: g.price, image_url: g.image_url, link: g.link,
    }).eq("id", g.id);
    toast.success("Presente salvo");
  };

  const deleteGift = async (id: string) => {
    await supabase.from("gift_items").delete().eq("id", id);
    setGifts(gifts.filter(g => g.id !== id));
  };

  const uploadGiftImage = async (id: string, f: File) => {
    const url = await uploadImage(f, "gift");
    if (!url) return;
    await supabase.from("gift_items").update({ image_url: url }).eq("id", id);
    updateGift(id, { image_url: url });
  };

  if (!site) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;

  return (
    <main className="min-h-screen bg-secondary/20">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Painel
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/s/$slug" params={{ slug: site.slug }} target="_blank"><ExternalLink className="w-3 h-3 mr-1" />Ver site</Link>
            </Button>
            <Button onClick={save} disabled={saving} size="sm" className="rounded-full">{saving ? "Salvando..." : "Salvar"}</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-serif text-4xl mb-1">{site.bride_name} & {site.groom_name}</h1>
        <p className="text-sm text-muted-foreground mb-8">nossosonho.com/s/{site.slug}</p>

        <Tabs defaultValue="info">
          <TabsList className="mb-6">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
            <TabsTrigger value="gifts">Lista de presentes</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="rounded-2xl bg-card border p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Noiva</Label><Input value={site.bride_name} onChange={e => setSite({ ...site, bride_name: e.target.value })} /></div>
                <div><Label>Noivo</Label><Input value={site.groom_name} onChange={e => setSite({ ...site, groom_name: e.target.value })} /></div>
                <div><Label>Data</Label><Input type="date" value={site.wedding_date ?? ""} onChange={e => setSite({ ...site, wedding_date: e.target.value })} /></div>
                <div><Label>Local</Label><Input value={site.location ?? ""} onChange={e => setSite({ ...site, location: e.target.value })} /></div>
                <div className="md:col-span-2"><Label>URL personalizada</Label><Input value={site.slug} onChange={e => setSite({ ...site, slug: e.target.value })} /></div>
                <div className="md:col-span-2"><Label>Chave PIX (opcional)</Label><Input value={site.pix_key ?? ""} onChange={e => setSite({ ...site, pix_key: e.target.value })} /></div>
              </div>
              <div>
                <Label>Mensagem de boas-vindas</Label>
                <Textarea rows={3} value={site.welcome_message ?? ""} onChange={e => setSite({ ...site, welcome_message: e.target.value })} placeholder="Bem-vindos ao nosso grande dia..." />
              </div>
              <div>
                <Label>Nossa história</Label>
                <Textarea rows={8} value={site.story ?? ""} onChange={e => setSite({ ...site, story: e.target.value })} placeholder="Conte como vocês se conheceram..." />
              </div>
            </div>

            <div className="rounded-2xl bg-card border p-6">
              <Label className="text-base mb-3 block">Foto principal (capa)</Label>
              <div className="flex items-start gap-5">
                <div className="w-48 h-48 rounded-xl bg-secondary overflow-hidden flex items-center justify-center">
                  {site.hero_image_url ? <img src={site.hero_image_url} className="w-full h-full object-cover" alt="" /> : <span className="text-xs text-muted-foreground">Sem foto</span>}
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-secondary text-sm">
                  <Upload className="w-4 h-4" /> Enviar foto
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && onHeroUpload(e.target.files[0])} />
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <div className="rounded-2xl bg-card border p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-serif text-2xl">Galeria do casal</h3>
                  <p className="text-sm text-muted-foreground">Adicione fotos para sua galeria</p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm">
                  <Upload className="w-4 h-4" /> Enviar foto
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && onPhotoUpload(e.target.files[0])} />
                </label>
              </div>
              {photos.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm border-2 border-dashed rounded-xl">Nenhuma foto ainda</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map(p => (
                    <div key={p.id} className="relative group aspect-square rounded-xl overflow-hidden bg-secondary">
                      <img src={p.image_url} className="w-full h-full object-cover" alt="" />
                      <button onClick={() => deletePhoto(p.id)} className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 opacity-0 group-hover:opacity-100 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="gifts" className="space-y-6">
            <div className="rounded-2xl bg-card border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-2xl">Sugestões prontas</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Toque para adicionar à sua lista</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {suggestions.map(s => (
                  <button key={s.id} onClick={() => addGift({ name: s.name, description: s.description, price: s.suggested_price, image_url: s.image_url })}
                    className="text-left rounded-xl border hover:border-primary hover:shadow-soft transition overflow-hidden bg-background">
                    <div className="aspect-square bg-secondary overflow-hidden"><img src={s.image_url} alt={s.name} className="w-full h-full object-cover" /></div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">{s.category}</p>
                      <p className="text-sm font-medium line-clamp-1">{s.name}</p>
                      <p className="text-sm text-primary mt-1">R$ {Number(s.suggested_price).toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-card border p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-2xl">Sua lista ({gifts.length})</h3>
                <Button size="sm" onClick={() => addGift()} className="rounded-full"><Plus className="w-4 h-4 mr-1" />Adicionar</Button>
              </div>
              {gifts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm border-2 border-dashed rounded-xl">Nenhum presente. Use as sugestões acima ou crie manualmente.</div>
              ) : (
                <div className="space-y-4">
                  {gifts.map(g => (
                    <div key={g.id} className="flex gap-4 p-4 rounded-xl border bg-background">
                      <div className="w-24 h-24 shrink-0 rounded-lg bg-secondary overflow-hidden relative">
                        {g.image_url ? <img src={g.image_url} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem foto</div>}
                        <label className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 bg-black/40 flex items-center justify-center transition">
                          <Upload className="w-4 h-4 text-white" />
                          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadGiftImage(g.id, e.target.files[0])} />
                        </label>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input value={g.name} onChange={e => updateGift(g.id, { name: e.target.value })} placeholder="Nome" />
                        <div className="grid grid-cols-2 gap-2">
                          <Input type="number" step="0.01" value={g.price} onChange={e => updateGift(g.id, { price: Number(e.target.value) })} placeholder="Preço" />
                          <Input value={g.link ?? ""} onChange={e => updateGift(g.id, { link: e.target.value })} placeholder="Link (opcional)" />
                        </div>
                        <Textarea rows={2} value={g.description} onChange={e => updateGift(g.id, { description: e.target.value })} placeholder="Descrição" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={() => saveGift(g)} className="rounded-full">Salvar</Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteGift(g.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
