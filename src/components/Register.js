import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/register', formData, {withCredentials: true});

      console.log(response.data); // Log the response from the server (for debugging)

      // Redirect to the login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response.data);
    }
  };

  return (
    <div>
      <h1 className="PageHeading">State Birds of India</h1>
      <h2>Register</h2>
      <form>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleInputChange} />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} />

        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
