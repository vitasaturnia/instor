// Logout.tsx
import React from 'react';
import { useFirebase } from '../context/firebaseContext';

interface LogoutProps {
    // Add any props if needed
}

const Logout: React.FC<LogoutProps> = () => {
    const { auth } = useFirebase();

    const handleLogout = async (): Promise<void> => {
        try {
            await auth.signOut();
        } catch (error) {
            if (error instanceof Error) {
                console.error('Logout error:', error.message);
                // Handle error and display to the user
            } else {
                console.error('Unknown logout error:', error);
            }
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
