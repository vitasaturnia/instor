import React, { useState } from 'react';
import axios from 'axios';

interface DownloadResponse {
    downloadLink: string;
}

const YTDownloaderPage: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [downloadLink, setDownloadLink] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleDownload = async () => {
        try {
            setError('');
            setLoading(true);

            // Call Netlify function to initiate video downloading
            const { data } = await axios.post<DownloadResponse>('/.netlify/functions/youtubeDownloader', {
                videoUrl,
            });

            setDownloadLink(data.downloadLink);
        } catch (error) {
            console.error('Error during download:', error);
            setError('An error occurred during the download. Please try again.');
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
                            placeholder="Enter YouTube Video URL"
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

export default YTDownloaderPage;
