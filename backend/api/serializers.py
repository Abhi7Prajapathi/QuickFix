from rest_framework import serializers
from .models import Worker, Review, Booking

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id', 'worker', 'author', 'rating', 'date', 
            'text', 'is_verified', 'suspicious_type', 'suspicious_reason'
        ]
        read_only_fields = ['id', 'date', 'suspicious_type', 'suspicious_reason']


class WorkerSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()

    class Meta:
        model = Worker
        fields = [
            'id', 'name', 'category', 'phone', 'whatsapp', 
            'experience', 'town', 'latitude', 'longitude', 
            'avatar', 'bio', 'is_emergency_available', 'is_verified', 
            'reviews', 'average_rating', 'distance'
        ]

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 5.0  # default rating
        total = sum(r.rating for r in reviews)
        return round(total / len(reviews), 1)

    def get_distance(self, obj):
        return getattr(obj, 'distance', 4.5)



class BookingSerializer(serializers.ModelSerializer):
    worker_name = serializers.ReadOnlyField(source='worker.name')
    worker_category = serializers.ReadOnlyField(source='worker.category')
    worker_phone = serializers.ReadOnlyField(source='worker.phone')
    whatsapp = serializers.ReadOnlyField(source='worker.whatsapp')

    class Meta:
        model = Booking
        fields = [
            'id', 'worker', 'worker_name', 'worker_category', 
            'worker_phone', 'whatsapp', 'booking_type', 'notes', 
            'status', 'date'
        ]
        read_only_fields = ['id', 'status', 'date']
