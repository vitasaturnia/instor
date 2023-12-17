import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/firebaseContext';
import { useAuth } from '../context/AuthContext';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    DocumentData,
    QueryDocumentSnapshot,
} from 'firebase/firestore';

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: any;
}

const Inbox: React.FC = () => {
    const { db } = useFirebase();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!user || !user.uid) {
                    setLoading(false);
                    setError('User is not authenticated');
                    return;
                }

                const currentUserId = user.uid;
                const messagesRef = collection(db, 'messages');
                const q = query(
                    messagesRef,
                    where('receiverId', '==', currentUserId),
                    orderBy('timestamp', 'desc')
                );

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const data: Message[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                        id: doc.id,
                        senderId: doc.data().senderId,
                        receiverId: doc.data().receiverId,
                        content: doc.data().content,
                        timestamp: doc.data().timestamp,
                    }));
                    setMessages(data);
                    setLoading(false);
                });

                return unsubscribe;
            } catch (error) {
                setError('Error fetching messages');
                console.error('Error fetching messages:', error);
                setLoading(false);
            }
        };

        fetchMessages();
    }, [db, user]);

    const handleSelectMessage = (id: string) => {
        setSelectedMessage(id);
    };

    const formatTimestamp = (timestamp: any) => {
        const date = new Date(timestamp.toMillis());
        return date.toLocaleString();
    };

    return (
        <div className="container mt-5">
            <div className="columns">
                <div className="column is-3">
                    <div className="box">
                        <h2 className="title is-4">Messages</h2>
                        {loading && <p>Loading messages...</p>}
                        {error && <p className="has-text-danger">{error}</p>}
                        {!loading && !error && (
                            <ul>
                                {messages.map((message) => (
                                    <li
                                        key={message.id}
                                        className={selectedMessage === message.id ? 'selected' : ''}
                                        onClick={() => handleSelectMessage(message.id)}
                                    >
                                        {message.senderId} {/* Display sender's UID */}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="column">
                    {selectedMessage !== null ? (
                        <div className="box">
                            <h2 className="title is-4">Message Content</h2>
                            <div>
                                <strong>Sender:</strong> {messages.find((msg) => msg.id === selectedMessage)?.senderId} {/* Display sender's UID */}
                            </div>
                            <div>
                                <strong>Message:</strong> {messages.find((msg) => msg.id === selectedMessage)?.content}
                            </div>
                            <div>
                                <strong>Timestamp:</strong>{' '}
                                {formatTimestamp(messages.find((msg) => msg.id === selectedMessage)?.timestamp)}
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
