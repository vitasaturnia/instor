import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';

interface DownloadResponse {
    downloadLink: string;
}

const YouTubeDownloader: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [downloadLink, setDownloadLink] = useState('');
    const [outputFormat, setOutputFormat] = useState<'mp3' | 'mp4' | 'aac' | 'ogg' | 'flac' | 'wav'>('mp3');
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

            const response = await axios.post<DownloadResponse>('/.netlify/functions/youtubeDownloader', {
                videoUrl,
                outputFormat,
            });

            if (response.status === 200) {
                setDownloadLink(response.data.downloadLink);
            } else {
                setError('An error occurred during the download. Please try again.');
            }
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
                {['mp3', 'mp4', 'aac', 'ogg', 'flac', 'wav'].map((format) => (
                    <label key={format}>
                        <input
                            type="radio"
                            name="outputFormat"
                            value={format}
                            checked={outputFormat === format}
                            onChange={() => setOutputFormat(format as typeof outputFormat)}
                        />
                        <span>{format.toUpperCase()}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default YouTubeDownloader;
import { Handler } from '@netlify/functions';
const fs = require('fs');
const ytdl = require('ytdl-core');

const handler: Handler = async (event: any) => {
    try {
        const { videoUrl, outputFormat } = JSON.parse(event.body);

        // Validate YouTube URL
        if (!ytdl.validateURL(videoUrl)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid YouTube URL',
                }),
            };
        }

        // Download YouTube video
        const info = await ytdl.getInfo(videoUrl);
        const videoId = info.videoDetails.videoId;
        const outputPath = `./downloads/${videoId}/output.${outputFormat}`;

        // Use ytdl-core to download video as MP3
        await ytdl(videoUrl, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(outputPath));

        return {
            statusCode: 200,
            body: JSON.stringify({
                downloadLink: outputPath,
            }),
        };
    } catch (error) {
        console.error('Error during download:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'An error occurred during the download. Please try again.',
                details: error.message, // Include the error message for more information
            }),
        };
    }
};

export { handler };