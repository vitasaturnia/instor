import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="footer has-background-dark has-text-white">
            <div className="content has-text-centered">
                <h1 className="title is-size-3 has-text-white">Your Music Hub</h1>
                <div className="footer-links mt-4">
                    <Link to="/" className="footer-link">
                        Home
                    </Link>
                    <Link to="/about" className="footer-link">
                        About
                    </Link>
                    <Link to="/contact" className="footer-link">
                        Contact
                    </Link>
                </div>
                <div className="footer-icons mt-4">
                    <a href="https://www.facebook.com/bombamusic" className="icon is-large has-text-white">
                        <FontAwesomeIcon icon={faFacebook} size="2x" />
                    </a>
                    <a href="https://www.instagram.com/bombamusic" className="icon is-large has-text-white">
                        <FontAwesomeIcon icon={faInstagram} size="2x" />
                    </a>
                    <a href="mailto:support@bombamusic.com" className="icon is-large has-text-white">
                        <FontAwesomeIcon icon={faEnvelope} size="2x" />
                    </a>
                </div>
                <p className="subtitle is-size-6 has-text-grey-light mt-4">
                    © 2023 Bomba Music. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
