// DarkModeToggler.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

interface DarkModeTogglerProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const DarkModeToggler: React.FC<DarkModeTogglerProps> = ({ darkMode, toggleDarkMode }) => {
    return (
        <div
            className={`dark-mode-toggler ${darkMode ? 'dark' : 'light'}`}
            onClick={toggleDarkMode}
        >
            <FontAwesomeIcon icon={darkMode ? faMoon : faSun} className="toggle-icon" />
        </div>
    );
};

export default DarkModeToggler;
