
import React, { useState } from 'react';
import { ArrowRight, Bookmark, Sparkles, Shield, Zap, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LandingProps {
  onGetStarted?: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      setShowAuthModal(false);
      onGetStarted?.();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp && !displayName) {
      setError('Please enter your name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      
      setShowAuthModal(false);
      onGetStarted?.();
    } catch (err: any) {
      setError(err.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`);
    } finally {
      setLoading(false);
    }
  };
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
          <a href="#" className="hover:text-navy dark:hover:text-teal transition-colors">Features</a>
          <a href="#" className="hover:text-navy dark:hover:text-teal transition-colors">Pricing</a>
          <a href="#" className="hover:text-navy dark:hover:text-teal transition-colors">About</a>
        </div>
        <button 
          onClick={() => setShowAuthModal(true)}
          className="text-sm font-bold border-2 border-navy px-6 py-2 rounded-full hover:bg-navy hover:text-white transition-all dark:border-teal dark:hover:bg-teal dark:hover:text-ink"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/20 text-[11px] font-bold uppercase tracking-widest text-navy dark:bg-teal/20 dark:text-teal">
            <Sparkles size={12} />
            AI-Powered Organization
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none max-w-4xl mx-auto">
            Your digital library, <span className="text-slate/40 dark:text-lightgrey/40">automated.</span>
          </h1>
          <p className="text-xl text-slate dark:text-lightgrey max-w-2xl mx-auto leading-relaxed">
            Stop manually tagging links. Ephemera uses Gemini AI to categorize, 
            summarize, and organize your web findings instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => setShowAuthModal(true)}
              className="group flex items-center gap-2 bg-navy text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-navy/80 transition-all active:scale-95 shadow-xl shadow-navy/20 dark:bg-teal dark:text-ink dark:shadow-teal/20 dark:hover:bg-teal/80"
            >
              Start for Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <p className="text-sm text-slate/60 dark:text-lightgrey/60">No credit card required.</p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-40">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">Instant Metadata</h3>
            <p className="text-slate dark:text-lightgrey leading-relaxed">Automatic fetching of titles, descriptions, and high-res favicons for every link you save.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">Private by Design</h3>
            <p className="text-slate dark:text-lightgrey leading-relaxed">Your data is yours. Encrypted storage and minimal tracking ensure your library stays personal.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center dark:bg-steel/20">
              <Bookmark size={24} />
            </div>
            <h3 className="text-xl font-bold">Smart Collections</h3>
            <p className="text-slate dark:text-lightgrey leading-relaxed">AI-driven categories that evolve based on your habits. Never lose a resource again.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gold/20 py-12 px-8 dark:border-steel/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate/60 dark:text-lightgrey/60 text-sm">© 2025 Ephemera Inc. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-medium text-slate dark:text-lightgrey">
            <a href="#" className="hover:text-navy dark:hover:text-teal transition-colors">Twitter</a>
            <a href="#" className="hover:text-navy dark:hover:text-teal transition-colors">GitHub</a>
            <a href="#" className="hover:text-navy dark:hover:text-teal transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-navy/50 dark:bg-ink/80 flex items-center justify-center p-4 z-50" onClick={() => setShowAuthModal(false)}>
          <div className="bg-white dark:bg-deepslate rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-slate dark:text-lightgrey text-sm">
                {isSignUp ? 'Sign up to start organizing your bookmarks' : 'Sign in to continue to Ephemera'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-deepslate border-2 border-gold/30 px-6 py-3 rounded-full font-bold hover:border-navy dark:hover:border-teal transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Loading...' : 'Continue with Google'}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gold/20 dark:border-steel/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-deepslate text-slate dark:text-lightgrey">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40 dark:text-lightgrey/40" size={18} />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gold/20 rounded-full focus:border-navy outline-none transition-colors dark:bg-ink dark:border-steel/30 dark:focus:border-teal"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40 dark:text-lightgrey/40" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gold/20 rounded-full focus:border-navy outline-none transition-colors dark:bg-ink dark:border-steel/30 dark:focus:border-teal"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40 dark:text-lightgrey/40" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gold/20 rounded-full focus:border-navy outline-none transition-colors dark:bg-ink dark:border-steel/30 dark:focus:border-teal"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy text-white py-3 rounded-full font-bold hover:bg-navy/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:bg-teal dark:text-ink dark:hover:bg-teal/80"
              >
                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-slate hover:text-navy dark:text-lightgrey dark:hover:text-teal transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
