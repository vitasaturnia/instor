import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useFirebase } from '../context/firebaseContext.tsx';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = () => {
    const { user, auth, storage } = useFirebase();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUpdateProfile = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (newPassword) {
                // Re-authentication is required for password update
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
            }

            if (profilePic) {
                const storageRef = ref(storage, `profile-pics/${user.uid}`);
                await uploadBytes(storageRef, profilePic);
                const photoURL = await getDownloadURL(storageRef);
                await updateProfile(user, { displayName, photoURL });
            } else {
                await updateProfile(user, { displayName });
            }

            setSuccess('Profile updated successfully.');
        } catch (error) {
            setError('Failed to update profile. ' + error.message);
        }
    };

    const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePic(e.target.files[0]);
        }
    };

    return (
        <div>
            <h1>Profile</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
            <form onSubmit={handleUpdateProfile}>
                <div>
                    <label>Display Name</label>
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div>
                    <label>New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div>
                    <label>Current Password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div>
                    <label>Profile Picture</label>
                    <input type="file" accept="image/*" onChange={handleProfilePicChange} />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
