// ListingComponent.jsx

import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/firebaseContext';

const ListingComponent = () => {
    const { auth, createListing, updateListing, deleteListing } = useFirebase();
    const [userListings, setUserListings] = useState([]);
    const [allListings, setAllListings] = useState([]);
    const [formData, setFormData] = useState({
        listingName: '',
        listingDomain: '',
        // Add other fields as needed
    });
    const [editMode, setEditMode] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userSpecificListings = await fetchUserListingsFromFirebase();
                setUserListings(userSpecificListings);

                const allListingsData = await fetchAllListingsFromFirebase();
                setAllListings(allListingsData);

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchUserListingsFromFirebase = async () => {
        // Implement this function to fetch user-specific listings from Firebase
        // e.g., using Firebase Firestore
        // Return a list of user-specific listings
    };

    const fetchAllListingsFromFirebase = async () => {
        // Implement this function to fetch all listings from Firebase
        // e.g., using Firebase Firestore
        // Return a list of all listings
    };

    const handleCreateOrUpdateListing = async (e) => {
        e.preventDefault();
        if (!formData.listingName) {
            setValidationError('Listing Name is required.');
            return;
        }

        try {
            if (editMode) {
                await updateListing(selectedListingId, formData);
            } else {
                await createListing(formData);
            }
            setFormData({ listingName: '', listingDomain: '' });
            setEditMode(false);
            setSelectedListingId(null);
            fetchUserListings();
            fetchAllListings();
            setSuccessMessage(editMode ? 'Listing updated successfully!' : 'Listing created successfully!');
            setValidationError(null);
        } catch (error) {
            console.error('Error creating/updating listing:', error.message);
            setError('Error creating/updating listing. Please try again.');
        }
    };

    const handleDeleteListing = async (listingId) => {
        try {
            setShowDeleteConfirmation(true);
            setSelectedListingId(listingId);
        } catch (error) {
            console.error('Error deleting listing:', error.message);
            setError('Error deleting listing. Please try again.');
        }
    };

    const confirmDeleteListing = async () => {
        try {
            await deleteListing(selectedListingId);
            setShowDeleteConfirmation(false);
            fetchUserListings();
            fetchAllListings();
            setSuccessMessage('Listing deleted successfully!');
        } catch (error) {
            console.error('Error deleting listing:', error.message);
            setError('Error deleting listing. Please try again.');
        }
    };

    const cancelDeleteListing = () => {
        setShowDeleteConfirmation(false);
        setSelectedListingId(null);
    };

    const handleEditListing = (listing) => {
        setFormData({
            listingName: listing.listingName,
            listingDomain: listing.listingDomain,
            // Add other fields as needed
        });
        setEditMode(true);
        setSelectedListingId(listing.id);
    };

    const clearForm = () => {
        setFormData({ listingName: '', listingDomain: '' });
        setEditMode(false);
        setSelectedListingId(null);
        setValidationError(null);
    };

    return (
        <div>
            {error && <div className="error-message">{error}</div>}

            <h2>Your Listings</h2>
            {loading ? (
                <ul>
                    {[1, 2, 3].map((index) => (
                        <li key={index}>
                            <div className="loading-skeleton"></div>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    <ul>
                        {userListings.map((listing) => (
                            <li key={listing.id}>
                                {listing.listingName} - {listing.listingDomain}{' '}
                                <button onClick={() => handleEditListing(listing)}>Edit</button>
                                <button onClick={() => handleDeleteListing(listing.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <h2>All Listings</h2>
            {loading ? (
                <ul>
                    {[1, 2, 3].map((index) => (
                        <li key={index}>
                            <div className="loading-skeleton"></div>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    <ul>
                        {allListings.map((listing) => (
                            <li key={listing.id}>
                                {listing.listingName} - {listing.listingDomain}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <h2>Create/Update Listing</h2>
            <form onSubmit={handleCreateOrUpdateListing}>
                {validationError && <div className="error-message">{validationError}</div>}

                <label htmlFor="listingName">Listing Name:</label>
                <input
                    type="text"
                    id="listingName"
                    value={formData.listingName}
                    onChange={(e) => setFormData({ ...formData, listingName: e.target.value })}
                />

                <label htmlFor="listingDomain">Listing Domain:</label>
                <input
                    type="text"
                    id="listingDomain"
                    value={formData.listingDomain}
                    onChange={(e) => setFormData({ ...formData, listingDomain: e.target.value })}
                />

                <button type="submit">{editMode ? 'Update Listing' : 'Create Listing'}</button>
                <button type="button" onClick={clearForm}>
                    Clear Form
                </button>
            </form>

            {showDeleteConfirmation && (
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete this listing?</p>
                    <button onClick={confirmDeleteListing}>Yes</button>
                    <button onClick={cancelDeleteListing}>No</button>
                </div>
            )}

            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
};

export default ListingComponent;
