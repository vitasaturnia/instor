import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/firebaseContext';
import DarkModeToggler from './DarkModeToggler';
import Logo from '../assets/img/popeye.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
    const { auth } = useFirebase();
    const [user, setUser] = useState(auth.currentUser);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            // Optionally: You can navigate to another page or show a success message after signing out
        } catch (error) {
            console.error('Sign out error:', error.message);
            // Handle sign out error
        }
    };

    useEffect(() => {
        // Update user state on component mount
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, [auth]);

    return (
        <nav className={`navbar ${darkMode ? 'is-dark' : 'is-light'}`} role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link to="/" className="navbar-item">
                    <img src={Logo} alt="Logo" width="112" height="28" />
                </Link>

                <div
                    role="button"
                    className="navbar-burger burger"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navBar"
                    onClick={() => {
                        const burger = document.querySelector('.burger');
                        const nav = document.querySelector('#navBar');
                        burger?.classList.toggle('is-active');
                        nav?.classList.toggle('is-active');
                    }}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </div>
            </div>

            <div id="navBar" className="navbar-menu">
                <div className="navbar-start">
                    <Link to="/sources" className="navbar-item">
                        Sources
                    </Link>
                    <Link to="/newsource" className="navbar-item">
                        New Source
                    </Link>
                    <Link to="/reviews" className="navbar-item">
                        Reviews
                    </Link>
                    <Link to="/newreview" className="navbar-item">
                        New Review
                    </Link>
                    <Link to="/chat" className="navbar-item">
                        Chat
                    </Link>
                    <Link to="/fakeornatty" className="navbar-item">
                        Fake Or Natty
                    </Link>
                    <Link to="/about" className="navbar-item">
                        About
                    </Link>
                    <Link to="/contact" className="navbar-item">
                        Contact
                    </Link>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <DarkModeToggler darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    </div>

                    {user ? (
                        <div className="navbar-item">
                            <Link to="/profile" className={`button ${darkMode ? 'is-light' : 'is-dark'}`}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                            </Link>
                        </div>
                    ) : null}

                    <div className="navbar-item">
                        <div className="buttons">
                            {user ? (
                                <button onClick={handleLogout} className={`button ${darkMode ? 'is-light' : 'is-dark'}`}>
                                    Logout
                                </button>
                            ) : (
                                <Link to="/login" className={`button ${darkMode ? 'is-light' : 'is-dark'}`}>
                                    Log in
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
