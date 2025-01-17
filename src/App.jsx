import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ColorPicker from './components/ColorPicker';
import UserList from './components/UserList';
import QRCodeButton from './components/QRCodeButton';
import './App.css';

const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000', {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: false
});

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedColor, setSelectedColor] = useState({ c: 50, m: 50, y: 50, k: 0 });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('init', ({ user, users }) => {
      console.log('Initialized with user:', user);
      setCurrentUser(user);
      setUsers(users);
      setSelectedColor(user.color);
    });

    socket.on('user-joined', (user) => {
      console.log('User joined:', user);
      setUsers(prev => [...prev, user]);
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

    socket.on('user-flash', (userId) => {
      console.log('User flash:', userId);
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          return { ...user, isFlashing: true };
        }
        return user;
      }));

      setTimeout(() => {
        setUsers(prev => prev.map(user => {
          if (user.id === userId) {
            return { ...user, isFlashing: false };
          }
          return user;
        }));
      }, 1000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (connected) {
      socket.emit('color-change', color);
    }
  };

  const handleUserTap = (userId) => {
    if (connected) {
      socket.emit('flash', userId);
    }
  };

  return (
    <div className="app">
      <div className="color-picker-container">
        <ColorPicker value={selectedColor} onChange={handleColorChange} />
      </div>
      <UserList 
        users={users} 
        currentUser={currentUser}
        onUserTap={handleUserTap}
      />
      <QRCodeButton />
    </div>
  );
}

export default App; 