const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const Database = require('./services/Database');

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use(express.json());

app.listen(port, () => {
    Database.getInstance(); // Ensure the database connection is established
    console.log('Database connection established');
    console.log(`Server is running on port ${port}`);
})