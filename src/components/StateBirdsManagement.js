import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './display.css'; 
import { useNavigate } from 'react-router-dom';

const StateBirdsManagement = () => {

  const navigate = useNavigate();

  const initialState = {
    name: '',
    image: '',
    description: '',
    state: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [stateBirds, setStateBirds] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    // Fetching the initial list of state birds when the component mounts
    fetchStateBirds();
  }, []);

  const fetchStateBirds = async () => {
    try {
      // Fetching the list of state birds from the backend
      const response = await axios.get('http://localhost:5000/auth/state-birds', {withCredentials: true});
      setStateBirds(response.data);
    } catch (error) {
      console.error('Error fetching state birds:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Edit existing state bird
      const response = await axios.put(
        `http://localhost:5000/auth/state-birds/${stateBirds[editIndex]._id}`,
        formData, {withCredentials: true}
      );
      console.log(response.data);
      setEditIndex(null);
    } else {
      // Add new state bird
      console.log(formData);
      const response = await axios.post('http://localhost:5000/auth/state-birds', formData, {withCredentials: true});
      console.log(response.data);
    }

    // Clear form data and fetch updated state bird list
    setFormData(initialState);
    fetchStateBirds();
  };

  const handleEdit = (index) => {
    // Set form data and edit index when editing
    setFormData(stateBirds[index]);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    // Delete state bird
    console.log(stateBirds[index]._id)
    const response = await axios.delete(`http://localhost:5000/auth/state-birds/${stateBirds[index]._id}`, {withCredentials: true});
    console.log(response.data);

    // Fetch updated state bird list
    fetchStateBirds();
  };

  const handleLogout = () => {
    // To navigate to the login page
    axios.get('http://localhost:5000/auth/logout', {withCredentials: true})
  .then(response => {
    // Handle successful logout (if needed)
    console.log('Logout successful:', response.data);
    navigate('/login');
  })
  .catch(error => {
    // Handle errors during logout
    console.error('Error during logout:', error.response.data);
  });
   
  };

  return (
    <div className="StateBirdsManagementContainer">
      <div className="StateBirdsList">
        <h2>State Birds Catalog</h2>
        <table >
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Description</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stateBirds.map((bird, index) => (
              <tr key={index}>
                <td>{bird.name}</td>
                <td>
                  <img src={bird.image} alt={bird.name} style={{ width: '200px', height: '150px' }} />
                </td>
                <td>{bird.description}</td>
                <td>{bird.state}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="LogoutButton" onClick={handleLogout}>Log out</button>
      </div>
      <div className="StateBirdsManagementForm">
        <h2>Bird Registry</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />

          <label>Image URL:</label>
          <input type="text" name="image" value={formData.image} onChange={handleInputChange} />

          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} />

          <label>State:</label>
          <input type="text" name="state" value={formData.state} onChange={handleInputChange} />

          <button type="submit">{editIndex !== null ? 'Update' : 'Add'}</button>
        </form>
      </div>
    </div>
  );
};

export default StateBirdsManagement;
