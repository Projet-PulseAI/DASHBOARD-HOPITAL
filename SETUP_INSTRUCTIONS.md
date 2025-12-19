# 🎯 INSTRUCTIONS DE MISE EN PLACE - PULSEAI DASHBOARD

## ⚡ DÉMARRAGE IMMÉDIAT (5 minutes)

### Étape 1️⃣ : Installer les dépendances

```bash
cd /home/light667/ai4y-delta-lom25/dashboard-react
npm install
```

**Temps estimé** : 2-3 minutes

---

### Étape 2️⃣ : Configurer Supabase

#### A. Exécuter le schéma SQL

Votre projet Supabase existe déjà : `https://fedjjdspntrxaqfzflao.supabase.co`

1. Ouvrez [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Allez dans **SQL Editor** (icône de base de données)
4. Cliquez sur **New query**
5. Copiez **TOUT** le contenu du fichier :
   ```
   /home/light667/ai4y-delta-lom25/dashboard-react/supabase/schema.sql
   ```
6. Collez dans l'éditeur
7. Cliquez sur **Run** (ou Ctrl+Enter)
8. Attendez ~10 secondes
9. Vérifiez qu'il affiche **"Success. No rows returned"**

#### B. Vérifier les tables créées

1. Allez dans **Table Editor** (icône de tableau)
2. Vous devriez voir :
   - ✅ `hospitals`
   - ✅ `hospital_resources`
   - ✅ `hospital_services`
   - ✅ `service_history`

Si vous les voyez, **c'est bon** ! ✅

**Temps estimé** : 1-2 minutes

---

### Étape 3️⃣ : Lancer l'application

```bash
npm run dev
```

Vous devriez voir :

```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Temps estimé** : 10 secondes

---

### Étape 4️⃣ : Tester l'inscription

1. Ouvrez votre navigateur sur `http://localhost:3000`
2. Vous serez redirigé vers `/login`
3. Cliquez sur **"Créer un compte"**
4. Remplissez le formulaire :

**Exemple de données de test** :

```
Email : hopital.test@pulseai.cm
Mot de passe : Test1234
Confirmer : Test1234

Nom de l'hôpital : Centre Hospitalier de Test
Type : Public
Niveau : Secondaire
Téléphone : +237 600 00 00 00
Adresse : Rue de la Santé, Quartier Central, Yaoundé

Cliquez sur "Détecter ma position automatiquement"
OU entrez manuellement :
Latitude : 3.848
Longitude : 11.502

Contact : Dr. Test Médecin

Services offerts : Cochez au moins :
- Urgences
- Consultation Générale
- Maternité
```

5. Cliquez sur **"S'inscrire"**
6. Si tout va bien, vous serez redirigé vers le dashboard ! 🎉

---

## ✅ VÉRIFICATIONS

### Si l'inscription fonctionne

Vous devriez voir :
- ✅ Un message de succès
- ✅ Redirection vers `/dashboard`
- ✅ Le nom de votre hôpital en haut
- ✅ Les onglets de navigation

**Félicitations, ça marche ! 🎊**

### Si erreur "Email already registered"

C'est normal ! Cet email existe déjà. Utilisez-en un autre ou essayez de vous connecter.

### Si erreur de connexion Supabase

Vérifiez :
1. Le fichier `.env` existe et contient les bonnes valeurs
2. Le schéma SQL a bien été exécuté
3. Vous êtes connecté à Internet

---

## 🧪 TEST COMPLET DES FONCTIONNALITÉS

Une fois connecté, testez :

### 1️⃣ Onglet "Ressources"

1. Cliquez sur l'onglet **"Ressources"**
2. Remplissez :
   - Lits totaux : 100
   - Lits disponibles : 45
   - Médecins totaux : 15
   - Médecins disponibles : 8
   - Personnel de garde : 12
3. Cliquez sur **"Mettre à jour les ressources"**
4. Vous devriez voir :
   - ✅ Message de succès
   - ✅ Statistiques mises à jour

### 2️⃣ Onglet "Services"

1. Cliquez sur l'onglet **"Services"**
2. Vous voyez vos services (ex: Urgences, Maternité)
3. Cliquez sur **"Mettre à jour"** sur un service
4. Remplissez :
   - File d'attente : 12
   - Temps d'attente moyen : 30
   - Temps max : 60
   - Capacité : 20
   - Statut : Occupé
5. Cliquez sur **"Enregistrer"**
6. Le service se met à jour ! ✅

### 3️⃣ Onglet "Analytics"

1. Cliquez sur l'onglet **"Analytics"**
2. Au début, pas de graphiques (données insuffisantes)
3. Retournez sur **"Ressources"**
4. Changez les valeurs et enregistrez plusieurs fois
5. Retournez sur **"Analytics"**
6. Vous devriez voir les graphiques ! 📊

### 4️⃣ Onglet "Informations"

1. Cliquez sur l'onglet **"Informations"**
2. Voyez toutes vos infos
3. Cliquez sur **"Modifier les informations"**
4. Changez quelque chose (ex: téléphone)
5. Cliquez sur **"Enregistrer"**
6. Changement enregistré ! ✅

---

## 🗄️ VÉRIFIER LES DONNÉES DANS SUPABASE

### Dans Table Editor

1. Allez dans **Table Editor**
2. Sélectionnez la table `hospitals`
3. Vous devriez voir votre hôpital
4. Sélectionnez `hospital_resources`
5. Vous voyez vos mises à jour de ressources (historisées !)
6. Sélectionnez `hospital_services`
7. Vous voyez vos services avec leurs statuts

**C'est magique, tout est sauvegardé automatiquement !** ✨

---

## 🚀 BUILD POUR PRODUCTION

Si tout fonctionne bien en dev :

```bash
npm run build
```

Cela créera un dossier `dist/` prêt pour la production.

**Temps estimé** : 30 secondes

---

## 📦 DÉPLOYER SUR VERCEL

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel

# Suivez les instructions
# Puis déployez en production
vercel --prod
```

N'oubliez pas d'ajouter les variables d'environnement sur Vercel !

---

## ❓ PROBLÈMES COURANTS

### "Module not found"

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### "Supabase connection error"

Vérifiez `.env` :
```bash
cat .env
```

Les valeurs doivent commencer par `VITE_`

### "Table does not exist"

Retournez dans Supabase SQL Editor et réexécutez le schéma.

### Port 3000 déjà utilisé

```bash
# Utilisez un autre port
npm run dev -- --port 3001
```

---

## 📞 AIDE

### Logs utiles

**Console navigateur** (F12) :
```
Regardez l'onglet "Console" pour les erreurs
```

**Logs Supabase** :
```
Dans Supabase : Allez dans "Logs" → "API"
```

**Vérifier les policies** :
```sql
-- Dans SQL Editor
SELECT * FROM pg_policies;
```

---

## ✅ CHECKLIST FINALE

Avant de considérer que tout fonctionne :

- [ ] `npm install` sans erreur
- [ ] Schéma SQL exécuté dans Supabase
- [ ] Tables visibles dans Table Editor
- [ ] `npm run dev` démarre sans erreur
- [ ] Page de login accessible
- [ ] Inscription d'un hôpital fonctionne
- [ ] Redirection vers dashboard
- [ ] Mise à jour des ressources fonctionne
- [ ] Mise à jour des services fonctionne
- [ ] Graphiques s'affichent (après plusieurs mises à jour)
- [ ] Données visibles dans Supabase Table Editor

---

## 🎉 FÉLICITATIONS !

Si toutes les étapes fonctionnent, vous avez :

✅ Un dashboard hospitalier complet et fonctionnel
✅ Une base de données sécurisée et structurée
✅ Une interface moderne et responsive
✅ Un système d'analytics avec historique
✅ Prêt pour la production !

**Votre Dashboard PulseAI est opérationnel ! 🚀🏥**

---

## 📚 DOCUMENTATION COMPLÈTE

Pour aller plus loin :

- `README.md` - Documentation technique complète
- `DEPLOYMENT.md` - Guide de déploiement détaillé
- `QUICK_START.md` - Guide de démarrage rapide
- `PROJECT_SUMMARY.md` - Synthèse du projet

**Bon développement ! 💪**
