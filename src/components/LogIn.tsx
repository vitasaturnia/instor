// Login.tsx
import React, { useState, FormEvent } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Register from './Register'; // Import the Register component

const Login: React.FC = () => {
    const { auth } = useFirebase();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showRegister, setShowRegister] = useState<boolean>(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        try {
            setError(null);
            await signInWithEmailAndPassword(auth, email, password);
            // Optional: Handle successful login, navigate, or perform other actions
        } catch (error) {
            console.error('Login error:', error.message);
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <section className="hero is-primary is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                            {showRegister ? (
                                <Register toggleForm={() => setShowRegister(!showRegister)} />
                            ) : (
                                <form onSubmit={handleLogin} className="box">
                                    <div className="field">
                                        <label htmlFor="email" className="label">
                                            Email
                                        </label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="email"
                                                id="email"
                                                placeholder="Your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
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
                                                placeholder="Your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="notification is-danger">
                                            <p className="subtitle">{error}</p>
                                        </div>
                                    )}

                                    <div className="field">
                                        <div className="control">
                                            <button type="submit" className="button is-primary">
                                                Login
                                            </button>
                                        </div>
                                    </div>

                                    <p>
                                        {showRegister ? "Already have an account?" : "Don't have an account?"}
                                        <span
                                            onClick={() => setShowRegister(!showRegister)}
                                            style={{ cursor: 'pointer', marginLeft: '5px', color: 'blue' }}
                                        >
                      {showRegister ? 'Login here' : 'Register here'}
                    </span>
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
