
import React from 'react';
import { ExternalLink, Star, Archive, MoreVertical, Trash2, Tag } from 'lucide-react';
import { Bookmark, ViewMode } from '../types';

interface BookmarkCardProps {
  bookmark: Bookmark;
  viewMode: ViewMode;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEditTags: (bookmark: Bookmark) => void;
  onClick?: (bookmark: Bookmark) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, viewMode, onDelete, onToggleFavorite, onEditTags, onClick }) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(bookmark);
    }
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };
  if (viewMode === ViewMode.LIST) {
    return (
      <div 
        onClick={handleCardClick}
        className="group flex items-center gap-4 p-3 bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer dark:bg-black dark:border-gray-900 dark:hover:bg-gray-950"
      >        <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center dark:bg-gray-900">
          {bookmark.favicon ? (
            <img src={bookmark.favicon} alt="" className="w-6 h-6 object-contain" />
          ) : (
            // Accessing domain through metadata
            <div className="text-xs font-bold text-gray-400">{bookmark.metadata.domain[0].toUpperCase()}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium truncate">{bookmark.title}</h4>
            {/* Accessing domain through metadata */}
            <span className="text-[10px] text-gray-400 truncate">{bookmark.metadata.domain}</span>
          </div>
          <div className="flex gap-1 mt-1">
            {bookmark.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[9px] text-gray-400">#{tag}</span>
            ))}
          </div>
        </div>
        <div className="hidden group-hover:flex items-center gap-2 pr-2">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEditTags(bookmark);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-black transition-colors dark:hover:bg-gray-800 dark:hover:text-white"
            title="Edit tags and category"
          >
            <Tag size={14} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(bookmark.id);
            }}
            className={`p-1.5 rounded-lg hover:bg-gray-200 transition-colors dark:hover:bg-gray-800 ${bookmark.isFavorite ? 'text-amber-500' : 'text-gray-400'}`}
          >
            <Star size={14} fill={bookmark.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(bookmark.id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors dark:hover:bg-red-950"
          >
            <Trash2 size={14} />
          </button>
          <a 
            href={bookmark.url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-black transition-colors dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/50 transition-all cursor-pointer dark:bg-black dark:border-gray-800 dark:hover:shadow-none"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {bookmark.favicon && <img src={bookmark.favicon} alt="" className="w-3 h-3" />}
            {/* Accessing domain through metadata */}
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{bookmark.metadata.domain}</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditTags(bookmark);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black transition-colors dark:hover:bg-gray-900 dark:hover:text-white"
              title="Edit tags and category"
            >
              <Tag size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(bookmark.id);
              }}
              className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-900 ${bookmark.isFavorite ? 'text-amber-500' : 'text-gray-400'}`}
            >
              <Star size={14} fill={bookmark.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(bookmark.id);
              }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors dark:hover:bg-red-950"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <h4 className="font-semibold text-sm line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">{bookmark.title}</h4>
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{bookmark.description}</p>
        <div className="flex flex-wrap gap-1">
          {bookmark.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-[10px] text-gray-500 rounded-full dark:bg-gray-900">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;
