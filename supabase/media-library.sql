-- À exécuter une seule fois dans Supabase > SQL Editor.
create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('actions', 'futsal', 'partenaires')),
  title text not null,
  kind text not null check (kind in ('image', 'video')),
  url text not null,
  created_at timestamptz not null default now()
);

alter table public.media_items enable row level security;

create policy "Public can view media"
on public.media_items for select
using (true);

create policy "PNE admin can add media"
on public.media_items for insert to authenticated
with check (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
);

create policy "PNE admin can delete media"
on public.media_items for delete to authenticated
using (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
);

insert into public.media_items (section, title, kind, url)
select seed.section, seed.title, seed.kind, seed.url
from (values
  ('futsal', 'Tigers Cup – l’équipe PNE', 'image', '/media/actions/tigers-cup-equipe.jpg'),
  ('futsal', 'Un moment de partage aux Pays-Bas', 'image', '/media/actions/tigers-cup-pause.jpg'),
  ('futsal', 'La vie du groupe en dehors du terrain', 'image', '/media/actions/tigers-cup-repas.jpg')
) as seed(section, title, kind, url)
where not exists (
  select 1 from public.media_items existing where existing.url = seed.url
);
