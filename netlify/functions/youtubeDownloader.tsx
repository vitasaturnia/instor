// youtubeDownloader.tsx
const ytdl = require('ytdl-core');

exports.handler = async function (event, context) {
    try {
        const { videoUrl } = JSON.parse(event.body);

        const info = await ytdl.getInfo(videoUrl);
        const videoId = info.videoDetails.videoId;

        return {
            statusCode: 200,
            body: JSON.stringify({ videoId }),
        };
    } catch (error) {
        console.error('Error in youtubeDownloader:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
