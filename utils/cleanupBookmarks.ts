// Utility to clean up bookmarks with undefined values in Firestore
// Run this from the browser console if you have corrupted bookmarks

import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const cleanupBookmarks = async (userId: string) => {
  console.log('=== Starting Bookmark Cleanup ===');
  console.log('User ID:', userId);
  
  try {
    const bookmarksRef = collection(db, 'bookmarks');
    const snapshot = await getDocs(bookmarksRef);
    
    let cleaned = 0;
    let deleted = 0;
    let errors = 0;
    
    for (const docSnapshot of snapshot.docs) {
      try {
        const data = docSnapshot.data();
        
        // Skip if not the current user's bookmark
        if (data.userId !== userId) {
          continue;
        }
        
        // Check if bookmark is missing critical fields
        if (!data.url || !data.userId) {
          console.log('Deleting invalid bookmark (no URL):', docSnapshot.id);
          await deleteDoc(doc(db, 'bookmarks', docSnapshot.id));
          deleted++;
          continue;
        }
        
        // Build cleaned data object
        const cleanedData: any = {};
        let needsUpdate = false;
        
        // Check each field
        Object.keys(data).forEach(key => {
          if (data[key] === undefined) {
            console.log(`Found undefined ${key} in bookmark:`, docSnapshot.id);
            needsUpdate = true;
            // Don't include undefined fields
          } else {
            cleanedData[key] = data[key];
          }
        });
        
        // Update document if it had undefined values
        if (needsUpdate) {
          console.log('Cleaning bookmark:', docSnapshot.id);
          await updateDoc(doc(db, 'bookmarks', docSnapshot.id), cleanedData);
          cleaned++;
        }
      } catch (error) {
        console.error('Error processing bookmark:', docSnapshot.id, error);
        errors++;
      }
    }
    
    console.log('=== Cleanup Complete ===');
    console.log(`Cleaned: ${cleaned} bookmarks`);
    console.log(`Deleted: ${deleted} invalid bookmarks`);
    console.log(`Errors: ${errors}`);
    
    return { cleaned, deleted, errors };
  } catch (error) {
    console.error('Cleanup failed:', error);
    throw error;
  }
};

console.log('Cleanup utility loaded. Call cleanupBookmarks(userId) to clean your bookmarks.');
