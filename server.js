const express = require('express');
const { OpenRouterClient } = require('@openrouter/client');

const app = express();

app.use(express.json());

const client = new OpenRouterClient({
    apiKey: 'YOUR_API_KEY_HERE',
});

app.post('/api/v1/chat/completions', async (req, res) => {
    const result = await client.chat.completions.create({
        model: 'text-davinci-003',
        messages: [
            {
                role: 'user',
                content: req.body.prompt,
            },
        ],
        max_tokens: 50,
    });
    res.json(result);
});

app.listen(3000, () => {
    console.log('Proxy server running on http://localhost:3000');
});
