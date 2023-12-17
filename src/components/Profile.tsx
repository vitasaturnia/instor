import React, { useState, useRef, FormEvent, ChangeEvent, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../context/firebaseContext';
import {
    updateProfile,
    updateEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    const { user } = useAuth();
    const { db, storage } = useFirebase();
    const firestore = getFirestore();
    const [email, setEmail] = useState<string>('');
    const [region, setRegion] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [showStats, setShowStats] = useState<boolean>(false);
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [bodyFat, setBodyFat] = useState<string>('');
    const [bestLifts, setBestLifts] = useState<Array<{ lift: string; weight: string }>>([
        { lift: '', weight: '' },
    ]);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [showBestLifts, setShowBestLifts] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            getDoc(userDocRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data() || {};
                        setUsername(userData.username || ''); // Set the username state variable with the actual username
                        setEmail(userData.email || '');
                        setRegion(userData.region || '');
                        setBio(userData.bio || '');
                        setHeight(userData.stats?.height || '');
                        setWeight(userData.stats?.weight || '');
                        setBodyFat(userData.stats?.bodyFat || '');
                        setBestLifts(userData.bestLifts || [{ lift: '', weight: '' }]);
                    } else {
                        setEmail(user.email || '');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [user, db]);


    const handleUpdateProfile = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword && newPassword !== currentPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            if (user) {
                if (email !== user.email) {
                    await updateEmail(user, email);
                }
                if (newPassword) {
                    const credential = EmailAuthProvider.credential(user.email, currentPassword);
                    await reauthenticateWithCredential(user, credential);
                    await updatePassword(user, newPassword);
                }

                let photoURL = user.photoURL;
                if (profilePic) {
                    const storageRef = ref(storage, `profile-pics/${user.uid}`);
                    await uploadBytes(storageRef, profilePic);
                    photoURL = await getDownloadURL(storageRef);
                }

                await updateProfile(user, { displayName: username, photoURL });

                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, {
                    username,
                    bio,
                    region,
                    stats: { height, weight, bodyFat },
                    bestLifts,
                });

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
        fileInputRef.current?.click();
    };

    const handleBestLiftChange = (index: number, key: string, value: string) => {
        const updatedBestLifts = bestLifts.map((lift, i) => {
            if (i === index) {
                return { ...lift, [key]: value };
            }
            return lift;
        });
        setBestLifts(updatedBestLifts);
    };

    const addBestLift = () => {
        if (bestLifts.length < 3) {
            setBestLifts([...bestLifts, { lift: '', weight: '' }]);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="title has-text-centered">Profile</h1>
            {error && <div className="notification is-danger">{error}</div>}
            {success && <div className="notification is-success">{success}</div>}

            <div className="profile-pic-wrapper" onClick={triggerFileInput}>
                <FontAwesomeIcon icon={faUserCircle} size="2x" className="profile-pic" />
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleProfilePicChange} style={{ display: 'none' }} />

            <form onSubmit={handleUpdateProfile} className="box">
                <div className="field">
                    <label className="label">Username</label>
                    <input
                        className="input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="field">
                    <label className="label">Email</label>
                    <input
                        className="input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="field">
                    <label className="label">Bio</label>
                    <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                </div>
                <div className="field">
                    <label className="label">Region</label>
                    <div className="select">
                        <select value={region} onChange={(e) => setRegion(e.target.value)}>
                            <option value="">Select Region</option>
                            <option value="North America">North America</option>
                            <option value="Central America">Central America</option>
                            <option value="South America">South America</option>
                            <option value="Europe">Europe</option>
                            <option value="Asia">Asia</option>
                            <option value="Africa">Africa</option>
                            <option value="Oceania">Oceania</option>
                        </select>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Stats</label>
                    <button
                        type="button"
                        className="button is-link is-light"
                        onClick={() => setShowStats(!showStats)}
                    >
                        {showStats ? 'Hide Stats' : 'Show Stats'}
                    </button>
                    {showStats && (
                        <div>
                            <div className="field">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Height (cm)"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                            </div>
                            <div className="field">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Weight (kg)"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </div>
                            <div className="field">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Body Fat (%)"
                                    value={bodyFat}
                                    onChange={(e) => setBodyFat(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="field">
                    <label className="label">Best Lifts</label>
                    <button
                        type="button"
                        className="button is-link is-light"
                        onClick={() => setShowBestLifts(!showBestLifts)}
                    >
                        {showBestLifts ? 'Hide Best Lifts' : 'Show Best Lifts'}
                    </button>
                    {showBestLifts && (
                        <div>
                            {bestLifts.map((lift, index) => (
                                <div key={index} className="field is-grouped">
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            placeholder="Lift"
                                            value={lift.lift}
                                            onChange={(e) => handleBestLiftChange(index, 'lift', e.target.value)}
                                        />
                                    </div>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="number"
                                            placeholder="Kg"
                                            value={lift.weight}
                                            onChange={(e) => handleBestLiftChange(index, 'weight', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                            {bestLifts.length < 3 && (
                                <button type="button" className="button is-link is-light" onClick={addBestLift}>
                                    Add Another Lift
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="field">
                    <label className="label">New Password</label>
                    <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="field">
                    <label className="label">Current Password</label>
                    <input
                        className="input"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div className="buttons">
                    <button type="submit" className="button is-primary">
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
