import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Star, ShieldCheck, MapPin, ShieldAlert, User, HelpCircle, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { MOCK_SERVICES } from "../data/mockWorkers";
import confetti from "canvas-confetti";

export default function WorkerProfileDetail() {
  const { activeWorker, setActiveWorker, addReview } = useApp();
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [isVerifiedBooking, setIsVerifiedBooking] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [detectionAlert, setDetectionAlert] = useState(null);

  if (!activeWorker) return null;

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const reviewData = {
      author: newAuthor,
      rating: Number(newRating),
      text: newText,
      isVerified: isVerifiedBooking
    };

    // Add review
    addReview(activeWorker.id, reviewData);

    // Get the newly added review to check if it was flagged immediately by the engine
    // Since AppContext updates the worker reviews, we can run a quick simulation check
    const words = newText.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const repRatio = uniqueWords.size / words.length;

    let flag = null;
    if (words.length > 6 && repRatio < 0.45) {
      flag = "text_repetition";
    } else if (newRating === 1 && (newText.includes("cheater") || newText.includes("fraud") || newText.includes("worst"))) {
      flag = "competitor_attack";
    } else if (!isVerifiedBooking && newAuthor.toLowerCase().startsWith("user") && newText.length < 15) {
      flag = "burner_profile";
    }

    if (flag) {
      setDetectionAlert({
        type: flag,
        message: "⚠️ Alert: Our real-time heuristic filter flagged your review as suspicious. It has been marked for inspection."
      });
      setTimeout(() => setDetectionAlert(null), 8000);
    } else {
      // Fire confetti for valid reviews!
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.5 },
        colors: ["#10b981", "#fbbf24"]
      });
    }

    // Reset inputs
    setNewAuthor("");
    setNewRating(5);
    setNewText("");
    setIsVerifiedBooking(true);
  };

  const getSuspiciousIconClass = (type) => {
    switch (type) {
      case "text_repetition": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "competitor_attack": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
      {/* Sidebar Overlay Container */}
      <div className="w-full max-w-2xl bg-[#0e1320] border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl relative">
        
        {/* Header Drawer */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Technician Profile</h2>
            {activeWorker.isVerified && (
              <div className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Pro
              </div>
            )}
          </div>
          <button
            onClick={() => setActiveWorker(null)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Real-time review filter alerts */}
          {detectionAlert && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 animate-bounce shadow-xl ${
              detectionAlert.type === "competitor_attack" 
                ? "bg-red-950/40 border-red-800 text-red-300"
                : "bg-amber-950/40 border-amber-800 text-amber-300"
            }`}>
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Review Detection Engine Alert</h4>
                <p className="text-xs mt-1 leading-relaxed">{detectionAlert.message}</p>
              </div>
            </div>
          )}

          {/* Intro Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-slate-900/30 rounded-2xl border border-slate-800/80">
            <img
              src={activeWorker.avatar}
              alt={activeWorker.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-700 shadow-lg"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-extrabold text-white mb-1">{activeWorker.name}</h3>
              
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-xs font-semibold rounded-md uppercase tracking-wider">
                  {MOCK_SERVICES[activeWorker.category].title}
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="h-4.5 w-4.5 fill-amber-400" />
                  {activeWorker.rating}
                  <span className="text-slate-500 text-xs font-normal">({activeWorker.reviews.length} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-3.5 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span>Suburb: <strong className="text-slate-200">{activeWorker.town}</strong></span>
                </div>
                <div>
                  <span>Experience: <strong className="text-slate-200">{activeWorker.experience} Years</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Biography Bio */}
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3">About Worker</h4>
            <p className="text-sm text-slate-400 leading-relaxed bg-slate-900/15 p-4 rounded-xl border border-slate-900">
              {activeWorker.bio}
            </p>
          </div>

          {/* Pricing Services list */}
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span>Standard Rates & Tasks</span>
              <span className="text-xs font-medium text-slate-500 capitalize">Base Fee: {MOCK_SERVICES[activeWorker.category].baseFee} Rs</span>
            </h4>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/25">
              {MOCK_SERVICES[activeWorker.category].items.map((srv) => (
                <div key={srv.id} className="flex justify-between items-center p-3.5 text-sm">
                  <span className="text-slate-300 font-medium">{srv.name}</span>
                  <span className="text-indigo-400 font-bold font-mono">₹{srv.rate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Stream Feed */}
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">
              Client Feedback ({activeWorker.reviews.length})
            </h4>

            {activeWorker.reviews.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">
                No reviews yet. Be the first to verify this worker!
              </div>
            ) : (
              <div className="space-y-4">
                {activeWorker.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-950/30 border border-slate-900 rounded-xl flex flex-col justify-between gap-2.5">
                    
                    {/* Reviewer line & badge indicator */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-300">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-200">{rev.author}</h5>
                          <span className="text-[10px] text-slate-500">{rev.date}</span>
                        </div>
                      </div>

                      {/* Ratings stars */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < rev.rating ? "fill-amber-400" : "text-slate-700"}`}
                            />
                          ))}
                        </div>

                        {/* Verified vs Fake Alerts */}
                        {rev.suspiciousDetails ? (
                          <div className="relative shrink-0">
                            <button
                              onMouseEnter={() => setActiveTooltip(rev.id)}
                              onMouseLeave={() => setActiveTooltip(null)}
                              onClick={() => setActiveTooltip(activeTooltip === rev.id ? null : rev.id)}
                              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${getSuspiciousIconClass(rev.suspiciousDetails.type)} cursor-help shrink-0`}
                            >
                              <ShieldAlert className="h-3 w-3 shrink-0" />
                              Suspicious Review
                            </button>
                            
                            {activeTooltip === rev.id && (
                              <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-slate-900 border border-slate-800 rounded-lg shadow-xl text-[10px] text-slate-300 z-30 leading-relaxed">
                                <span className="font-bold text-amber-400 block mb-1">Fake Review Detection Warning:</span>
                                {rev.suspiciousDetails.reason}
                              </div>
                            )}
                          </div>
                        ) : rev.isVerified ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                            Verified Booking
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 bg-slate-900 rounded-full border border-slate-800/80 shrink-0">
                            Unverified User
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed pl-10">
                      {rev.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form to submit review */}
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/10">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">
              Write a Review
            </h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Author Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Rating select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Rating Score</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              {/* Text Review */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Review Details</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Tell us about the repair work (ProTip: Write repeated phrase clusters to test fake review alerts!)"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Verified Booking Checkbox selector */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-900">
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-300">Did you hire this technician via Quickfix?</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">Enabling this attaches a verified checkout tag.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isVerifiedBooking}
                  onChange={(e) => setIsVerifiedBooking(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer text-center"
              >
                Submit Feedback
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
