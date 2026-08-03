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

    // STEP 1: Core SOS Logic (Yeh hamesha chalega)
    // (Yahan tumhara database mein SOS save karne ka logic hota)
    
    // STEP 2: AI Logic ko isolate kar diya (Fault Tolerance)
    let aiAdvice = null; // Default value agar AI fail ho jaye

    try {
      // FIX 1: Naya supported model use kiya (2.5 Flash)
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Emergency: ${rawMessage}. Location: ${latitude},${longitude}. Give 1-sentence advice.`;
      
      const result = await model.generateContent(prompt);
      aiAdvice = result.response.text(); // Agar success hua toh advice update ho jayegi
    } catch (aiError) {
      // FIX 2: Agar AI crash hua, toh system nahi rukega!
      // Bas console mein error aayega, aur code aage badh jayega.
      console.error("⚠️ AI Advice failed, but SOS is safe:", aiError.message);
    }

    // STEP 3: Final Success Response (AI pass ho ya fail, user ko 200 ok milega)
    res.status(200).json({ success: true, aiSummary: aiAdvice });

  } catch (err) {
    // Yeh wala catch sirf tab chalega jab core server mein koi bhayankar gadbad ho
    console.error("🚨 Critical Server Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. PORT FIX (Railway ke liye sabse zaroori)
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server flying on port ${PORT}`);
});