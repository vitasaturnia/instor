import React from 'react';
import Profile from '../components/Profile.tsx';

const NewListingPage: React.FC = () => {
    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <div className="has-text-centered">
                        </div>
                        <Profile />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewListingPage;
