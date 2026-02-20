# Implementation Plan - AI Resume Creator

This plan outlines the steps to build a full-stack AI-powered resume builder that supports manual entry, file uploads, AI enhancement, and PDF/DOCX export.

## Proposed Changes

### Backend (Node.js/Express)
- [NEW] `server/package.json`: Core dependencies.
- [NEW] `server/index.js`: Main server entry point.
- [NEW] `server/routes/resume.js`: API routes for upload, processing, and download.
- [NEW] `server/services/aiService.js`: Logic for OpenAI integration.
- [NEW] `server/services/pdfService.js`: Logic for PDF generation using `pdfkit`.
- [NEW] `server/services/docxService.js`: Logic for DOCX generation using `docx`.
- [NEW] `server/services/parserService.js`: Logic for extracting text from PDF/DOCX.

### Frontend (React/Vite/TailwindCSS)
- [NEW] `client/`: Initialize with Vite.
- [NEW] `client/src/components/ResumeForm.jsx`: Multi-section form for manual data entry.
- [NEW] `client/src/components/FileUploader.jsx`: Drag-and-drop file upload.
- [NEW] `client/src/components/ResumePreview.jsx`: Modern, professional resume renderer.
- [NEW] `client/src/components/Layout.jsx`: LinkedIn-style layout.
- [NEW] `client/src/api/client.js`: Axios/Fetch wrapper for backend communication.

## AI Optimization Strategy
- Use OpenAI's `gpt-4o` (or available model) with a system prompt focused on professional tone, keyword optimization for ATS (Applicant Tracking Systems), and recruiter appeal.

## Verification Plan

### Automated Tests
- None planned for this phase due to speed, but will verify endpoints using `curl` or Postman-style requests during development.

### Manual Verification
1. **Upload Test**: Upload a sample PDF resume and check if text is extracted correctly in console logs.
2. **AI Rewrite Test**: Trigger AI rewrite and verify the output is professional and formatted correctly.
3. **Export Test**: Download PDF and DOCX files and verify they open and look professional.
4. **UI Test**: Ensure the app looks like a premium LinkedIn-style interface.
5. **Share Test**: Verify "Share to LinkedIn" button opens a share dialog with a generated summary.
## UI & Layout Expansion Strategy

### Layout Themes
We will implement 10+ distinct resume layouts, categorized by style:
1. **Modern Professional** (LinkedIn-inspired)
2. **Creative Vibrant** (Bold colors, unique typography)
3. **Elegant Minimalist** (Classic, clean lines)
4. **Technical/Developer** (Dark mode option, focus on tech stack)
5. **Executive** (Traditional, serif fonts, formal)
6. **Timeline-based** (Visual timeline for experience)
7. **Side-Bar Classic** (Profile and skills on left)
8. **Grid-based** (Modular sections)
9. **Compact** (For one-page focus)
10. **Gradient Flow** (Colorful headers and accents)

### Implementation
- **Theme Engine**: Centralize styles into a `themes` configuration.
- **Preview Switcher**: Update `ResumePreview.jsx` to swap components or classes based on a `selectedLayout` state.
- **Enhanced UX**: Use `framer-motion` for smooth layout transitions and more vibrant Tailwind color palettes.

## Updated Verification Plan
- [ ] **Layout Switching**: Verify that selecting a different layout instantly updates the preview.
- [ ] **Responsive Design**: Ensure all 10 layouts look good on mobile.
- [ ] **Aesthetics**: Confirm the UI feels "colorful" and "premium" as requested.
## Export Style Sync Strategy

To ensure the downloaded resume matches the preview, we will:
1.  **Hex Color Mapping**: Map Tailwind classes (e.g., `bg-linkedin-blue`, `bg-coral-500`) to their respective Hex codes in the backend.
2.  **Dynamic PDF Styling**: Update `pdfService.js` to use the theme's primary/secondary colors and fonts where applicable.
3.  **Dynamic DOCX Styling**: Update `docxService.js` to apply theme-based coloring to headings and text runs.
4.  **Route Integration**: Modify the `/export-pdf` and `/export-docx` routes to accept a `theme` object.

## Updated Verification Plan
- [ ] **Export Visual Sync**: Verify that the downloaded PDF/DOCX uses the same color scheme as the selected layout in the UI.
- [ ] **Theme Variation**: Test exports for at least 3 different themes (e.g., Modern, Technical, Creative).

## Gemini AI Integration Strategy

We will replace OpenAI with Google's Gemini Pro model to utilize the user's existing Google Cloud API key.

### Changes:
1.  **Dependency**: Swap `openai` for `@google/generative-ai`.
2.  **Service Layer**: Rewrite `aiService.js` to use the `GoogleGenerativeAI` client.
3.  **Prompting**: Adjust the prompt to ensure Gemini returns a consistent JSON object.
4.  **Config**: Update `.env` to use `GEMINI_API_KEY`.

## Updated Verification Plan
- [ ] **Gemini Connectivity**: Confirm successful authentication with the provided `AIza...` key.
- [ ] **JSON Integrity**: Verify that Gemini returns valid JSON in the requested schema (education, experience, etc.).
