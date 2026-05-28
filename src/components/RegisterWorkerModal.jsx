import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, User, Phone, Zap, MapPin, ShieldAlert, Sparkles, Check } from "lucide-react";
import { MOCK_TOWNS, MOCK_SERVICES } from "../data/mockWorkers";
import confetti from "canvas-confetti";

export default function RegisterWorkerModal({ isOpen, onClose }) {
  const { registerWorker } = useApp();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("electrician");
  const [town, setTown] = useState("Rampur");
  const [isEmergencyAvailable, setIsEmergencyAvailable] = useState(false);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step === 1 && (!name.trim() || !phone.trim() || !experience.trim() || !bio.trim())) return;
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Coordinate mapping helper based on selected town for map visualization
    const townCoordinates = {
      Rampur: [25.4486, 81.8336],
      Dharampur: [25.4526, 81.8210],
      Sitapur: [25.4610, 81.8315],
      Pipri: [25.4225, 81.8290],
      Sonpur: [25.4578, 81.8490],
      Greenwood: [25.4380, 81.8450],
      Westside: [25.4312, 81.8150],
      Shantiniketan: [25.4410, 81.8590],
      Kalyanpur: [25.4680, 81.8120]
    };

    const workerData = {
      name,
      phone: `+91 ${phone}`,
      whatsapp: `91${phone.replace(/\s+/g, "")}`,
      experience: Number(experience),
      bio,
      category,
      town,
      isEmergencyAvailable,
      coordinates: townCoordinates[town] || [25.4410, 81.8290],
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&q=80&w=300`
    };

    registerWorker(workerData);

    // Blast celebratory double confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#10b981", "#ff007f"]
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#a855f7"]
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#a855f7"]
      });
    }, 250);

    // Reset Form
    setName("");
    setPhone("");
    setExperience("");
    setBio("");
    setCategory("electrician");
    setTown("Rampur");
    setIsEmergencyAvailable(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Card wrapper */}
      <div className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Technician Registration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-slate-950/40 px-5 py-3 border-b border-slate-900 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">Step {step} of 4</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <span 
                key={s} 
                className={`w-5 h-1.5 rounded-full transition-all duration-300 ${
                  s === step 
                    ? "bg-indigo-500 w-8" 
                    : s < step 
                      ? "bg-emerald-500" 
                      : "bg-slate-800"
                }`}
              ></span>
            ))}
          </div>
        </div>

        {/* Form Content body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200">Personal Details</h3>
              
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">WhatsApp Mobile Number</label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border-y border-l border-slate-800 bg-slate-900 text-slate-400 font-medium shrink-0">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-r-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Years of Experience</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Professional Bio</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe your service qualities, skills, and specialties..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200">Service Trade Specialty</h3>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Choose Trade Specialty</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  {Object.keys(MOCK_SERVICES).map((catKey) => (
                    <option key={catKey} value={catKey}>
                      {MOCK_SERVICES[catKey].title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-300 block mb-1">Standard Base Rates:</span>
                Your initial profile will register standard pricing categories (base fees, fan repairs, water pipe leakages, etc.) defined for the <strong>{MOCK_SERVICES[category].title}</strong> trade so that users can fetch estimates with the pricing calculator instantly.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200">Village Suburb Pinning</h3>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Select Primary Suburb</label>
                <select
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  {MOCK_TOWNS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 text-slate-400 flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-300 block mb-0.5">Map Coordinate Auto-matching</span>
                  By selecting {town}, our dashboard will automatically assign geographic mapping coordinates to place your live technician pin inside the neighborhood map directory.
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200">Emergency & Submission</h3>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 flex items-center justify-between gap-4">
                <div className="text-left flex items-start gap-2.5">
                  <ShieldAlert className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200 block mb-0.5">Emergency Availability Mode</span>
                    <span className="text-[10px] text-slate-500 block leading-relaxed">
                      Toggle this if you are active for off-hour overnight emergency repairs, piping bursts, short circuit hazards, etc.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isEmergencyAvailable}
                  onChange={(e) => setIsEmergencyAvailable(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-slate-400 space-y-1 text-left">
                <span className="font-bold text-indigo-300 block mb-1">Verify Your Profile details:</span>
                <p>• Name: <strong className="text-slate-200">{name}</strong></p>
                <p>• Contact: <strong className="text-slate-200">+91 {phone}</strong></p>
                <p>• Specialty: <strong className="text-slate-200">{MOCK_SERVICES[category].title}</strong></p>
                <p>• Neighborhood: <strong className="text-slate-200">{town}</strong></p>
              </div>
            </div>
          )}

        </form>

        {/* Modal Buttons Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/40 flex items-center justify-end gap-2.5">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="py-2 px-4.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl transition-all cursor-pointer text-xs border border-slate-700"
            >
              Previous
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={step === 1 && (!name.trim() || !phone.trim() || !experience.trim() || !bio.trim())}
              className={`py-2 px-5 font-bold rounded-xl transition-all text-xs cursor-pointer ${
                step === 1 && (!name.trim() || !phone.trim() || !experience.trim() || !bio.trim())
                  ? "bg-slate-800 text-slate-600 border border-slate-900 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition-all cursor-pointer text-xs"
            >
              Finish & Go Live!
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
