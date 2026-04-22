import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from 'dns'


dns.setServers(['8.8.8.8', '8.8.4.4']);


dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongo db connected successfully");

    } catch (error) {
        console.log("mongo db connection error: ", error);
    }
}