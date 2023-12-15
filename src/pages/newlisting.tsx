// ListingPage.tsx
import React from 'react';
import ListingLogic from '../components/listingComponent.tsx';

const NewListingPage: React.FC = () => {
    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <div className="has-text-centered">
                            <h1 className="title">Listing Page</h1>
                        </div>
                        <ListingLogic />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewListingPage;
