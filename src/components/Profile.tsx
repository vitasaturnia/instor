import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faKey, faImage, faGlobe } from '@fortawesome/free-solid-svg-icons';

const Profile: React.FC = () => {
    const { auth, db, storage } = useFirebase();
    const user = auth.currentUser;
    const [username, setUsername] = useState<string>(user?.displayName || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [country, setCountry] = useState<string>('');

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            // You can navigate to another page or show a success message after signing out
        } catch (error) {
            console.error('Sign out error:', error.message);
            // Handle sign out error
        }
    };

    const handleUpdateProfile = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const userUpdate: any = {
                displayName: username,
                email,
            };

            if (password) {
                userUpdate.password = password;
            }

            if (country) {
                userUpdate.country = country;
            }

            await user?.updateProfile(userUpdate);

            if (profilePic) {
                const storageRef = storage.ref();
                const profilePicRef = storageRef.child(`profile-pics/${user?.uid}`);
                await profilePicRef.putString(profilePic, 'data_url');
            }

            // Optional: You can update user information in the database here

            // Reset password-related fields
            setPassword('');
            setConfirmPassword('');

            // You can navigate to another page or show a success message after updating the profile
        } catch (error) {
            console.error('Profile update error:', error.message);
            // Handle profile update error
        }
    };

    const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => setProfilePic(e.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="container mt-5">
            <div className="columns is-centered">
                <div className="column is-half">
                    <h2 className="title is-2">Profile</h2>

                    <div className="field">
                        <div className="profile-pic-wrapper">
                            <div className="profile-pic-circle">
                                {user?.photoURL ? (
                                    <img src={user?.photoURL} alt="Profile" />
                                ) : (
                                    <FontAwesomeIcon icon={faUser} size="2x" />
                                )}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile}>
                        <div className="field">
                            <label className="label">Username</label>
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Confirm Password</label>
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Profile Picture</label>
                            <div className="file has-name">
                                <label className="file-label">
                                    <input className="file-input" type="file" accept="image/*" onChange={handleProfilePicChange} />
                                    <span className="file-cta">
                    <span className="file-icon">
                      <FontAwesomeIcon icon={faImage} />
                    </span>
                    <span className="file-label">Choose a file…</span>
                  </span>
                                    {profilePic && <span className="file-name">{profilePic}</span>}
                                </label>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Country</label>
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faGlobe} />
                </span>
                            </div>
                        </div>

                        <div className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-primary">
                                    Update Profile
                                </button>
                            </div>
                            <div className="control">
                                <button type="button" onClick={handleSignOut} className="button is-danger">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
