import React, { useEffect, useState } from 'react';
import Layout from "./Layout";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Credentials() {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const roles = ['admin', 'purchase', 'segregation', 'packaging', 'expense', 'credentials'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (userId) => {
    setEditMode(userId);
  };

  const handleSave = async (user) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/auth/users/${user._id}`, {
        username: user.username,
        password: user.password,
        role: user.role,
      });
      setEditMode(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/auth/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleChange = (e, userId, field) => {
    setUsers(users.map(user => user._id === userId ? { ...user, [field]: e.target.value } : user));
  };

  const togglePasswordVisibility = (userId) => {
    setShowPassword(prevState => ({ ...prevState, [userId]: !prevState[userId] }));
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Credentials Management</h2>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Password</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border">
              <td className="border px-4 py-2">
                {editMode === user._id ? (
                  <input 
                    type="text" 
                    className="border px-2 py-1" 
                    value={user.username} 
                    onChange={(e) => handleChange(e, user._id, 'username')} 
                  />
                ) : (
                  user.username
                )}
              </td>
              <td className="border px-4 py-2 relative">
                {editMode === user._id ? (
                  <div className="flex items-center">
                    <input 
                      type={showPassword[user._id] ? "text" : "password"} 
                      className="border px-2 py-1" 
                      value={user.password || ''} 
                      onChange={(e) => handleChange(e, user._id, 'password')} 
                    />
                    <button className="ml-2" onClick={() => togglePasswordVisibility(user._id)}>
                      {showPassword[user._id] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    {showPassword[user._id] ? user.password : "******"}
                    <button className="ml-2" onClick={() => togglePasswordVisibility(user._id)}>
                      {showPassword[user._id] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                )}
              </td>
              <td className="border px-4 py-2">
                {editMode === user._id ? (
                  <select
                    className="border px-2 py-1"
                    value={user.role}
                    onChange={(e) => handleChange(e, user._id, 'role')}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td className="border px-4 py-2">
                {editMode === user._id ? (
                  <button className="bg-green-500 text-white px-2 py-1 mr-2" onClick={() => handleSave(user)}>Save</button>
                ) : (
                  <button className="bg-blue-500 text-white px-2 py-1 mr-2" onClick={() => handleEdit(user._id)}>Edit</button>
                )}
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}