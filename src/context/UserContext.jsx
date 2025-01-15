import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import io from 'socket.io-client';
import { API_URL } from '../config/constants';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [color, setColor] = useState({ c: 0, m: 0, y: 0, k: 0 });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(API_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const value = {
    user,
    setUser,
    socket,
    color,
    setColor,
    users,
    setUsers
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 