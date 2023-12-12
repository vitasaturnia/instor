// Profile.js
import React from 'react';
import { useFirebase } from './FirebaseContext';

const Profile = () => {
    const { auth } = useFirebase();
    const user = auth.currentUser;

    return (
        <div>
            <h2>Profile</h2>
            {user ? (
                <p>Welcome, {user.email}!</p>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
};

export default Profile;
