import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext.tsx'; // Import from AuthContext
import { useFirebase } from '../context/firebaseContext.tsx'; // Import from FirebaseContext
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    const { user } = useAuth();
    const { auth, db, storage } = useFirebase();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [bio, setBio] = useState('');
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
            let photoURL = user?.photoURL;
            if (profilePic && user) {
                const storageRef = ref(storage, `profile-pics/${user.uid}`);
                await uploadBytes(storageRef, profilePic);
                photoURL = await getDownloadURL(storageRef);
            }

            if (user) {
                await updateProfile(user, { displayName, photoURL });

                const userDocRef = doc(db, "users", user.uid);
                const userData = { displayName, bio, height, weight, bodyFat };
                await updateDoc(userDocRef, userData);

                setSuccess('Profile updated successfully.');
            }
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
                    <label className="label">Bio</label>
                    <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                </div>
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
                <button type="submit" className="button is-primary">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
