create extension if not exists "pgcrypto";

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('actions', 'futsal', 'partenaires')),
  title text not null,
  kind text not null check (kind in ('image', 'video')),
  url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.actions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  category text not null,
  summary text not null,
  description text not null,
  video_url text,
  poster_url text,
  image_urls text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.actions (
  id, title, date, category, summary, description, video_url, poster_url, published
) values (
  '3e88fdba-c3c3-4713-9780-a4d7ed040f27',
  'Distribution solidaire – été 2026',
  '2026-07-20',
  'Solidarité locale',
  'Une action de proximité menée au contact direct des habitants.',
  'Paris Nord Élite s’est mobilisée sur le terrain pour apporter une aide concrète et créer un moment de solidarité avec les habitants.',
  '/media/actions/distribution-solidaire-ete-2026.mp4',
  '/media/actions/distribution-solidaire-ete-2026.png',
  true
)
on conflict (id) do nothing;

alter table public.actions enable row level security;

create policy "Public can read published actions"
on public.actions for select
using (published = true);

create policy "PNE admin can create actions"
on public.actions for insert to authenticated
with check (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
);

create policy "PNE admin can update actions"
on public.actions for update to authenticated
using (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
)
with check (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
);

create policy "PNE admin can delete actions"
on public.actions for delete to authenticated
using (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
);

insert into storage.buckets (id, name, public)
values ('actions-media', 'actions-media', true)
on conflict (id) do update set public = true;

create policy "Public can view action media"
on storage.objects for select
using (bucket_id = 'actions-media');

create policy "PNE admin can upload action media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'actions-media'
  and (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
);

create policy "PNE admin can update action media"
on storage.objects for update to authenticated
using (
  bucket_id = 'actions-media'
  and (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
);

create policy "PNE admin can delete action media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'actions-media'
  and (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
);
