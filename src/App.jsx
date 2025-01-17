import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import Ball from './components/Ball';
import QRCodeButton from './components/QRCodeButton';
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
  const [scores, setScores] = useState(new Map());
  const [gameComplete, setGameComplete] = useState(false);

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
      setScores(prev => {
        const newScores = new Map(prev);
        newScores.delete(userId);
        return newScores;
      });
    });

    socket.on('score-update', ({ userId, accuracy }) => {
      setScores(prev => {
        const newScores = new Map(prev);
        const userScores = newScores.get(userId) || [];
        newScores.set(userId, [...userScores, accuracy]);
        return newScores;
      });
    });

    connectSocket();

    return () => {
      clearInterval(pingInterval);
      socket.disconnect();
    };
  }, []);

  const handleTap = useCallback((accuracy, bounceNumber) => {
    if (!currentUser || !connected) return;
    
    socket.emit('score-update', {
      userId: currentUser.id,
      accuracy
    });

    setScores(prev => {
      const newScores = new Map(prev);
      const userScores = newScores.get(currentUser.id) || [];
      newScores.set(currentUser.id, [...userScores, accuracy]);
      
      // Check if game is complete for this user
      if (userScores.length >= 2) {
        setGameComplete(true);
      }
      
      return newScores;
    });
  }, [currentUser, connected]);

  const getWinner = useCallback(() => {
    if (!gameComplete) return null;
    
    let bestScore = Infinity;
    let winnerId = null;
    
    scores.forEach((userScores, userId) => {
      if (userScores.length === 3) {
        const avgScore = userScores.reduce((a, b) => a + b, 0) / userScores.length;
        if (avgScore < bestScore) {
          bestScore = avgScore;
          winnerId = userId;
        }
      }
    });
    
    return users.find(user => user.id === winnerId);
  }, [scores, users, gameComplete]);

  const winner = getWinner();

  return (
    <div className="app">
      <Ball onTap={handleTap} />
      {gameComplete && winner && (
        <div className="winner-announcement">
          Winner: {winner.name}!
        </div>
      )}
      <QRCodeButton />
    </div>
  );
}

export default App; 