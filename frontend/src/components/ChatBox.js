import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import styles from '../styles/ChatBox.module.css';

// Create socket instance outside component to persist across re-renders
const socket = io('http://localhost:5000'); // Replace with your backend URL in production

export default function ChatBox({ currentUser, targetUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // Consistent room ID strategy
  const roomId = currentUser && targetUser
    ? [currentUser, targetUser].sort().join('_')
    : null;

  // Join room and handle socket events
  useEffect(() => {
    if (!roomId) return;

    socket.emit('joinRoom', { roomId });

    socket.on('previousMessages', (msgs) => setMessages(msgs));
    socket.on('receiveMessage', (msg) => setMessages(prev => [...prev, msg]));

    return () => {
      socket.off('previousMessages');
      socket.off('receiveMessage');
    };
  }, [roomId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    const message = {
      sender: currentUser,
      text,
      timestamp: new Date()
    };
    socket.emit('sendMessage', { roomId, message });
    setText('');
  };

  if (!currentUser || !targetUser) return null;

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>Chat with Seller</div>

      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${
              msg.sender === currentUser ? styles.sent : styles.received
            }`}
          >
            <div className={styles.text}>{msg.text}</div>
            <div className={styles.meta}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className={styles.inputArea}>
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
