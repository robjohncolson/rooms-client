import { useUser } from '../context/UserContext';

function Screen() {
  const { socket, user } = useUser();

  const handleClick = () => {
    if (socket && user) {
      socket.emit('flash', user.id);
    }
  };

  return (
    <div 
      className="screen"
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'white',
        cursor: 'pointer'
      }}
    />
  );
}

export default Screen; 