
-- Wedding sites
create table public.wedding_sites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  bride_name text not null default '',
  groom_name text not null default '',
  wedding_date date,
  location text default '',
  story text default '',
  welcome_message text default '',
  hero_image_url text,
  pix_key text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.wedding_sites(owner_id);

alter table public.wedding_sites enable row level security;

create policy "Anyone can view published sites"
on public.wedding_sites for select
using (is_published = true or owner_id = auth.uid());

create policy "Owner can insert"
on public.wedding_sites for insert
with check (auth.uid() = owner_id);

create policy "Owner can update"
on public.wedding_sites for update
using (auth.uid() = owner_id);

create policy "Owner can delete"
on public.wedding_sites for delete
using (auth.uid() = owner_id);

-- Site photos
create table public.site_photos (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.wedding_sites(id) on delete cascade,
  image_url text not null,
  caption text default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index on public.site_photos(site_id);
alter table public.site_photos enable row level security;

create policy "Photos visible if site visible"
on public.site_photos for select
using (exists (select 1 from public.wedding_sites s where s.id = site_id and (s.is_published = true or s.owner_id = auth.uid())));

create policy "Owner manages photos"
on public.site_photos for all
using (exists (select 1 from public.wedding_sites s where s.id = site_id and s.owner_id = auth.uid()))
with check (exists (select 1 from public.wedding_sites s where s.id = site_id and s.owner_id = auth.uid()));

-- Gift items (per site)
create table public.gift_items (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.wedding_sites(id) on delete cascade,
  name text not null,
  description text default '',
  price numeric(10,2) not null default 0,
  image_url text,
  link text,
  reserved boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index on public.gift_items(site_id);
alter table public.gift_items enable row level security;

create policy "Gift items visible if site visible"
on public.gift_items for select
using (exists (select 1 from public.wedding_sites s where s.id = site_id and (s.is_published = true or s.owner_id = auth.uid())));

create policy "Owner manages gifts"
on public.gift_items for all
using (exists (select 1 from public.wedding_sites s where s.id = site_id and s.owner_id = auth.uid()))
with check (exists (select 1 from public.wedding_sites s where s.id = site_id and s.owner_id = auth.uid()));

-- Gift suggestions catalog (public)
create table public.gift_suggestions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  category text default '',
  suggested_price numeric(10,2) not null default 0,
  image_url text not null,
  created_at timestamptz not null default now()
);
alter table public.gift_suggestions enable row level security;
create policy "Anyone can read suggestions" on public.gift_suggestions for select using (true);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger wedding_sites_touch before update on public.wedding_sites
for each row execute function public.touch_updated_at();

-- Storage bucket
insert into storage.buckets (id, name, public) values ('wedding-media', 'wedding-media', true)
on conflict (id) do nothing;

create policy "Public read wedding-media"
on storage.objects for select
using (bucket_id = 'wedding-media');

create policy "Authenticated upload wedding-media"
on storage.objects for insert
with check (bucket_id = 'wedding-media' and auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owner update wedding-media"
on storage.objects for update
using (bucket_id = 'wedding-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owner delete wedding-media"
on storage.objects for delete
using (bucket_id = 'wedding-media' and (storage.foldername(name))[1] = auth.uid()::text);

-- Seed gift suggestions
insert into public.gift_suggestions (name, description, category, suggested_price, image_url) values
('Jogo de Panelas Antiaderente', 'Conjunto com 5 peças em cerâmica reforçada.', 'Cozinha', 599.00, 'https://images.unsplash.com/photo-1584990347449-a8d3a2a3ea8e?w=800'),
('Cafeteira Espresso', 'Cafeteira automática para os melhores cafés em casa.', 'Cozinha', 1290.00, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800'),
('Jogo de Taças de Cristal', 'Conjunto com 6 taças para vinho tinto.', 'Mesa', 349.00, 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800'),
('Jogo de Lençóis King', 'Lençóis 400 fios 100% algodão egípcio.', 'Quarto', 459.00, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'),
('Liquidificador de Alta Potência', '1200W com jarra de vidro térmico.', 'Cozinha', 699.00, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800'),
('Conjunto de Toalhas de Banho', '4 toalhas em algodão felpudo premium.', 'Banheiro', 289.00, 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800'),
('Air Fryer Digital', 'Fritadeira sem óleo 5L com display touch.', 'Cozinha', 849.00, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800'),
('Aspirador Robô', 'Robô aspirador inteligente com mapeamento.', 'Casa', 1899.00, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'),
('Smart TV 55"', 'TV 4K UHD com tecnologia HDR e streaming.', 'Sala', 2799.00, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'),
('Lua de Mel em Fernando de Noronha', 'Contribua com a viagem dos sonhos.', 'Viagem', 500.00, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'),
('Jantar Romântico', 'Contribua para um jantar especial em restaurante estrelado.', 'Experiência', 300.00, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'),
('Decoração para a Casa Nova', 'Ajude a montar o lar do casal.', 'Casa', 200.00, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800');
