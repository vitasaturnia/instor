import React, { ReactNode, useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import '../assets/sass/main.sass';
import FadeInWrapper from '../components/FadeInWrapper';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Apply dark mode styles on component mount
    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [darkMode]);

    return (
        <FadeInWrapper>
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <div>{children}</div>
            <Newsletter />
            <Footer />
        </FadeInWrapper>
    );
};

export default Layout;
