const fs = require('fs');
const ytdl = require('ytdl-core');

const handler = async (event) => {
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
        const stream = ytdl(videoUrl, { filter: 'audioonly' });
        const fileStream = fs.createWriteStream(outputPath);

        stream.pipe(fileStream);

        await new Promise((resolve, reject) => {
            stream.on('end', () => {
                fileStream.end();
                resolve();
            });

            stream.on('error', (error) => {
                reject(error);
            });
        });

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
                details: error.message,
            }),
        };
    }
};

module.exports = { handler };
