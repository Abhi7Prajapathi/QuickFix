import React from "react";
import { useApp } from "../context/AppContext";
import { Star, Phone, MessageSquare, ShieldCheck, MapPin, Navigation } from "lucide-react";
import { MOCK_SERVICES } from "../data/mockWorkers";
import confetti from "canvas-confetti";

export default function WorkerCard({ worker }) {
  const { setActiveWorker, bookWorker, isEmergencyMode } = useApp();

  const handleWhatsAppBooking = (e) => {
    e.stopPropagation(); // Prevent opening profile detail drawer

    // Register booking in our state
    bookWorker(worker.id, {
      type: "WhatsApp Inquiry",
      notes: `Direct inquiry for ${MOCK_SERVICES[worker.category].title}`
    });

    // Fire satisfying micro-interaction success confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#10b981", "#3b82f6", "#6366f1"]
    });

    // Construct custom pre-filled message URL
    const serviceName = MOCK_SERVICES[worker.category].title;
    const text = encodeURIComponent(
      `Hello ${worker.name}, I saw your verified profile on Quickfix! I need assistance with an urgent ${serviceName} job in ${worker.town}. Are you available to discuss?`
    );
    
    // Open in new tab
    window.open(`https://wa.me/${worker.whatsapp}?text=${text}`, "_blank");
  };

  const handleCallBooking = (e) => {
    e.stopPropagation();

    bookWorker(worker.id, {
      type: "Phone Booking Request",
      notes: `Called at ${worker.phone}`
    });

    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 },
      colors: ["#6366f1", "#f59e0b"]
    });

    // Fallback to standard tel link
    window.open(`tel:${worker.phone.replace(/\s+/g, "")}`, "_self");
  };

  return (
    <div 
      onClick={() => setActiveWorker(worker)}
      className="group relative flex flex-col justify-between rounded-2xl glass-card overflow-hidden cursor-pointer shadow-lg"
    >
      {/* Top Banner with availability status */}
      <div className="relative h-2 bg-gradient-to-r from-slate-800 to-slate-900 group-hover:from-indigo-500 group-hover:to-pink-500 transition-all duration-300"></div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Info */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="relative">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-700 bg-slate-800"
              />
              {worker.isEmergencyAvailable && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-base font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {worker.name}
                </h3>
                {worker.isVerified && (
                  <ShieldCheck className="h-4.5 w-4.5 text-blue-400 fill-blue-400/10 shrink-0" title="Quickfix Verified Professional" />
                )}
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                {MOCK_SERVICES[worker.category].title}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 px-3 py-2 bg-slate-950/40 rounded-xl border border-slate-900 mb-4 text-xs">
            <div className="text-center border-r border-slate-900">
              <span className="block text-slate-500 mb-0.5">Rating</span>
              <div className="flex items-center justify-center gap-1 text-slate-100 font-bold">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                {worker.rating}
              </div>
            </div>
            <div className="text-center border-r border-slate-900">
              <span className="block text-slate-500 mb-0.5">Exp</span>
              <span className="text-slate-100 font-bold">{worker.experience} Yrs</span>
            </div>
            <div className="text-center">
              <span className="block text-slate-500 mb-0.5">Distance</span>
              <span className="text-indigo-400 font-bold flex items-center justify-center gap-0.5">
                <Navigation className="h-2.5 w-2.5 rotate-45 shrink-0" />
                {worker.distance} km
              </span>
            </div>
          </div>

          {/* Location & Bio */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span>Based in: </span>
              <span className="font-semibold text-slate-300">{worker.town}</span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {worker.bio}
            </p>
          </div>
        </div>

        {/* Action Book Buttons */}
        <div className="flex gap-2">
          {/* WhatsApp Direct */}
          <button
            onClick={handleWhatsAppBooking}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-emerald-950/10 shrink-0"
          >
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </button>
          
          {/* Direct Call */}
          <button
            onClick={handleCallBooking}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer shrink-0"
          >
            <Phone className="h-4 w-4" />
            Call
          </button>
        </div>
      </div>

      {/* Emergency Pulsing Highlights */}
      {isEmergencyMode && worker.isEmergencyAvailable && (
        <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-2xl pointer-events-none glow-emerald"></div>
      )}
    </div>
  );
}
