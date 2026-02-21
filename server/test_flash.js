const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testFlash() {
    try {
        const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
        console.log('Using key starting with:', key ? key.substring(0, 7) : 'NONE');
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log('Prompting gemini-1.5-flash...');
        const result = await model.generateContent("Say hello world");
        const response = await result.response;
        console.log('Response:', response.text());
    } catch (error) {
        console.error('Flash Test Error:', error.message);
        if (error.response) {
            console.error('Response details:', JSON.stringify(error.response, null, 2));
        }
    }
}

testFlash();
