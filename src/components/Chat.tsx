import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../context/firebaseContext';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import 'bulma/css/bulma.min.css'; // Ensure Bulma CSS is imported

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth(); // User from AuthContext
    const { db } = useFirebase(); // Firestore database from FirebaseContext
    const messagesEndRef = useRef(null);
    const messagesRef = collection(db, 'messages');

    useEffect(() => {
        const q = query(messagesRef, orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesArray = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setMessages(messagesArray);
        });

        return unsubscribe;
    }, [db]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await addDoc(messagesRef, {
                text: newMessage,
                createdAt: serverTimestamp(),
                uid: user?.uid,
                photoURL: user?.photoURL || 'default-avatar.png'
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-display">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.uid === user?.uid ? 'sent' : 'received'}`}>
                        <img src={msg.photoURL} alt="Avatar" className="avatar" />
                        <div className="message-content">{msg.text}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <form onSubmit={sendMessage} className="field has-addons">
                    <div className="control is-expanded">
                        <input
                            className="input"
                            type="text"
                            value={newMessage}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                    </div>
                    <div className="control">
                        <button type="submit" className="button is-primary">Send</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat;
