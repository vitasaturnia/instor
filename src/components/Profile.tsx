import React from 'react';
import { useFirebase } from '../context/firebaseContext';

const Profile: React.FC = () => {
    const { auth } = useFirebase();
    const user = auth.currentUser;

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            // You can navigate to another page or show a success message after signing out
        } catch (error) {
            console.error('Sign out error:', error.message);
            // Handle sign out error
        }
    };

    return (
        <div>
            <h2>Profile</h2>
            {user ? (
                <>
                    <p>Welcome, {user.email}!</p>
                    <button onClick={handleSignOut} className="button is-danger">
                        Sign Out
                    </button>
                </>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
};

export default Profile;
