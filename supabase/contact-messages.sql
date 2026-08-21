create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254 and position('@' in email) > 1),
  subject text not null check (char_length(subject) between 2 and 100),
  message text not null check (char_length(message) between 2 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can send a contact message"
on public.contact_messages for insert to anon, authenticated
with check (
  char_length(name) between 2 and 120
  and char_length(email) between 5 and 254
  and position('@' in email) > 1
  and char_length(subject) between 2 and 100
  and char_length(message) between 2 and 5000
);

create policy "PNE admins can read contact messages"
on public.contact_messages for select to authenticated
using (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
);

create policy "PNE admins can update contact messages"
on public.contact_messages for update to authenticated
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

create policy "PNE admins can delete contact messages"
on public.contact_messages for delete to authenticated
using (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com'
  )
);
