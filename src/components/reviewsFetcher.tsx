import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { collection, getDocs } from 'firebase/firestore';

interface ReviewData {
    id: string;
    reviewTitle: string;
    reviewContent: string;
}

const ReviewsFetcher: React.FC = () => {
    const { db } = useFirebase();
    const [topReviews, setTopReviews] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopReviews = async () => {
            try {
                const reviewsCollection = collection(db, 'Reviews');
                const querySnapshot = await getDocs(reviewsCollection);
                const reviewsData: ReviewData[] = [];

                querySnapshot.forEach((doc) => {
                    const review = { id: doc.id, ...doc.data() } as ReviewData;
                    reviewsData.push(review);
                });

                // Assuming you want to show the top 10 reviews
                const topReviewsData = reviewsData.slice(0, 10);
                setTopReviews(topReviewsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching top reviews:', error.message);
                setError('Error fetching top reviews. Please try again.');
                setLoading(false);
            }
        };

        fetchTopReviews();
    }, [db]);

    return (
        <div className="container has-text-centered mt-6">
            <h2 className="title is-3 mb-4">Top 10 Reviews</h2>
            <div className="columns is-multiline is-centered">
                {error ? (
                    <div className="column is-12">
                        <div className="notification is-danger">{error}</div>
                    </div>
                ) : loading ? (
                    <div className="column is-12">
                        <div className="notification is-info">Loading...</div>
                    </div>
                ) : topReviews.length === 0 ? (
                    <div className="column is-12">
                        <div className="notification is-warning">No reviews found.</div>
                    </div>
                ) : (
                    topReviews.map((review) => (
                        <div key={review.id} className="column is-6-tablet is-4-desktop">
                            <div className="card">
                                <div className="card-content">
                                    <p className="title is-5">{review.reviewTitle}</p>
                                    <p className="subtitle is-6">{review.reviewContent}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewsFetcher;
