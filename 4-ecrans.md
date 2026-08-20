# 4 Écrans — Parcours Citoyen (Binetou)

> Document de suivi personnel. Mis à jour au fur et à mesure de l'avancement.
> Les écrans gérés par le coéquipier (accueil, carte, notifications) ne sont **pas** couverts ici.

---

## Vue d'ensemble

| # | Écran | Route | Composant | Fichiers | Statut |
|---|-------|-------|-----------|----------|--------|
| 1 | Historique des signalements | `/mobile/signalements` | `Historique` | `features/citoyen/signalements/historique/` | ✅ Terminé |
| 2 | Détail d'un signalement | `/mobile/signalements/:id` | `DetailSignalement` | `features/citoyen/signalements/detail/` | ✅ Terminé |
| 3 | Création d'un signalement | `/mobile/creation-signalement` | `Creation` | `features/citoyen/signalements/creation/` | 🔲 À faire |
| 4 | Profil citoyen | `/mobile/profil` | `Profil` | `features/citoyen/profil/` | 🔲 À faire |

---

## Infrastructure partagée (déjà en place)

### Modèle — `core/models/signalement.ts`

Types et interfaces utilisés par tous les 4 écrans :

```
TypeSignalement   → 'depot_sauvage' | 'ordures_menageres' | 'dechets_plastiques' | 'egouts_bouches' | 'autre'
UrgenceSignalement → 'critique' | 'modere' | 'leger'
StatutSignalement  → 'nouveau' | 'en_cours' | 'resolu'

Signalement (interface complète)
  - id, type, urgence, statut
  - titre, description?
  - adresse, latitude?, longitude?
  - photoUrl?
  - signalePar, dateCreation, dateMiseAJour?
  - agentId?

CreerSignalementPayload (envoyé au POST backend)
  - tout sauf : id, statut, dateCreation, dateMiseAJour, agentId
```

### Service — `core/services/signalement.service.ts`

Store central basé sur `signal`. Toutes les méthodes sont prêtes à basculer sur le vrai backend.

| Méthode | Mock actif | Endpoint backend (TODO) |
|---------|-----------|------------------------|
| `charger()` | ✅ 4 signalements mockés | `GET /api/signalements/` |
| `getById(id)` | ✅ cherche dans le cache | `GET /api/signalements/:id/` |
| `creer(payload)` | ✅ id temporaire `Date.now()` | `POST /api/signalements/` |
| `mettreAJourStatut(id, statut)` | ✅ maj local | `PATCH /api/signalements/:id/` |
| `supprimer(id)` | ✅ retire du signal | `DELETE /api/signalements/:id/` |

**Computed exposés en readonly :**
- `signalements` — liste complète
- `nouveaux` — filtre statut `nouveau`
- `enCours` — filtre statut `en_cours`
- `resolus` — filtre statut `resolu`

**Pour passer au vrai backend**, dans chaque méthode du service :
1. Décommenter le bloc `// TODO BACKEND`
2. Supprimer le bloc `// ── MOCK ──`
3. Supprimer `const MOCK_SIGNALEMENTS` en haut du fichier

---

## Écran 1 — Historique des signalements ✅

**Fichiers**
- `features/citoyen/signalements/historique/historique.ts`
- `features/citoyen/signalements/historique/historique.html`
- `features/citoyen/signalements/historique/historique.css`

**Route** : `/mobile/signalements`
**Chargement** : `loadComponent` (lazy)

### Ce qui est fait

**Composant `Historique`**
- Injection de `SignalementService` via `inject()`
- Signal `tous` → liste brute chargée via `charger()` au `ngOnInit`
- Signal `filtre` → filtre actif parmi `{ tous, nouveau, en_cours, resolu }`, mis à jour via `setFiltre()`
- `computed` `resultats` → liste filtrée automatiquement à chaque changement de `tous` ou `filtre`
- Pas de barre de recherche (absente de la maquette)

**Template — fidèle à la maquette**
- Fond global vert `#1B5E3B` sur toute la page
- En-tête : flèche retour à gauche + titre "Historique des Signalements" centré
- Filtres pill : **Tous / Nouveaux / En cours / Résolus** (ordre maquette)
  - Actif → fond blanc, texte vert
  - Inactif → transparent, bordure blanche, texte blanc
