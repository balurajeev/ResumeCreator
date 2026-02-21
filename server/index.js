const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
const resumeRoutes = require('./routes/resume');
app.use('/', resumeRoutes); // Extremely flexible - will catch /resume/upload etc if defined in the router
app.use('/resume', resumeRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/health', (req, res) => {
    res.send('AI Resume Creator API is healthy');
});

// Start Server
const server = app.listen(50003, '0.0.0.0', () => {
    console.log(`Server is running on port 50003`);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
