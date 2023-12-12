// Logout.js
import React from 'react';
import { useFirebase } from './FirebaseContext';

const Logout = () => {
    const { auth } = useFirebase();

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Logout error:', error.message);
            // Handle error and display to the user
        }
    };

    return (
        <div>
            <h2>Logout</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
