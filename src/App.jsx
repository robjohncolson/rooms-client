import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ColorPicker from './components/ColorPicker';
import UserList from './components/UserList';
import './App.css';

const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000');

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedColor, setSelectedColor] = useState({ c: 0, m: 0, y: 0, k: 0 });

  useEffect(() => {
    socket.on('init', ({ user, users }) => {
      setCurrentUser(user);
      setUsers(users);
    });

    socket.on('user-joined', (user) => {
      setUsers(prev => [...prev, user]);
    });

    socket.on('user-left', (userId) => {
      setUsers(prev => prev.filter(user => user.id !== userId));
    });

    socket.on('user-updated', (updatedUser) => {
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
    });

    socket.on('user-flash', (userId) => {
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

    return () => socket.disconnect();
  }, []);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    socket.emit('color-change', color);
  };

  const handleScreenClick = () => {
    socket.emit('flash', currentUser?.id);
  };

  return (
    <div className="app" onClick={handleScreenClick}>
      <div className="color-picker-container">
        <ColorPicker value={selectedColor} onChange={handleColorChange} />
      </div>
      <UserList 
        users={users} 
        currentUser={currentUser}
      />
    </div>
  );
}

export default App; 