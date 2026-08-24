import {
  AfterViewInit,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';

import * as L from 'leaflet';

import { RouterLink } from '@angular/router';

import { HeaderAgent } from '../components/header-agent/header-agent';

import { AgentIncidentService } from '../../../core/services/agent-incident';

import {
  AgentIncident,
  AgentIncidentUrgence,
} from '../../../core/models/agent-incident';


// ============================================================
// TYPES DES FILTRES
// ============================================================

type FiltreIncident =
  | 'TOUS'
  | 'DECHETS'
  | 'CANAUX'
  | 'VOIRIE'
  | 'ECLAIRAGE_PUBLIC'
  | 'ARBRE'
  | 'FUITE_EAU';


// ============================================================
// COMPOSANT
// ============================================================

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [
    HeaderAgent,
    RouterLink,
  ],
  templateUrl: './carte.html',
  styleUrl: './carte.css',
})
export class Carte implements AfterViewInit, OnDestroy {

  // ============================================================
  // SERVICES
  // ============================================================

  private readonly incidentService =
    inject(AgentIncidentService);


  // ============================================================
  // CARTE LEAFLET
  // ============================================================

  private map!: L.Map;

  private readonly marqueurs =
    L.layerGroup();


  // ============================================================
  // DONNÉES
  // ============================================================

  private incidents: AgentIncident[] = [];

  filtreActif: FiltreIncident = 'TOUS';


  // ============================================================
  // INITIALISATION
  // ============================================================

  ngAfterViewInit(): void {

    this.initialiserCarte();

    this.chargerIncidents();
  }


  // ============================================================
  // NETTOYAGE
  // ============================================================

  ngOnDestroy(): void {

    if (this.map) {
      this.map.remove();
    }
  }


  // ============================================================
  // INITIALISATION LEAFLET
  // ============================================================

  private initialiserCarte(): void {

    this.map = L.map('map', {
      center: [14.7167, -17.4677],
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });


    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors',

        maxZoom: 19,
      }
    ).addTo(this.map);


    this.marqueurs.addTo(this.map);
  }


  // ============================================================
  // CHARGEMENT DES INCIDENTS
  // ============================================================

  private chargerIncidents(): void {

    this.incidentService.getIncidents().subscribe({

      next: (incidents: AgentIncident[]) => {

        console.log(
          'INCIDENTS AGENT POUR LA CARTE :',
          incidents
        );


        this.incidents = incidents;


        this.afficherIncidents();
      },


      error: (error: unknown) => {

        console.error(
          'Erreur lors du chargement des incidents agent :',
          error
        );
      },

    });
  }


  // ============================================================
  // SÉLECTION DU FILTRE
  // ============================================================

  selectionnerFiltre(
    filtre: FiltreIncident
  ): void {

    this.filtreActif = filtre;


    console.log(
      'Filtre sélectionné :',
      this.filtreActif
    );


    this.afficherIncidents();
  }


  // ============================================================
  // AFFICHAGE DES INCIDENTS
  // ============================================================

  private afficherIncidents(): void {

    // Supprime les marqueurs actuellement affichés
    this.marqueurs.clearLayers();


    const incidentsFiltres =
      this.incidents.filter(
        (incident: AgentIncident) => {

          // ----------------------------------------------------
          // Un incident sans coordonnées ne peut pas être
          // affiché géographiquement.
          // ----------------------------------------------------

          if (
            incident.latitude === null ||
            incident.longitude === null
          ) {
            return false;
          }


          // ----------------------------------------------------
          // FILTRE "TOUS"
          // ----------------------------------------------------

          if (
            this.filtreActif === 'TOUS'
          ) {
            return true;
          }


          // ----------------------------------------------------
          // FILTRE PAR TYPE
          // ----------------------------------------------------

          return (
            incident.type ===
            this.filtreActif
          );
        }
      );


    console.log(
      'INCIDENTS AFFICHÉS :',
      incidentsFiltres
    );


    // ----------------------------------------------------------
    // Création des marqueurs
    // ----------------------------------------------------------

    incidentsFiltres.forEach(
      (incident: AgentIncident) => {

        this.ajouterMarqueurIncident(
          incident
        );
      }
    );
  }


  // ============================================================
  // CRÉATION D'UN MARQUEUR INCIDENT
  // ============================================================

  private ajouterMarqueurIncident(
    incident: AgentIncident
  ): void {

    if (
      incident.latitude === null ||
      incident.longitude === null
    ) {
      return;
    }


    // ----------------------------------------------------------
    // Couleur selon le niveau d'urgence
    // ----------------------------------------------------------

    const couleur =
      this.couleurSelonUrgence(
        incident.niveau_urgence
      );


    const icone =
      this.creerIconeMarqueur(
        couleur
      );


    // ----------------------------------------------------------
    // Création du marqueur
    // ----------------------------------------------------------

    const marqueur =
      L.marker(
        [
          incident.latitude,
          incident.longitude,
        ],
        {
          icon: icone,
        }
      );


    // ----------------------------------------------------------
    // Popup
    // ----------------------------------------------------------

    marqueur.bindPopup(`

      <div style="min-width: 180px;">

        <strong>
          ${this.echapperHtml(
            incident.reference
          )}
        </strong>

        <br>

        <span>
          Type :
          ${this.echapperHtml(
            incident.type
          )}
        </span>

        <br>

        <span>
          ${this.echapperHtml(
            incident.description
          )}
        </span>

        <br>

        <strong>
          Urgence :
          ${this.echapperHtml(
            incident.niveau_urgence
          )}
        </strong>

      </div>

    `);


    // ----------------------------------------------------------
    // Ajout à la couche
    // ----------------------------------------------------------

    marqueur.addTo(
      this.marqueurs
    );
  }


  // ============================================================
  // COULEUR SELON L'URGENCE
  // ============================================================

  private couleurSelonUrgence(
    urgence: AgentIncidentUrgence
  ): string {

    switch (urgence) {

      case 'CRITIQUE':
        return '#ef4444';


      case 'ELEVE':
        return '#f97316';


      case 'MODERE':
        return '#eab308';


      case 'ROUTINE':
        return '#004030';


      default:
        return '#6b7280';
    }
  }


  // ============================================================
  // ICÔNE LEAFLET
  // ============================================================

  private creerIconeMarqueur(
    couleur: string
  ): L.DivIcon {

    return L.divIcon({

      className: '',

      html: `

        <div
          style="
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${couleur};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.30);
            box-sizing: border-box;
          "
        >

          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >

            <path
              d="
                M8 1.5
                C5.5 1.5 3.5 3.5 3.5 6
                C3.5 9.2 8 14 8 14
                C8 14 12.5 9.2 12.5 6
                C12.5 3.5 10.5 1.5 8 1.5Z
              "
              fill="white"
            />

            <circle
              cx="8"
              cy="6"
              r="1.8"
              fill="${couleur}"
            />

          </svg>

        </div>

      `,

      iconSize: [
        32,
        32,
      ],

      iconAnchor: [
        16,
        16,
      ],
    });
  }


  // ============================================================
  // ÉCHAPPEMENT HTML
  // ============================================================

  private echapperHtml(
    value: string
  ): string {

    return value
      .replaceAll(
        '&',
        '&amp;'
      )
      .replaceAll(
        '<',
        '&lt;'
      )
      .replaceAll(
        '>',
        '&gt;'
      )
      .replaceAll(
        '"',
        '&quot;'
      )
      .replaceAll(
        "'",
        '&#039;'
      );
  }
}
