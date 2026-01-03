
import React, { useState } from 'react';
import { 
  LayoutGrid, 
  List, 
  Search, 
  Filter, 
  ChevronDown,
  ArrowUpDown,
  CheckSquare,
  MoreHorizontal
} from 'lucide-react';
import { Bookmark, ViewMode } from '../types';
import BookmarkCard from '../components/BookmarkCard';

interface BookmarksProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEditTags: (bookmark: Bookmark) => void;
  selectedCategory: string | null;
  categories: any[];
  onClick?: (bookmark: Bookmark) => void;
}

const Bookmarks: React.FC<BookmarksProps> = ({ bookmarks, onDelete, onToggleFavorite, onEditTags, selectedCategory, categories, onClick }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Favorites' | 'Archived'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'mostVisited'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const categoryName = selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : null;

  // Get all unique tags from bookmarks
  const allTags = Array.from(new Set(bookmarks.flatMap(b => b.tags || [])));

  // Apply all filters and sorting
  const filteredBookmarks = bookmarks
    .filter(b => {
      // Search filter
      const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Tag filter
      const matchesTag = !filterTag || b.tags?.includes(filterTag);
      
      // Tab filter
      let matchesTab = true;
      if (activeTab === 'Favorites') matchesTab = b.isFavorite;
      if (activeTab === 'Archived') matchesTab = b.isArchived;
      
      return matchesSearch && matchesTag && matchesTab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'mostVisited':
          return b.clickCount - a.clickCount;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {categoryName ? `${categoryName}` : 'Your Library'}
          </h1>
          <p className="text-sm text-gray-500">
            {bookmarks.length} items {categoryName ? `in ${categoryName}` : 'collected'}
          </p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl dark:bg-gray-900">
          <button 
            onClick={() => setViewMode(ViewMode.GRID)}
            className={`p-1.5 rounded-lg transition-all ${viewMode === ViewMode.GRID ? 'bg-white shadow-sm dark:bg-black' : 'text-gray-400'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.LIST)}
            className={`p-1.5 rounded-lg transition-all ${viewMode === ViewMode.LIST ? 'bg-white shadow-sm dark:bg-black' : 'text-gray-400'}`}
          >
            <List size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by title, url or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition-all dark:bg-black dark:border-gray-800 dark:focus:ring-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors dark:bg-black dark:border-gray-800"
            >
              <Filter size={16} />
              Filter
              {filterTag && <span className="ml-1 px-2 py-0.5 bg-black text-white text-xs rounded-full dark:bg-white dark:text-black">{filterTag}</span>}
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {showFilterMenu && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-10 dark:bg-black dark:border-gray-800">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setFilterTag(null);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors dark:hover:bg-gray-900 ${
                      !filterTag ? 'font-semibold text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    All Tags
                  </button>
                  {allTags.length > 0 ? (
                    allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setFilterTag(tag);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors dark:hover:bg-gray-900 ${
                          filterTag === tag ? 'font-semibold text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {tag}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400">No tags available</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors dark:bg-black dark:border-gray-800"
            >
              <ArrowUpDown size={16} />
              Sort
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-10 dark:bg-black dark:border-gray-800">
                <div className="py-2">
                  {[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'title', label: 'Title (A-Z)' },
                    { value: 'mostVisited', label: 'Most Visited' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as any);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors dark:hover:bg-gray-900 ${
                        sortBy === option.value ? 'font-semibold text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end py-2 border-b border-gray-50 dark:border-gray-900">
        <div className="flex items-center gap-1">
          {(['All', 'Favorites', 'Archived'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                tab === activeTab 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredBookmarks.length > 0 ? (
        <div className={viewMode === ViewMode.GRID ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col"}>
          {filteredBookmarks.map(bookmark => (
            <BookmarkCard 
              key={bookmark.id} 
              bookmark={bookmark} 
              viewMode={viewMode}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onEditTags={onEditTags}
              onClick={onClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 dark:bg-gray-900">
            <Search className="text-gray-300" size={32} />
          </div>
          <h3 className="font-semibold text-lg">No bookmarks found</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
