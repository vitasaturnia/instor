// ListingPage.tsx
import React from 'react';
import SourcesFetcher from '../components/sourcesFetcher.tsx'; // Correct the import statement

const ListingPage: React.FC = () => {
    return (
        <div>
            <SourcesFetcher /> {/* Use the correct component name */}
        </div>
    );
};

export default ListingPage;
