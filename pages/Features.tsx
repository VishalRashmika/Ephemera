import React from 'react';
import { Sparkles, Shield, Zap, Search, FolderTree, BarChart3, Palette, Globe, Database, Lock, CheckCircle2 } from 'lucide-react';

interface FeaturesProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const Features: React.FC<FeaturesProps> = ({ onBack, onNavigate }) => {
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
      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="space-y-20">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/20 text-[11px] font-bold uppercase tracking-widest text-navy dark:bg-teal/20 dark:text-teal">
              <Sparkles size={12} />
              Features
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              Everything you need to <span className="text-slate/40 dark:text-lightgrey/40">organize the web.</span>
            </h1>
            <p className="text-xl text-slate dark:text-lightgrey max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to make bookmark management effortless, intelligent, and beautiful.
            </p>
          </div>

          {/* AI-Powered Organization */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">AI-Powered Organization</h2>
              <p className="text-lg text-slate dark:text-lightgrey max-w-2xl mx-auto">
                Let artificial intelligence handle the tedious work of organizing your bookmarks
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30 hover:border-navy dark:hover:border-teal transition-colors">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <Zap className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Smart Metadata Extraction</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Automatically fetches titles, descriptions, and high-resolution favicons for every link you save. No manual entry required.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30 hover:border-navy dark:hover:border-teal transition-colors">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <Sparkles className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Intelligent Tagging</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Gemini AI generates relevant tags based on content analysis, ensuring your bookmarks are discoverable and well-organized.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30 hover:border-navy dark:hover:border-teal transition-colors">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <FolderTree className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Auto-Categorization</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  AI-driven categories that evolve based on your habits. The system learns what you save and adapts accordingly.
                </p>
              </div>
            </div>
          </div>

          {/* Powerful Management */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Powerful Management</h2>
              <p className="text-lg text-slate dark:text-lightgrey max-w-2xl mx-auto">
                Professional-grade tools to manage thousands of bookmarks with ease
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-navy/10 dark:bg-teal/10 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Bulk Operations</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Edit, tag, categorize, or delete multiple bookmarks at once. Save hours with batch processing capabilities.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-navy/10 dark:bg-teal/10 rounded-2xl flex items-center justify-center">
                  <Search className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Advanced Search</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Search by title, URL, tags, or categories. Find what you need in seconds, not minutes.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-navy/10 dark:bg-teal/10 rounded-2xl flex items-center justify-center">
                  <Globe className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Flexible Views</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Switch between grid and list layouts to match your workflow. Customize how you view your collection.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-navy/10 dark:bg-teal/10 rounded-2xl flex items-center justify-center">
                  <FolderTree className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Smart Filtering</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Filter by categories, tags, or favorites. Navigate your library with precision and speed.
                </p>
              </div>
            </div>
          </div>

          {/* Analytics & Insights */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Analytics & Insights</h2>
              <p className="text-lg text-slate dark:text-lightgrey max-w-2xl mx-auto">
                Understand your saving patterns and optimize your workflow
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <BarChart3 className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Activity Timeline</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  GitHub-style contribution calendar showing your saving patterns over time. Track your reading habits.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <BarChart3 className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Usage Statistics</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Track total bookmarks, tags, and weekly/monthly trends. See your collection grow over time.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <FolderTree className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Category Distribution</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Visual breakdown of your bookmark organization. Understand how your content is categorized.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <Zap className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Recent Activity</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Quick access to your latest additions and recently viewed bookmarks.
                </p>
              </div>
            </div>
          </div>

          {/* Beautiful Design */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Beautiful Design</h2>
              <p className="text-lg text-slate dark:text-lightgrey max-w-2xl mx-auto">
                A thoughtfully crafted interface that's a joy to use every day
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-navy/10 dark:bg-teal/10 rounded-2xl flex items-center justify-center">
                  <Palette className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Dual Themes</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  <strong>Light Mode:</strong> "Vintage Journal" with warm parchment tones.<br/>
                  <strong>Dark Mode:</strong> "Midnight Library" with sleek ink black.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-navy/10 dark:bg-teal/10 rounded-2xl flex items-center justify-center">
                  <Globe className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Responsive</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Works seamlessly on desktop, tablet, and mobile devices. Your bookmarks, everywhere.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-navy/10 dark:bg-teal/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Minimal & Clean</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Distraction-free interface focused on your content. No clutter, just bookmarks.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Privacy & Security</h2>
              <p className="text-lg text-slate dark:text-lightgrey max-w-2xl mx-auto">
                Your data is yours. We take privacy seriously.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <Lock className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Firebase Authentication</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Secure login with Google or email/password. Industry-standard authentication protocols.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <Database className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Encrypted Storage</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Your data is securely stored in Firebase Firestore with encryption at rest and in transit.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <Shield className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">Personal & Private</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Your bookmarks are yours alone. No sharing, no selling, no tracking across the web.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
                  <Shield className="text-navy dark:text-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold">No Tracking</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Minimal data collection, maximum privacy. We only collect what's necessary to make the app work.
                </p>
              </div>
            </div>
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

export default Features;
