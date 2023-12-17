import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../context/firebaseContext';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = () => {
    const { user } = useAuth();
    const { auth, storage } = useFirebase();
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
            if (newPassword && user) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
            }

            let photoURL = user?.photoURL;
            if (profilePic && user) {
                const storageRef = ref(storage, `profile-pics/${user.uid}`);
                await uploadBytes(storageRef, profilePic);
                photoURL = await getDownloadURL(storageRef);
            }

            await updateProfile(user, { displayName, photoURL });
            setSuccess('Profile updated successfully.');
        } catch (error) {
            setError('Failed to update profile: ' + error.message);
        }
    };

    const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setProfilePic(file);
    };

    return (
        <div className="container mt-5">
            <h1 className="title">Profile</h1>
            {error && <div className="notification is-danger">{error}</div>}
            {success && <div className="notification is-success">{success}</div>}
            <form onSubmit={handleUpdateProfile} className="box">
                <div className="field">
                    <label className="label">Display Name</label>
                    <div className="control">
                        <input className="input" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">New Password</label>
                    <div className="control">
                        <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Current Password</label>
                    <div className="control">
                        <input className="input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Profile Picture</label>
                    <div className="file">
                        <label className="file-label">
                            <input className="file-input" type="file" accept="image/*" onChange={handleProfilePicChange} />
                            <span className="file-cta">
                                <span className="file-label">Choose a file…</span>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="control">
                    <button type="submit" className="button is-primary">Update Profile</button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
