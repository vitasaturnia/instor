// InboxPage.tsx
import React from 'react';
import Inbox from '../components/Inbox.tsx'; // Import the Inbox component

const InboxPage: React.FC = () => {
    return (
        <div>
            <h1 className="title">Inbox Page</h1>
            <Inbox /> {/* Render the Inbox component */}
        </div>
    );
};

export default InboxPage;
