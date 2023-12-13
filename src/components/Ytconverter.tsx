// components/VideoDownloaderPage.js
import React from 'react';
import VideoDownloader from '../components/youtubeDownloader.tsx';

const VideoDownloaderPage = () => {
    return (
        <section className="section">
            <div className="container">
                <h1 className="title">YouTube Downloader</h1>
                <VideoDownloader />
            </div>
        </section>
    );
};

export default VideoDownloaderPage;
