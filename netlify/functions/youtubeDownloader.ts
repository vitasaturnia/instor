import { Handler } from '@netlify/functions';
import fs from 'fs';
import ytdl from 'ytdl-core';

const handler: Handler = async (event: any) => {
    try {
        console.log('Function called with event:', event);

        // Check if the event body is empty or not a valid JSON
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid request body',
                }),
            };
        }

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
        const videoStream = ytdl(videoUrl, { filter: 'audioonly' });
        const fileStream = fs.createWriteStream(outputPath);

        videoStream.pipe(fileStream);

        await new Promise((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });

        console.log('Download successful. File saved at:', outputPath);

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
