import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const ApplicantSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    position: String,
    status: { type: String, default: 'pending' },
    resumeUrl: String,
}, { timestamps: true });

const Applicant = mongoose.model('Applicant', ApplicantSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to DB');
        const count = await Applicant.countDocuments();
        console.log('Total applicants:', count);
        const apps = await Applicant.find().limit(5);
        console.log('Sample applicants:', JSON.stringify(apps, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
