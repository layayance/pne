-- À exécuter une seule fois dans Supabase > SQL Editor.
alter table public.actions
add column if not exists image_urls text[] not null default '{}';

-- La vidéo de distribution ne doit pas utiliser une photo sans rapport comme miniature.
update public.actions
set poster_url = null
where id = '3e88fdba-c3c3-4713-9780-a4d7ed040f27';

-- Texte corrigé et galerie de la Tigers Cup.
update public.actions
set
  title = 'Tigers Cup : une première aventure internationale',
  category = 'Action sportive',
  summary = 'Pour leur premier tournoi à l’étranger, les jeunes de PNE ont fièrement représenté le club aux Pays-Bas. 🇳🇱🥉',
  description = 'Paris Nord Élite a vécu son premier déplacement international à l’occasion de la Tigers Cup, organisée aux Pays-Bas.\n\nNos U11, nés en 2015, décrochent une belle 3e place sur 12 équipes. Le groupe U12/U13 réalise également un superbe parcours : les U13 atteignent la finale avant de s’incliner aux tirs au but.\n\nAu-delà des résultats, ce voyage a offert aux jeunes une expérience forte : découverte d’un nouveau pays, rencontres sportives et moments de partage en dehors des terrains.\n\nUne première aventure internationale réussie qui en appellera beaucoup d’autres !',
  image_urls = array[
    '/media/actions/tigers-cup-equipe.jpg',
    '/media/actions/tigers-cup-pause.jpg',
    '/media/actions/tigers-cup-repas.jpg'
  ]
where id = 'fbdc494e-5c5a-4f40-89b0-1c1b2c3300ef';
