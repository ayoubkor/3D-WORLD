# 🎨 Print3D Shop - E-commerce d'Impression 3D

Un site e-commerce complet, moderne et bilingue (Français/Arabe) pour la vente de produits d'impression 3D, avec un design inspiré de l'univers anime en dark mode.

## 🚀 Stack Technique

- **Frontend** : Next.js 15 (React), Tailwind CSS, Framer Motion, Lucide React.
- **Backend** : Node.js, Express, API REST.
- **Base de données** : MySQL (compatible phpMyAdmin).
- **Design** : Dark Mode, Anime Style, Responsive Mobile-First.

## 📁 Structure du Projet

```text
3d-print-shop/
├── backend/           # API Node.js / Express
│   ├── src/
│   │   ├── config/    # Configuration DB
│   │   ├── controllers/
│   │   ├── models/    # Modèles MySQL
│   │   ├── routes/
│   │   └── index.js   # Point d'entrée
│   └── uploads/       # Images produits
├── frontend/          # Application Next.js
│   ├── src/
│   │   ├── app/       # Pages (App Router)
│   │   ├── components/# Composants UI
│   │   ├── context/   # Gestion de la langue (i18n)
│   │   └── lib/       # Traductions et utilitaires
└── database.sql       # Schéma de la base de données
```

## 🛠️ Installation

### 1. Base de données
1. Importez le fichier `database.sql` dans votre serveur MySQL (via phpMyAdmin ou ligne de commande).
2. La base de données `print3d_shop` sera créée avec les tables nécessaires.

### 2. Backend
```bash
cd backend
npm install
```
Configurez le fichier `.env` :
```env
PORT=5000
DB_HOST=localhost
DB_USER=votre_user
DB_PASS=votre_password
DB_NAME=print3d_shop
JWT_SECRET=votre_secret
```
Lancez le serveur : `npm run dev` (ou `node src/index.js`).

### 3. Frontend
```bash
cd frontend
pnpm install # ou npm install
```
Lancez le site : `npm run dev`.
Accédez au site sur `http://localhost:3000`.

## 🧑‍💼 Administration
- **URL** : `/admin`
- **Identifiants par défaut** : `admin` / `admin123`

## ✨ Fonctionnalités
- **Bilingue** : Changement de langue instantané FR/AR avec support RTL.
- **Catalogue** : Liste des produits avec filtres par catégorie.
- **Commande** : Formulaire de commande simple sans compte requis.
- **Dashboard** : Gestion des produits, commandes et statuts.
- **Design** : Effets de survol néon, animations fluides et interface optimisée.

---
Développé avec ❤️ pour les passionnés d'impression 3D.
