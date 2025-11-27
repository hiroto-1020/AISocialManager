const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve(__dirname, '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const lines = envFile.split('\n');
    let key = '';
    for (const line of lines) {
        if (line.includes('GEMINI_API_KEY')) {
            const parts = line.split('=');
            if (parts.length >= 2) {
                key = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '').replace(';', '');
                break;
            }
        }
    }
    fs.writeFileSync('key.txt', key || 'NOT_FOUND');
} catch (e) {
    fs.writeFileSync('key.txt', 'ERROR: ' + e.message);
}
