import { Handler } from '@netlify/functions';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import ytdl from 'ytdl-core';

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

        // Set a unique ID for this conversion
        const conversionId = context.clientContext.custom.netlify.conversionId;

        // Set the output directory in Netlify
        const outputPath = `/downloads/${conversionId}/output.${outputFormat}`;

        await new Promise((resolve, reject) => {
            // Download YouTube video
            const videoStream = ytdl(videoUrl, { quality: 'highestvideo' });

            // Convert and save the video
            ffmpeg(videoStream)
                .toFormat(outputFormat)
                .on('end', () => {
                    console.log('Conversion finished');

                    // Save download link to a file
                    fs.writeFileSync(`./public/downloads/${conversionId}.txt`, outputPath);

                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error during conversion:', err);
                    reject(err);
                })
                .save(outputPath);
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                conversionId,
            }),
        };
    } catch (error) {
        console.error('Error during conversion:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'An error occurred during the conversion. Please try again.',
            }),
        };
    }
};

export { handler };
