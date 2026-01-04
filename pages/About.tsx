import React from 'react';
import { Github, Heart, Sparkles, Shield, Zap, Database } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-parchment text-charcoal selection:bg-navy selection:text-white dark:bg-ink dark:text-offwhite">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center dark:bg-teal">
            <div className="w-3 h-3 bg-gold rounded-full" />
          </div>
          <span className="font-bold text-xl tracking-tight">Ephemera</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate dark:text-lightgrey">
          <button onClick={() => onBack()} className="hover:text-navy dark:hover:text-teal transition-colors">Home</button>
          <button onClick={() => onNavigate('features')} className="hover:text-navy dark:hover:text-teal transition-colors">Features</button>
          <button onClick={() => onNavigate('extension')} className="hover:text-navy dark:hover:text-teal transition-colors">Extension</button>
          <button onClick={() => onNavigate('about')} className="hover:text-navy dark:hover:text-teal transition-colors">About</button>
        </div>
        <div className="w-20"></div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-20">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/20 text-[11px] font-bold uppercase tracking-widest text-navy dark:bg-teal/20 dark:text-teal">
              <Sparkles size={12} />
              About Ephemera
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none">
              Your digital library, <span className="text-slate/40 dark:text-lightgrey/40">automated.</span>
            </h1>
            <p className="text-xl text-slate dark:text-lightgrey max-w-3xl mx-auto leading-relaxed">
              Ephemera is an AI-powered bookmark manager that automatically categorizes, tags, and organizes your web findings using Google Gemini.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-sage/10 dark:bg-steel/10 rounded-3xl p-12 space-y-6">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-slate dark:text-lightgrey leading-relaxed">
              We believe that managing bookmarks shouldn't be a chore. In the age of information overload, finding that one article you saved weeks ago shouldn't require manual tagging and careful organization. Ephemera leverages the power of AI to do the heavy lifting for you, so you can focus on what matters: consuming and sharing great content.
            </p>
            <p className="text-lg text-slate dark:text-lightgrey leading-relaxed">
              Our goal is to create a bookmark manager that's smart enough to understand your content, beautiful enough to use daily, and private enough to trust with your digital discoveries.
            </p>
          </div>

          {/* Technology Stack */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Built With Modern Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-12 h-12 bg-navy/10 dark:bg-teal/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-navy dark:text-teal" size={24} />
                </div>
                <h3 className="text-xl font-bold">Google Gemini AI</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Powered by Google's latest Gemini AI model to intelligently analyze web content, extract metadata, and generate relevant tags automatically.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-12 h-12 bg-navy/10 dark:bg-teal/10 rounded-xl flex items-center justify-center">
                  <Database className="text-navy dark:text-teal" size={24} />
                </div>
                <h3 className="text-xl font-bold">Firebase Backend</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Secure authentication and encrypted cloud storage with Firebase, ensuring your bookmarks are safe and accessible from anywhere.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-12 h-12 bg-navy/10 dark:bg-teal/10 rounded-xl flex items-center justify-center">
                  <Zap className="text-navy dark:text-teal" size={24} />
                </div>
                <h3 className="text-xl font-bold">React & TypeScript</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Built with React 19 and TypeScript for a fast, type-safe, and maintainable codebase using modern web development practices.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-12 h-12 bg-navy/10 dark:bg-teal/10 rounded-xl flex items-center justify-center">
                  <Shield className="text-navy dark:text-teal" size={24} />
                </div>
                <h3 className="text-xl font-bold">Privacy First</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Your bookmarks are yours alone. We use minimal tracking, encrypted storage, and give you full control over your data.
                </p>
              </div>
            </div>
          </div>

          {/* Open Source */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/10 dark:bg-teal/10">
              <Heart className="text-navy dark:text-teal" size={20} />
              <span className="text-sm font-bold text-navy dark:text-teal">Open Source</span>
            </div>
            <h2 className="text-3xl font-bold">Built in the Open</h2>
            <p className="text-lg text-slate dark:text-lightgrey max-w-3xl mx-auto leading-relaxed">
              Ephemera is open source and MIT licensed. We believe in transparency and community-driven development. Fork it, customize it, or contribute to make it better for everyone.
            </p>
            <a 
              href="https://github.com/VishalRashmika/Ephemera" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-navy/80 transition-all active:scale-95 shadow-xl shadow-navy/20 dark:bg-teal dark:text-ink dark:shadow-teal/20 dark:hover:bg-teal/80"
            >
              <Github size={20} />
              View on GitHub
            </a>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            <img src="https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react" alt="React" />
            <img src="https://img.shields.io/badge/TypeScript-5.8.2-blue?style=flat-square&logo=typescript" alt="TypeScript" />
            <img src="https://img.shields.io/badge/Firebase-12.7.0-orange?style=flat-square&logo=firebase" alt="Firebase" />
            <img src="https://img.shields.io/badge/Gemini-AI-blueviolet?style=flat-square&logo=google" alt="Gemini AI" />
            <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gold/20 py-12 px-8 dark:border-steel/30 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate/60 dark:text-lightgrey/60 text-sm">© 2025 Ephemera Inc. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-medium text-slate dark:text-lightgrey">
            <a href="https://github.com/VishalRashmika/Ephemera" target="_blank" rel="noopener noreferrer" className="hover:text-navy dark:hover:text-teal transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
