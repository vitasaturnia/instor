// Index.tsx
import React from 'react';

const Index: React.FC = () => {
    return (
        <div>
            <section className="hero is-fullheight is-primary is-bold">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <h1 className="title is-size-1">Your Music Hub</h1>
                        <p className="subtitle is-size-4">
                            Explore, Listen, Connect.
                        </p>
                        <a href="#playlists" className="button is-large is-light">
                            Start Exploring
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;
