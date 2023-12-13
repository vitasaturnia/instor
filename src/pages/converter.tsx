import React, { useState } from 'react';
import axios from 'axios';

interface ConversionResponse {
    downloadLink: string;
}

const YTConverterPage: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [downloadLink, setDownloadLink] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Configuration options
    const [bitrate, setBitrate] = useState<string>('128');
    const [audioCodec, setAudioCodec] = useState<string>('libmp3lame');

    const handleDownload = async () => {
        try {
            setError('');
            setLoading(true);

            // Step 1: Call Netlify function to interact with YouTube API
            const { data: { videoId } } = await axios.post<{ videoId: string }>('/.netlify/functions/youtubeDownloader', {
                videoUrl,
            });

            // Step 2: Call Netlify function to initiate video downloading and conversion
            const { data: { downloadLink: responseDownloadLink } } = await axios.post<ConversionResponse>('/.netlify/functions/videoConverter', {
                videoId,
                bitrate,
                audioCodec,
            });

            setDownloadLink(responseDownloadLink);
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
                <h1 className="title">YouTube Converter</h1>
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

                {/* Configuration Panel */}
                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label">Configuration</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <p className="control">
                                <label className="label">Bitrate</label>
                                <div className="select">
                                    <select value={bitrate} onChange={(e) => setBitrate(e.target.value)}>
                                        <option value="128">128 kbps</option>
                                        <option value="256">256 kbps</option>
                                        <option value="320">320 kbps</option>
                                    </select>
                                </div>
                            </p>
                        </div>

                        <div className="field">
                            <p className="control">
                                <label className="label">Audio Codec</label>
                                <div className="select">
                                    <select value={audioCodec} onChange={(e) => setAudioCodec(e.target.value)}>
                                        <option value="libmp3lame">MP3 (libmp3lame)</option>
                                        <option value="aac">AAC (aac)</option>
                                        {/* Add more codec options as needed */}
                                    </select>
                                </div>
                            </p>
                        </div>
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
                            Download MP3
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default YTConverterPage;
