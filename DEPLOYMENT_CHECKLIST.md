# ✅ CHECKLIST DE DÉPLOIEMENT - PULSEAI DASHBOARD

## 🎯 État actuel : PRÊT POUR LE DÉPLOIEMENT

---

## ✅ VÉRIFICATIONS PRÉ-DÉPLOIEMENT

### 1. Structure du projet
- [x] Fichiers React créés et structurés
- [x] Package.json configuré
- [x] Vite config OK
- [x] .gitignore configuré
- [x] Variables d'environnement configurées

### 2. Code source
- [x] Aucune erreur détectée
- [x] Tous les composants créés
- [x] Services API implémentés
- [x] Contexte d'authentification OK
- [x] Routing configuré

### 3. Configuration Supabase
- [x] Schéma SQL créé et mis à jour
- [x] Variables d'environnement présentes
- [x] Client Supabase configuré
- [x] RLS policies dans le schéma

### 4. Build
- [x] Script de build configuré (`npm run build`)
- [x] Configuration Vite OK
- [x] Fichiers de déploiement créés

---

## 🚀 ÉTAPES DE DÉPLOIEMENT

### OPTION 1 : Vercel (Recommandé - Le plus simple)

#### Étape 1 : Préparer le projet
```bash
cd /home/light667/ai4y-delta-lom25/dashboard-react
```

#### Étape 2 : Installer Vercel CLI
```bash
npm install -g vercel
```

#### Étape 3 : Se connecter à Vercel
```bash
vercel login
```

#### Étape 4 : Déployer
```bash
vercel
```

