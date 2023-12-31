import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import Index from './pages/index';
import Contact from './pages/contact';
import Login from './pages/login';
import Register from './pages/register';
import About from './pages/about';
import Sources from './pages/sources.tsx';
import NewSource from './pages/newsource.tsx';
import Reviews from './pages/reviews.tsx';
import NewReview from './pages/newreview.tsx';
import Profile from './pages/profile.tsx';
import Chat from './pages/chat.tsx';
import Privacy from './pages/privacy.tsx';
import FakeOrNatty from './pages/fakeornatty.tsx';
import ProfilePage from './components/ProfilePage.tsx';
import Inbox from './components/Inbox.tsx';

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
                            <Route path="/sources" element={<Sources />} />
                            <Route path="/newsource" element={<NewSource />} />
                            <Route path="/reviews" element={<Reviews />} />
                            <Route path="/newreview" element={<NewReview />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/fakeornatty" element={<FakeOrNatty />} />
                            <Route path="/inbox" element={<Inbox />} />

                            <Route path="/:username" element={<ProfilePage />} />


                        </Routes>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
    );
};

export default App;
