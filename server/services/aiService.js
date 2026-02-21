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
        // Exhaustive list based on your specific project's "list_models" output
        const modelNames = [
            "gemini-flash-latest",
            "gemini-pro-latest",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-2.0-flash",
            "gemini-2.0-flash-lite",
            "gemini-2.0-flash-exp"
        ];

        let lastError;
        let quotaExceededAny = false;

        for (const name of modelNames) {
            try {
                console.log(`AI Service: Attempting model: ${name}`);
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

                // Set a timeout for the request
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                if (!text) throw new Error("Empty response from AI");

                // Robust JSON extraction
                let cleanJson = text.trim();
                const startIdx = cleanJson.indexOf('{');
                const endIdx = cleanJson.lastIndexOf('}');

                if (startIdx !== -1 && endIdx !== -1) {
                    cleanJson = cleanJson.substring(startIdx, endIdx + 1);
                } else {
                    console.error("AI Output did not contain valid JSON block:", text);
                    throw new Error("Invalid format from AI");
                }

                return JSON.parse(cleanJson);

            } catch (err) {
                console.error(`AI Service: Error with ${name}: ${err.message}`);
                lastError = err;

                if (err.message.includes('Quota exceeded') || err.message.includes('429')) {
                    quotaExceededAny = true;
                    console.warn(`AI Service: Quota limit reached for ${name}.`);
                }

                // Move to next model
                continue;
            }
        }

        // Final error reporting
        if (quotaExceededAny) {
            throw new Error("AI Quota Exceeded. The daily free limit for this API key has been reached. Please try again in 24 hours or provide a different Google API Key in the .env file.");
        } else {
            throw new Error(`AI processing failed after trying all models. Last error: ${lastError?.message || 'Unknown error'}`);
        }

    } catch (error) {
        console.error('Final Gemini Processing Error:', error);
        throw error;
    }
};

module.exports = { rewriteResume };
