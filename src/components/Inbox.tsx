// Inbox.tsx
import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const Inbox: React.FC = () => {
    const { db } = useFirebase();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messagesRef = collection(db, 'messages');
                const q = query(messagesRef, where('receiver', '==', 'currentUserId'), orderBy('timestamp', 'desc'));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const data = [];
                    snapshot.forEach((doc) => {
                        data.push({ id: doc.id, ...doc.data() });
                    });
                    setMessages(data);
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [db]);

    const handleSelectMessage = (id) => {
        setSelectedMessage(id);
    };

    return (
        <div className="container mt-5">
            <div className="columns">
                <div className="column is-3">
                    <div className="box">
                        <h2 className="title is-4">Messages</h2>
                        <ul>
                            {messages.map((message) => (
                                <li
                                    key={message.id}
                                    className={selectedMessage === message.id ? 'selected' : ''}
                                    onClick={() => handleSelectMessage(message.id)}
                                >
                                    {message.sender}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="column">
                    {selectedMessage !== null ? (
                        <div className="box">
                            <h2 className="title is-4">Message Content</h2>
                            <div>
                                <strong>Sender:</strong> {messages.find((msg) => msg.id === selectedMessage).sender}
                            </div>
                            <div>
                                <strong>Message:</strong> {messages.find((msg) => msg.id === selectedMessage).content}
                            </div>
                            <div>
                                <strong>Timestamp:</strong> {messages.find((msg) => msg.id === selectedMessage).timestamp}
                            </div>
                        </div>
                    ) : (
                        <div className="box">
                            <p className="has-text-grey-light">Select a message to view</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inbox;
