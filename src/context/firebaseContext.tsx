// FirebaseContext.tsx

import React, { createContext, useContext } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

interface FirebaseContextProps {
    auth: Auth;
}

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export const FirebaseContext = createContext<FirebaseContextProps>({ auth });

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <FirebaseContext.Provider value={{ auth }}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
    const { auth } = useContext(FirebaseContext);
    if (!auth) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return { auth };
};
