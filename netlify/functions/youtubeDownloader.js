const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

exports.handler = async function (event, context) {
    try {
        const { videoUrl } = JSON.parse(event.body);
        const info = await ytdl.getInfo(videoUrl);
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

        const response = {
            downloadLink: `/downloads/${info.videoDetails.title}.mp3`,
        };

        const outputPath = path.resolve('.netlify/functions/downloads', `${info.videoDetails.title}.mp3`);

        await new Promise((resolve, reject) => {
            ytdl(videoUrl, { format: videoFormat })
                .pipe(ffmpeg())
                .audioCodec('libmp3lame')
                .audioBitrate(320)
                .on('end', resolve)
                .on('error', reject)
                .pipe(fs.createWriteStream(outputPath));
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        console.error('Error in download function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
