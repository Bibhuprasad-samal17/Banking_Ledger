const mongoose = require('mongoose');




function connectToDB() {

    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with an error code
    });
}

module.exports = connectToDB;