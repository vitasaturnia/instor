// Navbar.tsx
import React from 'react';
import DarkModeToggler from './DarkModeToggler';
import Logo from '../assets/img/pac.png';

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
                        var burger = document.querySelector('.burger');
                        var nav = document.querySelector('#navBar');
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
                    <a className="navbar-item" href="/">
                        Home
                    </a>

                    <a className="navbar-item" href="/playlists">
                        Playlists
                    </a>

                    <a className="navbar-item" href="/converter">
                        Youtube Converter
                    </a>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <DarkModeToggler darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    </div>

                    <div className="navbar-item">
                        <div className="buttons">
                            <a className={`button ${darkMode ? 'is-light' : 'is-dark'}`} href="/app/src/pages/login">
                                Log in
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
