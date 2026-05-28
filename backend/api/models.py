from django.db import models

class Worker(models.Model):
    CATEGORY_CHOICES = [
        ('electrician', 'Electrician'),
        ('plumber', 'Plumber'),
        ('ac_repair', 'AC Repair'),
        ('painter', 'Painter'),
        ('carpenter', 'Carpenter'),
    ]

    name = models.CharField(max_length=150)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    phone = models.CharField(max_length=50)
    whatsapp = models.CharField(max_length=50)
    experience = models.IntegerField()
    town = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    avatar = models.URLField(max_length=500)
    bio = models.TextField()
    is_emergency_available = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.get_category_display()}"


class Review(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='reviews')
    author = models.CharField(max_length=150)
    rating = models.IntegerField()
    date = models.DateField(auto_now_add=True)
    text = models.TextField()
    is_verified = models.BooleanField(default=False)
    
    # Heuristics detection output fields
    suspicious_type = models.CharField(max_length=50, null=True, blank=True)
    suspicious_reason = models.TextField(null=True, blank=True)
    
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "Suspicious" if self.suspicious_type else "Normal"
        return f"Review by {self.author} for {self.worker.name} ({status})"


class Booking(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='bookings')
    booking_type = models.CharField(max_length=100)
    notes = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=50, default='Confirmed')
    date = models.DateField(auto_now_add=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking for {self.worker.name} ({self.booking_type})"
