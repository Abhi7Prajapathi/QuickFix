export const MOCK_TOWNS = [
  "Rampur",
  "Dharampur",
  "Sitapur",
  "Pipri",
  "Sonpur",
  "Greenwood",
  "Westside",
  "Shantiniketan",
  "Kalyanpur"
];

export const MOCK_SERVICES = {
  electrician: {
    title: "Electrician",
    icon: "Zap",
    baseFee: 150,
    items: [
      { id: "fan", name: "Ceiling Fan Installation", rate: 250 },
      { id: "wiring", name: "House Re-wiring (per room)", rate: 1200 },
      { id: "switch", name: "Switchboard / Socket Repair", rate: 100 },
      { id: "short", name: "Short Circuit Troubleshooting", rate: 400 },
      { id: "inverter", name: "Inverter Setup", rate: 600 }
    ]
  },
  plumber: {
    title: "Plumber",
    icon: "Droplet",
    baseFee: 120,
    items: [
      { id: "leak", name: "Leaking Pipe Repair", rate: 200 },
      { id: "tap", name: "Tap / Faucet Replacement", rate: 150 },
      { id: "drain", name: "Clogged Drain Cleaning", rate: 300 },
      { id: "tank", name: "Water Tank Cleaning", rate: 800 },
      { id: "toilet", name: "Toilet Flush Repair", rate: 250 }
    ]
  },
  ac_repair: {
    title: "AC Repair & Service",
    icon: "Wind",
    baseFee: 200,
    items: [
      { id: "service", name: "General AC Wet Service", rate: 500 },
      { id: "gas", name: "Gas Charging / Refilling", rate: 1500 },
      { id: "compressor", name: "Compressor Repair", rate: 2500 },
      { id: "installation", name: "Split AC Installation", rate: 1200 },
      { id: "leakage", name: "Water Leakage Troubleshooting", rate: 350 }
    ]
  },
  painter: {
    title: "Painter",
    icon: "Paintbrush",
    baseFee: 100,
    items: [
      { id: "wall", name: "Single Wall Painting", rate: 800 },
      { id: "room", name: "Full Room Painting", rate: 3500 },
      { id: "door", name: "Door/Window Varnishing & Polish", rate: 600 },
      { id: "waterproof", name: "Wall Dampness Waterproofing", rate: 1500 }
    ]
  },
  carpenter: {
    title: "Carpenter",
    icon: "Hammer",
    baseFee: 130,
    items: [
      { id: "hinge", name: "Door Hinge / Lock Repair", rate: 150 },
      { id: "furniture", name: "Furniture Assembly", rate: 1000 },
      { id: "modular", name: "Cabinet Repair & Fitting", rate: 450 },
      { id: "sofa", name: "Sofa Cushion Repair", rate: 900 }
    ]
  }
};

