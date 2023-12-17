import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '../context/firebaseContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const NewMessage = () => {
    const { username: receiver } = useParams<{ username: string }>();
    const { db } = useFirebase();
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [confirmation, setConfirmation] = useState<string | null>(null);

    const sendMessage = async (e: React.FormEvent) => {
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
            setError(null); // Clear any previous errors on success
        } catch (err) {
            setError('Error sending message');
            console.error(err);
        }
    };

    return (
        <div className="message-box">
            <h2 className="title is-4">Send a Message to {receiver}</h2>
            <form onSubmit={sendMessage}>
                <div className="field">
                    <div className="control">
                        <textarea
                            className={`textarea ${error ? 'is-danger' : ''}`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message here"
                            rows={4}
                        ></textarea>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button className="button is-primary" type="submit">Send Message</button>
                    </div>
                </div>
            </form>
            {error && <p className="help is-danger">{error}</p>}
            {confirmation && <p className="help is-success">{confirmation}</p>}
        </div>
    );
};

export default NewMessage;
