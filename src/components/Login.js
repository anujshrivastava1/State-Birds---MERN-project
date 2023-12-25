import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', formData, {withCredentials: true});

      console.log(response.data); // Log the response from the server 

      // Redirect to the state birds page after successful login
      if (response.status === 200){
        navigate('/state-birds');
      }
      else{
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Login error:', error.response.data);
      } else {
        console.error('Login error:', error.message);
      }
    }
  };

  return (
    <div>
      <h1 className="PageHeading">State Birds of India</h1>
      <h2>Login</h2>
      <form>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleInputChange} />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} />

        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
