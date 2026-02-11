# ♔ Échecs Pro ♔

Un jeu d'échecs web complet développé avec React, TypeScript et Vite. Il propose un mode 1 vs 1 local, un adversaire IA avec 5 niveaux de difficulté, un système de chronomètre complet (Bullet, Blitz, Rapide, Classique, Fischer) et une interface moderne avec plusieurs thèmes visuels.
Lien pour visionner la démo [Youtube](https://youtu.be/BWptQdi4AXo)

<img width="765" height="777" alt="image" src="https://github.com/user-attachments/assets/40deecc3-1126-4b47-bb55-d32a67f4bfa2" />


## Fonctionnalités

- **Partie locale 1 vs 1** — jouez contre un ami sur le même écran
- **Mode vs IA** — 5 niveaux de difficulté (Débutant à Expert)
- **Chronomètre complet** — Bullet, Blitz, Rapide, Classique, Fischer (avec incrément)
- **Toutes les règles officielles** — roque, prise en passant, promotion, pat, nulle par répétition
- **Interface moderne** — design sombre, thèmes personnalisables
- **Contrôles intuitifs** — drag & drop et clic pour déplacer les pièces
- **Historique des coups** — notation algébrique en temps réel
- **Annulation** — revenez en arrière à tout moment

<img width="1210" height="680" alt="image" src="https://github.com/user-attachments/assets/10733ddd-b02a-4ca4-b426-d19584614115" />


## Stack technique

- **React 18** + **TypeScript 5** — base solide et typée
- **Vite 5** — build ultra-rapide
- **Tailwind CSS 3** — styles utilitaires avec thème CSS variables
- **Zustand 4** — gestion d'état simple et performante
- **chess.js** — moteur de règles d'échecs
- **react-chessboard** — composant plateau

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Utilisation

1. Choisissez un contrôle du temps (ou "Sans timer")
2. Sélectionnez le niveau IA si vous jouez contre l'ordinateur
3. Cliquez sur **1 vs 1 Local** ou **vs IA** pour démarrer

### Déplacer les pièces

- **Drag & drop** : glissez une pièce vers sa destination
- **Clic** : cliquez sur une pièce, puis sur la case de destination

### Raccourcis clavier

| Touche | Action |
|--------|--------|
| Ctrl+Z | Annuler le dernier coup |
| Ctrl+N | Nouvelle partie |
| Esc    | Retour au menu |

## Thèmes disponibles

Cinq thèmes visuels sont inclus. Pour changer de thème, modifiez l'attribut `data-theme` sur la balise `<html>` :

| Valeur | Description |
|--------|-------------|
| `classic` (défaut) | Plateau bois clair/foncé, accents verts |
| `modern` | Sombre épuré, accents bleus |
| `dark` | Nord dark theme, accents cyan |
| `wood` | Tons bois naturels |
| `marble` | Effet marbre, accents violets |

## Structure du projet

```
src/
├── core/           # Logique pure, sans dépendance React
│   ├── engine/     # Wrapper chess.js + types
│   ├── timer/      # Moteur de chronomètre
│   └── stockfish/  # Gestionnaire IA
├── stores/         # État global (Zustand)
├── components/     # Composants React réutilisables
│   ├── atoms/
│   ├── molecules/  # TimerDisplay, PromotionDialog
│   └── organisms/  # ChessBoard
├── views/          # Pages de l'application
│   ├── Menu/
│   └── Game/
├── utils/          # Fonctions utilitaires
└── styles/         # CSS global et thèmes
```

## Licence

MIT — libre d'utilisation et de modification.

---

Projet open source par [Michaël — lm-code.be](https://lm-code.be)
Lien pour visionner la démo [Youtube](https://youtu.be/BWptQdi4AXo)
