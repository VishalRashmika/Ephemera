# 🏠 Self-Hosting Ephemera

This guide will help you self-host Ephemera on your own infrastructure with complete control over your data.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Firebase Setup](#firebase-setup)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- A **Firebase** account (free tier works fine)
- A **Google Gemini API** key ([Get one here](https://aistudio.google.com/app/apikey))

---

## 🔥 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `ephemera` (or your preferred name)
4. Disable Google Analytics (optional, but recommended for privacy)
5. Click **"Create project"**

### Step 2: Register Your Web App

1. In your Firebase project, click the **web icon** (`</>`) to add a web app
2. Register app with nickname: `Ephemera Web`
3. **Do NOT** check "Firebase Hosting" (we'll use other hosting)
4. Click **"Register app"**
5. **Copy the configuration object** - you'll need these values

Your config should look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

### Step 3: Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
4. Enable **Google** authentication:
   - Click on "Google"
   - Toggle "Enable"
   - Enter a support email
   - Click "Save"

### Step 4: Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **Production mode** (we'll add custom rules)
4. Select your preferred location (choose one closest to your users)
5. Click **"Enable"**

### Step 5: Set Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Bookmarks collection - users can only access their own bookmarks
    match /bookmarks/{bookmarkId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Categories collection - users can only access their own categories
    match /categories/{categoryId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

### Step 6: Create Firestore Indexes (Optional but Recommended)

For better query performance, create these composite indexes:

1. Go to **Firestore Database → Indexes** tab
2. Click **"Add Index"**
3. Create these indexes:

**Index 1: Bookmarks by user and creation date**
- Collection ID: `bookmarks`
- Fields to index:
  - `userId` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

**Index 2: Bookmarks by user and category**
- Collection ID: `bookmarks`
- Fields to index:
  - `userId` (Ascending)
  - `categoryId` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

---

## ⚙️ Environment Configuration

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ephemera.git
cd ephemera
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

```bash
cp .env.example .env
```

### Step 4: Configure Environment Variables

Edit the `.env` file with your actual values:

```env
# Gemini AI Configuration
# Get your key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Firebase Configuration (from Step 2 above)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef

# Optional: Only if using Google Analytics
# VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**⚠️ IMPORTANT**: Never commit the `.env` file to version control! It's already in `.gitignore`.

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers the easiest deployment with automatic builds and SSL.

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - Go to Project Settings → Environment Variables
     - Add all variables from your `.env` file
     - Make sure to add them to all environments (Production, Preview, Development)
   - Click "Deploy"

3. **Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow the prompts and configure environment variables when asked.

**Vercel Configuration** (optional `vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key",
    "VITE_FIREBASE_API_KEY": "@firebase-api-key",
    "VITE_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain",
    "VITE_FIREBASE_PROJECT_ID": "@firebase-project-id",
    "VITE_FIREBASE_STORAGE_BUCKET": "@firebase-storage-bucket",
    "VITE_FIREBASE_MESSAGING_SENDER_ID": "@firebase-messaging-sender-id",
    "VITE_FIREBASE_APP_ID": "@firebase-app-id"
  }
}
```

### Option 2: Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Or deploy via Netlify UI**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag and drop the `dist` folder
   - Configure environment variables in Site Settings → Environment

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Docker

**Dockerfile**:
```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build and run**:
```bash
# Build image
docker build -t ephemera .

# Run container (pass env vars)
docker run -d -p 80:80 \
  -e VITE_FIREBASE_API_KEY=your_key \
  -e VITE_FIREBASE_AUTH_DOMAIN=your_domain \
  ephemera
```

**Using docker-compose.yml**:
```yaml
version: '3.8'

services:
  ephemera:
    build: .
    ports:
      - "80:80"
    env_file:
      - .env
    restart: unless-stopped
```

### Option 4: Traditional VPS (Ubuntu/Debian)

1. **Install Node.js and Nginx**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs nginx
   ```

2. **Clone and build**:
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/ephemera.git
   cd ephemera
   npm install
   npm run build
   ```

3. **Configure Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/ephemera
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/ephemera/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Enable site and restart Nginx**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ephemera /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Add SSL with Let's Encrypt**:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🔒 Security Considerations

### 1. Environment Variables
- **Never** commit `.env` files to version control
- Use different credentials for development and production
- Rotate API keys periodically

### 2. Firebase Security
- Keep Firestore security rules restrictive
- Enable App Check for production (optional but recommended)
- Monitor Firebase usage regularly

### 3. API Keys
- Restrict Gemini API key to your domain only
- Set up Firebase API key restrictions in Google Cloud Console:
  - Go to Google Cloud Console → APIs & Services → Credentials
  - Edit your API key
  - Add HTTP referrers (websites) restrictions

### 4. HTTPS
- Always use HTTPS in production
- Most hosting platforms provide free SSL certificates
- Configure your domain with SSL/TLS

### 5. Content Security Policy
Add CSP headers in your hosting configuration for extra security.

---

## 🐛 Troubleshooting

### Issue: Firebase Authentication Not Working

**Solution:**
1. Check that your domain is authorized in Firebase Console
2. Go to Authentication → Settings → Authorized domains
3. Add your deployment domain

### Issue: Gemini API Rate Limits

**Solution:**
- Free tier: 15 requests per minute
- Upgrade to paid tier for higher limits
- Implement caching for frequently accessed data

### Issue: Firestore Permission Denied

**Solution:**
1. Verify Firestore security rules are published
2. Check user authentication status
3. Ensure `userId` field matches authenticated user

### Issue: Environment Variables Not Loading

**Solution:**
- Vite requires `VITE_` prefix for client-side variables
- Rebuild after changing environment variables
- Clear browser cache and restart dev server

### Issue: Build Fails

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

---

## 📞 Support

If you encounter issues:

1. Check the [main README](README.md) for general setup
2. Review [Firebase Setup Guide](FIREBASE_SETUP.md)
3. Open an issue on [GitHub](https://github.com/yourusername/ephemera/issues)

---

## 📝 License

This guide is part of the Ephemera project, licensed under MIT.

---

<div align="center">
  <p><a href="README.md">← Back to Main README</a></p>
  <p>Happy self-hosting! 🚀</p>
</div>
