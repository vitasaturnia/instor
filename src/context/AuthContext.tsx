// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirebase } from './firebaseContext';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextValue {
    user: User | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { auth } = useFirebase();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
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
