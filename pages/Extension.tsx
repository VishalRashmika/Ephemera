import React from 'react';
import { Sparkles, Rocket, Chrome, Bell } from 'lucide-react';

interface ExtensionProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const Extension: React.FC<ExtensionProps> = ({ onBack, onNavigate }) => {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-[11px] font-bold uppercase tracking-widest text-navy dark:bg-steel/20 dark:text-teal">
              <Rocket size={12} />
              Coming Soon
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              Chrome Extension <span className="text-slate/40 dark:text-lightgrey/40">on the way.</span>
            </h1>
            <p className="text-xl text-slate dark:text-lightgrey max-w-3xl mx-auto leading-relaxed">
              We're building a powerful Chrome extension to make saving bookmarks even faster. Bookmark any page with a single click, right from your browser.
            </p>
          </div>

          {/* Coming Soon Visual */}
          <div className="bg-gradient-to-br from-navy/5 to-gold/5 dark:from-teal/10 dark:to-steel/10 rounded-3xl p-16 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white dark:bg-deepslate rounded-3xl shadow-2xl mb-8 border-2 border-gold/30 dark:border-steel/30">
              <Chrome className="text-navy dark:text-teal" size={64} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ephemera for Chrome</h2>
            <p className="text-lg text-slate dark:text-lightgrey max-w-2xl mx-auto leading-relaxed">
              Save bookmarks instantly from any webpage. The extension will integrate seamlessly with your Ephemera account, providing the same AI-powered organization you love.
            </p>
          </div>

          {/* Features Preview */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">What to Expect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-12 h-12 bg-navy/10 dark:bg-teal/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-navy dark:text-teal" size={24} />
                </div>
                <h3 className="text-xl font-bold">One-Click Bookmarking</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Save any webpage to Ephemera with a single click. No need to copy and paste URLs into the web app.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-12 h-12 bg-navy/10 dark:bg-teal/10 rounded-xl flex items-center justify-center">
                  <Rocket className="text-navy dark:text-teal" size={24} />
                </div>
                <h3 className="text-xl font-bold">Instant AI Processing</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  The extension will automatically extract metadata and generate tags using Gemini AI as you save.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-12 h-12 bg-navy/10 dark:bg-teal/10 rounded-xl flex items-center justify-center">
                  <Chrome className="text-navy dark:text-teal" size={24} />
                </div>
                <h3 className="text-xl font-bold">Browser Integration</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Access your bookmarks directly from Chrome. Quick search and navigation without leaving your browser.
                </p>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-2xl p-8 space-y-4 border-2 border-gold/20 dark:border-steel/30">
                <div className="w-12 h-12 bg-navy/10 dark:bg-teal/10 rounded-xl flex items-center justify-center">
                  <Bell className="text-navy dark:text-teal" size={24} />
                </div>
                <h3 className="text-xl font-bold">Smart Notifications</h3>
                <p className="text-slate dark:text-lightgrey leading-relaxed">
                  Get notified when AI processing is complete and your bookmark is ready with tags and categories.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Development Timeline</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-white dark:bg-deepslate rounded-xl p-6 border-2 border-gold/20 dark:border-steel/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-navy/10 dark:bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-navy dark:text-teal">Q1</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">Planning & Design</h3>
                    <p className="text-slate dark:text-lightgrey">Finalizing extension features and user experience</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-xl p-6 border-2 border-gold/20 dark:border-steel/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-navy/10 dark:bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-navy dark:text-teal">Q2</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">Development & Testing</h3>
                    <p className="text-slate dark:text-lightgrey">Building and refining the extension with beta testers</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-deepslate rounded-xl p-6 border-2 border-navy dark:border-teal shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-navy dark:bg-teal rounded-full flex items-center justify-center flex-shrink-0">
                    <Rocket className="text-white dark:text-ink" size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">Public Launch</h3>
                    <p className="text-slate dark:text-lightgrey">Available on Chrome Web Store for everyone</p>
                  </div>
                </div>
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

export default Extension;
