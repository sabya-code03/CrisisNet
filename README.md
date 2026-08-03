# 🚨 CrisisNet: Instant Emergency Broadcast System

CrisisNet is a real-time, fault-tolerant emergency broadcast prototype designed to bridge the critical communication gap between citizens in distress and first responders. Built by **Sabyasachi Ghosh** .

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://crisis-net-app-view.vercel.app/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101)](https://socket.io/)
[![Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-blue)](https://ai.google.dev/)

---

## ✨ Core Features

- **📍 One-Tap SOS with GPS Lock** — Users can send immediate distress signals that automatically capture their exact geographical coordinates along with the emergency category (Fire, Medical, Security).
- **⚡ Real-Time Command Center** — Powered by WebSockets (`Socket.io`), the admin dashboard receives and displays live SOS alerts instantly with zero page-refresh latency.
- **🧠 AI-Powered Triage** — Integrates Google's **Gemini 2.5 Flash** model to analyze the emergency context and provide localized, actionable survival advice for first responders.
- **🛡️ Fault-Tolerant Architecture** — The backend is designed with strict decoupling. If the AI API experiences downtime or rate limits, the core SOS transmission still successfully reaches administrators, ensuring no distress signal is ever lost.

## 🗂️ Project Structure

```
CrisisNet/
├── crisis-backend/     # Node.js + Express API and Socket.io server
│   └── server.js       # Core server: SOS endpoint, AI triage, real-time broadcast
└── guest-admin-ui/      # Next.js frontend (guest SOS form + admin dashboard)
    └── app/
        ├── page.tsx         # Guest-facing SOS trigger screen
        └── admin/page.tsx   # Real-time admin command center
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, Tailwind CSS (deployed on Vercel) |
| Backend | Node.js, Express (deployed on Render) |
| Real-Time Communication | Socket.io |
| AI Integration | Google Generative AI SDK (`@google/generative-ai`, Gemini 2.5 Flash) |

## 🚀 How It Works

1. **The Guest App** — A mobile-first interface where a user selects an emergency type, adds optional details, and triggers an SOS. The browser's Geolocation API locks the user's coordinates.
2. **The Broadcast** — The Next.js frontend sends a `POST` request with the message and GPS coordinates to the Node.js backend (`/api/sos`).
3. **The Triage (Parallel Processing)** — The backend immediately attempts to fetch a one-sentence survival advice summary from Gemini 2.5 Flash.
4. **The Alert** — The backend packages the data (with or without the AI summary, ensuring fault tolerance) and broadcasts it to all connected admins via `io.emit("new_crisis_alert")`.
5. **The Admin Board** — The command center, listening on the same socket connection, instantly renders the new alert card — no refresh required.

## 💻 Local Setup & Installation

To run this project locally, you'll need to start both the backend and frontend.

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Google AI Studio](https://ai.google.dev/) API key for Gemini

### 1. Clone the repository

```bash
git clone https://github.com/sabya-code03/CrisisNet.git
cd CrisisNet
```

### 2. Set up the backend

```bash
cd crisis-backend
npm install
```

Create a `.env` file in `crisis-backend/`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

Start the server:

```bash
npm start
```

The backend will run on `http://localhost:5000` and exposes a health check at `/` and the SOS endpoint at `POST /api/sos`.

### 3. Set up the frontend

```bash
cd ../guest-admin-ui
npm install
npm run dev
```

The app will be available at `http://localhost:3000`, with the guest SOS screen at `/` and the admin dashboard at `/admin`.

> **Note:** The frontend currently points at the deployed backend (`https://crisisnet-3jh1.onrender.com`) rather than reading the API URL from an environment variable. If you're running the backend locally, update the `fetch` URL in `app/page.tsx` and the `io()` call in `app/admin/page.tsx` to `http://localhost:5000` (or wire up a `NEXT_PUBLIC_API_URL` env variable) so the frontend talks to your local server.

## 🌐 Live Demo

A hosted version of the app is available at **[crisis-net-app-view.vercel.app](https://crisis-net-app-view.vercel.app/)**.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or file an issue.

## 📄 License

No license has been specified for this project yet. Contact the repository owner for usage terms.
