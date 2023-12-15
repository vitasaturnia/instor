// FirebaseContext.tsx

import React, { createContext, useContext } from 'react';
import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

interface FirebaseContextProps {
    auth: Auth;
    db: Firestore;
}

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
};

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export const FirebaseContext = createContext<FirebaseContextProps>({ auth, db });

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <FirebaseContext.Provider value={{ auth, db }}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
    const { auth, db } = useContext(FirebaseContext);
    if (!auth || !db) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return { auth, db };
};
