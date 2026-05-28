import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, MapPin, ShieldAlert, Zap, Droplet, Wind, Paintbrush, Hammer, Navigation } from "lucide-react";
import { MOCK_SERVICES, MOCK_TOWNS } from "../data/mockWorkers";

export default function HeroSection() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTown,
    setSelectedTown,
    isEmergencyMode,
    setIsEmergencyMode,
    userLocation,
    detectUserLocation
  } = useApp();

  const [isDetecting, setIsDetecting] = useState(false);
  const [showTownDropdown, setShowTownDropdown] = useState(false);

  const categories = [
    { id: "electrician", title: "Electrician", icon: Zap, color: "text-amber-400 border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10 hover:border-amber-400/40" },
    { id: "plumber", title: "Plumber", icon: Droplet, color: "text-blue-400 border-blue-400/20 bg-blue-400/5 hover:bg-blue-400/10 hover:border-blue-400/40" },
    { id: "ac_repair", title: "AC Repair", icon: Wind, color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10 hover:border-cyan-400/40" },
    { id: "painter", title: "Painter", icon: Paintbrush, color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-400/10 hover:border-emerald-400/40" },
    { id: "carpenter", title: "Carpenter", icon: Hammer, color: "text-orange-400 border-orange-400/20 bg-orange-400/5 hover:bg-orange-400/10 hover:border-orange-400/40" }
  ];

  const handleLocationDetect = async () => {
    setIsDetecting(true);
    await detectUserLocation();
    setIsDetecting(false);
  };

  return (
    <div className="relative pt-8 pb-12 overflow-hidden px-4 sm:px-6 lg:px-8 border-b border-slate-800 grid-bg">
      {/* Dynamic Ambient Background Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
      {isEmergencyMode && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-red-600/5 blur-[150px] pointer-events-none transition-all duration-500"></div>
      )}

      <div className="relative max-w-6xl mx-auto text-center z-10">
        {/* Main Tag & Title */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Empowering Local Technicians & Small Businesses
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Find Trusted <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Local Technicians</span> <br className="hidden sm:inline" /> In Your Area Instantly
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-400 mb-10 px-2">
          Need an electrician, plumber, or emergency repair? Browse verified service workers in rural villages and small towns. Instant contact via WhatsApp!
        </p>

        {/* Search Panel Box */}
        <div className="max-w-4xl mx-auto glass-panel p-4 sm:p-5 rounded-2xl shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, skill, or service (e.g. leaking pipe)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Town Dropdown selector */}
            <div className="relative md:w-56">
              <button
                onClick={() => setShowTownDropdown(!showTownDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{selectedTown || "All Suburbs/Villages"}</span>
                </div>
                <span className="text-slate-500 text-xs">▼</span>
              </button>

              {showTownDropdown && (
                <div className="absolute right-0 top-full mt-2 w-full glass-panel rounded-xl shadow-xl overflow-hidden z-30 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedTown(null);
                      setShowTownDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border-b border-slate-800/40"
                  >
                    All Suburbs/Villages
                  </button>
                  {MOCK_TOWNS.map((town) => (
                    <button
                      key={town}
                      onClick={() => {
                        setSelectedTown(town);
                        setShowTownDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800 transition-colors ${
                        selectedTown === town ? "text-indigo-400 font-medium bg-indigo-500/5" : "text-slate-300 hover:text-white"
                      }`}
                    >
                      {town}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GPS Sim Trigger */}
            <button
              onClick={handleLocationDetect}
              disabled={isDetecting}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all duration-300 cursor-pointer ${
                userLocation.isDetected
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600"
              }`}
            >
              {isDetecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                  Locating...
                </>
              ) : (
                <>
                  <Navigation className={`h-4 w-4 ${userLocation.isDetected ? "text-emerald-400 fill-emerald-400/20" : "text-indigo-400"}`} />
                  {userLocation.isDetected ? "Location Verified" : "Use My Location"}
                </>
              )}
            </button>
          </div>

          {/* Location indicator */}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 glow-emerald shrink-0"></span>
            <span>Current Search Center: </span>
            <span className="font-semibold text-slate-300">{userLocation.name}</span>
            <span className="text-slate-600">({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})</span>
          </div>
        </div>

        {/* Emergency "Available Now" toggle banner */}
        <div className={`max-w-4xl mx-auto mb-10 overflow-hidden rounded-2xl border transition-all duration-500 shadow-lg ${
          isEmergencyMode 
            ? "bg-red-500/10 border-red-500/40 glow-red"
            : "bg-slate-900/40 border-slate-800"
        }`}>
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-left">
              <div className={`p-2.5 rounded-xl ${isEmergencyMode ? "bg-red-500/20 text-red-400 emergency-pulse" : "bg-slate-800 text-slate-400"}`}>
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-sm sm:text-base font-bold ${isEmergencyMode ? "text-red-200" : "text-slate-200"}`}>
                  Urgent Repair / Emergency Available Now
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filters immediately for technicians available *right now* within a 5km radius to assist you.
                </p>
              </div>
            </div>

            {/* Neon Toggle switch */}
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isEmergencyMode ? "text-red-400" : "text-slate-500"}`}>
                {isEmergencyMode ? "ACTIVE EMERGENCY MODE" : "EMERGENCY FILTER OFF"}
              </span>
              <button
                onClick={() => setIsEmergencyMode(!isEmergencyMode)}
                className={`relative inline-flex h-7.5 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                  isEmergencyMode ? "bg-red-500" : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                    isEmergencyMode ? "translate-x-6.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid Selector */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-500 tracking-widest mb-4">
            Filter Technicians By Specialty
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-4 pt-1 px-4 -mx-4 justify-start lg:justify-center lg:flex-wrap lg:px-0 lg:mx-0 scrollbar-none snap-x snap-mandatory">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all shrink-0 cursor-pointer snap-start ${
                !selectedCategory
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              All Trades
            </button>
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl border text-sm font-bold transition-all duration-300 shrink-0 cursor-pointer snap-start ${cat.color} ${
                    isSelected
                      ? "bg-slate-900 border-slate-100 text-white shadow-lg shadow-white/5 font-black scale-[1.02]"
                      : "text-slate-400"
                  }`}
                >
                  <IconComponent className={`h-4.5 w-4.5 ${isSelected ? "animate-bounce" : ""}`} />
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
