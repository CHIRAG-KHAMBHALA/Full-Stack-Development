import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import '../styles/UserSearch.css';

interface User {
  uid: string;
  displayName: string;
  email: string;
}

interface UserSearchProps {
  onSelectUser: (user: { userId: string; displayName: string; email: string }) => void;
  onClose: () => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const usersQuery = query(
        collection(db, 'users'),
        limit(50) // Limit to avoid too many results
      );
      
      const snapshot = await getDocs(usersQuery);
      const users: User[] = [];
      
      snapshot.forEach((doc) => {
        const userData = doc.data() as User;
        // Exclude current user from results
        if (userData.uid !== currentUser?.uid) {
          users.push(userData);
        }
      });
      
      setAllUsers(users);
      setSearchResults(users.slice(0, 10)); // Show first 10 users initially
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setSearchResults(allUsers.slice(0, 10));
      return;
    }

    const filtered = allUsers.filter(user =>
      user.displayName.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(filtered.slice(0, 10));
  };

  const handleSelectUser = (user: User) => {
    onSelectUser({
      userId: user.uid,
      displayName: user.displayName,
      email: user.email
    });
  };

  return (
    <div className="user-search">
      <div className="search-header">
        <h3>Start New Chat</h3>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="search-input-container">
        <div className="search-input-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
            autoFocus
          />
        </div>
      </div>

      <div className="search-results">
        {loading ? (
          <div className="loading-users">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading users...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="no-users">
            <i className="fas fa-users"></i>
            <p>
              {searchTerm.trim() === '' 
                ? 'No users found' 
                : `No users found for "${searchTerm}"`
              }
            </p>
            <small>Try searching with a different term</small>
          </div>
        ) : (
          <div className="users-list">
            <div className="results-header">
              <p>{searchResults.length} user{searchResults.length !== 1 ? 's' : ''} found</p>
            </div>
            {searchResults.map((user) => (
              <div
                key={user.uid}
                className="user-item"
                onClick={() => handleSelectUser(user)}
              >
                <div className="user-avatar">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h4>{user.displayName}</h4>
                  <p>{user.email}</p>
                </div>
                <div className="select-icon">
                  <i className="fas fa-comment"></i>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
