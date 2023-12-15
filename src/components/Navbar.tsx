// Navbar.tsx
import React from 'react';
import DarkModeToggler from './DarkModeToggler';
import Logo from '../assets/img/popeye.png';
import { Link } from 'react-router-dom';

interface NavbarProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
    return (
        <nav className={`navbar ${darkMode ? 'is-dark' : 'is-light'}`} role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <img
                        src={Logo}
                        alt="Logo"
                        width="112"
                        height="28"
                    />
                </a>

                <a
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
                </a>
            </div>

            <div id="navBar" className="navbar-menu">
                <div className="navbar-start">

                    <Link to="/listing" className="navbar-item">
                        Listing
                    </Link>
                    <Link to="/listing" className="navbar-item">
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

                    <div className="navbar-item">
                        <div className="buttons">
                            <Link to="/login" className={`button ${darkMode ? 'is-light' : 'is-dark'}`}>
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
