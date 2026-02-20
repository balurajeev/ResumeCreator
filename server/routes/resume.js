const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { extractTextFromPDF } = require('../services/parserService');
const { rewriteResume } = require('../services/aiService');
const { generatePDF } = require('../services/pdfService');
const { generateDOCX } = require('../services/docxService');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        let extractedText = '';

        if (req.file.mimetype === 'application/pdf') {
            extractedText = await extractTextFromPDF(filePath);
        } else {
            return res.status(400).json({ error: 'Unsupported file format. Please upload a PDF.' });
        }

        // Clean up: delete file after extraction
        const fs = require('fs');
        fs.unlink(filePath, (err) => {
            if (err) console.error('Cleanup error:', err);
        });

        res.json({ text: extractedText });
    } catch (error) {
        console.error('SERVER UPLOAD ERROR:', error.message);
        res.status(500).json({ error: `Failed to process resume: ${error.message}` });
    }
});

router.post('/rewrite', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided for rewrite' });
        }

        const rewrittenData = await rewriteResume(text);
        res.json(rewrittenData);
    } catch (error) {
        console.error('AI Rewrite error:', error);
        res.status(500).json({ error: 'Failed to rewrite resume' });
    }
});

router.post('/export-pdf', async (req, res) => {
    try {
        const resumeData = req.body;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        generatePDF(resumeData, res);
    } catch (error) {
        console.error('PDF Export Error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

router.post('/export-docx', async (req, res) => {
    try {
        const resumeData = req.body;
        const buffer = await generateDOCX(resumeData);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.docx');
        res.send(buffer);
    } catch (error) {
        console.error('DOCX Export Error:', error);
        res.status(500).json({ error: 'Failed to generate DOCX' });
    }
});

module.exports = router;
