const fs = require('fs');
const path = require('path');

// Load .env manually since we might not have dotenv installed globally or in this scope easily
try {
    const paths = ['.env', '.env.local'];
    for (const p of paths) {
        const envPath = path.resolve(__dirname, p);
        if (fs.existsSync(envPath)) {
            console.log(`Reading ${p}...`);
            const envFile = fs.readFileSync(envPath, 'utf8');
            const lines = envFile.split('\n');
            for (const line of lines) {
                // Match key=value, allow spaces, allow export
                const match = line.match(/^(?:export\s+)?([^=]+)\s*=\s*(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    let value = match[2].trim();
                    // Strip quotes if present
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    if (key === 'GEMINI_API_KEY') {
                        process.env.GEMINI_API_KEY = value;
                        console.log("Found GEMINI_API_KEY");
                    }
                }
            }
        }
    }
} catch (e) {
    console.log('Error reading env files:', e.message);
}

const key = process.env.GEMINI_API_KEY;
console.log("Key found:", !!key);

if (!key) {
    console.error("No GEMINI_API_KEY found.");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

fetch(url)
    .then(r => r.json())
    .then(data => {
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.name.includes('imagen') || m.supportedGenerationMethods?.includes('generateImage')) {
                    console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                }
            });
            // Also print all just in case
            // console.log(JSON.stringify(data, null, 2));
        } else {
            console.log("Error or no models:", data);
        }
    })
    .catch(e => console.error("Fetch error:", e));
