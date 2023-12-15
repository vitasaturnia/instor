// ListingFetcher.tsx
import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/firebaseContext';

const ListingFetcher: React.FC = () => {
    const { auth, db } = useFirebase();
    const [topListings, setTopListings] = useState<ListingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopListings = async () => {
            try {
                // Fetch top 10 listings with highest reviews (actual logic needed)
                // For now, let's set placeholder data
                const placeholderListings = Array.from({ length: 10 }, (_, index) => ({
                    id: index.toString(),
                    listingName: `Company ${index + 1}`,
                    listingDomain: `company${index + 1}.com`,
                }));
                setTopListings(placeholderListings);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching top listings:', error.message);
                setError('Error fetching top listings. Please try again.');
                setLoading(false);
            }
        };

        fetchTopListings();
    }, []);

    return (
        <div>
            <h2>Top 10 Listings with Highest Reviews</h2>
            {error ? (
                <p>Error: {error}</p>
            ) : loading ? (
                <p>Loading...</p>
            ) : topListings.length === 0 ? (
                <p>There are no listings yet.</p>
            ) : (
                <ul>
                    {topListings.map((listing) => (
                        <li key={listing.id}>
                            {listing.listingName} - {listing.listingDomain}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ListingFetcher;
