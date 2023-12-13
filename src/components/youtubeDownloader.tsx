import { Handler } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const ytdl = require('ytdl-core');

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const handler: Handler = async (event: any) => {
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

        // Download YouTube video using ytdl-core
        const buffer = await ytdl.download(videoUrl, { filter: 'audioonly' });

        // Upload the buffer to Firebase Storage
        const fileName = outputFormat || 'mp3';
        const storageRef = ref(storage, `downloads/output.${fileName}`);
        const uint8Array = new Uint8Array(buffer);
        await uploadBytes(storageRef, uint8Array);

        // Get the download URL for the file
        const downloadURL = await getDownloadURL(storageRef);

        return {
            statusCode: 200,
            body: JSON.stringify({
                downloadLink: downloadURL,
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

export { handler };
