const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bird = require('../models/Bird');
const bcrypt = require('bcrypt');
const { isAuthenticated } = require('../Middleware/authMiddleware');
const jwt = require('jsonwebtoken');
// const {isAuthenticated} = require('../Middleware/authMiddleware');

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    // Return success response
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Bird details route
router.post('/state-birds',isAuthenticated , async (req, res) => {
    try {
      const { name, image, description, state } = req.body;  
      // Create a new bird
      const newBird = new Bird({
        name,
        image,
        description,
        state,
      });
  
      // Save the bird to the database
      await newBird.save();
  
      // Return success response
      res.status(200).json({ message: 'Bird details added successfully' });
    } catch (error) {
      console.error('Error adding bird details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/state-birds', isAuthenticated , async (req, res) => {
    const username = req.username;
    try {
      // Using the Bird model, find all records in the "birds" collection
      const allBirds = await Bird.find();
  
      // Return the list of birds as JSON
      res.status(200).json(allBirds);
    } catch (error) {
      console.error('Error fetching all birds:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  
  });

  router.delete('/state-birds/:id', async (req, res) => {
    try {
      const birdId = req.params.id;
  
      // Using the Bird model, find and remove the bird by ID
      const deletedBird = await Bird.findOneAndDelete({ _id: birdId });
  
      if (!deletedBird) {
        return res.status(404).json({ error: 'Bird not found' });
      }
  
      res.status(200).json({ message: 'Bird deleted successfully', deletedBird });
    } catch (error) {
      console.error('Error deleting state bird:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put('/state-birds/:id', async (req, res) => {
    try {
      const birdId = req.params.id;
      const { name, image, description, state } = req.body;
  
      // Using the Bird model, find and update the bird by ID
      const updatedBird = await Bird.findByIdAndUpdate(
        birdId,
        { name, image, description, state },
        { new: true, runValidators: true }
      );
  
      if (!updatedBird) {
        return res.status(404).json({ error: 'Bird not found' });
      }
  
      res.status(200).json({ message: 'Bird updated successfully', updatedBird });
    } catch (error) {
      console.error('Error updating state bird:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Comparing the entered password with the hashed password stored in the database
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate and send a token for authentication here
        const payload = { username: username };
        const token = jwt.sign(payload, "Anuj");

        // Set the token as a cookie
        res.cookie('token', token);

        // Send the response after setting the cookie
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/logout', isAuthenticated, (req, res) => {
  // Clear the token cookie
  
  res.clearCookie("token")
  res.send("logout successfully")
  res.status(200)
});

module.exports = router;
