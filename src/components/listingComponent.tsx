// ListingComponent.tsx
import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/firebaseContext';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    DocumentData,
    DocumentReference,
} from 'firebase/firestore';

interface ListingData {
    id: string;
    listingName: string;
    listingDomain: string;
    createdBy: string;
}

const ListingComponent: React.FC = () => {
    const { auth, db } = useFirebase();
    const [userListings, setUserListings] = useState<ListingData[]>([]);
    const [allListings, setAllListings] = useState<ListingData[]>([]);
    const [formData, setFormData] = useState({ listingName: '', listingDomain: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setUserListings(await fetchUserListingsFromFirebase());
            setAllListings(await fetchAllListingsFromFirebase());
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchUserListingsFromFirebase = async () => {
        const userUid = auth.currentUser?.uid;
        const userListingCollection = collection(db, 'Listings');
        const userListingSnapshot = await getDocs(userListingCollection);
        return userListingSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as ListingData))
            .filter((listing) => listing.createdBy === userUid);
    };

    const fetchAllListingsFromFirebase = async () => {
        const allListingCollection = collection(db, 'Listings');
        const allListingSnapshot = await getDocs(allListingCollection);
        return allListingSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ListingData));
    };

    const handleCreateOrUpdateListing = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.listingName) {
            setValidationError('Listing Name is required.');
            return;
        }

        try {
            if (editMode) await updateListingInFirebase(selectedListingId!, formData);
            else await createListingInFirebase(formData);

            setFormData({ listingName: '', listingDomain: '' });
            setEditMode(false);
            setSelectedListingId(null);
            await fetchData();
            setSuccessMessage(editMode ? 'Listing updated successfully!' : 'Listing created successfully!');
            setValidationError(null);
        } catch (error) {
            console.error('Error creating/updating listing:', error.message);
            setError('Error creating/updating listing. Please try again.');
        }
    };

    const createListingInFirebase = async (listingData: DocumentData) => {
        const userUid = auth.currentUser?.uid;
        const listingCollection = collection(db, 'Listings');
        await addDoc(listingCollection, { ...listingData, createdBy: userUid, createdOn: new Date() });
    };

    const updateListingInFirebase = async (listingId: string, listingData: DocumentData) => {
        const listingDocRef = doc(collection(db, 'Listings'), listingId);
        await updateDoc(listingDocRef, { ...listingData, updatedOn: new Date() });
    };

    const handleDeleteListing = async (listingId: string) => {
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
            await deleteListingInFirebase(selectedListingId!);
            setShowDeleteConfirmation(false);
            await fetchData();
            setSuccessMessage('Listing deleted successfully!');
        } catch (error) {
            console.error('Error deleting listing:', error.message);
            setError('Error deleting listing. Please try again.');
        }
    };

    const deleteListingInFirebase = async (listingId: string) => {
        const listingDocRef = doc(collection(db, 'Listings'), listingId);
        await deleteDoc(listingDocRef);
    };

    const cancelDeleteListing = () => {
        setShowDeleteConfirmation(false);
        setSelectedListingId(null);
    };

    const handleEditListing = (listing: ListingData) => {
        setFormData({ listingName: listing.listingName, listingDomain: listing.listingDomain });
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
                <ul>{Array.from({ length: 3 }).map((_, index) => <li key={index}><div className="loading-skeleton"></div></li>)}</ul>
            ) : (
                <ul>
                    {userListings.length === 0 ? <p>There is nothing here yet.</p> : userListings.map((listing) => (
                        <li key={listing.id}>
                            {listing.listingName} - {listing.listingDomain}{' '}
                            <button onClick={() => handleEditListing(listing)}>Edit</button>
                            <button onClick={() => handleDeleteListing(listing.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            <h2>All Listings</h2>
            {loading ? (
                <ul>{Array.from({ length: 3 }).map((_, index) => <li key={index}><div className="loading-skeleton"></div></li>)}</ul>
            ) : (
                <ul>
                    {allListings.length === 0 ? <p>There is nothing here yet.</p> : allListings.map((listing) => (
                        <li key={listing.id}>
                            {listing.listingName} - {listing.listingDomain}
                        </li>
                    ))}
                </ul>
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
