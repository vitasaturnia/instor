import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/firebaseContext';

const Register: React.FC = () => {
    const { auth } = useFirebase();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Add cleanup logic if needed
        return () => {
            // Cleanup logic here
        };
    }, []); // Empty dependency array means this effect will only run once, similar to componentDidMount

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setError(null);
            await auth.createUserWithEmailAndPassword(email, password);
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error.message);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2 className="title">Register</h2>
            <form onSubmit={handleRegister}>
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input
                            className="input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input
                            className="input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control">
                        <input
                            className="input"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            Register
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Register;
