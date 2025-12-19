# Guide de Déploiement - PulseAI Dashboard

Ce guide vous accompagne pas à pas dans le déploiement du Dashboard PulseAI.

## 📋 Checklist pré-déploiement

- [ ] Projet Supabase créé
- [ ] Schéma de base de données exécuté
- [ ] Variables d'environnement configurées
- [ ] Application testée localement
- [ ] Build de production testé

## 🗄️ 1. Configuration Supabase

### Créer le projet

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "New Project"
3. Remplissez :
   - **Project name** : pulseai-dashboard
   - **Database password** : (générez un mot de passe fort)
   - **Region** : choisissez la plus proche (EU Central recommandé)
4. Cliquez sur "Create new project"
5. Attendez 2-3 minutes la création

### Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Ouvrez le fichier `supabase/schema.sql`
4. Copiez tout le contenu
5. Collez dans l'éditeur SQL
6. Cliquez sur **Run**
7. Vérifiez qu'il n'y a pas d'erreur (devrait afficher "Success")

### Vérifier les tables

1. Allez dans **Table Editor**
2. Vous devriez voir :
   - `hospitals`
   - `hospital_resources`
   - `hospital_services`
   - `service_history`

### Récupérer les clés

1. Allez dans **Settings** → **API**
2. Notez :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** key : `eyJhbG...`

## 🚀 2. Déploiement sur Vercel (Recommandé)

### Installation

```bash
npm install -g vercel
```

### Configuration

1. Dans le dossier `dashboard-react`, exécutez :

```bash
vercel
```

2. Répondez aux questions :
   - Set up and deploy? **Y**
   - Which scope? Choisissez votre compte
   - Link to existing project? **N**
   - Project name? **pulseai-dashboard**
   - In which directory? **./**
   - Want to override settings? **N**

### Variables d'environnement

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet **pulseai-dashboard**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez :

```
VITE_SUPABASE_URL = https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY = votre_anon_key
```

5. Cliquez sur **Save**

### Redéployer

```bash
vercel --prod
```

Votre dashboard est maintenant live ! 🎉

## 🌐 3. Déploiement sur Netlify

### Via l'interface web

1. Buildez localement :

```bash
npm run build
```

2. Allez sur [netlify.com](https://netlify.com)
3. Glissez-déposez le dossier `dist/`
4. Une fois déployé, allez dans **Site settings** → **Environment variables**
5. Ajoutez :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Redéployez

### Via CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## 🐳 4. Déploiement avec Docker

### Créer le Dockerfile

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build et run

```bash
docker build -t pulseai-dashboard \
  --build-arg VITE_SUPABASE_URL=https://votre-projet.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=votre_key \
  .

docker run -p 80:80 pulseai-dashboard
```

## 🔒 5. Sécurité

### Vérifier RLS

1. Dans Supabase, allez dans **Authentication** → **Policies**
2. Vérifiez que toutes les tables ont des policies
3. Testez avec un compte test

### HTTPS

- Vercel et Netlify fournissent HTTPS automatiquement
- Pour un serveur custom, utilisez Let's Encrypt

### CORS

Si vous utilisez un domaine custom, configurez CORS dans Supabase :

1. **Settings** → **API**
2. **CORS Allowed Origins**
3. Ajoutez votre domaine

## 🧪 6. Tests post-déploiement

### Checklist

- [ ] L'inscription fonctionne
- [ ] La connexion fonctionne
- [ ] Les ressources se mettent à jour
- [ ] Les services se gèrent correctement
- [ ] Les graphiques s'affichent
- [ ] Responsive sur mobile
- [ ] Pas d'erreurs dans la console

### Test de charge

```bash
# Optionnel : tester avec Apache Bench
ab -n 100 -c 10 https://votre-dashboard.vercel.app/
```

## 📊 7. Monitoring

### Supabase

1. **Dashboard** → **Reports**
2. Surveillez :
   - Database size
   - API requests
   - Active users

### Vercel/Netlify

1. **Analytics**
2. Surveillez :
   - Visites
   - Performance
   - Erreurs

## 🔄 8. Mises à jour

### Déploiement continu

1. Connectez votre repo GitHub
2. Chaque push déploie automatiquement
3. Configurez les branches (main = production)

### Rollback

```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

## 🆘 9. Dépannage

### Build échoue

- Vérifiez les variables d'environnement
- Vérifiez `npm run build` localement
- Consultez les logs de build

### Erreur 404

- Vérifiez la configuration du routeur
- Pour Vercel/Netlify, créez `vercel.json` :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Données ne chargent pas

- Vérifiez les variables d'environnement
- Vérifiez les policies Supabase
- Consultez la console navigateur

## 📞 Support

Pour toute question, contactez l'équipe PulseAI.

---

**Félicitations !** Votre Dashboard PulseAI est maintenant en production ! 🎉
