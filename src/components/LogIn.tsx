import React, { useState } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { sendPasswordResetEmail } from 'firebase/auth';

const Login = () => {
    const { auth } = useFirebase();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        // Implement login logic here
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setError('If an account with that email exists, we sent a password reset link.');
        } catch (error) {
            setError("Failed to send password reset email");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <div className="error">{error}</div>}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Login</button>
                <button type="button" onClick={handleForgotPassword}>
                    Forgot Password?
                </button>
            </form>
        </div>
    );
};

export default Login;