export const INITIAL_WORKERS = [
  {
    id: "w1",
    name: "Ramesh Kumar",
    category: "electrician",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    experience: 8,
    rating: 4.8,
    town: "Rampur",
    coordinates: [25.4486, 81.8336],
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300",
    isEmergencyAvailable: true,
    isVerified: true,
    bio: "Certified vocational electrician with 8+ years experience. Expert in residential wiring, short circuits, switchboard installations, and inverter set-up in Rampur village and surrounding towns.",
    reviews: [
      {
        id: "r1_1",
        author: "Sanjay Sharma",
        rating: 5,
        date: "2026-05-25",
        text: "Ramesh fixed our main switchboard in Rampur at 11 PM during a power cut. Extremely professional and quick! Recommended.",
        isVerified: true,
        suspiciousDetails: null
      },
      {
        id: "r1_2",
        author: "Anonymous User",
        rating: 5,
        date: "2026-05-24",
        text: "Great work. Great work. Great work. Ramesh is the best. Great work. Highly recommend to everyone.",
        isVerified: false,
        suspiciousDetails: {
          reason: "Identical phrase repetition and generic keyword density (Heuristics: repetitive text structure).",
          type: "text_repetition"
        }
      }
    ]
  },
  {
    id: "w2",
    name: "Mohammad Ali",
    category: "plumber",
    phone: "+91 99887 76655",
    whatsapp: "919988776655",
    experience: 12,
    rating: 4.9,
    town: "Dharampur",
    coordinates: [25.4526, 81.8210],
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=300",
    isEmergencyAvailable: true,
    isVerified: true,
    bio: "12+ years experience in heavy leak control, kitchen sink installations, drainage blocks, water tank cleanups, and borewell motor assemblies. Always available on short notice in Dharampur area.",
    reviews: [
      {
        id: "r2_1",
        author: "Devendra Singh",
        rating: 5,
        date: "2026-05-26",
        text: "Ali resolved our major kitchen pipe burst issue. He had all the advanced tools with him. Very polite and charges are very reasonable.",
        isVerified: true,
        suspiciousDetails: null
      },
      {
        id: "r2_2",
        author: "Rohan Patel",
        rating: 4,
        date: "2026-05-15",
        text: "Good plumber, fixed our water tank leakage. Recommended.",
        isVerified: true,
        suspiciousDetails: null
      }
    ]
  },
  {
    id: "w3",
    name: "Vikram Rathore",
    category: "ac_repair",
    phone: "+91 91234 56789",
    whatsapp: "919123456789",
    experience: 5,
    rating: 4.6,
    town: "Greenwood",
    coordinates: [25.4380, 81.8450],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    isEmergencyAvailable: false,
    isVerified: false,
    bio: "Specialist in split AC wet servicing, gas leakage detection, compressor replacements, and cooling optimizations. Reliable service in Greenwood suburb.",
    reviews: [
      {
        id: "r3_1",
        author: "Aman Gupta",
        rating: 5,
        date: "2026-05-20",
        text: "Excellent gas refilling service. AC cooling is back to normal and fast now.",
        isVerified: true,
        suspiciousDetails: null
      },
      {
        id: "r3_2",
        author: "User4958",
        rating: 5,
        date: "2026-05-20",
        text: "Excellent gas refilling service. AC cooling is back to normal and fast now.",
        isVerified: false,
        suspiciousDetails: {
          reason: "High similarity: submitted within seconds with identical phrasing as another reviewer.",
          type: "temporal_proximity"
        }
      }
    ]
  },
  {
    id: "w4",
    name: "Sunil Verma",
    category: "painter",
    phone: "+91 98888 77777",
    whatsapp: "919888877777",
    experience: 9,
    rating: 4.7,
    town: "Sitapur",
    coordinates: [25.4610, 81.8315],
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
    isEmergencyAvailable: true,
    isVerified: true,
    bio: "Professional painter for residential homes and offices. Specializes in beautiful wall damping waterproof coatings, premium plastic emulsified paints, and wood varnishing. Fast cleanups.",
    reviews: [
      {
        id: "r4_1",
        author: "Manoj Mishra",
        rating: 5,
        date: "2026-05-18",
        text: "Sunil painted our entire living room in just 2 days. The finishing is excellent, and he covered all our furniture properly before starting.",
        isVerified: true,
        suspiciousDetails: null
      }
    ]
  },
  {
    id: "w5",
    name: "Gurpreet Singh",
    category: "carpenter",
    phone: "+91 97777 66666",
    whatsapp: "919777766666",
    experience: 15,
    rating: 4.9,
    town: "Westside",
    coordinates: [25.4312, 81.8150],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    isEmergencyAvailable: false,
    isVerified: true,
    bio: "Traditional wood artisan with 15 years in bespoke furniture crafting. Skilled in modular kitchen cabinet assemblies, sliding wardrobe alignments, heavy door repairs, and sofa refurbishing.",
    reviews: [
      {
        id: "r5_1",
        author: "Harpreet Kaur",
        rating: 5,
        date: "2026-05-22",
        text: "Gurpreet fixed our sliding wardrobe doors which were stuck for months. Incredible expertise and precision. A true master carpenter.",
        isVerified: true,
        suspiciousDetails: null
      }
    ]
  },
  {
    id: "w6",
    name: "Amit Patel",
    category: "electrician",
    phone: "+91 93333 44444",
    whatsapp: "919333344444",
    experience: 4,
    rating: 4.2,
    town: "Sonpur",
    coordinates: [25.4578, 81.8490],
    avatar: "https://images.unsplash.com/photo-1620122303020-43ec4b6cf7f8?auto=format&fit=crop&q=80&w=300",
    isEmergencyAvailable: true,
    isVerified: false,
    bio: "Quick, energetic residential technician. Expert in LED installation, solar panel repair, standard house connections, and immediate electrical trip solutions.",
    reviews: [
      {
        id: "r6_1",
        author: "Preeti Sinha",
        rating: 4,
        date: "2026-05-12",
        text: "Helpful guy. Amit came in short time and resolved the inverter charging issue.",
        isVerified: true,
        suspiciousDetails: null
      },
      {
        id: "r6_2",
        author: "CompetitorHater",
        rating: 1,
        date: "2026-05-14",
        text: "Extremely worst worker. Did not do any work and stole money. Beware of this cheater!!",
        isVerified: false,
        suspiciousDetails: {
          reason: "Flagged: Negative review submitted from an unverified burner account with highly aggressive language.",
          type: "competitor_attack"
        }
      }
    ]
  },
  {
    id: "w7",
    name: "Rajesh Soni",
    category: "plumber",
    phone: "+91 94444 55555",
    whatsapp: "919444455555",
    experience: 6,
    rating: 4.4,
    town: "Pipri",
    coordinates: [25.4225, 81.8290],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    isEmergencyAvailable: true,
    isVerified: false,
    bio: "Reliable plumber in Pipri. Specialized in bathroom fittings, pipe leakages, water taps, and drain cleanups at affordable costs.",
    reviews: [
      {
        id: "r7_1",
        author: "Kedar Nath",
        rating: 4.5,
        date: "2026-05-19",
        text: "Fixed our bathroom faucet. He arrived exactly on time and charged standard rates.",
        isVerified: true,
        suspiciousDetails: null
      }
    ]
  },
  {
    id: "w8",
    name: "Hari Prasad",
    category: "painter",
    phone: "+91 95555 66666",
    whatsapp: "919555566666",
    experience: 10,
    rating: 4.7,
    town: "Shantiniketan",
    coordinates: [25.4410, 81.8590],
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    isEmergencyAvailable: false,
    isVerified: true,
    bio: "Fine texture painting specialist. Over 10 years working in decorative stencils, premium metallic finish coats, exterior wall waterproof painting, and distemper paints. Clean workmanship in Shantiniketan.",
    reviews: [
      {
        id: "r8_1",
        author: "Sunita Roy",
        rating: 5,
        date: "2026-05-11",
        text: "Hari painted our kids bedroom with stencil designs. It looks incredibly beautiful! Highly professional work.",
        isVerified: true,
        suspiciousDetails: null
      }
    ]
  }
];
