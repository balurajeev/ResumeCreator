const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error('ERROR: No API Key found in environment variables! Please set GEMINI_API_KEY in Render/Vercel settings.');
} else {
    console.log(`AI Service initialized. Key starts with: ${apiKey.substring(0, 7)}...`);
}

const genAI = new GoogleGenerativeAI(apiKey);

const rewriteResume = async (resumeText) => {
    try {
        // Broad list of model names to handle different region/account availability
        const modelNames = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro-latest",
            "gemini-pro",
            "gemini-flash-lite-latest"
        ];

        let model;
        let lastError;

        for (const name of modelNames) {
            try {
                console.log(`Attempting to use model: ${name}`);
                model = genAI.getGenerativeModel({ model: name });

                const prompt = `
                    You are a professional resume writer. 
                    Rewrite the following resume text to be more professional and ATS-optimized. 
                    Use quantifiable achievements where possible. 
                    YOU MUST RETURN ONLY A VALID JSON OBJECT. NO MARKDOWN, NO EXPLANATIONS.
                    
                    The JSON structure MUST follow this exactly:
                    {
                      "name": "string",
                      "email": "string",
                      "phone": "string",
                      "linkedin": "string",
                      "summary": "string",
                      "experience": [{"role": "string", "company": "string", "duration": "string", "description": "string"}],
                      "education": [{"degree": "string", "institution": "string", "year": "string"}],
                      "skills": ["string"]
                    }

                    Resume Details:
                    ${resumeText}
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Clean the response: Gemini sometimes wraps results in ```json ... ```
                const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(cleanJson);
            } catch (err) {
                console.error(`Error with model ${name}:`, err.message);
                lastError = err;
                // If it's an auth error or quota error, it might not be worth trying other models, 
                // but let's try them all just in case.
                continue;
            }
        }

        throw lastError;
    } catch (error) {
        console.error('Final Gemini Processing Error:', error);
        // Provide more detailed feedback in the thrown error so the UI/User can see it
        throw new Error(`AI processing failed: ${error.message || 'Check API key/Model access'}`);
    }
};

module.exports = { rewriteResume };
