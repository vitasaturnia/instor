// ListingPage.tsx
import React from 'react';
import SourceLogic from '../components/sourcesComponent.tsx';

const NewListingPage: React.FC = () => {
    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <div className="has-text-centered">
                            <h1 className="title">New Source</h1>
                        </div>
                        <SourceLogic/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewListingPage;
