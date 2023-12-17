// ReviewPage.tsx
import React from 'react';
import ReviewFetcher from '../components/reviewsFetcher.tsx';

const ReviewPage: React.FC = () => {
    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <div className="has-text-centered">
                        </div>
                        <ReviewFetcher />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewPage;
