import { Routes } from '@angular/router';
import { Dashboard } from './layouts/dashboard/dashboard';
import { Mobile } from './layouts/mobile/mobile';
import { Accueil } from './features/accueil/accueil';
import { Carte } from './features/carte/carte';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
 {
  path: 'mobile',
  component: Mobile,
  children: [
    {
      path: '',
      component: Accueil,
    },
    {
      path: 'carte',
      component: Carte,
    },
  ],
},
];