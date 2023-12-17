import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { collection, getDocs } from 'firebase/firestore';

interface SourceData {
    id: string;
    sourceName: string;
    sourceDomain: string;
}

const SourcesFetcher: React.FC = () => {
    const { db } = useFirebase();
    const [topSources, setTopSources] = useState<SourceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopSources = async () => {
            try {
                const sourcesCollection = collection(db, 'Sources');
                const querySnapshot = await getDocs(sourcesCollection);
                const sourcesData: SourceData[] = [];

                querySnapshot.forEach((doc) => {
                    const source = { id: doc.id, ...doc.data() } as SourceData;
                    sourcesData.push(source);
                });

                // Assuming you want to show the top 10 sources
                const topSourcesData = sourcesData.slice(0, 10);
                setTopSources(topSourcesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching top sources:', error.message);
                setError('Error fetching top sources. Please try again.');
                setLoading(false);
            }
        };

        fetchTopSources();
    }, [db]);

    return (
        <div className="container has-text-centered mt-6">
            <h2 className="title is-3 mb-4">Top sources</h2>
            <div className="columns is-multiline is-centered">
                {error ? (
                    <div className="column is-12">
                        <div className="notification is-danger">{error}</div>
                    </div>
                ) : loading ? (
                    <div className="column is-12">
                        <div className="notification is-info">Loading...</div>
                    </div>
                ) : topSources.length === 0 ? (
                    <div className="column is-12">
                        <div className="notification is-warning">No sources found.</div>
                    </div>
                ) : (
                    topSources.map((source) => (
                        <div key={source.id} className="column is-6-tablet is-4-desktop">
                            <div className="card">
                                <div className="card-content">
                                    <p className="title is-5">{source.sourceName}</p>
                                    <p className="subtitle is-6">{source.sourceDomain}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SourcesFetcher;
