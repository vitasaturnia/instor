import { Handler } from '@netlify/functions';
import ytdl from 'ytdl-core';
import fs from 'fs';

const handler: Handler = async (event, context) => {
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
        const outputPath = `/downloads/${videoId}/output.${outputFormat}`;

        await ytdl(videoUrl, { quality: 'highest' })
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
            }),
        };
    }
};

export { handler };
