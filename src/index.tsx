import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import dotenv from 'dotenv';

// Load dotenv configuration based on NODE_ENV
dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
});

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Root element not found in the document.");
}
