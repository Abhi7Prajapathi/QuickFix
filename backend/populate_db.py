import os
import django

# Bootstrap the Django setting context before doing any imports
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickfix_backend.settings')
django.setup()

from api.models import Worker, Review

def seed_database():
    print("🧹 Cleaning database records...")
    Review.objects.all().delete()
    Worker.objects.all().delete()

    print("🌱 Seeding technicians/workers data...")

    workers_data = [
        {
            "name": "Ramesh Kumar",
            "category": "electrician",
            "phone": "+91 98765 43210",
            "whatsapp": "919876543210",
            "experience": 8,
            "town": "Rampur",
            "latitude": 25.4486,
            "longitude": 81.8336,
            "avatar": "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300",
            "bio": "Certified vocational electrician with 8+ years experience. Expert in residential wiring, short circuits, switchboard installations, and inverter set-up in Rampur village and surrounding towns.",
            "is_emergency_available": True,
            "is_verified": True,
            "reviews": [
                {
                    "author": "Sanjay Sharma",
                    "rating": 5,
                    "text": "Ramesh fixed our main switchboard in Rampur at 11 PM during a power cut. Extremely professional and quick! Recommended.",
                    "is_verified": True,
                    "suspicious_type": None,
                    "suspicious_reason": None
                },
                {
                    "author": "Anonymous User",
                    "rating": 5,
                    "text": "Great work. Great work. Great work. Ramesh is the best. Great work. Highly recommend to everyone.",
                    "is_verified": False,
                    "suspicious_type": "text_repetition",
                    "suspicious_reason": "High frequency of repetitive words or phrases. Flagged as suspected commercial review stuffing."
                }
            ]
        },
        {
            "name": "Mohammad Ali",
            "category": "plumber",
            "phone": "+91 99887 76655",
            "whatsapp": "919988776655",
            "experience": 12,
            "town": "Dharampur",
            "latitude": 25.4526,
            "longitude": 81.8210,
            "avatar": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=300",
            "bio": "12+ years experience in heavy leak control, kitchen sink installations, drainage blocks, water tank cleanups, and borewell motor assemblies. Always available on short notice in Dharampur area.",
            "is_emergency_available": True,
            "is_verified": True,
            "reviews": [
                {
                    "author": "Devendra Singh",
                    "rating": 5,
                    "text": "Ali resolved our major kitchen pipe burst issue. He had all the advanced tools with him. Very polite and charges are very reasonable.",
                    "is_verified": True,
                    "suspicious_type": None,
                    "suspicious_reason": None
                },
                {
                    "author": "Rohan Patel",
                    "rating": 4,
                    "text": "Good plumber, fixed our water tank leakage. Recommended.",
                    "is_verified": True,
                    "suspicious_type": None,
                    "suspicious_reason": None
                }
            ]
        },
        {
            "name": "Vikram Rathore",
            "category": "ac_repair",
            "phone": "+91 91234 56789",
            "whatsapp": "919123456789",
            "experience": 5,
            "town": "Greenwood",
            "latitude": 25.4380,
            "longitude": 81.8450,
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
            "bio": "Specialist in split AC wet servicing, gas leakage detection, compressor replacements, and cooling optimizations. Reliable service in Greenwood suburb.",
            "is_emergency_available": False,
            "is_verified": False,
            "reviews": [
                {
                    "author": "Aman Gupta",
                    "rating": 5,
                    "text": "Excellent gas refilling service. AC cooling is back to normal and fast now.",
                    "is_verified": True,
                    "suspicious_type": None,
                    "suspicious_reason": None
                },
                {
                    "author": "User4958",
                    "rating": 5,
                    "text": "Excellent gas refilling service. AC cooling is back to normal and fast now.",
                    "is_verified": False,
                    "suspicious_type": "temporal_proximity",
                    "suspicious_reason": "High similarity: submitted within seconds with identical phrasing as another reviewer."
                }
            ]
        },
        {
            "name": "Sunil Verma",
            "category": "painter",
            "phone": "+91 98888 77777",
            "whatsapp": "919888877777",
            "experience": 9,
            "town": "Sitapur",
            "latitude": 25.4610,
            "longitude": 81.8315,
            "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
            "bio": "Professional painter for residential homes and offices. Specializes in beautiful wall damping waterproof coatings, premium plastic emulsified paints, and wood varnishing. Fast cleanups.",
            "is_emergency_available": True,
            "is_verified": True,
            "reviews": [
                {
                    "author": "Manoj Mishra",
                    "rating": 5,
                    "text": "Sunil painted our entire living room in just 2 days. The finishing is excellent, and he covered all our furniture properly before starting.",
                    "is_verified": True,
                    "suspicious_type": None,
                    "suspicious_reason": None
                }
            ]
        },
        {
            "name": "Gurpreet Singh",
            "category": "carpenter",
            "phone": "+91 97777 66666",
            "whatsapp": "919777766666",
            "experience": 15,
            "town": "Westside",
            "latitude": 25.4312,
            "longitude": 81.8150,
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
            "bio": "Traditional wood artisan with 15 years in bespoke furniture crafting. Skilled in modular kitchen cabinet assemblies, sliding wardrobe alignments, heavy door repairs, and sofa refurbishing.",
            "is_emergency_available": False,
            "is_verified": True,
            "reviews": [
                {
                    "author": "Harpreet Kaur",
                    "rating": 5,
                    "text": "Gurpreet fixed our sliding wardrobe doors which were stuck for months. Incredible expertise and precision. A true master carpenter.",
                    "is_verified": True,
                    "suspicious_type": None,
                    "suspicious_reason": None
                }
            ]
        },
        {
            "name": "Amit Patel",
            "category": "electrician",
            "phone": "+91 93333 44444",
            "whatsapp": "919333344444",
            "experience": 4,
            "town": "Sonpur",
            "latitude": 25.4578,
            "longitude": 81.8490,
            "avatar": "https://images.unsplash.com/photo-1620122303020-43ec4b6cf7f8?auto=format&fit=crop&q=80&w=300",
            "bio": "Quick, energetic residential technician. Expert in LED installation, solar panel repair, standard house connections, and immediate electrical trip solutions.",
            "is_emergency_available": True,
            "is_verified": False,
            "reviews": [
                {
                    "author": "Preeti Sinha",
                    "rating": 4,
                    "text": "Helpful guy. Amit came in short time and resolved the inverter charging issue.",
                    "is_verified": True,
                    "suspicious_type": None,
                    "suspicious_reason": None
                },
                {
                    "author": "CompetitorHater",
                    "rating": 1,
                    "text": "Extremely worst worker. Did not do any work and stole money. Beware of this cheater!!",
                    "is_verified": False,
                    "suspicious_type": "competitor_attack",
                    "suspicious_reason": "Flagged: Negative review submitted from an unverified burner account with highly aggressive language."
                }
            ]
        },
        {
            "name": "Rajesh Soni",
            "category": "plumber",
            "phone": "+91 94444 55555",
            "whatsapp": "919444455555",
            "experience": 6,
            "town": "Pipri",
            "latitude": 25.4225,
            "longitude": 81.8290,
            "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
            "bio": "Reliable plumber in Pipri. Specialized in bathroom fittings, pipe leakages, water taps, and drain cleanups at affordable costs.",
            "is_emergency_available": True,
            "is_verified": False,
            "reviews": [
                {
                    "author": "Kedar Nath",
                    "rating": 4.5,
                    "text": "Fixed our bathroom faucet. He arrived exactly on time and charged standard rates.",
                    "is_verified": True,
                    "suspicious_type": None,
                    "suspicious_reason": None
                }
            ]
        },
        {
            "name": "Hari Prasad",
            "category": "painter",
            "phone": "+91 95555 66666",
            "whatsapp": "919555566666",
            "experience": 10,
            "town": "Shantiniketan",
            "latitude": 25.4410,
            "longitude": 81.8590,
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
            "bio": "Fine texture painting specialist. Over 10 years working in decorative stencils, premium metallic finish coats, exterior wall waterproof painting, and distemper paints. Clean workmanship in Shantiniketan.",
            "is_emergency_available": False,
            "is_verified": True,
            "reviews": [
                {
                    "author": "Sunita Roy",
                    "rating": 5,
                    "text": "Hari painted our kids bedroom with stencil designs. It looks incredibly beautiful! Highly professional work.",
                    "is_verified": True,
                    "suspicious_type": None,
                    "suspicious_reason": None
                }
            ]
        }
    ]

    for w_info in workers_data:
        reviews_list = w_info.pop("reviews")
        # Save worker
        worker = Worker.objects.create(**w_info)
        print(f"  + Added Worker: {worker.name}")
        
        # Save nested reviews
        for r_info in reviews_list:
            Review.objects.create(worker=worker, **r_info)

    print("🎉 Database successfully seeded with 8 workers and mock reviews!")

if __name__ == "__main__":
    seed_database()
