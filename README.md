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

# CI/CD et Tests E2E / Valentin
Rôle
Mise en place du pipeline CI/CD avec GitHub Actions et des tests E2E avec Selenium.

Ce qui a été fait
Pipeline CI/CD (.github/workflows/ci.yml)

Création d'un workflow GitHub Actions qui se déclenche automatiquement sur chaque PR et push vers main
Le pipeline installe les dépendances, lance les tests et l'analyse ESLint sur le backend et le frontend
ESLint (.eslintrc.json)

Configuration d'ESLint sur le backend pour analyser la qualité du code
Ajout de la règle varsIgnorePattern: ^_ pour les variables intentionnellement non utilisées
Tests E2E avec Selenium (tests/e2e.test.js)

4 scénarios automatisés testés dans un vrai navigateur Chrome :
TEST 1 : Login avec admin@test.com
TEST 2 : Création d'une tâche avec titre, description et priorité
TEST 3 : Suppression d'une tâche
TEST 4 : Déconnexion
Résultats
[TEST 1] Login avec admin@test.com...
  ✅ PASS - Login réussi, dashboard affiché
[TEST 2] Création d'une tâche...
  ✅ PASS - Tâche créée et visible dans la liste
[TEST 3] Suppression d'une tâche...
  ✅ PASS - Tâche supprimée avec succès
[TEST 4] Déconnexion...
  ✅ PASS - Déconnexion réussie

Résultats : 4 ✅ passés, 0 ❌ échoués

Problèmes rencontrés
1. ESLint non reconnu

Problème : eslint n'est pas reconnu en tant que commande interne
Cause : npm install n'avait pas été lancé, les dépendances étaient absentes
Solution : lancer npm install avant npm run lint
2. Erreur ESLint no-unused-vars sur password

Problème : ESLint signalait password comme inutilisé dans le destructuring { password, ...user }
Cause : la variable est extraite intentionnellement pour être exclue du résultat, pas pour être utilisée
Solution : renommage en _password + ajout de varsIgnorePattern: ^_ dans .eslintrc.json
3. Tests E2E — modal introuvable

Problème : no such element: Unable to locate element: .modal
Cause : le driver.wait(until.elementLocated) cherchait le modal alors qu'il avait déjà disparu entre deux appels, à cause d'un problème de timing avec le rendu React
Solution : suppression du wait redondant, utilisation directe de findElements avec vérification manuelle, et ajout de sleep() pour laisser le temps au navigateur de rendre les composants
4. Commande && non supportée

Problème : cd backend && npm run dev retournait une erreur dans PowerShell
Cause : PowerShell n'accepte pas && comme séparateur de commandes
Solution : utiliser deux commandes séparées ou ; à la place

## Test unitaires Front-End / Badreddine 

✓ src/components/Login.test.jsx (3 tests) 391ms

 Test Files  6 passed (6)
      Tests  23 passed (23)
   Start at  09:12:49
   Duration  12.66s (transform 358ms, setup 2.00s, collect 4.42s, tests 2.18s, environment 10.03s, prepare 1.98s)     

 % Coverage report from v8
------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |   57.57 |    87.69 |   76.19 |   57.57 |                   
 src              |       0 |        0 |       0 |       0 |                   
  App.js          |       0 |        0 |       0 |       0 | 1-34
  index.js        |       0 |        0 |       0 |       0 | 1-11
 src/components   |   86.49 |    93.44 |   94.11 |   86.49 |
  Dashboard.js    |     100 |     87.5 |     100 |     100 | 28
  Login.js        |     100 |      100 |     100 |     100 |
  PrivateRoute.js |     100 |      100 |     100 |     100 |
  Register.js     |     100 |      100 |     100 |     100 |
  TaskCard.js     |       0 |        0 |       0 |       0 | 1-74
  TaskForm.js     |     100 |    90.47 |     100 |     100 | 18,20
  TaskList.js     |     100 |      100 |     100 |     100 |
 src/contexts     |       0 |        0 |       0 |       0 |
  AuthContext.js  |       0 |        0 |       0 |       0 | 1-91
  TaskContext.js  |       0 |        0 |       0 |       0 | 1-109
------------------|---------|----------|---------|---------|-------------------