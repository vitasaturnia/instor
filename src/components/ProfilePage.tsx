import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '../context/firebaseContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Import the envelope icon
import NewMessage from '../components/NewMessage.tsx'; // Import the NewMessage component

const ProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const { db } = useFirebase();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showMessageForm, setShowMessageForm] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('username', '==', username));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError('User not found');
                } else {
                    setUserData(querySnapshot.docs[0].data() as UserData);
                }
            } catch (err) {
                setError('Error fetching user data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username, db]);

    const toggleMessageForm = () => {
        setShowMessageForm(!showMessageForm);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userData) return <div>User not found</div>;

    return (
        <div className="container mt-2">

            <div className="columns is-centered">
                <div className="column is-6">
                    <h1 className="title has-text-centered">{userData.username || 'Not provided'}</h1>
                    <div className="has-text-centered">
                        <FontAwesomeIcon icon={faUserCircle} size="2x" className="profile-pic" />
                    </div>

                    <div className="field mt-2 has-text-centered">
                        <button className="button is-primary is-small" onClick={toggleMessageForm}>
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                            {showMessageForm ? 'Cancel' : 'Message user'}
                        </button>
                    </div>
                    {showMessageForm && <NewMessage receiver={username} />}

                    <div className="box">
                        <div className="field">
                            <label className="label">Username</label>
                            <p className="is-static">{userData.username || 'Not provided'}</p>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <p className="is-static">{userData.email || 'Not provided'}</p>
                        </div>
                        <div className="field">
                            <label className="label">Bio</label>
                            <p className="is-static">{userData.bio || 'Not provided'}</p>
                        </div>
                        <div className="field">
                            <label className="label">Region</label>
                            <p className="is-static">{userData.region || 'Not provided'}</p>
                        </div>
                        {userData.stats && (
                            <div className="field">
                                <label className="label">Stats</label>
                                <p>Height: {userData.stats.height ? `${userData.stats.height} cm` : 'Not provided'}</p>
                                <p>Weight: {userData.stats.weight ? `${userData.stats.weight} kg` : 'Not provided'}</p>
                                <p>Body Fat: {userData.stats.bodyFat ? `${userData.stats.bodyFat}%` : 'Not provided'}</p>
                            </div>
                        )}
                        {userData.bestLifts && userData.bestLifts.length > 0 && (
                            <div className="field">
                                <label className="label">Best Lifts</label>
                                {userData.bestLifts.map((lift, index) => (
                                    <p key={index}>{lift.lift || 'Not provided'}: {lift.weight ? `${lift.weight} kg` : 'Not provided'}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
