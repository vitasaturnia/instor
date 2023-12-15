import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Index from './pages/index';
import Contact from './pages/contact';
import Login from './pages/login';
import Register from './pages/register';
import About from './pages/about';
import Listings from './pages/listings.tsx';
import NewListing from './pages/newlisting.tsx';
import Profile from './pages/profile.tsx';

import Layout from './components/Layout';

const App: React.FC = () => {
    return (
            <AuthProvider>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/listings" element={<Listings />} />
                            <Route path="/newlisting" element={<NewListing />} />
                            <Route path="/profile" element={<Profile />} />


                        </Routes>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
    );
};

export default App;
