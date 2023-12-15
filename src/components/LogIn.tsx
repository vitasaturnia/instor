import React, { useState, FormEvent } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const { auth } = useFirebase();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        try {
            setError(null);
            await signInWithEmailAndPassword(auth, email, password);

            // Navigate to /profile after successful login
            navigate('/profile');
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
                                    Don't have an account?{' '}
                                    <span
                                        onClick={() => navigate('/register')}
                                        className="has-text-info"
                                        style={{ cursor: 'pointer' }}
                                    >
                    Register here
                  </span>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
