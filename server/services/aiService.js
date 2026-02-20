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
                    You are an expert ATS-optimized resume writer.
                    
                    TASK:
                    1. Read the provided "Raw Resume Text".
                    2. Extract all personal info, work experience, education, and skills.
                    3. Rewrite the content to be more professional, using strong action verbs and quantifiable results.
                    4. IMPORTANT: Keep all factual information (dates, company names, job titles) EXACTLY as provided. Do not hallucinate.
                    
                    OUTPUT FORMAT:
                    You MUST return ONLY a valid JSON object. Do not include any markdown styling like \`\`\`json or explanations.
                    
                    STRICT JSON STRUCTURE:
                    {
                      "name": "Full Name",
                      "email": "Email Address",
                      "phone": "Phone Number",
                      "linkedin": "LinkedIn URL (if found)",
                      "summary": "A professional 2-3 sentence summary",
                      "experience": [
                        {
                          "role": "Job Title",
                          "company": "Company Name",
                          "duration": "Dates (e.g. Jan 2020 - Present)",
                          "description": "3-4 bullet points of achievements"
                        }
                      ],
                      "education": [
                        {
                          "degree": "Degree Name",
                          "institution": "School Name",
                          "year": "Graduation Year"
                        }
                      ],
                      "skills": ["Skill 1", "Skill 2"]
                    }

                    Raw Resume Text:
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
