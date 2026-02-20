const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const resumeRoutes = require('./routes/resume');
app.use('/resume', resumeRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/', (req, res) => {
    res.send('AI Resume Creator API is running');
});

// Start Server
const startServer = (port) => {
    const currentPort = parseInt(port, 10);
    const server = app.listen(currentPort, () => {
        console.log(`Server is running on port ${currentPort}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${currentPort} is in use, trying ${currentPort + 1}...`);
            startServer(currentPort + 1);
        } else {
            console.error('Server error:', error);
        }
    });

    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
};

startServer(PORT);
