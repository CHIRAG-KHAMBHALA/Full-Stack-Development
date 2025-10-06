import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc
} from 'firebase/firestore';
import '../styles/Sidebar.css';

interface Chat {
  id: string;
  participants: string[];
  lastMessage: {
    text: string;
    timestamp: Date;
    senderId: string;
  };
  lastUpdated: Date;
}

interface ChatWithUser extends Chat {
  otherUser: {
    uid: string;
    displayName: string;
    email: string;
  };
}

interface SidebarProps {
  onSelectChat: (chat: { userId: string; displayName: string; email: string }) => void;
  onNewChat: () => void;
  selectedChatId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectChat, onNewChat, selectedChatId }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [chats, setChats] = useState<ChatWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastUpdated', 'desc')
    );

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data() as Chat;
        const otherUserId = chatData.participants.find(id => id !== currentUser.uid);
        
        if (otherUserId) {
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          if (userDoc.exists()) {
            return {
              ...chatData,
              id: chatDoc.id,
              otherUser: userDoc.data() as { uid: string; displayName: string; email: string; }
            };
          }
        }
        return null;
      });

      const resolvedChats = (await Promise.all(chatPromises)).filter(Boolean) as ChatWithUser[];
      setChats(resolvedChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="user-avatar">
            {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <h3>{userProfile?.displayName}</h3>
            <p>{userProfile?.email}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      <div className="sidebar-actions">
        <button className="new-chat-btn" onClick={onNewChat}>
          <i className="fas fa-plus"></i>
          New Chat
        </button>
      </div>

      <div className="chats-section">
        <div className="section-header">
          <h4>Recent Chats</h4>
        </div>
        
        <div className="chats-list">
          {loading ? (
            <div className="loading-chats">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading chats...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="no-chats">
              <i className="fas fa-comments"></i>
              <p>No conversations yet</p>
              <small>Start a new chat to begin</small>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${selectedChatId === chat.otherUser.uid ? 'active' : ''}`}
                onClick={() => onSelectChat({
                  userId: chat.otherUser.uid,
                  displayName: chat.otherUser.displayName,
                  email: chat.otherUser.email
                })}
              >
                <div className="chat-avatar">
                  {chat.otherUser.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="chat-info">
                  <div className="chat-header">
                    <h4>{chat.otherUser.displayName}</h4>
                    <span className="chat-time">
                      {formatTime(chat.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="last-message">
                    {chat.lastMessage.senderId === currentUser?.uid ? 'You: ' : ''}
                    {chat.lastMessage.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
