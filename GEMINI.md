# 🚀 Zizu Facture - Dossier de Passation (Handover Document)

Ce document a été généré pour résumer l'état actuel du projet **Zizu Facture** et servir de point de départ pour tout futur modèle IA ou développeur reprenant le projet.

## 🎯 Ce que l'application fait
**Zizu Facture** est une interface SaaS (Software as a Service) de facturation et de gestion, spécialement conçue pour les entrepreneurs africains. 
L'application permet de gérer des clients, de créer, suivre, modifier et télécharger des factures (TVA 18%, montants en FCFA), et de gérer les paramètres de son entreprise. L'objectif principal de cette première phase était d'établir un **frontend robuste, interactif et esthétiquement premium**, avant de le connecter à une base de données.

---

## ✨ Fonctionnalités implémentées

Toutes les fonctionnalités actuelles reposent sur un système de données locales (`mock-data.ts`) qui simule une persistance des données tant que le navigateur n'est pas rafraîchi manuellement.

1. **Dashboard (Tableau de bord)**
   - Statistiques globales (Chiffre d'affaires, En attente, En retard, Brouillons).
   - Liste des 5 factures les plus récentes avec statuts colorés.
   - Accès rapide à la création de facture.

2. **Gestion des Factures**
   - **Liste** : Affichage paginé avec recherche par nom et filtres par statut.
   - **Création (`/new`)** : Formulaire dynamique avec sélection de client, ajout de lignes illimitées, calcul automatique du sous-total, de la TVA (18%) et du TTC. Sauvegarde simulée avec modale de succès personnalisée.
   - **Détails (`/[id]`)** : Vue complète de la facture, bouton pour changer le statut (ex: de "Envoyée" à "Payée"), impression native au format PDF (`window.print()`), modales personnalisées pour la modification et la suppression.

3. **Gestion des Clients**
   - Liste paginée des clients avec recherche dynamique.
   - Formulaire d'ajout de client complet.
   - Simulation de modification et modale de suppression personnalisée.

4. **Paramètres**
   - Onglets de navigation (Profil, Entreprise, Notifications, Sécurité).
   - Modification des informations de profil et d'entreprise (qui se répercutent dynamiquement sur l'en-tête des nouvelles factures générées).

---

## 📁 Structure des fichiers principale

```text
/
├── app/
│   ├── (app)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx               # Tableau de bord principal
│   │   │   ├── clients/page.tsx       # Gestion des clients
│   │   │   ├── settings/page.tsx      # Paramètres du compte
│   │   │   └── factures/
│   │   │       ├── page.tsx           # Liste des factures
│   │   │       ├── new/page.tsx       # Création de facture
│   │   │       └── [id]/page.tsx      # Détails d'une facture spécifique
│   │   └── layout.tsx                 # Layout avec Sidebar et Header
│   ├── globals.css                    # CSS global et utilitaires Tailwind
│   └── layout.tsx                     # Root layout
├── components/
│   ├── layout/
│   │   ├── header.tsx                 # Barre de navigation supérieure
│   │   └── sidebar.tsx                # Menu de navigation latéral (Desktop & Mobile)
│   └── ui/                            # Composants de base (Boutons, Cartes, Badges)
├── lib/
│   └── mock-data.ts                   # 🧠 Moteur de données simulées de l'application
└── .agents/
    └── AGENTS.md                      # Règles strictes du Design System
```

---

## 🛠️ Technologies utilisées
- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript, React
- **Styling** : Tailwind CSS
- **Icônes** : Lucide React
- **Composants UI** : Base inspirée de Shadcn UI (Boutons, Cartes)

---

## 🎨 Décisions de Design (Design System)
L'interface a été méticuleusement conçue pour offrir une expérience "Premium SaaS" :
- **Aesthetic** : Vibe moderne, claire, avec des touches de "Glassmorphism" (`backdrop-blur`).
- **Couleurs** : Dégradés primaires Indigo/Violet (`bg-gradient-to-r from-indigo-600 to-purple-600`), textes majoritairement `slate-900` et `slate-500`.
- **Formes** : Angles très arrondis (`rounded-2xl` pour les cartes, `rounded-full` pour les boutons primaires et badges).
- **Interactions** : Tous les éléments interactifs ont des micro-animations (`hover:-translate-y-1`, `hover:shadow-xl`, `hover:scale-[1.02]`).
- **Dialogues** : **Aucun `alert()` ou `confirm()` natif du navigateur.** Tous les avertissements et confirmations utilisent des modales personnalisées intégrées dans le DOM pour une UX fluide.

---

## 🤖 Instructions pour un futur modèle IA
Cher collègue IA, si tu reprends ce projet, voici tes priorités :

1. **Règles d'or (CRITIQUE)** : Avant de générer la moindre ligne de code UI, tu DOIS lire et assimiler les règles de design présentes dans `.agents/AGENTS.md`. Ne casse jamais les animations de survol, les arrondis (`2xl` / `full`), ni les ombres douces.
2. **Backend (La prochaine grande étape)** : L'application est prête pour Supabase. Ta mission sera de remplacer la logique de `lib/mock-data.ts` par des appels à une base de données PostgreSQL (Supabase) via des Server Actions de Next.js, et de configurer l'authentification.
3. **Modales** : Ne réintroduis jamais d'alertes natives du navigateur. Utilise des composants modaux basés sur les `Card` existantes avec des overlay fixes `bg-slate-900/50 backdrop-blur-sm`.
4. **Génération PDF** : Actuellement, le téléchargement PDF utilise `window.print()` couplé à la classe CSS `print:hidden` pour cacher l'UI. Si le client souhaite des PDF générés côté serveur, prévois une librairie comme `puppeteer` ou `react-pdf`, mais l'approche actuelle est valide pour le frontend.
5. **Avertissement Environnement** : Si le HMR (Hot Module Replacement) semble cassé, vérifie que l'utilisateur n'a pas plusieurs serveurs `npm run dev` lancés en parallèle, ce qui est souvent arrivé durant le prototypage.
