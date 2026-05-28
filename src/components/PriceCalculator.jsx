import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { X, Calculator, ShieldAlert, Sparkles, Navigation, CheckSquare, Square, MessageSquare, Info } from "lucide-react";
import { MOCK_SERVICES } from "../data/mockWorkers";
import confetti from "canvas-confetti";

export default function PriceCalculator() {
  const { 
    isCalculatorOpen, 
    setIsCalculatorOpen, 
    calculatorCategory, 
    setCalculatorCategory,
    isEmergencyMode,
    filteredWorkers,
    bookWorker
  } = useApp();

  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState({});

  const serviceConfig = MOCK_SERVICES[calculatorCategory];

  // Reset checked items when category changes
  useEffect(() => {
    setSelectedItems({});
    setQuantities({});
  }, [calculatorCategory]);

  if (!isCalculatorOpen) return null;

  const toggleItem = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    if (!quantities[itemId]) {
      setQuantities(prev => ({ ...prev, [itemId]: 1 }));
    }
  };

  const handleQtyChange = (itemId, val) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, Number(val))
    }));
  };

  // Find average distance of closest worker in category to compute travel charge
  const workersInCat = filteredWorkers.filter(w => w.category === calculatorCategory);
  const closestDist = workersInCat.length > 0 ? Math.min(...workersInCat.map(w => w.distance)) : 4.5;
  const travelFee = Math.round(closestDist * 20); // 20 Rs per km

  // Calculations
  const baseFee = serviceConfig.baseFee;
  let itemsSubtotal = 0;

  serviceConfig.items.forEach(item => {
    if (selectedItems[item.id]) {
      const qty = quantities[item.id] || 1;
      itemsSubtotal += item.rate * qty;
    }
  });

  const rawTotal = baseFee + itemsSubtotal + travelFee;
  const emergencyMarkup = isEmergencyMode ? Math.round(rawTotal * 0.20) : 0;
  const finalTotal = rawTotal + emergencyMarkup;

  const handleBookEstimate = () => {
    if (itemsSubtotal === 0) return;

    // Pick first worker in this category to mock the booking with
    const worker = workersInCat[0] || { id: "w1", name: "Ramesh Kumar", whatsapp: "919876543210" };

    // Register booking in our state
    bookWorker(worker.id, {
      type: "Calculator Estimate Booking",
      notes: `Booked estimate: Total ₹${finalTotal} (Includes ${calculatorCategory} services).`
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.75 },
      colors: ["#6366f1", "#10b981", "#ff007f"]
    });

    // Formulate pre-filled whatsapp message listing all selected tasks
    let itemsText = "";
    serviceConfig.items.forEach(item => {
      if (selectedItems[item.id]) {
        const qty = quantities[item.id] || 1;
        itemsText += ` - ${item.name} (Qty: ${qty})\n`;
      }
    });

    const text = encodeURIComponent(
      `Hello! I generated an estimate quote using Quickfix Calculator for ${serviceConfig.title} services:\n\n${itemsText}\nBase Fee: ₹${baseFee}\nTravel Fee: ₹${travelFee}${isEmergencyMode ? `\nEmergency Surcharge (20%): ₹${emergencyMarkup}` : ""}\n*Estimated Total: ₹${finalTotal}*\n\nAre you available to take this job?`
    );

    window.open(`https://wa.me/${worker.whatsapp}?text=${text}`, "_blank");
    setIsCalculatorOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-lg bg-[#0e1320] border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <Calculator className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Smart Price Estimator</h2>
          </div>
          <button
            onClick={() => setIsCalculatorOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
              Select Trade Specialty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(MOCK_SERVICES).map((catKey) => (
                <button
                  key={catKey}
                  onClick={() => setCalculatorCategory(catKey)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer truncate ${
                    calculatorCategory === catKey
                      ? "bg-indigo-600 border-indigo-500 text-white font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {MOCK_SERVICES[catKey].title}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency price warn badge */}
          {isEmergencyMode && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-2.5 text-xs leading-relaxed animate-pulse">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-red-400" />
              <div>
                <strong className="text-red-200 font-bold block mb-0.5">Emergency Pricing Active</strong>
                An automated 20% markup is added to cover instant dispatch, round-the-clock priority labor, and off-hour response times.
              </div>
            </div>
          )}

          {/* Job Selection Checklist */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Check services needed
            </label>
            <div className="space-y-2.5">
              {serviceConfig.items.map((item) => {
                const isChecked = !!selectedItems[item.id];
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isChecked 
                        ? "bg-slate-900/80 border-indigo-500/30" 
                        : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 text-indigo-400 shrink-0" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-700 shrink-0" />
                      )}
                      <div>
                        <span className={`text-xs font-medium block ${isChecked ? "text-slate-100" : "text-slate-400"}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">₹{item.rate} per unit</span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    {isChecked && (
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800"
                      >
                        <button
                          onClick={() => handleQtyChange(item.id, (quantities[item.id] || 1) - 1)}
                          className="text-xs text-slate-400 hover:text-white px-1.5 cursor-pointer font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-100 min-w-4 text-center">
                          {quantities[item.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.id, (quantities[item.id] || 1) + 1)}
                          className="text-xs text-slate-400 hover:text-white px-1.5 cursor-pointer font-bold"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Breakdown Sheet */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900 space-y-3.5">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-900 pb-2">
              Itemized Quote Breakdown
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Base Consultation Fee:</span>
                <span className="text-slate-300 font-medium">₹{baseFee}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Selected Tasks Total:</span>
                <span className="text-slate-300 font-medium">₹{itemsSubtotal}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  Travel & Distance Fee
                  <Info className="h-3 w-3 text-slate-600 cursor-help" title={`Based on closest technician distance of ${closestDist.toFixed(1)} km`} />
                </span>
                <span className="text-slate-300 font-medium">₹{travelFee}</span>
              </div>

              {isEmergencyMode && (
                <div className="flex justify-between text-red-400">
                  <span>Emergency Surcharge (20%):</span>
                  <span className="font-bold">₹{emergencyMarkup}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-slate-900 pt-3.5">
              <span className="text-sm font-bold text-slate-200">Total Estimated Cost:</span>
              <span className="text-lg font-extrabold text-indigo-400 font-mono">₹{finalTotal}</span>
            </div>
          </div>

        </div>

        {/* CTA Book Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/20">
          <button
            onClick={handleBookEstimate}
            disabled={itemsSubtotal === 0}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-center cursor-pointer transition-all shadow-lg ${
              itemsSubtotal > 0
                ? "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-600/10"
                : "bg-slate-800 text-slate-500 border border-slate-900 cursor-not-allowed"
            }`}
          >
            <MessageSquare className="h-4.5 w-4.5" />
            Book Closest Pro for ₹{finalTotal}
          </button>
          <span className="block text-[10px] text-center text-slate-500 mt-2">
            No upfront payment required. Pay directly to worker on-site.
          </span>
        </div>

      </div>
    </div>
  );
}
