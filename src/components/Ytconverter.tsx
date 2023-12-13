// converter.tsx
import React, { useState } from 'react';
import axios from 'axios';

const Converter: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [outputFormat, setOutputFormat] = useState('mp3');
    const [downloadLink, setDownloadLink] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        try {
            setError(null);

            // Call your Netlify function with the videoUrl and outputFormat
            const response = await axios.post('/.netlify/functions/youtubeDownloader', {
                videoUrl,
                outputFormat,
            });

            // Assuming your Netlify function returns the downloadLink
            setDownloadLink(response.data.downloadLink);
        } catch (err) {
            console.error('Conversion error:', err);
            setError('An error occurred during the conversion. Please try again.');
        }
    };

    return (
        <div>
            <h1>YouTube to MP3 Converter</h1>
            <div>
                <label>
                    YouTube Video URL:
                    <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Output Format:
                    <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}>
                        <option value="mp3">MP3</option>
                        {/* Add other format options if needed */}
                    </select>
                </label>
            </div>
            <div>
                <button onClick={handleConvert}>Convert</button>
            </div>
            {downloadLink && (
                <div>
                    <p>Download Link:</p>
                    <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                        {downloadLink}
                    </a>
                </div>
            )}
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};

export default Converter;
