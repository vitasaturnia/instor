import React, { useState } from 'react';

const PrivacySettings = () => {
    const [showDisplayName, setShowDisplayName] = useState(true);
    const [showEmail, setShowEmail] = useState(true);
    const [showBio, setShowBio] = useState(true);
    const [showRegion, setShowRegion] = useState(true);
    const [showStats, setShowStats] = useState(true);
    const [showBestLifts, setShowBestLifts] = useState(true);
    const [messagePrivacy, setMessagePrivacy] = useState('everyone'); // Default to 'everyone'

    const handlePrivacyChange = (e) => {
        setMessagePrivacy(e.target.value);
    };

    return (
        <div className="container mt-5">
            <h1 className="title has-text-centered">Privacy Settings</h1>

            {/* Display Name Privacy */}
            <div className="field">
                <label className="label">Display Name</label>
                <input
                    type="checkbox"
                    checked={showDisplayName}
                    onChange={() => setShowDisplayName(!showDisplayName)}
                />
            </div>

            {/* Email Privacy */}
            <div className="field">
                <label className="label">Email</label>
                <input
                    type="checkbox"
                    checked={showEmail}
                    onChange={() => setShowEmail(!showEmail)}
                />
            </div>

            {/* Bio Privacy */}
            <div className="field">
                <label className="label">Bio</label>
                <input
                    type="checkbox"
                    checked={showBio}
                    onChange={() => setShowBio(!showBio)}
                />
            </div>

            {/* Region Privacy */}
            <div className="field">
                <label className="label">Region</label>
                <input
                    type="checkbox"
                    checked={showRegion}
                    onChange={() => setShowRegion(!showRegion)}
                />
            </div>

            {/* Stats Privacy */}
            <div className="field">
                <label className="label">Stats</label>
                <input
                    type="checkbox"
                    checked={showStats}
                    onChange={() => setShowStats(!showStats)}
                />
            </div>

            {/* Best Lifts Privacy */}
            <div className="field">
                <label className="label">Best Lifts</label>
                <input
                    type="checkbox"
                    checked={showBestLifts}
                    onChange={() => setShowBestLifts(!showBestLifts)}
                />
            </div>

            {/* Message Privacy */}
            <div className="field">
                <label className="label">Message Privacy</label>
                <div className="control">
                    <div className="select">
                        <select value={messagePrivacy} onChange={handlePrivacyChange}>
                            <option value="everyone">Everyone</option>
                            <option value="friends">Friends</option>
                            <option value="no_one">No One</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="buttons">
                <button type="button" className="button is-primary">
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default PrivacySettings;
