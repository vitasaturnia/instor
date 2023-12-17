import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '../context/firebaseContext.tsx';
import { useAuth } from '../context/AuthContext.tsx
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const NewMessage = () => {
    const { username: receiver } = useParams<{ username: string }>();
    const { db } = useFirebase();
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Message cannot be empty');
            return;
        }
        try {
            await addDoc(collection(db, 'messages'), {
                sender: user?.email, // or any identifier you prefer
                receiver,
                content: message,
                timestamp: serverTimestamp(),
            });
            setConfirmation('Message sent successfully');
            setMessage('');
        } catch (err) {
            setError('Error sending message');
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={sendMessage}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here"
                ></textarea>
                <button type="submit">Send Message</button>
            </form>
            {error && <p className="error">{error}</p>}
            {confirmation && <p className="confirmation">{confirmation}</p>}
        </div>
    );
};

export default NewMessage;
