const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error('ERROR: No API Key found in environment variables!');
} else {
    console.log(`AI Service initialized. Key starts with: ${apiKey.substring(0, 7)}...`);
}

const genAI = new GoogleGenerativeAI(apiKey);

const rewriteResume = async (resumeText) => {
    try {
        // Models prioritized by what we saw in your successful CURL list
        const modelNames = [
            "gemini-pro-latest",
            "gemini-flash-lite-latest",
            "gemini-1.5-flash",
            "gemini-1.5-pro"
        ];

        let lastError;

        for (const name of modelNames) {
            try {
                console.log(`Attempting to use model: ${name}`);
                const model = genAI.getGenerativeModel({ model: name });

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

                const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(cleanJson);

            } catch (err) {
                console.error(`Error with model ${name}:`, err.message);
                lastError = err;

                // If it's a quota error (429 or limit exceeded), trying another model might help 
                // but usually signifies a bigger issue with the API key or account status.
                if (err.message.includes('Quota exceeded') || err.message.includes('429')) {
                    console.warn(`Quota issue with ${name}. Moving to next...`);
                }

                continue;
            }
        }

        throw lastError;
    } catch (error) {
        console.error('Final Gemini Processing Error:', error);
        throw new Error(`AI processing failed: ${error.message}`);
    }
};

module.exports = { rewriteResume };
