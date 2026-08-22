import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Actions } from './pages/actions/actions';
import { Partners } from './pages/partners/partners';
import { Contact } from './pages/contact/contact';
import { Futsal } from './pages/futsal/futsal';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    data: {
      title: 'Paris Nord Élite | Association jeunesse et futsal à Paris',
      description:
        'Paris Nord Élite est une association engagée pour la jeunesse, les familles et les habitants des 18e et 19e arrondissements de Paris : futsal, solidarité et accompagnement.',
    },
  },
  {
    path: 'qui-sommes-nous',
    component: About,
    data: {
      title: 'Notre association à Paris Nord | Paris Nord Élite',
      description:
        'Découvrez Paris Nord Élite, association de proximité qui accompagne les jeunes et les familles dans le nord de Paris par le sport, l’éducation et la solidarité.',
    },
  },
  {
    path: 'actions',
    component: Actions,
    data: {
      title: 'Actions solidaires et jeunesse à Paris | Paris Nord Élite',
      description:
        'Découvrez les actions de Paris Nord Élite : solidarité locale, sport, sorties éducatives, insertion et accompagnement des jeunes à Paris Nord.',
    },
  },
  {
    path: 'futsal',
    component: Futsal,
    data: {
      title: 'Club de futsal Paris Nord U12, U13 et Seniors | PNE',
      description:
        'Rejoignez Paris Nord Élite Futsal, club à Paris Nord pour les catégories U12, U13 et Seniors : formation, esprit collectif et accompagnement des joueurs.',
    },
  },
  {
    path: 'partenaires',
    component: Partners,
    data: {
      title: 'Devenir partenaire de Paris Nord Élite | Association Paris',
      description:
        'Entreprises, institutions, clubs et associations : soutenez les projets jeunesse, futsal et solidarité de Paris Nord Élite dans le nord parisien.',
    },
  },
  {
    path: 'contact',
    component: Contact,
    data: {
      title: 'Contacter Paris Nord Élite | Association et futsal Paris Nord',
      description:
        'Contactez Paris Nord Élite pour rejoindre le club de futsal, devenir bénévole, proposer une action ou construire un partenariat à Paris Nord.',
    },
  },
  { path: 'admin', component: Admin, data: { title: 'Administration | Paris Nord Élite', noIndex: true } },
  { path: '**', redirectTo: '' },
];
