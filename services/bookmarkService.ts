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
    console.log('=== Starting bookmark save to Firestore ===');
    console.log('User ID:', bookmark.userId);
    console.log('URL:', bookmark.url);
    console.log('Full bookmark data:', JSON.stringify(bookmark, null, 2));
    
    // Prepare data for Firestore (remove undefined fields)
    const firestoreData: any = {
      ...bookmark,
      createdAt: Timestamp.fromMillis(bookmark.createdAt),
      updatedAt: Timestamp.fromMillis(bookmark.updatedAt),
      lastAccessed: Timestamp.fromMillis(bookmark.lastAccessed)
    };
    
    // Remove undefined fields (Firestore doesn't allow undefined values)
    Object.keys(firestoreData).forEach(key => {
      if (firestoreData[key] === undefined) {
        delete firestoreData[key];
      }
    });
    
    console.log('Cleaned data for Firestore:', JSON.stringify(firestoreData, null, 2));
    
    const docRef = await addDoc(collection(db, BOOKMARKS_COLLECTION), firestoreData);
    
    console.log('✓ Bookmark saved successfully with ID:', docRef.id);
    console.log('=== Bookmark save complete ===');
    return docRef.id;
  } catch (error) {
    console.error('✗ ERROR adding bookmark to Firestore:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      code: (error as any)?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

// Get all bookmarks for a specific user
export const getUserBookmarks = async (userId: string): Promise<Bookmark[]> => {
  try {
    console.log('=== getUserBookmarks called ===');
    console.log('User ID:', userId);
    console.log('Firestore DB instance:', db ? 'Connected' : 'Not connected');
    
    const q = query(
      collection(db, BOOKMARKS_COLLECTION),
      where('userId', '==', userId)
    );
    
    console.log('Executing Firestore query...');
    const querySnapshot = await getDocs(q);
    console.log('Query completed. Found', querySnapshot.size, 'documents');
    
    const bookmarks: Bookmark[] = [];
    const invalidDocs: string[] = [];
    
    querySnapshot.forEach((doc) => {
      try {
        const data = doc.data();
        console.log(`Processing document ${doc.id}:`, {
          hasUrl: !!data.url,
          hasUserId: !!data.userId,
          userId: data.userId,
          title: data.title
        });
        
        // Validate required fields
        if (!data.url || !data.userId) {
          console.warn('Skipping invalid bookmark (missing required fields):', doc.id, data);
          invalidDocs.push(doc.id);
          return;
        }
        
        bookmarks.push({
          id: doc.id,
          userId: data.userId,
          url: data.url,
          title: data.title || 'Untitled',
          description: data.description || '',
          favicon: data.favicon || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          categoryId: data.categoryId || undefined,
          isFavorite: data.isFavorite || false,
          isArchived: data.isArchived || false,
          metadata: data.metadata && typeof data.metadata === 'object' ? data.metadata : {},
          clickCount: data.clickCount || 0,
          lastAccessed: data.lastAccessed?.toMillis() || Date.now(),
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: data.updatedAt?.toMillis() || Date.now()
        });
      } catch (error) {
        console.error('Error processing bookmark document:', doc.id, error);
        invalidDocs.push(doc.id);
      }
    });
    
    if (invalidDocs.length > 0) {
      console.warn(`Skipped ${invalidDocs.length} invalid bookmark(s):`, invalidDocs);
    }
    
    console.log(`✓ Successfully processed ${bookmarks.length} valid bookmarks`);
    
    // Sort by createdAt descending (most recent first) in memory
    bookmarks.sort((a, b) => b.createdAt - a.createdAt);
    
    return bookmarks;
  } catch (error) {
    console.error('=== getUserBookmarks Error ===');
    console.error('Error getting bookmarks:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      code: (error as any)?.code,
      name: (error as any)?.name
    });
    throw error;
  }
};

// Delete a bookmark
export const removeBookmark = async (bookmarkId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, BOOKMARKS_COLLECTION, bookmarkId));
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    
    // Check if it's a permission error
    const errorCode = (error as any)?.code;
    if (errorCode === 'permission-denied') {
      console.error('\n🔒 PERMISSION DENIED - Firestore Security Rules Issue');
      console.error('Your Firestore security rules need to allow DELETE operations.');
      console.error('\nTo fix this:');
      console.error('1. Go to Firebase Console → Firestore Database → Rules');
      console.error('2. Make sure you have this rule for bookmarks:');
      console.error('   allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;');
      console.error('3. Click "Publish" to save the rules');
      console.error('\nSee FIRESTORE_RULES.md in your project for complete rules.\n');
      
      throw new Error('Permission denied. Please update your Firestore security rules to allow delete operations. Check the browser console for details.');
    }
    
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
    if (updates.createdAt) {
      updateData.createdAt = Timestamp.fromMillis(updates.createdAt);
    }
    
    // Remove undefined fields (Firestore doesn't allow undefined values)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
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
