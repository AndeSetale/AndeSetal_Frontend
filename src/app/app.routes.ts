import { Routes } from '@angular/router';
import { Dashboard } from './layouts/dashboard/dashboard';
import { Mobile } from './layouts/mobile/mobile';
import { Accueil } from './features/tableau-de-bord/accueil';

import { AccueilCitoyen } from './features/citoyen/accueil/accueil';
import { Carte } from './features/carte/carte';

import { CarteIntervention } from './components/carte-intervention/carte-intervention';

import { GestionAgents } from './features/gestion-agents/gestion-agents';
import { AgentDetail } from './features/agent-detail/agent-detail';
import { Incidents } from './features/incidents/incidents';
import { CarteIncidentsComponent } from './features/carte-incidents/carte-incidents/carte-incidents';
import { DetailIncident } from './features/detail-incident/detail-incident';
import { AccueilComponent as AccueilCitoyen } from './features/citoyen/accueil/accueil';
import { CartesComponent } from './features/citoyen/cartes/cartes';
import { ScanComponent } from './features/citoyen/scan/scan';
import { EnregistrementComponent } from './features/citoyen/enregistrement/enregistrement';
import { ConfirmationComponent } from './features/citoyen/confirmation/confirmation';
import { PageConnexionDash } from './features/page-connexion-dash/page-connexion-dash';

import { Carte as CarteAgent } from './features/agent/carte/carte';
import { Agent } from './features/agent/layouts/agent/agent';
import { AccueilAgent } from './features/agent/accueil/accueil';
import { Interventions } from './features/agent/interventions/interventions';
import { HistoriqueRapport } from './features/agent/historique-rapport/historique-rapport';
import { DetailIntervention } from './features/agent/detail-intervention/detail-intervention';
import { DetailIncident as DetailIncidentAgent } from './features/agent/detail-incident/detail-incident';
import { RapportEnvoye } from './features/agent/rapport-envoye/rapport-envoye';
import { Profil } from './features/agent/profil/profil';
import { guestGuard } from './core/guards/guestGuard';
import { authDashGuard } from './core/guards/auth_dash.guard';


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
    path: 'dash/connexion',
    component: PageConnexionDash,
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate:[authDashGuard],
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
        component: AccueilCitoyen,
      },
      {
        path: 'carte',
        component: CartesComponent,
      },
      {
        path: 'scan',
        component: ScanComponent,
      },
      {
        path: 'enregistrement',
        component: EnregistrementComponent,
      },
      {
        path: 'confirmation',
        component: ConfirmationComponent,
      },

      // routes concernant le profil du citoyen  et le signalement
      {
        path: 'signalements',
        loadComponent: () =>
          import('./features/citoyen/signalements/historique/historique')
            .then(m=> m.Historique)
      },
      {
        path: 'signalements/:id',
        loadComponent: () =>
          import('./features/citoyen/signalements/detail/detail')
            .then(m => m.DetailSignalement) 
      },

      {
        path: 'profil',
        loadComponent: () =>
          import('./features/citoyen/profil/profil')
            .then(m => m.ProfilCitoyen)
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
      path: 'interventions/:id',
      component: DetailIntervention,
    },

    {
      path: 'incidents/:id',
      component: DetailIncidentAgent,
    },

    {
      path: 'historique/:id',
      component: HistoriqueRapport,
    },

    {
      path: 'rapport-envoye/:id',
      component: RapportEnvoye,
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
