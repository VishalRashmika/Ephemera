<div align="center">
  <img src="assets/banner.png" alt="Ephemera Banner" width="100%">
  
  <h1>Ephemera</h1>
  
  <p align="center">
    <strong>Your digital library, automated.</strong>
  </p>
  
  <p align="center">
    AI-powered bookmark manager that automatically categorizes, tags, and organizes your web findings using Google Gemini.
  </p>

  <p align="center">
    <img src="assets/logo.png" alt="Ephemera Logo" width="120">
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#demo">Demo</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#deployment">Deployment</a> •
    <a href="SELF_HOSTING.md">Self-Hosting Guide</a> •
    <a href="GITHUB_DEPLOYMENT.md">GitHub Deployment</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.8.2-blue?style=flat-square&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Firebase-12.7.0-orange?style=flat-square&logo=firebase" alt="Firebase">
    <img src="https://img.shields.io/badge/Gemini-AI-blueviolet?style=flat-square&logo=google" alt="Gemini AI">
  </p>
</div>

---

## ✨ Features

### 🤖 **AI-Powered Organization**
- **Smart Metadata Extraction**: Automatically fetches titles, descriptions, and favicons
- **Intelligent Tagging**: Gemini AI generates relevant tags based on content analysis
- **Auto-Categorization**: AI-driven categories that adapt to your habits

### 📚 **Powerful Management**
- **Bulk Operations**: Edit, tag, categorize, or delete multiple bookmarks at once
- **Advanced Search**: Search by title, URL, tags, or categories
- **Flexible Views**: Switch between grid and list layouts
- **Smart Filtering**: Filter by categories, tags, or favorites

### 📊 **Analytics & Insights**
- **Activity Timeline**: GitHub-style contribution calendar showing your saving patterns
- **Usage Statistics**: Track total bookmarks, tags, and weekly/monthly trends
- **Category Distribution**: Visual breakdown of your bookmark organization
- **Recent Activity**: Quick access to your latest additions

### 🎨 **Beautiful Design**
- **Dual Themes**: 
  - **Light Mode**: "Vintage Journal" - Warm parchment tones with navy and gold accents
  - **Dark Mode**: "Midnight Library" - Sleek ink black with teal highlights
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Minimal & Clean**: Distraction-free interface focused on your content

### 🔐 **Privacy & Security**
- **Firebase Authentication**: Secure login with Google or email/password
- **Encrypted Storage**: Your data is securely stored in Firestore
- **Personal & Private**: Your bookmarks are yours alone
- **No Tracking**: Minimal data collection, maximum privacy

### 🚀 **Developer-Friendly**
- **Open Source**: MIT licensed, fork and customize as you wish
- **Modern Stack**: React 19, TypeScript, Vite, TailwindCSS
- **Easy Deployment**: Deploy to Vercel, Netlify, or any static host
- **Self-Hostable**: Full control over your data ([Self-Hosting Guide](SELF_HOSTING.md))

---

## 🎯 Demo

### Dashboard
View your bookmark analytics, recent additions, and activity timeline at a glance.

### Smart Bookmarking
Just paste a URL - Gemini AI handles the rest:
- Extracts page title and description
- Generates relevant tags
- Suggests appropriate categories
- Saves high-quality favicon

### Bulk Management
Select multiple bookmarks to:
- Add or remove tags in bulk
- Move to different categories
- Mark as favorites
- Archive or delete

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase project ([Create one here](https://console.firebase.google.com/))
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ephemera.git
   cd ephemera
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Configure Firebase** (See [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
   - Enable Authentication (Google & Email/Password)
   - Create Firestore database
   - Set up security rules

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (see below)

3. **Configure Environment Variables in Vercel**
   - Go to Project Settings > Environment Variables
   - Add each variable from your `.env` file
   - Deploy!

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod
     ```

3. **Set environment variables** in Netlify dashboard under Site Settings > Environment Variables

### GitHub Actions Deployment

For automated deployments with GitHub Actions and detailed instructions on setting up secrets, see the **[GitHub Deployment Guide](GITHUB_DEPLOYMENT.md)**.

**Quick setup**: Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `GEMINI_API_KEY`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Build Tool**: Vite 6
- **AI**: Google Gemini API
- **Backend**: Firebase (Auth + Firestore)
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 📖 Documentation

- **[Self-Hosting Guide](SELF_HOSTING.md)** - Deploy Ephemera on your own infrastructure
- **[Firebase Setup](FIREBASE_SETUP.md)** - Detailed Firebase configuration steps
- **[Firestore Setup](FIRESTORE_SETUP.md)** - Database structure and security rules

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the amazing AI capabilities
- [Firebase](https://firebase.google.com/) for backend infrastructure
- [Lucide](https://lucide.dev/) for beautiful icons
- [Recharts](https://recharts.org/) for elegant data visualization

---

## 💬 Support

If you have any questions or run into issues:
- Open an issue on GitHub
- Check the [Self-Hosting Guide](SELF_HOSTING.md)
- Review existing issues for solutions

---

<div align="center">
  <p>Made with ❤️ for bookmark hoarders everywhere</p>
  <p>
    <a href="https://github.com/yourusername/ephemera">⭐ Star us on GitHub</a> •
    <a href="https://github.com/yourusername/ephemera/issues">🐛 Report Bug</a> •
    <a href="https://github.com/yourusername/ephemera/issues">💡 Request Feature</a>
  </p>
</div>
