// components/VideoDownloader.js
import React, { useState } from 'react';
import axios from 'axios';

const VideoDownloader = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [downloadLink, setDownloadLink] = useState('');

    const handleDownload = async () => {
        if (!videoUrl) {
            setError('Please enter a YouTube video URL');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setDownloadLink('');

            const response = await axios.post(
                process.env.REACT_APP_FIREBASE_FUNCTION_URL,
                { videoUrl }
            );

            setDownloadLink(response.data.downloadUrl);
        } catch (err) {
            console.error('Error:', err);
            setError('An error occurred during the download process');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section">
            <div className="container">
                <h1 className="title">YouTube Downloader</h1>
                <div className="field has-addons">
                    <div className="control is-expanded">
                        <input
                            className="input"
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                    </div>
                    <div className="control">
                        <button className={`button is-primary ${loading ? 'is-loading' : ''}`} onClick={handleDownload}>
                            Download
                        </button>
                    </div>
                </div>

                {/* Error and Success Messages */}
                {error && (
                    <div className="notification is-danger">
                        <p className="subtitle">{error}</p>
                    </div>
                )}

                {downloadLink && (
                    <div className="notification is-success">
                        <p className="subtitle">Download Link:</p>
                        <a href={downloadLink} className="button is-info" download>
                            Download
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VideoDownloader;
