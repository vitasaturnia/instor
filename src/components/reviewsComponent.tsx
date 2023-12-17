import React, { useState } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ErrorMessage from '../components/errorMessage';
import "../assets/sass/reviewStars.sass"
const ReviewLogic: React.FC = () => {
    const { auth, db } = useFirebase();
    const [formData, setFormData] = useState({
        reviewTitle: '',
        reviewContent: '',
        reviewStars: 0,
    });
    const [editMode, setEditMode] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    const handleCreateOrUpdateReview = async (e: React.FormEvent) => {
        e.preventDefault();

        const { reviewTitle, reviewContent, reviewStars } = formData;

        if (!reviewTitle || !reviewContent || reviewStars === 0) {
            setValidationError('Review Title, Content, and Stars are required.');
            return;
        }

        try {
            if (editMode) await updateReview(selectedReviewId!, { reviewTitle, reviewContent, reviewStars });
            else await createReview({ reviewTitle, reviewContent, reviewStars });

            resetForm();
            setSuccessMessage(editMode ? 'Review updated successfully!' : 'Review created successfully!');
            setValidationError(null);
        } catch (error) {
            console.error('Error creating/updating review:', error.message);
            setError('Error creating/updating review. Please try again.');
        }
    };

    const createReview = async (data: any) => {
        try {
            const userUid = auth.currentUser?.uid;
            const reviewCollection = collection(db, 'Reviews');
            await addDoc(reviewCollection, {
                ...data,
                createdBy: userUid,
                createdOn: new Date(),
            });
        } catch (error) {
            throw new Error('Error creating review: ' + error.message);
        }
    };

    const updateReview = async (id: string, data: any) => {
        try {
            const reviewDocRef = collection(db, 'Reviews', id);
            await updateDoc(reviewDocRef, {
                ...data,
                updatedOn: new Date(),
            });
        } catch (error) {
            throw new Error('Error updating review: ' + error.message);
        }
    };

    const deleteReview = async (id: string) => {
        try {
            const reviewDocRef = collection(db, 'Reviews', id);
            await deleteDoc(reviewDocRef);
        } catch (error) {
            throw new Error('Error deleting review: ' + error.message);
        }
    };

    const handleEditReview = (review: any) => {
        setEditMode(true);
        setSelectedReviewId(review.id);
        setFormData({ reviewTitle: review.reviewTitle, reviewContent: review.reviewContent, reviewStars: review.reviewStars });
    };

    const handleDeleteReview = async (id: string) => {
        try {
            await deleteReview(id);
            setSuccessMessage('Review deleted successfully!');
        } catch (error) {
            console.error('Error deleting review:', error.message);
            setError('Error deleting review. Please try again.');
        }
    };

    const handleStarClick = (rating: number) => {
        setFormData({ ...formData, reviewStars: rating });
    };

    const resetForm = () => {
        setFormData({ reviewTitle: '', reviewContent: '', reviewStars: 0 });
        setEditMode(false);
        setSelectedReviewId(null);
    };

    const renderStarIcons = () => {
        return Array.from({ length: 10 }, (_, index) => (
            <FontAwesomeIcon
                key={index + 1}
                icon={faStar}
                size="2x"
                className={`star-icon ${index < (hoveredStar ?? formData.reviewStars) ? 'selected' : ''}`}
                onMouseEnter={() => setHoveredStar(index + 1)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => handleStarClick(index + 1)}
            />
        ));
    };

    return (
        <div>
            {error && <ErrorMessage message={error} />}
            {successMessage && <div className="notification is-success">{successMessage}</div>}
            {validationError && <ErrorMessage message={validationError} />}

            <form onSubmit={handleCreateOrUpdateReview}>
                <div className="field">
                    <label className="label">Review Title</label>
                    <div className="control">
                        <input
                            className={`input ${validationError ? 'is-danger' : ''}`}
                            type="text"
                            placeholder="Enter Review Title"
                            value={formData.reviewTitle}
                            onChange={(e) => setFormData({ ...formData, reviewTitle: e.target.value })}
                        />
                    </div>
                    {validationError && <p className="help is-danger">{validationError}</p>}
                </div>

                <div className="field">
                    <label className="label">Review Content</label>
                    <div className="control">
                        <textarea
                            className="textarea"
                            placeholder="Enter Review Content"
                            value={formData.reviewContent}
                            onChange={(e) => setFormData({ ...formData, reviewContent: e.target.value })}
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Stars:</label>
                    <div className="control star-rating">{renderStarIcons()}</div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button type="submit" className={`button ${editMode ? 'is-warning' : 'is-primary'}`}>
                            {editMode ? 'Update Review' : 'Create Review'}
                        </button>
                    </div>
                    {editMode && (
                        <div className="control">
                            <button
                                type="button"
                                className="button is-danger"
                                onClick={() => handleDeleteReview(selectedReviewId!)}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ReviewLogic;
