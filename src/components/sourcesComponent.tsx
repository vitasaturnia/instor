import React, { useState } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const SourceLogic: React.FC = () => {
    const { auth, db } = useFirebase();
    const [formData, setFormData] = useState({ sourceName: '', sourceDomain: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreateOrUpdateSource = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.sourceName || !formData.sourceDomain) {
            setValidationError('Source Name and Domain are required.');
            return;
        }

        try {
            if (editMode) await updateSourceInFirebase(selectedSourceId!, formData);
            else await createSourceInFirebase(formData);

            setFormData({ sourceName: '', sourceDomain: '' });
            setEditMode(false);
            setSelectedSourceId(null);
            setSuccessMessage(editMode ? 'Source updated successfully!' : 'Source created successfully!');
            setValidationError(null);
        } catch (error) {
            console.error('Error creating/updating source:', error.message);
            setError('Error creating/updating source. Please try again.');
        }
    };

    const createSourceInFirebase = async (sourceData: any) => {
        try {
            const userUid = auth.currentUser?.uid;
            const sourceCollection = collection(db, 'Sources');
            await addDoc(sourceCollection, {
                ...sourceData,
                createdBy: userUid,
                createdOn: new Date(),
            });
        } catch (error) {
            throw new Error('Error creating source: ' + error.message);
        }
    };

    const updateSourceInFirebase = async (sourceId: string, sourceData: any) => {
        try {
            const sourceDocRef = collection(db, 'Sources', sourceId);
            await updateDoc(sourceDocRef, {
                ...sourceData,
                updatedOn: new Date(),
            });
        } catch (error) {
            throw new Error('Error updating source: ' + error.message);
        }
    };

    const deleteSourceInFirebase = async (sourceId: string) => {
        try {
            const sourceDocRef = collection(db, 'Sources', sourceId);
            await deleteDoc(sourceDocRef);
        } catch (error) {
            throw new Error('Error deleting source: ' + error.message);
        }
    };

    const handleEditSource = (source: any) => {
        setEditMode(true);
        setSelectedSourceId(source.id);
        setFormData({ sourceName: source.sourceName, sourceDomain: source.sourceDomain });
    };

    const handleDeleteSource = async (sourceId: string) => {
        try {
            await deleteSourceInFirebase(sourceId);
            setSuccessMessage('Source deleted successfully!');
        } catch (error) {
            console.error('Error deleting source:', error.message);
            setError('Error deleting source. Please try again.');
        }
    };

    return (
        <div>
            {error && <div className="notification is-danger">{error}</div>}
            {successMessage && <div className="notification is-success">{successMessage}</div>}
            {validationError && <div className="notification is-danger">{validationError}</div>}

            <form onSubmit={handleCreateOrUpdateSource}>
                <div className="field">
                    <label className="label">Source Name</label>
                    <div className="control">
                        <input
                            className={`input ${validationError ? 'is-danger' : ''}`}
                            type="text"
                            placeholder="Enter Source Name"
                            value={formData.sourceName}
                            onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                        />
                    </div>
                    {validationError && <p className="help is-danger">{validationError}</p>}
                </div>

                <div className="field">
                    <label className="label">Source Domain</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Enter Source Domain"
                            value={formData.sourceDomain}
                            onChange={(e) => setFormData({ ...formData, sourceDomain: e.target.value })}
                        />
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button type="submit" className={`button ${editMode ? 'is-warning' : 'is-primary'}`}>
                            {editMode ? 'Update Source' : 'Create Source'}
                        </button>
                    </div>
                    {editMode && (
                        <div className="control">
                            <button
                                type="button"
                                className="button is-danger"
                                onClick={() => {
                                    handleDeleteSource(selectedSourceId!);
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

export default SourceLogic;
