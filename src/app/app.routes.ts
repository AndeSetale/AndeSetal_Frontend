import { Routes } from '@angular/router';
import { Dashboard } from './layouts/dashboard/dashboard';
import { Mobile } from './layouts/mobile/mobile';
import { Accueil } from './features/tableau-de-bord/accueil';

import { Accueil as AccMobile } from './features/accueil/accueil';
import { Carte } from './features/carte/carte';

import { CarteIntervention } from './components/carte-intervention/carte-intervention';
import { ListeIntervention } from './features/interventions/liste/liste';
import { authGuard } from './core/guards/auth-guard';

import { GestionAgents } from './features/gestion-agents/gestion-agents';
import { AgentDetail } from './features/agent-detail/agent-detail';
import { Incidents } from './features/incidents/incidents';
import { CarteIncidentsComponent } from './features/carte-incidents/carte-incidents/carte-incidents';
import { DetailIncident } from './features/detail-incident/detail-incident';

import { Carte as CarteAgent } from './features/agent/carte/carte';
import { Agent } from './features/agent/layouts/agent/agent';
import { AccueilAgent } from './features/agent/accueil/accueil';
import { Interventions } from './features/agent/interventions/interventions';
import { HistoriqueRapport } from './features/agent/historique-rapport/historique-rapport';
import { DetailIntervention } from './features/agent/detail-intervention/detail-intervention';
import { Profil } from './features/agent/profil/profil';

export const routes: Routes = [

  // ==========================================
  // AUTHENTIFICATION
  // ==========================================
  // {
  //   path: '',
  //   redirectTo: 'connexion',
  //   pathMatch: 'full'
  // },

  {
    path: 'connexion',
    loadComponent: () =>
      import('./features/authentification/connexion/connexion')
        .then(m => m.Connexion)
  },

  {
    path: 'inscription',
    loadComponent: () =>
      import('./features/authentification/inscription/inscription')
        .then(m => m.Inscription)
  },

  {
    path: 'verification',
    loadComponent: () =>
    import('./features/authentification/verification/verification')
    .then(m => m.Verification)
  },

  // ==========================================
  // PARCOURS DESKTOP — SIDEBAR
  // ==========================================
  {
    path: 'dashboard',
    component: Dashboard,
    children: [

      // Tableau de bord
      {
        path: '',
        component: Accueil,
      },

      {
        path: 'map',
        component: Carte,
      },
      {
    path: 'map/incidents/:id',
    component: DetailIncident,
  },

      // Gestion des incidents
      {
        path: 'incidents',
        component: Incidents,
      },

      // Rapports
      // {
      //   path: 'rapports',
      //   component: ,
      // },

     
      {
        path: 'agents',
        component: GestionAgents
      },

       {
    path: 'agents/:id',
    component:AgentDetail
  }

      // {
      //   path: 'set-setal',
      //   component: ...
      // },

      // {
      //   path: 'financement',
      //   component: ...
      // },

      // {
      //   path: 'settings',
      //   component: ...
      // },
    ],
  },

  // ==========================================
  // PARCOURS MOBILE
  // ==========================================
  {
    path: 'mobile',
    component: Mobile,
    children: [
      {
        path: '',
        component: AccMobile,
      },
      {
        path: 'carte',
        component: Carte,
      },
    ],
  },

  // ==========================================
  // ROUTE PAR DÉFAUT
  // ==========================================
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },


// ==========================================
// ROUTE AGENT
// ==========================================

{
  path: 'agent',
  component: Agent,
  children: [
    {
      path: '',
      component: AccueilAgent,
    },

    {
      path: 'interventions',
      component: Interventions,
    },

    {
      path: 'historique',
      component: HistoriqueRapport,
    },

    {
      path: 'detail/:id',
      component: DetailIntervention,
    },

    {
      path: 'carte',
      component: CarteAgent,
    },

    {
      path: 'profil',
      component: Profil,
    },
  ],
},

  // ==========================================
  // ROUTE INCONNUE
  // ==========================================
  {
    path: '**',
    redirectTo: 'dashboard',
  },

];
