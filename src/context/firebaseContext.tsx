// FirebaseContext.js
import { createContext, useContext } from 'react';
import { auth } from './FirebaseConfig';

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
    return <FirebaseContext.Provider value={{ auth }}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
    return useContext(FirebaseContext);
};
