
export enum ViewMode {
  GRID = 'grid',
  LIST = 'list'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface UserPreferences {
  theme: Theme;
  defaultView: ViewMode;
  language: string;
}

export interface BookmarkMetadata {
  domain: string;
  image?: string;
  author?: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  tags: string[];
  categoryId?: string;
  isFavorite: boolean;
  isArchived: boolean;
  metadata: BookmarkMetadata;
  clickCount: number;
  lastAccessed: number;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  parentId: string | null;
  order: number;
  bookmarkCount: number;
  createdAt: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: UserPreferences;
  createdAt: number;
  lastLogin: number;
}
