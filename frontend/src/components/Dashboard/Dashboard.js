import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logout } from '../../services/authService';
import axios from 'axios';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleToUpdate, setRoleToUpdate] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);

        if (userInfo?.role === 'admin') {
          const response = await axios.get('http://localhost:5000/api/users', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          setUsersList(response.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleChange = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, { role: roleToUpdate }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      // Refresh user list
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setUsersList(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <p>Your role: {user.role}</p>
          
          {/* Render admin-specific content */}
          {user.role === 'admin' && (
            <div className="admin-section">
              <h3>Users List</h3>
              <ul className="user-list">
                {usersList.length > 0 ? (
                  usersList.map((user) => (
                    <li key={user.id} className="user-item">
                      {user.username} ({user.email})
                      <select
                        value={user.role}
                        onChange={(e) => {
                          setSelectedUser(user.id);
                          setRoleToUpdate(e.target.value);
                        }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="guest">Guest</option>
                      </select>
                      <button onClick={() => handleRoleChange(user.id)}>Update Role</button>
                    </li>
                  ))
                ) : (
                  <p>No users found.</p>
                )}
              </ul>
            </div>
          )}

          {/* Render user-specific content */}
          {user.role === 'user' && (
            <div className="user-section">
              <h3>User Content</h3>
              <p>This is user-specific content.</p>
            </div>
          )}
          
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
