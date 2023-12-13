// src/DownloadPage.js
import React, { useState } from 'react';

const DownloadPage = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [downloadLink, setDownloadLink] = useState('');

    const handleDownload = async () => {
        try {
            const response = await fetch('/.netlify/functions/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoUrl }),
            });

            if (response.ok) {
                const result = await response.json();
                setDownloadLink(result.downloadLink);
            } else {
                console.error('Failed to fetch download link');
            }
        } catch (error) {
            console.error('Error fetching download link:', error);
        }
    };

    return (
        <div>
            <h1>YouTube to MP3 Downloader</h1>
            <label>
                YouTube Video URL:
                <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
            </label>
            <button onClick={handleDownload}>Download MP3</button>
            {downloadLink && (
                <div>
                    <p>Download Link:</p>
                    <a href={downloadLink} download>
                        Download MP3
                    </a>
                </div>
            )}
        </div>
    );
};

export default DownloadPage;