- Cartes blanches avec pour chaque signalement :
  - Icône SVG selon le **type** dans un cercle gris (poubelle, goutte d'eau, ampoule, plante)
  - Titre en gras + adresse + date relative (`getDateRelative`)
  - Badge statut à droite : Nouveau = orange vif, En cours = vert clair, Résolu = vert foncé (texte blanc)
  - Lien `routerLink` vers `/mobile/signalements/:id`
- État vide : icône loupe blanche + texte

**Helpers**
- `getStatutClasses(statut)` → classes Tailwind du badge (orange / vert clair / vert foncé)
- `getStatutLabel(statut)` → libellé français du statut
- `getDateRelative(dateIso)` → "Aujourd'hui" / "Hier" / "5 Octobre"

---

## Écran 2 — Détail d'un signalement ✅

**Fichiers**
- `features/citoyen/signalements/detail/detail.ts`
- `features/citoyen/signalements/detail/detail.html`
- `features/citoyen/signalements/detail/detail.css`

**Route** : `/mobile/signalements/:id`
**Chargement** : `loadComponent` (lazy)

### Ce qui est fait

**Composant `DetailSignalement`**
- Injection de `ActivatedRoute` et `SignalementService` via `inject()`
- Signal `incident` → signalement courant (`Signalement | null`)
- Signal `chargement` → booléen pour le spinner
- `ngOnInit` : lit l'id depuis `route.snapshot.paramMap`, appelle `getById(id)`, alimente les signals
- Timeline supprimée (absente de la maquette)

**Template — fidèle à la maquette**
- Spinner pendant le chargement
- **Photo pleine largeur** en haut (h-56), placeholder SVG si pas de photo
- **Bouton retour** circulaire blanc/flou flottant sur la photo (haut gauche) → `/mobile/signalements`
- **Badge statut overlay** sur la photo (haut droite) avec icône check
  - Nouveau = orange | En cours = vert clair | Résolu = vert foncé
- **Titre** précédé de l'icône SVG du type dans un cercle vert clair (inline via `getTypeIconSvg`)
- **Badge urgence** pill : rouge + icône flamme + texte "CRITIQUE" en majuscules + label "Niveau d'urgence" en vert
- **Géolocalisation GPS** : icône pin vert + label vert + adresse en gras
- **Séparateur pointillé**
- **Section description** dans carte blanche : icône flocon + label "Description" + texte en italique
- **État 404** : message "Signalement introuvable" + lien retour

**Helpers**
- `getStatutClasses(statut)` → badge overlay orange / vert clair / vert foncé
- `getStatutLabel(statut)` → libellé français
- `getUrgenceClasses(urgence)` → rouge / orange / vert clair
- `getUrgenceLabel(urgence)` → "CRITIQUE" / "MODÉRÉ" / "LÉGER" (majuscules)
- `getTypeIconSvg(type)` → SVG inline selon le type (poubelle / goutte / ampoule / plante / point d'exclamation)

---

## Écran 3 — Création d'un signalement 🔲

**Fichiers**
- `features/citoyen/signalements/creation/creation.ts` ← squelette vide (`Creation {}`)
- `features/citoyen/signalements/creation/creation.html` ← `<p>creation works!</p>`

**Route à brancher** : `/mobile/creation-signalement`
*(route commentée dans `app.routes.ts`, à décommenter)*

### À implémenter

- Formulaire en plusieurs étapes (ou page unique) pour saisir :
  - Type de signalement (sélecteur)
  - Niveau d'urgence
  - Titre / description
  - Adresse (saisie texte + géolocalisation optionnelle)
  - Photo (upload ou caméra)
- Appel `signalementService.creer(payload)` à la soumission
- Redirection vers `/mobile/signalements` après succès
- Gestion des erreurs et état d'envoi (spinner)

---

## Écran 4 — Profil citoyen 🔲

**Fichiers**
- `features/citoyen/profil/profil.ts` ← squelette vide (`Profil {}`)
- `features/citoyen/profil/profil.html` ← `<p>profil works!</p>`

**Route** : `/mobile/profil`
*(route déjà déclarée dans `app.routes.ts` via `loadComponent`)*

### État actuel

Composant vide généré par Angular CLI. Aucune logique ni template.

### À implémenter

- Affichage des informations du citoyen connecté (nom, email, téléphone, quartier)
  → utiliser le modèle `Utilisateur` existant dans `core/models/utilisateur.ts`
- Possibilité de modifier ses informations (formulaire éditable)
- Résumé rapide de l'activité : nombre de signalements (total / en cours / résolus)
  → s'appuyer sur les `computed` du `SignalementService` (`nouveaux`, `enCours`, `resolus`)
- Bouton de déconnexion → appel `auth.deconnecter()` du service `Auth`
- Gestion de la photo de profil (optionnel selon maquette)

### Notes

Le modèle `Utilisateur` est dans `core/models/utilisateur.ts` :
```ts
{ id, nomComplet, email, telephone?, quartier?, role }
```
Il faudra probablement créer un `ProfilService` (ou étendre `Auth`) pour charger et mettre à jour les infos du citoyen connecté, en suivant le même pattern que `SignalementService`.

---

## Conventions du projet à respecter

| Élément | Convention |
|---------|-----------|
| State | Signals Angular (`signal`, `computed`) — pas de `BehaviorSubject` |
| Injection | `inject()` — pas de constructeur |
| `standalone` | Ne pas mettre `standalone: true` (Angular 22) |
| Lazy loading | `loadComponent` dans les routes |
| HTTP | Passer par le service `Api` (`core/services/api.ts`) |
| Couleur principale | `#1B5E3B` (vert And-Setal) |
| Style | Tailwind CSS uniquement |
| Modèles | `core/models/` |
| Services | `core/services/` |

---

## Routes concernées dans `app.routes.ts`

```ts
// ✅ Déjà actives
{ path: 'signalements',     loadComponent: () => import('...historique').then(m => m.Historique) }
{ path: 'signalements/:id', loadComponent: () => import('...detail').then(m => m.DetailSignalement) }
{ path: 'profil',           loadComponent: () => import('...citoyen/profil/profil').then(m => m.Profil) }

// 🔲 À décommenter
{ path: 'creation-signalement', loadComponent: () => import('...creation').then(m => m.Creation) }
```
