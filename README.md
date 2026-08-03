# 🚨 CrisisNet: Instant Emergency Broadcast System

CrisisNet is a real-time, fault-tolerant emergency broadcast prototype designed to bridge the critical communication gap between citizens in distress and first responders. Built by **The Big O's** for the Solution Challenge 2026.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://crisis-net-app-view.vercel.app/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101)](https://socket.io/)
[![Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-blue)](https://ai.google.dev/)

---

## ✨ Core Features

*   **📍 One-Tap SOS with GPS Lock:** Users can send immediate distress signals that automatically capture their exact geographical coordinates along with the emergency category (Fire, Medical, Security).
*   **⚡ Real-Time Command Center:** Powered by WebSockets (`Socket.io`), the admin dashboard receives and displays live SOS alerts instantly with zero page-refresh latency.
*   **🧠 AI-Powered Triage:** Integrates Google's **Gemini 2.5 Flash** model to analyze the emergency context and provide localized, actionable survival advice for first responders.
*   **🛡️ Fault-Tolerant Architecture:** The backend is designed with strict decoupling. If the AI API experiences downtime or rate limits, the core SOS transmission still successfully reaches administrators, ensuring no distress signal is ever lost.

## 🛠️ Tech Stack

*   **Frontend:** Next.js, React, Tailwind CSS (Hosted on Vercel)
*   **Backend:** Node.js, Express.js (Hosted on Render)
*   **Real-Time Communication:** Socket.io
*   **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)

## 🚀 How It Works

1.  **The Guest App:** A mobile-first interface where a user selects an emergency type, adds optional details, and slides to trigger an SOS.
2.  **The Broadcast:** The Next.js frontend sends a POST request with GPS coordinates to the Node.js backend.
3.  **The Triage (Parallel Processing):** The backend immediately attempts to fetch a 1-sentence survival advice summary from Gemini 2.5 Flash.
4.  **The Alert:** The backend packages the data (with or without the AI summary, ensuring fault tolerance) and broadcasts it via `io.emit("new_crisis_alert")`.
5.  **The Admin Board:** The command center, listening on the same socket connection, instantly renders the new alert card.

## 💻 Local Setup & Installation

To run this project locally, you will need to start both the frontend and backend servers.

### 1. Clone the Repository
```bash
git clone [https://github.com/sabya-code03/CrisisNet.git](https://github.com/sabya-code03/CrisisNet.git)
cd CrisisNet
