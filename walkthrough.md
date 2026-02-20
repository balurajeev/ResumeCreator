# Walkthrough - AI Resume Creator

The AI Resume Creator is a professional tool that leverages **Google Gemini** to transform raw resume details into impact-oriented, recruiter-friendly resumes.

- **AI Powered by Gemini**: Switched from OpenAI to Google Gemini Pro for faster, reliable resume optimization.
- **Dynamic Port Selection**: Backend now runs on port 50001 with automatic failover protection.
- **Privacy First**: Automatic file deletion and no database storage to protect user PII.
- **Publicly Hosted**: Fully deployed and functional in a production environment.

## Features Implemented

### 1. Modern LinkedIn-Style UI
The application features a minimalist, professional design with **11 dynamic themes** (Technical, Creative, Modern, etc.).

### 2. Smart Resume Import
Users can upload an existing PDF resume. The backend extracts the text and uses AI to structure it into a professional format automatically.

## Latest Fixes (Local & Production)
- **PDF Extraction Fix**: Resolved `TypeError` and empty text issues by updating `parserService.js` to handle `pdf-parse` v2.4.5 requirements (Uint8Array and `.getText().text`).
- **Quota & Model Handling**: Implemented a robust fallback system for Gemini models. The app now prioritizes `gemini-pro-latest` and `gemini-flash-lite-latest` to avoid project-specific quota limits.
- **Environment Stability**: Automatically ensures the `uploads/` directory exists and handles dynamic port selection (e.g., 50001-50004) for local development.

## Verification Results
- [x] **Local Upload**: Successfully parsed "balagopal_architect.pdf".
- [x] **AI Rewrite**: Verified that Gemini preserves dates and facts while optimizing professional language.
- [x] **Export**: Verified PDF and DOCX exports maintain styling.
- [x] **Production**: Verified deployment on Render/Vercel handles routing and CORS correctly.

### 3. AI-Powered Rewrite
A "Rewrite with AI" button allows users to send their current resume data to **Google Gemini**. The AI optimizes the language for ATS (Applicant Tracking Systems) and professional appeal.

### 4. Professional Preview
A real-time, high-fidelity preview of the resume updates as the user types or after an AI rewrite, reflecting the selected theme's colors and fonts.

### 5. Multi-Format Export
- **PDF**: Generated using `pdfkit`, matching the frontend theme colors.
- **DOCX**: Generated using the `docx` library, matching the frontend theme colors.

### 6. Public Deployment
- **Frontend**: Successfully hosted on Vercel at `https://resume-creator-flax.vercel.app`.
- **Backend**: Successfully hosted on Render at `https://resumecreator-zpan.onrender.com`.

## Verification Results

- [x] **File Upload**: Successfully extracts text from PDFs and deletes files after processing.
- [x] **AI Rewrite**: Correctly structures and optimizes resume content using Gemini Pro.
- [x] **PDF Export**: Generates a themed, downloadable PDF file.
- [x] **DOCX Export**: Generates a themed DOCX file compatible with Word.
- [x] **UI/UX**: Responsive with smooth animations and layout switching.
- [x] **Deployment**: Verified the live `/health` endpoint and cross-origin communication.
