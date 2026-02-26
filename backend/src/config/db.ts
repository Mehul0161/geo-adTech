import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/geo-adtech';
        await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Connected: ${mongoUri}`);
    } catch (err: any) {
        console.error(`❌ MongoDB Connection Error: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
