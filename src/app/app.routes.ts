import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Actions } from './pages/actions/actions';
import { Partners } from './pages/partners/partners';
import { Contact } from './pages/contact/contact';
import { Futsal } from './pages/futsal/futsal';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'qui-sommes-nous', component: About },
  { path: 'actions', component: Actions },
  { path: 'futsal', component: Futsal },
  { path: 'partenaires', component: Partners },
  { path: 'contact', component: Contact },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: '' },
];
