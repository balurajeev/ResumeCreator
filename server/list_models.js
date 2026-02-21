const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    try {
        const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
        console.log('Using key starting with:', key ? key.substring(0, 7) : 'NONE');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        if (data.error) {
            console.error('API Error:', data.error);
        } else {
            console.log('Available Models:');
            data.models.forEach(m => console.log(`- ${m.name}`));
        }
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
