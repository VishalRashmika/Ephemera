import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

/**
 * Sign in with Google using popup
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Create or update user profile in Firestore
    await createUserProfile(result.user);
    
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(result.user, { displayName });
    
    // Create user profile in Firestore
    await createUserProfile(result.user);
    
    return result;
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Create or update user profile in Firestore
 */
const createUserProfile = async (user: User): Promise<void> => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Create new user profile
    const { email, displayName, photoURL } = user;
    
    try {
      await setDoc(userRef, {
        email,
        displayName,
        photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  } else {
    // Update existing user profile
    try {
      await setDoc(
        userRef,
        {
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
