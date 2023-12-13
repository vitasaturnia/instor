import React, { useState, FormEvent } from 'react';
import { useFirebase } from '../context/firebaseContext';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
    const { auth } = useFirebase();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Login error:', error.message);
            // Handle error and display to the user
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
                                    <div className="control has-icons-left">
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="e.g. bobsmith@gmail.com"
                                            className="input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <span className="icon is-small is-left">
                      <i className="fa fa-envelope"></i>
                    </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="password" className="label">
                                        Password
                                    </label>
                                    <div className="control has-icons-left">
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="*******"
                                            className="input"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <span className="icon is-small is-left">
                      <i className="fa fa-lock"></i>
                    </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="rememberMe" className="checkbox">
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={() => setRememberMe(!rememberMe)}
                                        />
                                        Remember me
                                    </label>
                                </div>
                                <div className="field">
                                    <button type="submit" className="button is-success">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
