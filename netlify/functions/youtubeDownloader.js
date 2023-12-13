// functions/download.js
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs').promises; // Using fs.promises for async file operations
const path = require('path');

exports.handler = async function (event, context) {
    try {
        const { videoUrl } = JSON.parse(event.body);
        const info = await ytdl.getInfo(videoUrl);
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

        const downloadLink = `/downloads/${info.videoDetails.title}.mp3`;
        const outputPath = path.resolve('public/downloads', `${info.videoDetails.title}.mp3`);

        await downloadAndConvert(videoUrl, videoFormat, outputPath);

        return {
            statusCode: 200,
            body: JSON.stringify({ downloadLink }),
        };
    } catch (error) {
        console.error('Error in download function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

async function downloadAndConvert(videoUrl, videoFormat, outputPath) {
    return new Promise(async (resolve, reject) => {
        try {
            const videoStream = ytdl(videoUrl, { format: videoFormat });
            const ffmpegCommand = ffmpeg(videoStream)
                .audioCodec('libmp3lame')
                .audioBitrate(320)
                .on('end', resolve)
                .on('error', reject);

            const fileStream = fs.createWriteStream(outputPath);

            // Pipe video stream to ffmpeg and save to file
            videoStream.pipe(ffmpegCommand).pipe(fileStream);

            // Wait for the process to complete
            await new Promise((innerResolve, innerReject) => {
                fileStream.on('finish', innerResolve);
                fileStream.on('error', innerReject);
            });
        } catch (error) {
            reject(error);
        }
    });
}
