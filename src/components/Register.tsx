import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFirebase } from '../context/firebaseContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface RegisterProps {
    toggleForm: () => void;
}

const Register: React.FC<RegisterProps> = ({ toggleForm }) => {
    const { auth, db } = useFirebase();
    const navigate = useNavigate();
    const [userRegistration, setUserRegistration] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const successMessageTimeout = setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);

        return () => clearTimeout(successMessageTimeout);
    }, [successMessage]);

    const handleChange = (e: FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setUserRegistration({
            ...userRegistration,
            [name]: value,
        });
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        const { email, password, confirmPassword, username } = userRegistration;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setError(null);

            // Check if the email is already registered
            const userCollection = collection(db, 'users');
            const emailQuery = query(userCollection, where('email', '==', email));
            const querySnapshot = await getDocs(emailQuery);

            if (!querySnapshot.empty) {
                setError('Email is already registered.');
                return;
            }

            // Check if the username is already taken
            const usernameQuery = query(userCollection, where('username', '==', username));
            const usernameSnapshot = await getDocs(usernameQuery);

            if (!usernameSnapshot.empty) {
                setUsernameError('Username is already taken.');
                return;
            }

            // Register the user using Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Registration successful, now set the UID as the document ID for the user
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                email,
                username,
                // Add other user profile fields here
            });

            setSuccessMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            console.error('Registration error:', error.message);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <section className="hero is-primary is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                            <form onSubmit={handleRegister} className="box">
                                <div className="field">
                                    <label htmlFor="username" className="label">
                                        Username
                                    </label>
                                    <div className="control">
                                        <input
                                            className={`input ${usernameError ? 'is-danger' : ''}`}
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="Your username"
                                            value={userRegistration.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    {usernameError && (
                                        <p className="help is-danger">{usernameError}</p>
                                    )}
                                </div>

                                <div className="field">
                                    <label htmlFor="email" className="label">
                                        Email
                                    </label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Your email"
                                            value={userRegistration.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="password" className="label">
                                        Password
                                    </label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="Your password"
                                            value={userRegistration.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="confirmPassword" className="label">
                                        Confirm Password
                                    </label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Confirm your password"
                                            value={userRegistration.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="notification is-danger">
                                        <p className="subtitle">{error}</p>
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="notification is-success">
                                        <p className="subtitle">{successMessage}</p>
                                    </div>
                                )}

                                <div className="field">
                                    <div className="control">
                                        <button type="submit" className="button is-primary">
                                            Register
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="has-text-info">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
