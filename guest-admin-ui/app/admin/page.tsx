"use client"; 
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Ye tere backend se judne ka direct connection hai
const socket = io("https://rapid-sos-backend-production.up.railway.app"); 

export default function AdminDashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Jaise hi backend se 'new_crisis_alert' aayega, ye function chalega
    socket.on("new_crisis_alert", (data) => {
      console.log("Naya SOS aaya:", data);
      setAlerts((prev) => [data, ...prev]); // Naye alert ko list mein sabse upar daal do
    });

    return () => {
      socket.off("new_crisis_alert"); // Clean up 
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-red-500 mb-8 flex items-center gap-3">
        <span className="animate-pulse">🚨</span> Emergency Command Center
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Live Feed Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-[650px] flex flex-col shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-3 flex justify-between">
            Live SOS Feed
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">{alerts.length} Active</span>
          </h2>
          
          <div className="overflow-y-auto flex-1 pr-2 space-y-4">
            {alerts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 font-mono">
                Listening for emergencies...
              </div>
            ) : (
              alerts.map((alert, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg shadow border-l-4 border-red-500 hover:bg-gray-650 transition">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-red-600 text-xs px-2 py-1 rounded shadow-sm font-bold uppercase tracking-wider">
                      {alert.triage.type}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-1 text-yellow-400">Severity: {alert.triage.severity}</p>
                  <p className="text-sm text-gray-200 mb-2">{alert.triage.details}</p>
                  <div className="bg-gray-800 p-2 rounded text-xs text-green-400 font-mono">
                     Action: {alert.triage.action_required}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Map Visualizer Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-[650px] relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
           <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{backgroundImage: 'radial-gradient(circle at center, #4b5563 2px, transparent 2px)', backgroundSize: '30px 30px'}}>
           </div>
           
           <div className="text-center z-10">
              <div className="text-8xl mb-6">🗺️</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">Campus Map Engine Active</h3>
              <p className="text-gray-400">Total Pings Received: {alerts.length}</p>
              
              {alerts.length > 0 && (
                <div className="mt-8 animate-bounce">
                  <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full border border-red-500 text-sm">
                    ⚠️ {alerts.length} Locations Tagged
                  </span>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}