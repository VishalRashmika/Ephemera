import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Category } from '../types';

const CATEGORIES_COLLECTION = 'categories';

// Add a new category to Firestore
export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  try {
    console.log('Adding category to Firestore:', category);
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...category,
      createdAt: Timestamp.fromMillis(category.createdAt)
    });
    console.log('Category added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Get all categories for a specific user
export const getUserCategories = async (userId: string): Promise<Category[]> => {
  try {
    console.log('Fetching categories for user:', userId);
    const q = query(
      collection(db, CATEGORIES_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const categories: Category[] = [];
    
    console.log('Found', querySnapshot.size, 'categories');
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        userId: data.userId,
        name: data.name,
        color: data.color,
        icon: data.icon,
        order: data.order,
        parentId: data.parentId || null,
        bookmarkCount: data.bookmarkCount || 0,
        createdAt: data.createdAt?.toMillis() || Date.now()
      });
    });
    
    // Sort by order
    categories.sort((a, b) => a.order - b.order);
    
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Delete a category
export const removeCategory = async (categoryId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (categoryId: string, updates: Partial<Category>): Promise<void> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await updateDoc(categoryRef, updates as any);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};
