// Layout.tsx
import React, { ReactNode } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Newsletter from './Newsletter';
import '../assets/all.sass';
import FadeInWrapper from '../components/FadeInWrapper';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <FadeInWrapper>
            <Navbar />
            <div>{children}</div>
            <Newsletter />
            <Footer />
        </FadeInWrapper>
    );
};

export default Layout;
