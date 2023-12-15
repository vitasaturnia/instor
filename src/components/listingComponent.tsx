// ListingLogic.tsx
import React, { useState } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const ListingLogic: React.FC = () => {
    const { auth, db } = useFirebase();
    const [formData, setFormData] = useState({ listingName: '', listingDomain: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreateOrUpdateListing = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.listingName || !formData.listingDomain) {
            setValidationError('Listing Name and Domain are required.');
            return;
        }

        try {
            if (editMode) await updateListingInFirebase(selectedListingId!, formData);
            else await createListingInFirebase(formData);

            setFormData({ listingName: '', listingDomain: '' });
            setEditMode(false);
            setSelectedListingId(null);
            setSuccessMessage(editMode ? 'Listing updated successfully!' : 'Listing created successfully!');
            setValidationError(null);
        } catch (error) {
            console.error('Error creating/updating listing:', error.message);
            setError('Error creating/updating listing. Please try again.');
        }
    };

    const createListingInFirebase = async (listingData: any) => {
        try {
            const userUid = auth.currentUser?.uid;
            const listingCollection = collection(db, 'Listings');
            await addDoc(listingCollection, {
                ...listingData,
                createdBy: userUid,
                createdOn: new Date(),
            });
        } catch (error) {
            throw new Error('Error creating listing: ' + error.message);
        }
    };

    const updateListingInFirebase = async (listingId: string, listingData: any) => {
        try {
            const listingDocRef = collection(db, 'Listings', listingId);
            await updateDoc(listingDocRef, {
                ...listingData,
                updatedOn: new Date(),
            });
        } catch (error) {
            throw new Error('Error updating listing: ' + error.message);
        }
    };

    const deleteListingInFirebase = async (listingId: string) => {
        try {
            const listingDocRef = collection(db, 'Listings', listingId);
            await deleteDoc(listingDocRef);
        } catch (error) {
            throw new Error('Error deleting listing: ' + error.message);
        }
    };

    const handleEditListing = (listing: any) => {
        setEditMode(true);
        setSelectedListingId(listing.id);
        setFormData({ listingName: listing.listingName, listingDomain: listing.listingDomain });
    };

    const handleDeleteListing = async (listingId: string) => {
        try {
            await deleteListingInFirebase(listingId);
            setSuccessMessage('Listing deleted successfully!');
        } catch (error) {
            console.error('Error deleting listing:', error.message);
            setError('Error deleting listing. Please try again.');
        }
    };

    return (
        <div>
            {error && <div className="notification is-danger">{error}</div>}
            {successMessage && <div className="notification is-success">{successMessage}</div>}
            {validationError && <div className="notification is-danger">{validationError}</div>}

            <form onSubmit={handleCreateOrUpdateListing}>
                <div className="field">
                    <label className="label">Listing Name</label>
                    <div className="control">
                        <input
                            className={`input ${validationError ? 'is-danger' : ''}`}
                            type="text"
                            placeholder="Enter Listing Name"
                            value={formData.listingName}
                            onChange={(e) => setFormData({ ...formData, listingName: e.target.value })}
                        />
                    </div>
                    {validationError && <p className="help is-danger">{validationError}</p>}
                </div>

                <div className="field">
                    <label className="label">Listing Domain</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Enter Listing Domain"
                            value={formData.listingDomain}
                            onChange={(e) => setFormData({ ...formData, listingDomain: e.target.value })}
                        />
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button type="submit" className={`button ${editMode ? 'is-warning' : 'is-primary'}`}>
                            {editMode ? 'Update Listing' : 'Create Listing'}
                        </button>
                    </div>
                    {editMode && (
                        <div className="control">
                            <button
                                type="button"
                                className="button is-danger"
                                onClick={() => {
                                    handleDeleteListing(selectedListingId!);
                                }}
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

export default ListingLogic;
