import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000', {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 60000,
  autoConnect: false
});

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);

  // Keep connection alive
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (connected) {
        socket.emit('ping');
      }
    }, 20000);

    return () => clearInterval(pingInterval);
  }, [connected]);

  useEffect(() => {
    const connectSocket = () => {
      if (!socket.connected) {
        socket.connect();
      }
    };

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
      setTimeout(connectSocket, 1000);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnected(false);
      setTimeout(connectSocket, 1000);
    });

    socket.on('init', ({ user, users }) => {
      console.log('Initialized with user:', user);
      setCurrentUser(user);
      setUsers(users);
    });

    socket.on('user-joined', (user) => {
      console.log('User joined:', user);
      setUsers(prev => {
        const exists = prev.some(u => u.id === user.id);
        if (exists) return prev;
        return [...prev, user];
      });
    });

    socket.on('user-left', (userId) => {
      console.log('User left:', userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    });

    socket.on('user-updated', (updatedUser) => {
      console.log('User updated:', updatedUser);
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
    });

    connectSocket();

    return () => {
      clearInterval(pingInterval);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app" />
  );
}

export default App; 