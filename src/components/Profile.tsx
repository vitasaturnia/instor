import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useFirebase } from '../context/firebaseContext.tsx';
import { updateProfile, updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    const { user } = useAuth();
    const { auth, db, storage } = useFirebase();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [region, setRegion] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [bio, setBio] = useState('');
    const [showStats, setShowStats] = useState(false);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bodyFat, setBodyFat] = useState('');
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    const handleUpdateProfile = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Update Email
            if (user && email !== user.email) {
                await updateEmail(user, email);
            }

            // Update Password
            if (newPassword && user) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
            }

            // Update Profile Picture
            let photoURL = user?.photoURL;
            if (profilePic && user) {
                const storageRef = ref(storage, `profile-pics/${user.uid}`);
                await uploadBytes(storageRef, profilePic);
                photoURL = await getDownloadURL(storageRef);
            }

            // Update Firebase Auth Profile
            await updateProfile(user, { displayName, photoURL });

            // Update Additional User Data in Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userData = { displayName, bio, region, stats: { height, weight, bodyFat } };
            await updateDoc(userDocRef, userData);

            setSuccess('Profile updated successfully.');
        } catch (error) {
            setError('Failed to update profile: ' + error.message);
        }
    };

    const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setProfilePic(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const toggleStats = () => setShowStats(!showStats);

    return (
        <div className="container mt-5">
            <h1 className="title">Profile</h1>
            {error && <div className="notification is-danger">{error}</div>}
            {success && <div className="notification is-success">{success}</div>}

            <div className="profile-pic-wrapper" onClick={triggerFileInput}>
                <FontAwesomeIcon icon={faUserCircle} size="3x" />
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleProfilePicChange} style={{ display: 'none' }} />

            <form onSubmit={handleUpdateProfile} className="box">
                <div className="field">
                    <label className="label">Display Name</label>
                    <input className="input" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>

                <div className="field">
                    <label className="label">Email</label>
                    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="field">
                    <label className="label">Region</label>
                    <input className="input" type="text" value={region} onChange={(e) => setRegion(e.target.value)} />
                </div>

                <div className="field">
                    <label className="label">Bio</label>
                    <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                </div>

                <div className="field">
                    <label className="label">New Password</label>
                    <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>

                <div className="field">
                    <label className="label">Current Password</label>
                    <input className="input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>

                <div className="button is-text" onClick={toggleStats}>Toggle Stats</div>
                {showStats && (
                    <div className="box">
                        <h2 className="subtitle">Stats</h2>
                        <div className="field">
                            <label className="label">Height</label>
                            <input className="input" type="text" value={height} onChange={(e) => setHeight(e.target.value)} />
                        </div>
                        <div className="field">
                            <label className="label">Weight</label>
                            <input className="input" type="text" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                        <div className="field">
                            <label className="label">Body Fat %</label>
                            <input className="input" type="text" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} />
                        </div>
                    </div>
                )}

                <button type="submit" className="button is-primary">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
