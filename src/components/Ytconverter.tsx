import React, { useState } from 'react';
import axios from 'axios';

const YouTubeDownloader = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [downloadLink, setDownloadLink] = useState('');

    const handleDownload = async () => {
        try {
            setLoading(true);

            // Step 1: Call Netlify function to interact with YouTube API
            const { data } = await axios.post('/.netlify/functions/youtubeDownloader', {
                videoUrl,
            });

            // Step 2: Call Netlify function to initiate video downloading and conversion
            const conversionResponse = await axios.post('/.netlify/functions/videoConverter', {
                videoId: data.videoId,
            });

            setDownloadLink(conversionResponse.data.downloadLink);
        } catch (error) {
            console.error('Error during download:', error);
            // Handle errors appropriately
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>YouTube Downloader</h1>
            <input
                type="text"
                placeholder="Enter YouTube Video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
            />
            <button onClick={handleDownload} disabled={loading}>
                {loading ? 'Downloading...' : 'Download'}
            </button>
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

export default YouTubeDownloader;