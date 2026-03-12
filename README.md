# PROJET d'Application de gestion de tâches

# Outil utilisé

- Frontend : React
- Backend : Node.js / Express
- Tests : Jest, Supertest, Selenium
- CI/CD : GitHub Actions
- Qualité : ESLint

# Choix du GitHub Flow

Nous avons décidé d'utiliser le GitHub Flow pour notre projet comme ça nous aurons une branche principale comme prod (main), et d'autres branches comme la branch develop pour travailler sur les autres fonctionnalités avant de les ajouter.

# Règles d'ajout

Une fois une nouvelle fonctionnalité ajouté une Pull Request est ouverte sur GitHub, comme ça une autre personne peut lire le code avant de le valider.

Pour la protection des branches, nous avons interdis les push direct sans Pull Request (Require a pull request before merging, dans les paramètre GITHUB). Pour toute fusion, les tests doivent réussir avant (Require status checks to pass before merging, dans les paramètres GITHUB).

Organisation de l'équipe :

    - Chef de Projet GITHUB / Théo
    - Backend & Tests d'intégration / Maxime
    - Frontend & Tests unitaires / Badreddine
    - DevOps CI-CD & Tests E2E / Valentin

