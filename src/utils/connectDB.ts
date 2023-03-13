import mongoose from 'mongoose';

async function connectDB() {
    const MONGO_URL = process.env.MONGODB_URL;
    try {
        mongoose.connect(MONGO_URL, { autoIndex: false });
        console.log(`Connect MongoDB successfully with URI: ${MONGO_URL} !`);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;
