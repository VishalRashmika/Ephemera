// Firebase Connection Test Utility
// Run this in the browser console to test Firebase connection

import { db } from './config/firebase';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  console.log('=== Testing Firebase Connection ===');
  
  try {
    // Test 1: Check if db is initialized
    console.log('1. Checking Firestore instance:', db ? '✓ Initialized' : '✗ Not initialized');
    
    if (!db) {
      console.error('Firestore is not initialized!');
      return false;
    }
    
    // Test 2: Try to write a test document
    console.log('2. Attempting to write test document...');
    const testData = {
      test: true,
      message: 'Firebase connection test',
      timestamp: Timestamp.now(),
      createdAt: Timestamp.fromMillis(Date.now())
    };
    
    const docRef = await addDoc(collection(db, 'test_connection'), testData);
    console.log('✓ Test document written successfully! ID:', docRef.id);
    
    // Test 3: Try to read from the collection
    console.log('3. Attempting to read test documents...');
    const querySnapshot = await getDocs(collection(db, 'test_connection'));
    console.log('✓ Read successful! Found', querySnapshot.size, 'documents');
    
    console.log('=== All Firebase tests passed! ===');
    return true;
    
  } catch (error) {
    console.error('✗ Firebase test failed:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      code: (error as any)?.code
    });
    
    // Check for common Firebase errors
    if ((error as any)?.code === 'permission-denied') {
      console.error('');
      console.error('🔒 PERMISSION DENIED ERROR');
      console.error('This usually means your Firestore security rules are blocking writes.');
      console.error('');
      console.error('To fix this, go to Firebase Console:');
      console.error('1. Open your Firebase project');
      console.error('2. Go to Firestore Database > Rules');
      console.error('3. Update your rules to allow authenticated users to write:');
      console.error('');
      console.error('rules_version = \'2\';');
      console.error('service cloud.firestore {');
      console.error('  match /databases/{database}/documents {');
      console.error('    match /{document=**} {');
      console.error('      allow read, write: if request.auth != null;');
      console.error('    }');
      console.error('  }');
      console.error('}');
      console.error('');
    }
    
    return false;
  }
};

// Auto-run test if this file is imported
console.log('Firebase test utility loaded. Run testFirebaseConnection() to test your connection.');
