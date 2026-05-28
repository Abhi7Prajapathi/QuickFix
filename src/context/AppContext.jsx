import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_WORKERS, MOCK_SERVICES } from "../data/mockWorkers";

const AppContext = createContext();

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Offline fallback datasets
  const [localWorkers, setLocalWorkers] = useState(() => {
    const saved = localStorage.getItem("quickfix_workers");
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [workers, setWorkers] = useState([]);
  const [isApiOnline, setIsApiOnline] = useState(false);

  // Load initial bookings
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("quickfix_bookings");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [activeWorker, setActiveWorker] = useState(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorCategory, setCalculatorCategory] = useState("electrician");

  // User simulated GPS location (centered in local region)
  const [userLocation, setUserLocation] = useState({
    lat: 25.4410,
    lng: 81.8290,
    name: "Sitapur Central",
    isDetected: false
  });

  // Local storage persistence for offline fallback workers
  useEffect(() => {
    if (!isApiOnline && localWorkers.length > 0) {
      localStorage.setItem("quickfix_workers", JSON.stringify(localWorkers));
    }
  }, [localWorkers, isApiOnline]);

  // Persist bookings
  useEffect(() => {
    localStorage.setItem("quickfix_bookings", JSON.stringify(bookings));
  }, [bookings]);

  // Dynamic fetch workers from Django backend API (with offline fallback)
  const fetchWorkersFromApi = async () => {
    try {
      // Build search query parameters
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedTown) params.append("town", selectedTown);
      if (isEmergencyMode) params.append("is_emergency", "true");
      if (searchQuery) params.append("search", searchQuery);

      // Pass coordinates for spatial distance calculations in Python!
      params.append("lat", userLocation.lat);
      params.append("lng", userLocation.lng);

      const response = await fetch(`${API_BASE_URL}/workers/?${params.toString()}`);
      if (!response.ok) throw new Error("API server responded with error");

      const data = await response.json();

      // Map API list response to match frontend camelCase structures
      const formattedWorkers = data.map(w => ({
        id: w.id.toString(),
        name: w.name,
        category: w.category,
        phone: w.phone,
        whatsapp: w.whatsapp,
        experience: w.experience,
        town: w.town,
        coordinates: [w.latitude, w.longitude],
        avatar: w.avatar,
        bio: w.bio,
        isEmergencyAvailable: w.is_emergency_available,
        isVerified: w.is_verified,
        distance: w.distance,
        rating: w.average_rating,
        reviews: w.reviews.map(r => ({
          id: r.id.toString(),
          author: r.author,
          rating: r.rating,
          date: r.date,
          text: r.text,
          isVerified: r.is_verified,
          suspiciousDetails: r.suspicious_type ? {
            type: r.suspicious_type,
            reason: r.suspicious_reason
          } : null
        })).sort((a, b) => b.id.localeCompare(a.id)) // sort reviews newest first
      }));

      if (formattedWorkers.length === 0 && !searchQuery && !selectedCategory && !selectedTown && !isEmergencyMode) {
        // Connected to Django, but database is empty. Show mock profiles as seed fallback.
        setWorkers(localWorkers);
      } else {
        setWorkers(formattedWorkers);
      }
      setIsApiOnline(true);
    } catch (err) {
      // API is offline - trigger fallback to local browser dataset
      setIsApiOnline(false);

      // Execute frontend local filtering/sorting logic
      const calculated = localWorkers.map(w => {
        const dist = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          w.coordinates[0],
          w.coordinates[1]
        );
        return { ...w, distance: dist };
      }).filter(w => {
        const matchesSearch = searchQuery === "" ||
          w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.town.toLowerCase().includes(searchQuery.toLowerCase()) ||
          MOCK_SERVICES[w.category].title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = !selectedCategory || w.category === selectedCategory;
        const matchesTown = !selectedTown || w.town === selectedTown;
        const matchesEmergency = !isEmergencyMode || w.isEmergencyAvailable;

        return matchesSearch && matchesCategory && matchesTown && matchesEmergency;
      }).sort((a, b) => {
        if (isEmergencyMode) return a.distance - b.distance;
        if (b.isVerified !== a.isVerified) return b.isVerified ? 1 : -1;
        return b.rating - a.rating;
      });

      setWorkers(calculated);
    }
  };

  // Trigger API fetches on state changes
  useEffect(() => {
    fetchWorkersFromApi();
  }, [searchQuery, selectedCategory, selectedTown, isEmergencyMode, userLocation, localWorkers]);

  // Geolocation detector simulation
  const detectUserLocation = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUserLocation({
          lat: 25.4450,
          lng: 81.8350,
          name: "Rampur Junction (GPS Detected)",
          isDetected: true
        });
        resolve(true);
      }, 1200);
    });
  };

  // Haversine formula (km distance calculation)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  // Add review (Django POST with offline backup)
  const addReview = async (workerId, newReviewData) => {
    const { author, rating, text, isVerified = false } = newReviewData;

    if (isApiOnline) {
      try {
        const payload = {
          worker: Number(workerId),
          author,
          rating,
          text,
          is_verified: isVerified
        };

        const response = await fetch(`${API_BASE_URL}/reviews/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Could not POST review to backend");

        // Success - refetch the updated records from Django Database
        await fetchWorkersFromApi();

        // If the active profile drawer is open, reload its active local state
        const refreshedResponse = await fetch(`${API_BASE_URL}/workers/${workerId}/?lat=${userLocation.lat}&lng=${userLocation.lng}`);
        if (refreshedResponse.ok) {
          const w = await refreshedResponse.json();
          setActiveWorker({
            id: w.id.toString(),
            name: w.name,
            category: w.category,
            phone: w.phone,
            whatsapp: w.whatsapp,
            experience: w.experience,
            town: w.town,
            coordinates: [w.latitude, w.longitude],
            avatar: w.avatar,
            bio: w.bio,
            isEmergencyAvailable: w.is_emergency_available,
            isVerified: w.is_verified,
            distance: w.distance,
            rating: w.average_rating,
            reviews: w.reviews.map(r => ({
              id: r.id.toString(),
              author: r.author,
              rating: r.rating,
              date: r.date,
              text: r.text,
              isVerified: r.is_verified,
              suspiciousDetails: r.suspicious_type ? {
                type: r.suspicious_type,
                reason: r.suspicious_reason
              } : null
            })).sort((a, b) => b.id.localeCompare(a.id))
          });
        }
        return;
      } catch (err) {
        // Fallback to local execution if backend POST fails
        console.warn("Backend POST review failed, falling back to local simulation.", err);
      }
    }

    // --- Offline Local Simulation Mode ---
    let suspiciousDetails = null;
    if (text && text.trim().length > 0) {
      const lowerText = text.toLowerCase();
      const words = lowerText.split(/\s+/);
      const uniqueWords = new Set(words);
      const repetitiveRatio = uniqueWords.size / words.length;

      const competitorKeywords = ["cheater", "fraud", "stole", "worst", "don't trust", "competitor", "robbed", "fake"];
      const containsSpamKeywords = competitorKeywords.some(keyword => lowerText.includes(keyword));

      if (words.length > 6 && repetitiveRatio < 0.45) {
        suspiciousDetails = {
          type: "text_repetition",
          reason: "High frequency of repetitive words or phrases. Flagged as suspected commercial review stuffing."
        };
      } else if (rating === 1 && containsSpamKeywords && !isVerified) {
        suspiciousDetails = {
          type: "competitor_attack",
          reason: "Unverified negative review containing highly hostile competitive vocabulary. Suspected rival worker smear."
        };
      } else if (!isVerified && author.toLowerCase().startsWith("user") && text.length < 15 && rating === 5) {
        suspiciousDetails = {
          type: "burner_profile",
          reason: "Short positive review from an unverified default user handle. Low information density."
        };
      }
    }

    const review = {
      id: `r_${Date.now()}`,
      author: author || "Anonymous User",
      rating: Number(rating),
      date: new Date().toISOString().split("T")[0],
      text: text || "No text review provided.",
      isVerified,
      suspiciousDetails
    };

    setLocalWorkers(prevWorkers => {
      const updated = prevWorkers.map(w => {
        if (w.id === workerId) {
          const updatedReviews = [review, ...w.reviews];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

          return {
            ...w,
            rating: newAvgRating,
            reviews: updatedReviews
          };
        }
        return w;
      });

      // Update active worker drawer state
      const targetWorker = updated.find(w => w.id === workerId);
      if (targetWorker) {
        setActiveWorker(targetWorker);
      }
      return updated;
    });
  };

  // Register technician (Django POST with offline backup)
  const registerWorker = async (workerData) => {
    if (isApiOnline) {
      try {
        const payload = {
          name: workerData.name,
          category: workerData.category,
          phone: workerData.phone,
          whatsapp: workerData.whatsapp,
          experience: workerData.experience,
          town: workerData.town,
          latitude: workerData.coordinates[0],
          longitude: workerData.coordinates[1],
          avatar: workerData.avatar,
          bio: workerData.bio,
          is_emergency_available: workerData.isEmergencyAvailable,
          is_verified: false
        };

        const response = await fetch(`${API_BASE_URL}/workers/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Could not POST new worker to backend");

        // Refresh list directly from DB
        await fetchWorkersFromApi();
        return;
      } catch (err) {
        console.warn("Backend POST worker failed, falling back to local registration.", err);
      }
    }

    // --- Offline Fallback Mode ---
    const newWorker = {
      id: `w_${Date.now()}`,
      rating: 5.0,
      reviews: [],
      isVerified: false,
      ...workerData
    };
    setLocalWorkers(prev => [newWorker, ...prev]);
  };

  // Book worker (Django POST with local state sync)
  const bookWorker = async (workerId, bookingData) => {
    const targetWorker = workers.find(w => w.id === workerId);
    if (!targetWorker) return;

    const newBooking = {
      id: `b_${Date.now()}`,
      workerId,
      workerName: targetWorker.name,
      workerCategory: targetWorker.category,
      workerPhone: targetWorker.phone,
      whatsapp: targetWorker.whatsapp,
      date: new Date().toLocaleDateString(),
      status: "Confirmed",
      ...bookingData
    };

    setBookings(prev => [newBooking, ...prev]);

    if (isApiOnline) {
      try {
        const payload = {
          worker: Number(workerId),
          booking_type: bookingData.type,
          notes: bookingData.notes || ""
        };

        await fetch(`${API_BASE_URL}/bookings/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn("Backend booking log save failed, persisted locally.", err);
      }
    }

    return newBooking;
  };

  return (
    <AppContext.Provider
      value={{
        workers,
        bookings,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedTown,
        setSelectedTown,
        isEmergencyMode,
        setIsEmergencyMode,
        userLocation,
        detectUserLocation,
        calculateDistance,
        activeWorker,
        setActiveWorker,
        isCalculatorOpen,
        setIsCalculatorOpen,
        calculatorCategory,
        setCalculatorCategory,
        addReview,
        registerWorker,
        bookWorker,
        filteredWorkers: workers, // already filtered on API list request
        isApiOnline
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
