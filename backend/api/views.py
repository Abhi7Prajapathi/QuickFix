import math
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import Worker, Review, Booking
from .serializers import WorkerSerializer, ReviewSerializer, BookingSerializer

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    """Calculates distance in kilometers using the Haversine formula"""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat / 2) ** 2 + 
         math.cos(math.radians(lat1)) * 
         math.cos(math.radians(lat2)) * 
         math.sin(dlon / 2) ** 2)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)


class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        # Pass request so serializer can access calculated distances
        context['request'] = self.request
        return context

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # 1. Category Filtering
        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        # 2. Town/Village Filtering
        town = request.query_params.get('town')
        if town:
            queryset = queryset.filter(town=town)

        # 3. Emergency Filter
        is_emergency = request.query_params.get('is_emergency')
        if is_emergency == 'true':
            queryset = queryset.filter(is_emergency_available=True)

        # 4. Search Filter
        search_query = request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(bio__icontains=search_query) |
                Q(town__icontains=search_query)
            )

        # Retrieve user coordinates to compute distances
        user_lat = request.query_params.get('lat')
        user_lng = request.query_params.get('lng')

        workers = list(queryset)

        if user_lat and user_lng:
            try:
                user_lat = float(user_lat)
                user_lng = float(user_lng)
                for worker in workers:
                    worker.distance = calculate_haversine_distance(
                        user_lat, user_lng, 
                        worker.latitude, worker.longitude
                    )
                # Sort closest first
                workers.sort(key=lambda w: w.distance)
            except ValueError:
                # Fallback to standard rating sorting
                workers.sort(key=lambda w: (-w.is_verified, -w.rating if hasattr(w, 'rating') else 0))
        else:
            # Standard rating sorting
            for worker in workers:
                worker.distance = 4.5  # default baseline
            workers.sort(key=lambda w: (-w.is_verified))

        serializer = self.get_serializer(workers, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user_lat = request.query_params.get('lat')
        user_lng = request.query_params.get('lng')
        
        if user_lat and user_lng:
            try:
                instance.distance = calculate_haversine_distance(
                    float(user_lat), float(user_lng), 
                    instance.latitude, instance.longitude
                )
            except ValueError:
                instance.distance = 4.5
        else:
            instance.distance = 4.5
            
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def create(self, request, *args, **kwargs):
        # Extract fields
        worker_id = request.data.get('worker')
        author = request.data.get('author', 'Anonymous User')
        rating = int(request.data.get('rating', 5))
        text = request.data.get('text', '')
        is_verified = request.data.get('is_verified', False)

        if not worker_id:
            return Response(
                {"error": "Worker ID is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            worker = Worker.objects.get(id=worker_id)
        except Worker.DoesNotExist:
            return Response(
                {"error": "Worker not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # --- Server-Side Heuristic Fake Review Detection Engine ---
        suspicious_type = None
        suspicious_reason = None

        if text:
            lower_text = text.lower()
            words = lower_text.split()
            
            # 1. Text Repetition Check
            if len(words) > 6:
                unique_words = set(words)
                ratio = len(unique_words) / len(words)
                
                # Check for repeated word density
                if ratio < 0.45:
                    suspicious_type = "text_repetition"
                    suspicious_reason = "High frequency of repetitive words or phrases. Flagged as suspected commercial review stuffing."

            # 2. Competitor/Hostile Smear Check
            competitor_keywords = ["cheater", "fraud", "stole", "worst", "don't trust", "competitor", "robbed", "fake"]
            contains_smear = any(kw in lower_text for kw in competitor_keywords)
            
            if rating == 1 and contains_smear and not is_verified:
                suspicious_type = "competitor_attack"
                suspicious_reason = "Unverified negative review containing highly hostile competitive vocabulary. Suspected rival worker smear."

            # 3. Burner Account Check
            if not is_verified and author.lower().startswith("user") and len(text) < 15 and rating == 5:
                suspicious_type = "burner_profile"
                suspicious_reason = "Short positive review from an unverified default user handle. Low information density."

        # Create review entry
        review = Review.objects.create(
            worker=worker,
            author=author,
            rating=rating,
            text=text,
            is_verified=is_verified,
            suspicious_type=suspicious_type,
            suspicious_reason=suspicious_reason
        )

        serializer = self.get_serializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        worker_id = request.data.get('worker')
        booking_type = request.data.get('booking_type')
        notes = request.data.get('notes', '')

        try:
            worker = Worker.objects.get(id=worker_id)
        except Worker.DoesNotExist:
            return Response(
                {"error": "Worker not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        booking = Booking.objects.create(
            worker=worker,
            booking_type=booking_type,
            notes=notes,
            status="Confirmed"
        )

        serializer = self.get_serializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
