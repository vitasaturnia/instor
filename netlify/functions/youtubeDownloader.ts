const { Handler } = require('@netlify/functions');
const fs = require('fs');
const ytdl = require('ytdl-core');
const mkdirp = require('mkdirp');

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

        // Ensure the directory exists
        await mkdirp(`./downloads/${videoId}`);

        // Use ytdl-core to download video as MP3
        const stream = ytdl(videoUrl, { filter: 'audioonly' });
        const fileStream = fs.createWriteStream(outputPath);

        return new Promise((resolve, reject) => {
            stream.pipe(fileStream);

            stream.on('end', () => {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({
                        downloadLink: outputPath,
                    }),
                });
            });

            stream.on('error', (error) => {
                reject({
                    statusCode: 500,
                    body: JSON.stringify({
                        error: 'An error occurred during the download. Please try again.',
                        details: error.message,
                    }),
                });
            });
        });
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
