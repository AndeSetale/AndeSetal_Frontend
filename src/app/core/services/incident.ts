import { Injectable, computed, signal } from '@angular/core';

import { Incident } from '../models/incident';

@Injectable({
    providedIn: 'root',
})
export class IncidentService {

    /**
     * Source locale des incidents.
     *
     * Pour le moment les données sont statiques.
     * Plus tard, cette source sera remplacée par les données
     * provenant du backend via HttpClient.
     */
    private readonly incidentsSignal = signal<Incident[]>([
        {
            id: 1,

            titre: 'Dépôt Sauvage Illégal',

            description:
                'Accumulation importante de déchets ménagers et de débris sur la voie publique. Présence de matières organiques et plastiques nécessitant une intervention rapide pour éviter la prolifération.',

            categorie: 'Dépôt sauvage',

            adresse: 'Rue 10, Médina, Dakar',

            image: 'https://placehold.co/370x200',

            priorite: 'critique',

            confianceIA: 94,

            latitude: 14.6937,

            longitude: -17.4441,

            dateCreation: new Date().toISOString(),

            iaAnalyse: true,
        },
    ]);


    /**
     * Liste complète des incidents.
     */
    readonly incidents =
        this.incidentsSignal.asReadonly();


    /**
     * Incidents critiques.
     */
    readonly incidentsCritiques = computed(() =>
        this.incidentsSignal().filter(
            incident => incident.priorite === 'critique'
        )
    );

    /**
     * Recherche un incident par son ID.
     *
     * Pour le moment :
     * recherche dans la source locale.
     *
     * TODO BACKEND :
     * Cette méthode pourra conserver la même responsabilité
     * mais les données pourront provenir de l'API Django.
     */
    getById(
        id: number | string
    ): Incident | undefined {

        return this.incidentsSignal().find(
            incident =>
                String(incident.id) === String(id)
        );
    }


    /**
     * Recherche les incidents d'une priorité donnée.
     *
     * Pour le moment :
     * recherche dans la source locale.
     *
     * TODO BACKEND :
     * Cette logique pourra être remplacée par une requête
     * vers l'API Django avec un filtre de priorité.
     */
    getByPriorite(
        priorite: Incident['priorite']
    ): Incident[] {

        return this.incidentsSignal().filter(
            incident =>
                incident.priorite === priorite
        );
    }


    /**
     * Recherche les incidents d'une catégorie donnée.
     *
     * Pour le moment :
     * recherche dans la source locale.
     *
     * TODO BACKEND :
     * Cette logique pourra être remplacée par une requête
     * vers l'API Django avec un filtre de catégorie.
     */
    getByCategorie(
        categorie: string
    ): Incident[] {

        return this.incidentsSignal().filter(
            incident =>
                incident.categorie === categorie
        );
    }

}