Suivez les instructions :
- Setup and deploy? **Y**
- Which scope? **Votre compte**
- Link to existing project? **N**
- Project name? **pulseai-dashboard**
- In which directory? **./**
- Want to override settings? **N**

#### Étape 5 : Configurer les variables d'environnement

Sur https://vercel.com :
1. Allez dans votre projet
2. Settings → Environment Variables
3. Ajoutez :
   - `VITE_SUPABASE_URL` = `https://fedjjdspntrxaqfzflao.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlZGpqZHNwbnRyeGFxZnpmbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMTEwNjMsImV4cCI6MjA4MDY4NzA2M30.YQBiYiyTQuUqgnT8SHfyIm0W87g6U7ROAczRtrikR5M`

#### Étape 6 : Redéployer avec les variables
```bash
vercel --prod
```

**✅ C'est fait ! Votre dashboard est en ligne !**

---

### OPTION 2 : Netlify

#### Étape 1 : Build local
```bash
cd /home/light667/ai4y-delta-lom25/dashboard-react
npm install
npm run build
```

#### Étape 2 : Déployer sur Netlify

**Via l'interface web :**
1. Allez sur https://netlify.com
2. Glissez-déposez le dossier `dist/`
3. Une fois déployé :
   - Site settings → Environment variables
   - Ajoutez les mêmes variables que pour Vercel
4. Redéployez

**Via CLI :**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

### OPTION 3 : Firebase Hosting

#### Étape 1 : Installer Firebase CLI
```bash
npm install -g firebase-tools
```

#### Étape 2 : Se connecter
```bash
firebase login
```

#### Étape 3 : Initialiser Firebase
```bash
cd /home/light667/ai4y-delta-lom25/dashboard-react
firebase init hosting
```

Répondez :
- Use existing project? **Y**
- Select project: **Votre projet Firebase**
- Public directory? **dist**
- Configure as SPA? **Y**
- Set up automatic builds? **N**

#### Étape 4 : Créer le fichier de config des variables

Créez `.env.production` :
```env
VITE_SUPABASE_URL=https://fedjjdspntrxaqfzflao.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlZGpqZHNwbnRyeGFxZnpmbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMTEwNjMsImV4cCI6MjA4MDY4NzA2M30.YQBiYiyTQuUqgnT8SHfyIm0W87g6U7ROAczRtrikR5M
```

#### Étape 5 : Build et déployer
```bash
npm run build
firebase deploy --only hosting
```

**✅ Votre dashboard est en ligne sur Firebase !**

---

## 🗄️ CONFIGURATION SUPABASE (OBLIGATOIRE)

### Étape 1 : Exécuter le schéma SQL

1. Allez sur https://supabase.com
2. Connectez-vous à votre projet
3. SQL Editor → New query
4. Copiez **TOUT** le contenu de :
   ```
   /home/light667/ai4y-delta-lom25/dashboard-react/supabase/schema.sql
   ```
5. Collez et cliquez sur **RUN**
6. Attendez ~10 secondes
7. Vérifiez : "Success. No rows returned"

### Étape 2 : Vérifier les tables

Dans Table Editor, vous devriez voir :
- ✅ hospitals
- ✅ hospital_resources
- ✅ hospital_services
- ✅ service_history

### Étape 3 : Vérifier les policies RLS

Dans Authentication → Policies, vérifiez que les policies sont actives.

---

## 🧪 TESTS POST-DÉPLOIEMENT

### 1. Test d'accès
- [ ] Le site charge sans erreur
- [ ] Pas d'erreur dans la console (F12)
- [ ] Redirection vers /login fonctionne

### 2. Test d'inscription
- [ ] Formulaire d'inscription accessible
- [ ] Géolocalisation fonctionne
- [ ] Inscription réussie
- [ ] Redirection vers dashboard

### 3. Test de connexion
- [ ] Connexion avec compte créé
- [ ] Session maintenue
- [ ] Dashboard s'affiche

### 4. Test des fonctionnalités
- [ ] Mise à jour des ressources
- [ ] Mise à jour des services
- [ ] Graphiques s'affichent
- [ ] Modification des infos hôpital

### 5. Test responsive
- [ ] Fonctionne sur mobile
- [ ] Fonctionne sur tablette
- [ ] Fonctionne sur desktop

---

## 🔧 COMMANDES UTILES

### Build local
```bash
cd /home/light667/ai4y-delta-lom25/dashboard-react
npm install
npm run build
```

### Prévisualiser le build
```bash
npm run preview
```

### Vérifier les erreurs
```bash
npm run lint
```

---

## ⚠️ POINTS IMPORTANTS

### Variables d'environnement
- **Toujours** configurer les variables d'environnement sur la plateforme de déploiement
- Ne **jamais** commiter le fichier `.env`
- Utilisez `.env.example` comme référence

### CORS Supabase
Si vous avez des erreurs CORS :
1. Supabase → Settings → API
2. CORS Allowed Origins
3. Ajoutez votre domaine de déploiement

### HTTPS
- Vercel et Netlify fournissent HTTPS automatiquement
- Firebase Hosting aussi
- **Obligatoire** pour la géolocalisation

---

## 📊 MONITORING

### Vercel
- Dashboard → Analytics
- Surveillez les visites et erreurs

### Netlify
- Site → Analytics
- Logs en temps réel

### Firebase
- Console Firebase → Hosting
- Trafic et performance

### Supabase
- Dashboard → Reports
- Database size
- API requests
- Active users

---

## 🐛 DÉPANNAGE

### Build échoue
```bash
# Nettoyer et réinstaller
rm -rf node_modules dist
rm package-lock.json
npm install
npm run build
```

### Erreur "Module not found"
```bash
# Vérifier les imports
npm run lint
```

### Erreur de connexion Supabase
1. Vérifier les variables d'environnement
2. Vérifier que le schéma SQL est exécuté
3. Vérifier les policies RLS

### Page blanche après déploiement
1. Vérifier la console navigateur (F12)
2. Vérifier que vercel.json ou netlify.toml est présent
3. Vérifier les variables d'environnement

---

## ✅ CHECKLIST FINALE

Avant de considérer le déploiement réussi :

- [ ] Build local fonctionne (`npm run build`)
- [ ] Schéma SQL exécuté dans Supabase
- [ ] Tables visibles dans Table Editor
- [ ] Application déployée sur plateforme
- [ ] Variables d'environnement configurées
- [ ] Site accessible via URL
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Dashboard fonctionne
- [ ] Ressources se mettent à jour
- [ ] Services se gèrent
- [ ] Analytics s'affichent
- [ ] Responsive OK
- [ ] HTTPS activé

---

## 🎉 RÉSULTAT ATTENDU

Une fois déployé, vous aurez :

✅ Un dashboard en ligne accessible 24/7
✅ URL publique (ex: pulseai-dashboard.vercel.app)
✅ HTTPS automatique
✅ Connexion sécurisée à Supabase
✅ Interface responsive
✅ Données temps réel
✅ Prêt pour les hôpitaux partenaires

---

## 📞 SUPPORT

En cas de problème :
1. Vérifiez cette checklist
2. Consultez les logs de la plateforme
3. Vérifiez la console navigateur
4. Vérifiez les logs Supabase

---

**Votre Dashboard PulseAI est prêt pour le déploiement ! 🚀**

**Recommandation** : Commencez avec Vercel (le plus simple)
