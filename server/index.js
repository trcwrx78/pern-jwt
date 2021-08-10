require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes

// Register and Login routes
app.use('/auth', require('./routes/jwtAuth'));

// Dashbaord routes
app.use('/dashboard', require('./routes/dashboard'));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is up and listening on ${port}`));
