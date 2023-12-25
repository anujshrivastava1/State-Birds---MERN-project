const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');



const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({origin: 'http://localhost:3000',credentials: true}));
app.use(cookieParser());
// app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (replace 'your_mongodb_uri' with your actual MongoDB URI)
// const uri = 'mongodb://127.0.0.1:27017/birds';
// mongoose.connect(uri);
// const connection = mongoose.connection;
// connection.once('open', () => {
//     console.log('MongoDB connection established successfully!!!')
// });

mongoose.connect('mongodb+srv://Anuj:MeXW2elrbZao4csi@cluster0.nw6a2rd.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Adding routes for user registration, login, and state birds
app.use('/auth', authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
