import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useApp } from "../context/AppContext";
import { Star, ShieldCheck, MapPin, Zap } from "lucide-react";
import L from "leaflet";
import { MOCK_SERVICES } from "../data/mockWorkers";

// Standard Leaflet Icon fix for React builds to avoid compilation asset breaks
const standardIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const emergencyIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map controller to handle panning/zoom when search location coordinates update
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function LeafletMap() {
  const { filteredWorkers, userLocation, setActiveWorker } = useApp();

  const userCenter = [userLocation.lat, userLocation.lng];

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Ambient background glow while loading */}
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center -z-10">
        <span className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
      </div>

      <MapContainer
        center={userCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        {/* Modern dark-themed map tile service by CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* User simulated GPS Pin */}
        <Marker position={userCenter} icon={userIcon}>
          <Popup>
            <div className="text-center font-semibold text-xs py-1">
              <span className="text-red-400 block mb-0.5 font-bold">📍 Your Location</span>
              <span className="text-slate-300 text-[10px]">{userLocation.name}</span>
            </div>
          </Popup>
        </Marker>

        {/* Dynamic worker pins */}
        {filteredWorkers.map((worker) => {
          const isEmergency = worker.isEmergencyAvailable;
          const pinIcon = isEmergency ? emergencyIcon : standardIcon;
          
          return (
            <Marker
              key={worker.id}
              position={worker.coordinates}
              icon={pinIcon}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  {/* Category badge & verified check */}
                  <div className="flex items-center justify-between mb-1.5 border-b border-slate-800/60 pb-1.5">
                    <span className="text-[10px] uppercase font-extrabold tracking-wide text-indigo-400">
                      {MOCK_SERVICES[worker.category].title}
                    </span>
                    <div className="flex items-center gap-1">
                      {worker.isVerified && (
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      )}
                      {worker.isEmergencyAvailable && (
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shrink-0"></span>
                      )}
                    </div>
                  </div>

                  {/* Worker Card summary */}
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700 bg-slate-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 leading-tight">
                        {worker.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-0.5">
                        <Star className="h-3 w-3 fill-amber-400 shrink-0" />
                        <span className="font-semibold text-slate-200">{worker.rating}</span>
                        <span className="text-slate-500">({worker.reviews.length})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-2">
                    <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                    <span>{worker.town} ({worker.distance} km away)</span>
                  </div>

                  {/* View Details Call to Action */}
                  <button
                    onClick={() => setActiveWorker(worker)}
                    className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer"
                  >
                    View Details & Rates
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Automatically pans map center to updated location coordinates */}
        <MapController center={userCenter} />
      </MapContainer>
    </div>
  );
}
