import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../context/firebaseContext';

interface AuthContextValue {
    user: firebase.User | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { auth } = useContext(FirebaseContext)!; // Ensure that FirebaseContext is not null
    const [user, setUser] = useState<firebase.User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return unsubscribe;
    }, [auth]);

    const value: AuthContextValue = { user };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
