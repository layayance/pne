alter policy "PNE admin can create actions"
on public.actions
with check (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com',
    'y.faneyaya@gmail.com'
  )
);

alter policy "PNE admin can update actions"
on public.actions
using (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com',
    'y.faneyaya@gmail.com'
  )
)
with check (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com',
    'y.faneyaya@gmail.com'
  )
);

alter policy "PNE admin can delete actions"
on public.actions
using (
  (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com',
    'y.faneyaya@gmail.com'
  )
);

alter policy "PNE admin can upload action media"
on storage.objects
with check (
  bucket_id = 'actions-media'
  and (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com',
    'y.faneyaya@gmail.com'
  )
);

alter policy "PNE admin can update action media"
on storage.objects
using (
  bucket_id = 'actions-media'
  and (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com',
    'y.faneyaya@gmail.com'
  )
);

alter policy "PNE admin can delete action media"
on storage.objects
using (
  bucket_id = 'actions-media'
  and (auth.jwt() ->> 'email') in (
    'parisnordelite@gmail.com',
    'malayindaabo23@gmail.com',
    'y.faneyaya@gmail.com'
  )
);
