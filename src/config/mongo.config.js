const mongoose = require('mongoose');

module.exports = connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL); // Database connected.
        console.log('🍃 MongoDB Database Connected successfully...🍃');
    } catch (error) {
        console.log('❌ MongoDB Database Connections Error :', error);
    }
};
