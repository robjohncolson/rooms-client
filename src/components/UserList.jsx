import './UserList.css';

function UserList({ users, currentUser }) {
  const cmykToRgb = (c, m, y, k) => {
    let r = 255 * (1 - c / 100) * (1 - k / 100);
    let g = 255 * (1 - m / 100) * (1 - k / 100);
    let b = 255 * (1 - y / 100) * (1 - k / 100);
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  return (
    <div className="user-list">
      {users.map(user => (
        <div 
          key={user.id}
          className={`user-item ${user.id === currentUser?.id ? 'current-user' : ''}`}
          style={{
            color: user.isFlashing 
              ? cmykToRgb(user.color.c, user.color.m, user.color.y, user.color.k)
              : '#000'
          }}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default UserList; 