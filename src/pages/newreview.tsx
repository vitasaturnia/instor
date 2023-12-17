import React, { useState, useEffect } from 'react';
import ReviewsLogic from '../components/reviewsComponent.tsx';
import { useFirebase } from '../context/firebaseContext';
import { collection, getDocs } from 'firebase/firestore';
import LoadingSpinner from '../components/loadingSpinner'; // Placeholder for loading spinner
import ErrorMessage from '../components/errorMessage'; // Placeholder for error message

interface Source {
    id: string;
    sourceName: string;
    // Add other properties based on your source data structure
}

const NewReviewPage: React.FC = () => {
    const { db } = useFirebase();
    const [sources, setSources] = useState<Source[]>([]);
    const [selectedSource, setSelectedSource] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const sourcesCollection = collection(db, 'Sources');
                const querySnapshot = await getDocs(sourcesCollection);
                const sourcesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Source));
                setSources(sourcesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sources:', error.message);
                setError('Error fetching sources. Please try again.');
                setLoading(false);
            }
        };

        fetchSources();
    }, [db]);

    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <div className="has-text-centered">
                            <h1 className="title">New Review</h1>
                        </div>
                        {loading && <LoadingSpinner />} {/* Display loading spinner while fetching data */}
                        {error && <ErrorMessage message={error} />} {/* Display error message if there's an error */}
                        {!loading && !error && (
                            <>
                                <div className="field">
                                    <label className="label">Select Source:</label>
                                    <div className="control">
                                        <div className="select">
                                            <select
                                                value={selectedSource || ''}
                                                onChange={(e) => setSelectedSource(e.target.value)}
                                            >
                                                <option value="" disabled>
                                                    Choose a source
                                                </option>
                                                {sources.map((source) => (
                                                    <option key={source.id} value={source.id}>
                                                        {source.sourceName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <ReviewsLogic selectedSource={selectedSource} />
                            </>
                        )} {/* Render ReviewsLogic when data is loaded and no error */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewReviewPage;
