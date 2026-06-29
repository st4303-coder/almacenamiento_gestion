require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5100;
const connectDB = require('./src/config/database');

connectDB();
app.listen(PORT, () =>{
    console.log(`Hello world: http://localhost:${PORT}`);
});