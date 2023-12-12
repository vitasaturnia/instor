import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';

const YouTubeDownloader: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [downloadLink, setDownloadLink] = useState('');
    const [outputFormat, setOutputFormat] = useState<'mp3' | 'mp4'>('mp3');
    const [error, setError] = useState<string | null>(null);

    const loaderAnimation = useSpring({
        opacity: loading ? 1 : 0,
        from: { opacity: 0 },
        reset: loading,
    });

    const handleDownload = async () => {
        try {
            setLoading(true);
            setError(null);

            // Step 1: Call Netlify function to interact with YouTube API
            const { data } = await axios.post('/.netlify/functions/youtubeDownloader', {
                videoUrl,
            });

            // Step 2: Call Netlify function to initiate video downloading and conversion
            const conversionResponse = await axios.post('/.netlify/functions/videoConverter', {
                videoId: data.videoId,
                outputFormat,
            });

            // Set download link (replace this with your actual logic)
            setDownloadLink(conversionResponse.data.downloadLink);
        } catch (error) {
            console.error('Error during download:', error);
            setError('An error occurred during the download. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="youtubeDownloader" className={`box ${outputFormat === 'mp3' ? 'is-light' : ''}`}>
            <h1>YouTube Downloader</h1>
            <input
                type="text"
                placeholder="Enter YouTube Video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
            />
            <button onClick={handleDownload} disabled={loading}>
                {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                    'Download'
                )}
            </button>

            {error && (
                <div className="notification is-danger">
                    {error}
                </div>
            )}

            {downloadLink && (
                <div>
                    <p className="download-link">
                        Download Link: <a href={downloadLink} download>Download {outputFormat.toUpperCase()}</a>
                    </p>
                </div>
            )}

            <div className="loader">
                <animated.div style={loaderAnimation}>&nbsp;</animated.div>
            </div>

            <div className="output-options">
                <label>
                    <input
                        type="radio"
                        name="outputFormat"
                        value="mp3"
                        checked={outputFormat === 'mp3'}
                        onChange={() => setOutputFormat('mp3')}
                    />
                    <span>MP3</span>
                </label>

                <label>
                    <input
                        type="radio"
                        name="outputFormat"
                        value="mp4"
                        checked={outputFormat === 'mp4'}
                        onChange={() => setOutputFormat('mp4')}
                    />
                    <span>MP4</span>
                </label>
            </div>
        </div>
    );
};

export default YouTubeDownloader;
