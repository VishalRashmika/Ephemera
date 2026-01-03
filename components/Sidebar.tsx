
import React from 'react';
import { 
  LayoutDashboard, 
  Bookmark, 
  BarChart3, 
  Settings, 
  Plus, 
  ChevronRight,
  Hash,
  FolderOpen,
  Sun,
  Moon,
  X,
  Edit3
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  categories: any[];
  selectedCategory: string | null;
  onCategoryClick: (categoryId: string) => void;
  onAddCategory: () => void;
  bookmarks: any[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, categories, selectedCategory, onCategoryClick, onAddCategory, bookmarks }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  
  // Calculate top 5 most used tags
  const topTags = React.useMemo(() => {
    const tagCount: { [key: string]: number } = {};
    
    bookmarks.forEach(bookmark => {
      bookmark.tags?.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
  }, [bookmarks]);
  
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'bookmarks', icon: Bookmark, label: 'All Bookmarks' },
    { id: 'analytics', icon: Edit3, label: 'Bulk Edit' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gold/20 flex flex-col fixed left-0 top-0 z-40 dark:bg-deepslate dark:border-steel/30">
      {/* Fixed Header */}
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center dark:bg-teal">
            <div className="w-3 h-3 bg-gold rounded-full dark:bg-ink" />
          </div>
          <span className="font-bold text-xl tracking-tight">Ephemera</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 scrollbar-custom">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isBookmarksPage = item.id === 'bookmarks';
            const isActive = isBookmarksPage 
              ? (currentPage === item.id && (selectedCategory === null || selectedCategory === 'all'))
              : currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isBookmarksPage) {
                    onCategoryClick('all');
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                  ? 'bg-gold/20 text-navy font-medium dark:bg-steel/20 dark:text-teal' 
                  : 'text-slate hover:bg-gold/10 hover:text-navy dark:text-lightgrey dark:hover:bg-steel/10 dark:hover:text-teal'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4 px-3">
            <span className="text-xs font-semibold text-slate/60 dark:text-lightgrey/60 uppercase tracking-wider">Categories</span>
            <button 
              onClick={onAddCategory}
              className="text-slate/60 hover:text-navy dark:text-lightgrey/60 dark:hover:text-teal transition-colors"
              title="Add new category"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryClick(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-gold/20 text-navy font-medium dark:bg-steel/20 dark:text-teal'
                    : 'text-slate hover:bg-gold/10 hover:text-navy dark:text-lightgrey dark:hover:bg-steel/10 dark:hover:text-teal'
                }`}
              >
                <FolderOpen size={16} style={{ color: cat.color }} />
                <span className="flex-1 text-left truncate">{cat.name}</span>
                <span className="text-[10px] bg-gold/20 px-1.5 py-0.5 rounded text-charcoal dark:bg-steel/20 dark:text-offwhite">{cat.bookmarkCount}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4 px-3">
            <span className="text-xs font-semibold text-slate/60 dark:text-lightgrey/60 uppercase tracking-wider">Top Tags</span>
          </div>
          <div className="flex flex-wrap gap-1 px-3">
            {topTags.length > 0 ? (
              topTags.map(({ tag, count }) => (
                <span key={tag} className="flex items-center gap-1 text-[11px] bg-gold/20 text-charcoal px-2 py-1 rounded-full cursor-pointer hover:bg-gold/30 transition-colors dark:bg-steel/20 dark:text-offwhite dark:hover:bg-steel/30" title={`${count} bookmark${count !== 1 ? 's' : ''}`}>
                  <Hash size={10} />
                  {tag}
                  <span className="text-[9px] opacity-60">({count})</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate/60 dark:text-lightgrey/60">No tags yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 p-6 border-t border-gold/20 dark:border-steel/30">
        <div className="flex items-center gap-3 px-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {currentUser?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser?.email?.split('@')[0] || 'User'}</p>
          </div>
        </div>
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate hover:bg-gold/10 hover:text-navy transition-colors dark:text-lightgrey dark:hover:bg-steel/10 dark:hover:text-teal"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
