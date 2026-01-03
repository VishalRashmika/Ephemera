
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Bookmarks from './pages/Bookmarks';
import BulkEdit from './pages/BulkEdit';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import { Bookmark, Category } from './types';
import { X, Link as LinkIcon, Sparkles, Loader2, Plus } from 'lucide-react';
import { fetchUrlMetadata } from './services/geminiService';
import { useAuth } from './contexts/AuthContext';
import { addBookmark as saveBookmarkToFirestore, getUserBookmarks, removeBookmark, toggleBookmarkFavorite, updateBookmark } from './services/bookmarkService';
import { addCategory as saveCategoryToFirestore, getUserCategories, removeCategory as deleteCategoryFromFirestore } from './services/categoryService';

const App: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryForNewBookmark, setSelectedCategoryForNewBookmark] = useState<string | undefined>(undefined);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | undefined>(undefined);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6');
  const [categories, setCategories] = useState<Category[]>([]);

  // Load bookmarks from Firebase
  useEffect(() => {
    if (!currentUser) return;
    
    const loadBookmarks = async () => {
      try {
        console.log('Loading bookmarks for user:', currentUser.uid);
        const userBookmarks = await getUserBookmarks(currentUser.uid);
        console.log('Loaded bookmarks:', userBookmarks);
        setBookmarks(userBookmarks);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        alert('Error loading bookmarks. Please check the browser console for details.');
      }
    };
    
    loadBookmarks();
  }, [currentUser]);

  // Load categories from Firebase
  useEffect(() => {
    if (!currentUser) return;
    
    const loadCategories = async () => {
      try {
        console.log('Loading categories for user:', currentUser.uid);
        const userCategories = await getUserCategories(currentUser.uid);
        console.log('Loaded categories:', userCategories);
        
        // If no categories exist, create default ones
        if (userCategories.length === 0) {
          console.log('No categories found, creating default categories...');
          const defaultCategories = [
            { name: 'Work and Study', color: '#3B82F6', order: 0 },
            { name: 'Personal', color: '#10B981', order: 1 },
            { name: 'Read Later', color: '#F59E0B', order: 2 },
            { name: 'Tools and Resources', color: '#8B5CF6', order: 3 },
            { name: 'Miscellaneous', color: '#6B7280', order: 4 }
          ];
          
          const createdCategories: Category[] = [];
          
          for (const cat of defaultCategories) {
            const categoryData = {
              userId: currentUser.uid,
              name: cat.name,
              color: cat.color,
              icon: 'folder',
              order: cat.order,
              parentId: null,
              bookmarkCount: 0,
              createdAt: Date.now()
            };
            
            const categoryId = await saveCategoryToFirestore(categoryData);
            createdCategories.push({ id: categoryId, ...categoryData });
          }
          
          setCategories(createdCategories);
          console.log('Default categories created:', createdCategories);
        } else {
          setCategories(userCategories);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, [currentUser]);

  // Update category bookmark counts whenever bookmarks change
  useEffect(() => {
    if (categories.length === 0) return;
    
    // Calculate bookmark count for each category
    const updatedCategories = categories.map(category => {
      const count = bookmarks.filter(b => b.categoryId === category.id).length;
      return { ...category, bookmarkCount: count };
    });
    
    // Only update if counts have changed to avoid infinite loop
    const countsChanged = updatedCategories.some((cat, index) => 
      cat.bookmarkCount !== categories[index].bookmarkCount
    );
    
    if (countsChanged) {
      setCategories(updatedCategories);
    }
  }, [bookmarks]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddBookmark = async () => {
    if (!newUrl || !currentUser) return;
    setIsProcessing(true);
    try {
      console.log('Fetching metadata for:', newUrl);
      const metadata = await fetchUrlMetadata(newUrl);
      console.log('Metadata fetched:', metadata);
      
      const newBookmarkData = {
        userId: currentUser.uid,
        url: newUrl,
        title: metadata.title,
        description: metadata.description,
        favicon: metadata.favicon,
        tags: metadata.tags,
        categoryId: selectedCategoryForNewBookmark,
        isFavorite: false,
        isArchived: false,
        metadata: { 
          domain: metadata.domain,
          image: metadata.image 
        },
        clickCount: 0,
        lastAccessed: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      console.log('Saving bookmark to Firestore...');
      const bookmarkId = await saveBookmarkToFirestore(newBookmarkData);
      console.log('Bookmark saved with ID:', bookmarkId);
      
      const newBookmark: Bookmark = {
        id: bookmarkId,
        ...newBookmarkData
      };
      
      setBookmarks(prev => [newBookmark, ...prev]);
      setNewUrl('');
      setSelectedCategoryForNewBookmark(undefined);
      setIsAdding(false);
      alert('Bookmark saved successfully!');
    } catch (err) {
      console.error('Error adding bookmark:', err);
      alert(`Error adding bookmark: ${err instanceof Error ? err.message : 'Please check the URL and try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      await removeBookmark(id);
      setBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      alert('Error deleting bookmark. Please try again.');
    }
  };

  const toggleFavorite = async (id: string) => {
    const bookmark = bookmarks.find(b => b.id === id);
    if (!bookmark) return;
    
    const newFavoriteStatus = !bookmark.isFavorite;
    
    // Optimistically update UI
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, isFavorite: newFavoriteStatus } : b));
    
    try {
      await toggleBookmarkFavorite(id, newFavoriteStatus);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setBookmarks(prev => prev.map(b => b.id === id ? { ...b, isFavorite: !newFavoriteStatus } : b));
      alert('Error updating bookmark. Please try again.');
    }
  };

  const updateBookmarkTags = async (bookmarkId: string, tags: string[]) => {
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    if (!bookmark) return;

    // Optimistically update UI
    setBookmarks(prev => prev.map(b => b.id === bookmarkId ? { ...b, tags, categoryId: editingCategory, updatedAt: Date.now() } : b));

    try {
      await updateBookmark(bookmarkId, { tags, categoryId: editingCategory, updatedAt: Date.now() });
      setEditingBookmark(null);
      setEditingTags([]);
      setEditingCategory(undefined);
      setNewTag('');
    } catch (error) {
      console.error('Error updating tags:', error);
      // Revert on error
      setBookmarks(prev => prev.map(b => b.id === bookmarkId ? { ...b, tags: bookmark.tags, categoryId: bookmark.categoryId } : b));
      alert('Error updating tags. Please try again.');
    }
  };

  const handleBookmarkClick = async (bookmark: Bookmark) => {
    const newClickCount = bookmark.clickCount + 1;
    const now = Date.now();
    
    // Optimistically update UI
    setBookmarks(prev => prev.map(b => 
      b.id === bookmark.id ? { ...b, clickCount: newClickCount, lastAccessed: now } : b
    ));

    try {
      await updateBookmark(bookmark.id, { 
        clickCount: newClickCount, 
        lastAccessed: now 
      });
    } catch (error) {
      console.error('Error updating click count:', error);
      // Revert on error
      setBookmarks(prev => prev.map(b => 
        b.id === bookmark.id ? { ...b, clickCount: bookmark.clickCount, lastAccessed: bookmark.lastAccessed } : b
      ));
    }
  };

  // Bulk editing handlers
  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => removeBookmark(id)));
      setBookmarks(prev => prev.filter(b => !ids.includes(b.id)));
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert('Error deleting bookmarks. Please try again.');
    }
  };

  const handleBulkUpdateTags = async (ids: string[], tags: string[]) => {
    const updates = ids.map(async (id) => {
      try {
        await updateBookmark(id, { tags, updatedAt: Date.now() });
      } catch (error) {
        console.error(`Error updating tags for bookmark ${id}:`, error);
      }
    });
    
    await Promise.all(updates);
    setBookmarks(prev => prev.map(b => ids.includes(b.id) ? { ...b, tags, updatedAt: Date.now() } : b));
  };

  const handleBulkUpdateCategory = async (ids: string[], categoryId: string | undefined) => {
    const updates = ids.map(async (id) => {
      try {
        await updateBookmark(id, { categoryId, updatedAt: Date.now() });
      } catch (error) {
        console.error(`Error updating category for bookmark ${id}:`, error);
      }
    });
    
    await Promise.all(updates);
    setBookmarks(prev => prev.map(b => ids.includes(b.id) ? { ...b, categoryId, updatedAt: Date.now() } : b));
  };

  const handleBulkToggleFavorite = async (ids: string[], isFavorite: boolean) => {
    const updates = ids.map(async (id) => {
      try {
        await toggleBookmarkFavorite(id, isFavorite);
      } catch (error) {
        console.error(`Error toggling favorite for bookmark ${id}:`, error);
      }
    });
    
    await Promise.all(updates);
    setBookmarks(prev => prev.map(b => ids.includes(b.id) ? { ...b, isFavorite } : b));
  };

  const handleBulkToggleArchive = async (ids: string[], isArchived: boolean) => {
    const updates = ids.map(async (id) => {
      try {
        await updateBookmark(id, { isArchived, updatedAt: Date.now() });
      } catch (error) {
        console.error(`Error archiving bookmark ${id}:`, error);
      }
    });
    
    await Promise.all(updates);
    setBookmarks(prev => prev.map(b => ids.includes(b.id) ? { ...b, isArchived } : b));
  };

  const handleCategoryClick = (categoryId: string) => {
    // If 'all' is clicked, show all bookmarks (null selection)
    if (categoryId === 'all') {
      setSelectedCategory(null);
      setCurrentPage('bookmarks');
    } else if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      setCurrentPage('bookmarks');
    }
  };

  const openTagEditor = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setEditingTags([...bookmark.tags]);
    setEditingCategory(bookmark.categoryId);
    setNewTag('');
  };

  const addTagToEdit = () => {
    if (newTag.trim() && !editingTags.includes(newTag.trim())) {
      setEditingTags([...editingTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTagFromEdit = (tag: string) => {
    setEditingTags(editingTags.filter(t => t !== tag));
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !currentUser) return;
    
    try {
      const newCategoryData = {
        userId: currentUser.uid,
        name: newCategoryName.trim(),
        color: newCategoryColor,
        icon: 'folder',
        order: categories.length,
        parentId: null,
        bookmarkCount: 0,
        createdAt: Date.now()
      };
      
      console.log('Adding new category:', newCategoryData);
      const categoryId = await saveCategoryToFirestore(newCategoryData);
      
      const newCategory: Category = {
        id: categoryId,
        ...newCategoryData
      };
      
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setNewCategoryColor('#3B82F6');
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? Bookmarks in this category will not be deleted.')) {
      return;
    }
    
    try {
      await deleteCategoryFromFirestore(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      
      // If the deleted category was selected, clear the selection
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };

  const handleImportBookmarks = async (importedBookmarks: Partial<Bookmark>[]) => {
    if (!currentUser) return;

    try {
      const successfulImports: Bookmark[] = [];
      
      for (const bookmark of importedBookmarks) {
        try {
          // Try to fetch metadata for each bookmark
          let metadata = null;
          try {
            metadata = await fetchUrlMetadata(bookmark.url || '');
          } catch (error) {
            console.log('Failed to fetch metadata for:', bookmark.url);
          }

          const bookmarkData = {
            userId: currentUser.uid,
            url: bookmark.url || '',
            title: bookmark.title || metadata?.title || bookmark.url || 'Untitled',
            description: bookmark.description || metadata?.description || '',
            tags: bookmark.tags || metadata?.tags || [],
            categoryId: bookmark.categoryId,
            isFavorite: bookmark.isFavorite || false,
            isArchived: bookmark.isArchived || false,
            favicon: metadata?.favicon || '',
            domain: metadata?.domain || new URL(bookmark.url || '').hostname,
            createdAt: Date.now(),
            lastAccessed: Date.now(),
            clickCount: 0
          };

          const bookmarkId = await saveBookmarkToFirestore(bookmarkData);
          successfulImports.push({ id: bookmarkId, ...bookmarkData });
        } catch (error) {
          console.error('Failed to import bookmark:', bookmark.url, error);
        }
      }

      // Add successful imports to state
      if (successfulImports.length > 0) {
        setBookmarks(prev => [...prev, ...successfulImports]);
      }
    } catch (error) {
      console.error('Error during import:', error);
      throw error;
    }
  };

  if (!currentUser) {
    return <Landing />;
  }

  return (
    <div className="flex bg-parchment min-h-screen text-charcoal dark:bg-ink dark:text-offwhite transition-colors duration-300">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
        onAddCategory={() => setIsAddingCategory(true)}
        bookmarks={bookmarks}
      />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {currentPage === 'dashboard' && (
            <Dashboard 
              bookmarks={bookmarks}
              categories={categories}
              onAdd={() => setIsAdding(true)}
              onDelete={deleteBookmark}
              onToggleFavorite={toggleFavorite}
              onEditTags={openTagEditor}
              onNavigate={setCurrentPage}
              onClick={handleBookmarkClick}
            />
          )}
          {currentPage === 'bookmarks' && (
            <Bookmarks 
              bookmarks={selectedCategory ? bookmarks.filter(b => b.categoryId === selectedCategory) : bookmarks}
              onDelete={deleteBookmark}
              onToggleFavorite={toggleFavorite}
              onEditTags={openTagEditor}
              selectedCategory={selectedCategory}
              categories={categories}
              onClick={handleBookmarkClick}
            />
          )}
          {currentPage === 'analytics' && (
            <BulkEdit
              bookmarks={bookmarks}
              categories={categories}
              onDelete={handleBulkDelete}
              onUpdateTags={handleBulkUpdateTags}
              onUpdateCategory={handleBulkUpdateCategory}
              onToggleFavorite={handleBulkToggleFavorite}
              onToggleArchive={handleBulkToggleArchive}
            />
          )}
          {currentPage === 'settings' && (
            <Settings 
              categories={categories}
              onDeleteCategory={handleDeleteCategory}
              onImportBookmarks={handleImportBookmarks}
            />
          )}
        </div>
      </main>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/40 backdrop-blur-md dark:bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-in zoom-in duration-300 dark:bg-black dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">New Bookmark</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gold/10 rounded-full transition-colors dark:hover:bg-steel/20">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate/60 dark:text-lightgrey/60 uppercase tracking-widest block mb-2">Website URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40 dark:text-lightgrey/40" size={18} />
                  <input 
                    type="url" 
                    placeholder="https://example.com"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-white border border-gold/20 rounded-2xl pl-10 pr-4 py-4 text-base focus:ring-2 focus:ring-navy outline-none transition-all dark:bg-ink dark:border-steel/30 dark:focus:ring-teal"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate/60 dark:text-lightgrey/60 uppercase tracking-widest block mb-2">Category (Optional)</label>
                <select
                  value={selectedCategoryForNewBookmark || ''}
                  onChange={(e) => setSelectedCategoryForNewBookmark(e.target.value || undefined)}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-4 text-base focus:ring-2 focus:ring-black outline-none transition-all dark:bg-gray-900 dark:focus:ring-white"
                >
                  <option value="">No Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-sage/10 rounded-2xl border border-sage/20 dark:bg-teal/5 dark:border-teal/20">
                <div className="flex gap-3">
                  <Sparkles size={20} className="text-sage shrink-0 dark:text-teal" />
                  <div>
                    <h4 className="text-sm font-semibold text-navy dark:text-teal">Smart Meta Extraction</h4>
                    <p className="text-xs text-slate/70 mt-1 dark:text-lightgrey/70 leading-relaxed">Gemini will automatically fetch title, description, and generate relevant tags for this link.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAddBookmark}
                disabled={isProcessing || !newUrl}
                className="w-full bg-navy text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-navy/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:bg-teal dark:text-ink dark:hover:bg-teal/80"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                {isProcessing ? 'Analyzing Website...' : 'Save Bookmark'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/40 backdrop-blur-md dark:bg-ink/40">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gold/20 animate-in zoom-in duration-300 dark:bg-deepslate dark:border-steel/30">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">New Category</h2>
              <button onClick={() => setIsAddingCategory(false)} className="p-2 hover:bg-gold/10 rounded-full transition-colors dark:hover:bg-steel/20">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate/60 dark:text-lightgrey/60 uppercase tracking-widest block mb-2">Category Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Work, Personal, Learning"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="w-full bg-white border border-gold/20 rounded-2xl px-4 py-4 text-base focus:ring-2 focus:ring-navy outline-none transition-all dark:bg-ink dark:border-steel/30 dark:focus:ring-teal"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate/60 dark:text-lightgrey/60 uppercase tracking-widest block mb-2">Color</label>
                <div className="flex gap-3 flex-wrap">
                  {['#1D3557', '#8AB17D', '#E9C46A', '#E76F51', '#457B9D', '#A8DADC', '#3B82F6', '#10B981'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewCategoryColor(color)}
                      className={`w-10 h-10 rounded-full transition-all ${newCategoryColor === color ? 'ring-2 ring-offset-2 ring-navy dark:ring-teal' : 'hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsAddingCategory(false)}
                  className="flex-1 bg-gold/20 text-charcoal py-3 rounded-2xl font-medium hover:bg-gold/30 transition-all dark:bg-steel/20 dark:text-lightgrey dark:hover:bg-steel/30"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="flex-1 bg-navy text-white py-3 rounded-2xl font-medium hover:bg-navy/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:bg-teal dark:text-ink dark:hover:bg-teal/80"
                >
                  Create Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tags Modal */}
      {editingBookmark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/40 backdrop-blur-md dark:bg-ink/40">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-gold/20 animate-in zoom-in duration-300 dark:bg-deepslate dark:border-steel/30">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Edit Bookmark</h2>
              <button onClick={() => { setEditingBookmark(null); setEditingCategory(undefined); }} className="p-2 hover:bg-gold/10 rounded-full transition-colors dark:hover:bg-steel/20">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate/60 dark:text-lightgrey/60 uppercase tracking-widest block mb-2">Bookmark</label>
                <p className="text-sm font-medium truncate">{editingBookmark.title}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate/60 dark:text-lightgrey/60 uppercase tracking-widest block mb-2">Category</label>
                <select
                  value={editingCategory || ''}
                  onChange={(e) => setEditingCategory(e.target.value || undefined)}
                  className="w-full bg-white border border-gold/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-navy outline-none transition-all dark:bg-ink dark:border-steel/30 dark:focus:ring-teal"
                >
                  <option value="">No Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate/60 dark:text-lightgrey/60 uppercase tracking-widest block mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editingTags.length === 0 ? (
                    <span className="text-sm text-slate/60 dark:text-lightgrey/60">No tags yet</span>
                  ) : (
                    editingTags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/20 text-charcoal text-sm rounded-full dark:bg-steel/20 dark:text-offwhite">
                        {tag}
                        <button 
                          onClick={() => removeTagFromEdit(tag)} 
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate/60 dark:text-lightgrey/60 uppercase tracking-widest block mb-2">Add New Tag</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter tag name"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTagToEdit()}
                    className="flex-1 bg-white border border-gold/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-navy outline-none transition-all dark:bg-ink dark:border-steel/30 dark:focus:ring-teal"
                  />
                  <button 
                    onClick={addTagToEdit}
                    disabled={!newTag.trim()}
                    className="px-4 py-3 bg-gold/20 text-charcoal rounded-xl text-sm font-medium hover:bg-gold/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-steel/20 dark:text-lightgrey dark:hover:bg-steel/30"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => { setEditingBookmark(null); setEditingCategory(undefined); }}
                  className="flex-1 bg-gold/20 text-charcoal py-3 rounded-2xl font-medium hover:bg-gold/30 transition-all dark:bg-steel/20 dark:text-lightgrey dark:hover:bg-steel/30"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => updateBookmarkTags(editingBookmark.id, editingTags)}
                  className="flex-1 bg-navy text-white py-3 rounded-2xl font-medium hover:bg-navy/80 transition-all dark:bg-teal dark:text-ink dark:hover:bg-teal/80"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
