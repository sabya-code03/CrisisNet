"use client";
import { useState, useEffect } from "react";

export default function GuestSOSApp() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [locStatus, setLocStatus] = useState("📍 Locating you...");
  const [selectedEmergency, setSelectedEmergency] = useState("");
  const [details, setDetails] = useState("");
  const [sendStatus, setSendStatus] = useState("idle"); // idle, sending, success, failed

  // CONCEPT 1: Auto-fetch GPS Location on load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocStatus("✅ Exact Location Locked");
        },
        (error) => {
          console.error("GPS Error:", error);
          setLocStatus("⚠️ Location access denied. Using approx.");
        }
      );
    }
  }, []);

  // CONCEPT 2: Build Payload and Fire to Backend
  const triggerSOS = async (e: any) => {
    if (e) e.preventDefault(); // Ye line sabse zaroori hai!
    setSendStatus("sending");
    
    // Combining Quick Action + Details for Gemini
    const rawMessage = `${selectedEmergency} Emergency. ${details}`.trim();

    const payload = {
      rawMessage: rawMessage,
      latitude: location.lat,
      longitude: location.lng,
      userId: `Guest_${Math.floor(Math.random() * 9999)}`,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSendStatus("success");
      } else {
        setSendStatus("failed");
      }
    } catch (error) {
      console.error("Backend unreachable", error);
      setSendStatus("failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex justify-center items-center p-4 font-sans text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
        
        {/* Header */}
        <div className="bg-red-600 p-6 text-center shadow-lg">
          <h1 className="text-3xl font-extrabold tracking-wider">CRISIS<span className="text-gray-900">NET</span></h1>
          <p className="text-sm font-medium mt-1 opacity-90">Instant Emergency Broadcast</p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* GPS Status Bar */}
          <div className="bg-gray-800 p-3 rounded-lg text-center border border-gray-700">
            <span className={`text-sm font-bold ${locStatus.includes('✅') ? 'text-green-400' : 'text-yellow-400'}`}>
              {locStatus}
            </span>
          </div>

          {/* Quick Triggers */}
          <div>
            <h3 className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">1. Select Emergency Type</h3>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setSelectedEmergency("Fire")}
                className={`p-3 rounded-xl flex flex-col items-center justify-center transition ${selectedEmergency === "Fire" ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-2xl mb-1">🔥</span>
                <span className="text-xs font-bold">Fire</span>
              </button>
              <button 
                onClick={() => setSelectedEmergency("Medical")}
                className={`p-3 rounded-xl flex flex-col items-center justify-center transition ${selectedEmergency === "Medical" ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-2xl mb-1">🚑</span>
                <span className="text-xs font-bold">Medical</span>
              </button>
              <button 
                onClick={() => setSelectedEmergency("Security")}
                className={`p-3 rounded-xl flex flex-col items-center justify-center transition ${selectedEmergency === "Security" ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-2xl mb-1">🛡️</span>
                <span className="text-xs font-bold">Security</span>
              </button>
            </div>
          </div>

          {/* Optional Details */}
          <div>
            <h3 className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">2. Additional Details (Optional)</h3>
            <textarea 
              className="w-full bg-gray-800 text-white p-4 rounded-xl border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition outline-none resize-none"
              rows={3}
              placeholder="E.g., 4th floor, severe smoke..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          {/* The Big Red Button */}
          <div className="pt-4">
            {sendStatus === "success" ? (
              <div className="bg-green-500 text-white p-4 rounded-2xl text-center font-bold text-xl animate-pulse">
                ✅ SOS SENT TO ADMIN
              </div>
            ) : sendStatus === "failed" ? (
              <div className="bg-yellow-500 text-gray-900 p-4 rounded-2xl text-center font-bold text-xl">
                ⚠️ FAILED. RETRY.
              </div>
            ) : (
              <button 
                onClick={triggerSOS}
                disabled={sendStatus === "sending" || !selectedEmergency}
                className={`w-full p-5 rounded-2xl text-xl font-black tracking-widest shadow-lg transition-transform transform active:scale-95 ${!selectedEmergency ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/50'}`}>
                {sendStatus === "sending" ? "BROADCASTING..." : "🚨 SLIDE TO SOS"}
              </button>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}