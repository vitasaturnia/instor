// ListingPage.tsx
import React from 'react';
import ListingFetcher from '../components/listingFetcher.tsx'; // Correct the import statement

const ListingPage: React.FC = () => {
    return (
        <div>
            <h1>Listing Page</h1>
            <ListingFetcher /> {/* Use the correct component name */}
        </div>
    );
};

export default ListingPage;
