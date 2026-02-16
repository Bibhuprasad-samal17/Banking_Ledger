require("dotenv").config()
const app = require ('./src/app');
const connectToDB = require('./src/config/db');


require('dotenv').config();
const connectDB = require('./src/config/db');

connectDB();

connectToDB();


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000'); 
})