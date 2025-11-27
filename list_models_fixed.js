const key = 'AIzaSyBoZvwm9_HPlCKOpU2v84jV_ao3U77bTAE';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log(`Fetching from ${url}...`);

fetch(url)
    .then(r => r.json())
    .then(data => {
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods?.join(', ')})`);
            });
        } else {
            console.log("Error or no models:", JSON.stringify(data, null, 2));
        }
    })
    .catch(e => console.error("Fetch error:", e));
