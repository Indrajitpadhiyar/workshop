import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testUpload() {
    // create a dummy file
    const dummyPath = path.join(__dirname, 'dummy.pdf');
    fs.writeFileSync(dummyPath, 'dummy pdf content');
    
    const fileContent = fs.readFileSync(dummyPath);
    const blob = new Blob([fileContent], { type: 'application/pdf' });

    const form = new FormData();
    form.append('firstName', 'Test');
    form.append('lastName', 'User');
    form.append('email', 'test@example.com');
    form.append('position', 'Tester');
    form.append('resume', blob, 'dummy.pdf');

    try {
        const response = await fetch('http://localhost:4000/api/register', {
            method: 'POST',
            body: form
        });
        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Body:', text);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        fs.unlinkSync(dummyPath);
    }
}

testUpload();
