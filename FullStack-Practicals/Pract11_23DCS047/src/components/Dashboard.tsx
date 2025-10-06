import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import UserSearch from './UserSearch';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

interface SelectedChat {
  userId: string;
  displayName: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [showUserSearch, setShowUserSearch] = useState(false);

  const handleStartChat = (user: SelectedChat) => {
    setSelectedChat(user);
    setShowUserSearch(false);
  };

  const handleSelectChat = (chat: SelectedChat) => {
    setSelectedChat(chat);
  };

  if (!currentUser || !userProfile) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar
        onSelectChat={handleSelectChat}
        onNewChat={() => setShowUserSearch(true)}
        selectedChatId={selectedChat?.userId || null}
      />
      
      <div className="main-content">
        {showUserSearch ? (
          <UserSearch 
            onSelectUser={handleStartChat}
            onClose={() => setShowUserSearch(false)}
          />
        ) : selectedChat ? (
          <ChatWindow 
            selectedUser={selectedChat}
            currentUser={currentUser}
          />
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <i className="fas fa-comments"></i>
              <h3>Welcome to Social Chat</h3>
              <p>Select a conversation or start a new chat to begin messaging.</p>
              <button 
                className="start-chat-btn"
                onClick={() => setShowUserSearch(true)}
              >
                <i className="fas fa-plus"></i>
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
