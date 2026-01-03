import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square,
  Trash2,
  Star,
  Archive
} from 'lucide-react';
import { Bookmark, Category } from '../types';

interface BulkEditProps {
  bookmarks: Bookmark[];
  categories: Category[];
  onDelete: (ids: string[]) => void;
  onUpdateTags: (ids: string[], tags: string[]) => void;
  onUpdateCategory: (ids: string[], categoryId: string | undefined) => void;
  onToggleFavorite: (ids: string[], isFavorite: boolean) => void;
  onToggleArchive: (ids: string[], isArchived: boolean) => void;
}

const BulkEdit: React.FC<BulkEditProps> = ({ 
  bookmarks, 
  categories, 
  onDelete,
  onUpdateTags,
  onUpdateCategory,
  onToggleFavorite,
  onToggleArchive
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkTags, setBulkTags] = useState('');
  const [bulkCategory, setBulkCategory] = useState<string>('');

  const toggleBookmark = (bookmarkId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(bookmarkId)) {
      newSelected.delete(bookmarkId);
    } else {
      newSelected.add(bookmarkId);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === bookmarks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(bookmarks.map(b => b.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected bookmark(s)?`)) return;
    
    onDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBulkUpdateTags = () => {
    if (selectedIds.size === 0 || !bulkTags.trim()) return;
    
    const tags = bulkTags.split(',').map(t => t.trim()).filter(t => t);
    onUpdateTags(Array.from(selectedIds), tags);
    setBulkTags('');
    setSelectedIds(new Set());
  };

  const handleBulkUpdateCategory = () => {
    if (selectedIds.size === 0 || !bulkCategory) return;
    
    onUpdateCategory(Array.from(selectedIds), bulkCategory === 'none' ? undefined : bulkCategory);
    setBulkCategory('');
    setSelectedIds(new Set());
  };

  const handleBulkFavorite = () => {
    if (selectedIds.size === 0) return;
    onToggleFavorite(Array.from(selectedIds), true);
    setSelectedIds(new Set());
  };

  const handleBulkArchive = () => {
    if (selectedIds.size === 0) return;
    onToggleArchive(Array.from(selectedIds), true);
    setSelectedIds(new Set());
  };

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Bulk Edit</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and edit multiple bookmarks at once
        </p>
      </header>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950 dark:border-blue-900">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                {selectedIds.size} bookmark{selectedIds.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Add tags (comma-separated)"
                value={bulkTags}
                onChange={(e) => setBulkTags(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-900 dark:border-gray-700"
              />
              <button
                onClick={handleBulkUpdateTags}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Tags
              </button>
              
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="">Move to category...</option>
                <option value="none">Uncategorized</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={handleBulkUpdateCategory}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Move
              </button>
              
              <button
                onClick={handleBulkFavorite}
                className="p-1.5 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors dark:bg-amber-900 dark:text-amber-400"
                title="Add to favorites"
              >
                <Star size={16} />
              </button>
              
              <button
                onClick={handleBulkArchive}
                className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-400"
                title="Archive"
              >
                <Archive size={16} />
              </button>
              
              <button
                onClick={handleBulkDelete}
                className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-400"
                title="Delete selected"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLI-Style Table */}
      <div className="border border-gray-300 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-400 dark:bg-gray-900 dark:border-gray-600">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <button onClick={toggleSelectAll}>
                  {selectedIds.size === bookmarks.length && bookmarks.length > 0 ? (
                    <CheckSquare size={14} className="text-blue-600" />
                  ) : (
                    <Square size={14} className="text-gray-500" />
                  )}
                </button>
              </th>
              <th className="px-3 py-2 text-left font-mono font-bold text-[11px] uppercase tracking-wider text-gray-700 dark:text-gray-300">Title</th>
              <th className="px-3 py-2 text-left font-mono font-bold text-[11px] uppercase tracking-wider text-gray-700 dark:text-gray-300">Category</th>
              <th className="px-3 py-2 text-left font-mono font-bold text-[11px] uppercase tracking-wider text-gray-700 dark:text-gray-300">Created</th>
              <th className="px-3 py-2 text-center font-mono font-bold text-[11px] uppercase tracking-wider text-gray-700 dark:text-gray-300">Fav</th>
              <th className="px-3 py-2 text-left font-mono font-bold text-[11px] uppercase tracking-wider text-gray-700 dark:text-gray-300">Tags</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black font-mono text-xs">
            {bookmarks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-12 text-center text-gray-500">
                  No bookmarks found.
                </td>
              </tr>
            ) : (
              bookmarks.map((bookmark, index) => {
                const isSelected = selectedIds.has(bookmark.id);
                
                return (
                  <tr
                    key={bookmark.id}
                    className={`border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-950' : index % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-950/50' : ''
                    }`}
                  >
                    <td className="px-3 py-2">
                      <button onClick={() => toggleBookmark(bookmark.id)}>
                        {isSelected ? (
                          <CheckSquare size={14} className="text-blue-600" />
                        ) : (
                          <Square size={14} className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <div className="truncate max-w-md" title={bookmark.title}>
                        {bookmark.title}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                      {getCategoryName(bookmark.categoryId)}
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {bookmark.isFavorite ? '★' : '─'}
                    </td>
                    <td className="px-3 py-2">
                      {bookmark.tags.length > 0 ? bookmark.tags.join(', ') : '─'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {bookmarks.length > 0 && (
        <div className="font-mono text-xs text-gray-500">
          {bookmarks.length} row{bookmarks.length !== 1 ? 's' : ''} | {selectedIds.size} selected
        </div>
      )}
    </div>
  );
};

export default BulkEdit;
