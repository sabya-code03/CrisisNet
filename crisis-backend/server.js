const express = require('express');
const http = require('http'); // 👈 Ye missing tha!
const { Server } = require('socket.io'); // 👈 Ye bhi missing tha!
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Create Server (Socket.io ke liye zaroori hai)
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// 2. Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Routes
app.get('/', (req, res) => res.send("Rapid SOS Backend is Live! 🚀"));

app.post('/api/sos', async (req, res) => {
    try {
        const { rawMessage, latitude, longitude, userId } = req.body;
        console.log(`🚨 SOS from ${userId}`);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`Emergency: ${rawMessage}. Location: ${latitude},${longitude}. Give 1-sentence advice.`);
        
        res.status(200).json({ success: true, aiSummary: result.response.text() });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 4. PORT FIX (Railway ke liye sabse zaroori)
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server flying on port ${PORT}`);
});