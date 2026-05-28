import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import HeroSection from "./components/HeroSection";
import WorkerCard from "./components/WorkerCard";
import LeafletMap from "./components/LeafletMap";
import WorkerProfileDetail from "./components/WorkerProfileDetail";
import PriceCalculator from "./components/PriceCalculator";
import RegisterWorkerModal from "./components/RegisterWorkerModal";
import { Wrench, Calendar, ClipboardList, CheckCircle2, MessageSquare, Phone, Calculator, HelpCircle } from "lucide-react";

function MainApp() {
  const {
    filteredWorkers,
    bookings,
    setIsCalculatorOpen,
    isEmergencyMode,
    isApiOnline
  } = useApp();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [mobileView, setMobileView] = useState("list"); // "list" or "map"

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* Premium Header Navigation */}
      <header className="sticky top-0 bg-[#0e1320]/80 backdrop-blur-md border-b border-slate-800/80 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & API Status */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center shrink-0">
                <Wrench className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="leading-none">
                <span className="text-base sm:text-lg font-black tracking-tight text-white block">
                  Quick<span className="text-indigo-400">fix</span>
                </span>
                <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-500 mt-0.5 font-bold">
                  Worker Directory
                </span>
              </div>
            </div>
            
            {/* Real-time backend status badge */}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border transition-all duration-300 shrink-0 ${
              isApiOnline 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" 
                : "bg-amber-500/5 text-amber-400 border-amber-500/20"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isApiOnline ? "bg-emerald-400 glow-emerald" : "bg-amber-400 animate-pulse"}`}></span>
              <span className="hidden sm:inline">{isApiOnline ? "Django REST API Active" : "Local Sync Active"}</span>
              <span className="sm:hidden">{isApiOnline ? "API Active" : "Local Mode"}</span>
            </span>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Price Estimator */}
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-md shrink-0"
            >
              <Calculator className="h-4 w-4 text-indigo-400" />
              <span className="hidden sm:inline">Estimator</span>
            </button>

            {/* Worker Onboarding */}
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-1 px-3 py-2 sm:px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all cursor-pointer shadow-lg shadow-indigo-900/30 hover:scale-[1.02] shrink-0"
            >
              <span className="hidden sm:inline">Onboard Pro</span>
              <span className="sm:hidden font-extrabold">+ Pro</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Showcase Search Box */}
      <HeroSection />

      {/* Main Workspace Directory Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full pb-24 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Grid: Workers List (7 cols) */}
          <div className={`lg:col-span-7 space-y-6 ${mobileView === "list" ? "block" : "hidden lg:block"}`}>
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Available Technicians
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 text-xs font-normal">
                    {filteredWorkers.length} found
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Sorted by verified status and highest ratings.
                </p>
              </div>
            </div>

            {filteredWorkers.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-slate-800 rounded-3xl space-y-4">
                <p className="text-slate-500 text-sm">
                  No workers match your exact search criteria.
                </p>
                <p className="text-xs text-slate-600">
                  Try turning off "Emergency Mode" or clearing your trade and location filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredWorkers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            )}
          </div>

          {/* Right Grid: Interactive Map (5 cols) */}
          <div className={`lg:col-span-5 lg:sticky lg:top-24 space-y-4 ${mobileView === "map" ? "block" : "hidden lg:block"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Interactive Local Map
              </h3>
              <div className="flex items-center gap-3 text-[10px] font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> You
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Emergency Pro
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Standard Pro
                </span>
              </div>
            </div>
            
            {/* Live Leaflet Map Component */}
            <LeafletMap />
          </div>

        </div>

        {/* Real-time Session Booking Log Simulator (Footer dashboard) */}
        {bookings.length > 0 && (
          <div className="mt-16 bg-[#0e1320]/60 rounded-2xl border border-slate-800/80 p-6 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3.5 mb-4">
              <ClipboardList className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Your Booking Inquiries & Contacts Log</h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium shrink-0 animate-pulse">
                Live Simulator State
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 flex flex-col justify-between gap-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{booking.workerName}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold text-[9px] uppercase border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-400">
                    <p className="text-[10px] text-slate-500">Log Date: {booking.date}</p>
                    <p>Method: <strong className="text-slate-300">{booking.type}</strong></p>
                    <p className="truncate text-slate-400">Details: {booking.notes}</p>
                  </div>

                  <div className="flex gap-2 border-t border-slate-900 pt-2.5">
                    <a
                      href={`https://wa.me/${booking.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 rounded-lg text-[10px] font-bold transition-all border border-emerald-500/15"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      WhatsApp Chat
                    </a>
                    <a
                      href={`tel:${booking.workerPhone}`}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold transition-all border border-slate-800"
                    >
                      <Phone className="h-3.5 w-3.5 text-indigo-400" />
                      Call Phone
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile View Toggle Button */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden">
          <button
            onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600/95 hover:bg-indigo-500 text-white font-extrabold text-xs tracking-wider shadow-2xl backdrop-blur-md border border-white/10 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300"
          >
            {mobileView === "list" ? (
              <>
                <span>🗺️ View Map</span>
              </>
            ) : (
              <>
                <span>📋 View List</span>
              </>
            )}
          </button>
        </div>

      </main>

      {/* Premium Footer */}
      <footer className="bg-[#090d16] border-t border-slate-900 py-8 px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-sm font-bold text-slate-300 block">Quickfix Services</span>
            <span className="text-[10px] text-slate-600 block mt-0.5">📍 Visual prototyping environment for village/town communities.</span>
          </div>
          <span className="text-[10px] text-slate-600">
            &copy; 2026 Quickfix Inc. All rights reserved.
          </span>
        </div>
      </footer>

      {/* Active Drawers & Modals */}
      <WorkerProfileDetail />
      <PriceCalculator />
      <RegisterWorkerModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
