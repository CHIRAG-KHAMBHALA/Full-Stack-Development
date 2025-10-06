import React, { useEffect, useState, useRef } from 'react';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import '../styles/ChatWindow.css';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
  senderName: string;
}

interface ChatWindowProps {
  selectedUser: {
    userId: string;
    displayName: string;
    email: string;
  };
  currentUser: User;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatId = [currentUser.uid, selectedUser.userId].sort().join('_');

  useEffect(() => {
    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList: Message[] = [];
      snapshot.forEach((doc) => {
        messageList.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messageList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage.trim(),
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Unknown',
      chatId,
      timestamp: serverTimestamp()
    };

    try {
      // Add message to messages collection
      await addDoc(collection(db, 'messages'), messageData);

      // Update or create chat document
      const chatDocRef = doc(db, 'chats', chatId);
      await setDoc(chatDocRef, {
        participants: [currentUser.uid, selectedUser.userId],
        lastMessage: {
          text: newMessage.trim(),
          senderId: currentUser.uid,
          timestamp: new Date()
        },
        lastUpdated: new Date()
      }, { merge: true });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="user-avatar">
            {selectedUser.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h3>{selectedUser.displayName}</h3>
            <p>{selectedUser.email}</p>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading-messages">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <i className="fas fa-comments"></i>
            <p>No messages yet</p>
            <small>Start the conversation by sending a message</small>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUser.uid;
              const showTimestamp = index === 0 || 
                (messages[index - 1].senderId !== message.senderId) ||
                (message.timestamp && messages[index - 1].timestamp && 
                 message.timestamp.toDate().getTime() - messages[index - 1].timestamp.toDate().getTime() > 300000);

              return (
                <div
                  key={message.id}
                  className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                  </div>
                  {showTimestamp && (
                    <div className="message-timestamp">
                      {formatTime(message.timestamp)}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="message-input-container">
        <form onSubmit={sendMessage} className="message-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${selectedUser.displayName}...`}
              className="message-input"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="send-button"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
