import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Bookmark } from '../types';

const BOOKMARKS_COLLECTION = 'bookmarks';

// Add a new bookmark to Firestore
export const addBookmark = async (bookmark: Omit<Bookmark, 'id'>): Promise<string> => {
  try {
    console.log('Adding bookmark to Firestore:', bookmark);
    const docRef = await addDoc(collection(db, BOOKMARKS_COLLECTION), {
      ...bookmark,
      createdAt: Timestamp.fromMillis(bookmark.createdAt),
      updatedAt: Timestamp.fromMillis(bookmark.updatedAt),
      lastAccessed: Timestamp.fromMillis(bookmark.lastAccessed)
    });
    console.log('Bookmark added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

// Get all bookmarks for a specific user
export const getUserBookmarks = async (userId: string): Promise<Bookmark[]> => {
  try {
    console.log('Fetching bookmarks for user:', userId);
    const q = query(
      collection(db, BOOKMARKS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const bookmarks: Bookmark[] = [];
    
    console.log('Found', querySnapshot.size, 'bookmarks');
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookmarks.push({
        id: doc.id,
        userId: data.userId,
        url: data.url,
        title: data.title,
        description: data.description,
        favicon: data.favicon,
        tags: data.tags || [],
        categoryId: data.categoryId,
        isFavorite: data.isFavorite || false,
        isArchived: data.isArchived || false,
        metadata: data.metadata || {},
        clickCount: data.clickCount || 0,
        lastAccessed: data.lastAccessed?.toMillis() || Date.now(),
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now()
      });
    });
    
    // Sort by createdAt descending (most recent first) in memory
    bookmarks.sort((a, b) => b.createdAt - a.createdAt);
    
    return bookmarks;
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    throw error;
  }
};

// Delete a bookmark
export const removeBookmark = async (bookmarkId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, BOOKMARKS_COLLECTION, bookmarkId));
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    throw error;
  }
};

// Update a bookmark
export const updateBookmark = async (bookmarkId: string, updates: Partial<Bookmark>): Promise<void> => {
  try {
    const bookmarkRef = doc(db, BOOKMARKS_COLLECTION, bookmarkId);
    const updateData: any = { ...updates };
    
    // Convert timestamps if present
    if (updates.updatedAt) {
      updateData.updatedAt = Timestamp.fromMillis(updates.updatedAt);
    }
    if (updates.lastAccessed) {
      updateData.lastAccessed = Timestamp.fromMillis(updates.lastAccessed);
    }
    
    await updateDoc(bookmarkRef, updateData);
  } catch (error) {
    console.error('Error updating bookmark:', error);
    throw error;
  }
};

// Toggle favorite status
export const toggleBookmarkFavorite = async (bookmarkId: string, isFavorite: boolean): Promise<void> => {
  try {
    await updateBookmark(bookmarkId, { 
      isFavorite,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};
