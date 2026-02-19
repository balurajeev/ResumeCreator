---
description: How to run the AI Resume Creator application
---

To run the AI Resume Creator application, follow these steps:

### 1. Prerequisites
Ensure you have Node.js installed and an OpenAI API key.

### 2. Setup Environment Variables
- Open `server/.env`.
- Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 3. Start the Backend Server
// turbo
- Open a terminal and run:
```powershell
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Start the Frontend Application
// turbo
- Open a second terminal and run:
```powershell
cd client
npm install
npm run dev
```
The frontend will start on `http://localhost:5173` (or the next available port).

### 5. Access the App
Open your browser and navigate to the local URL provided by the frontend terminal (usually `http://localhost:5173`).
