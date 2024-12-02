import React, { useState, useEffect } from 'react';

const DashboardPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/users');
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch users');
        }
  
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err.message);
      }
    };
  
    fetchUsers();
  }, []);
  

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>{user.username} - {user.email}</li>
          ))
        ) : (
          <li>No users found.</li>
        )}
      </ul>
    </div>
  );
};

export default DashboardPage;
