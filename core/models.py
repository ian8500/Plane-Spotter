from django.conf import settings
from django.db import models

class Airport(models.Model):
    icao = models.CharField(max_length=4, unique=True)
    iata = models.CharField(max_length=3, blank=True)
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=120, blank=True)
    country = models.CharField(max_length=120, default="United Kingdom")
    lat = models.FloatField()
    lon = models.FloatField()

    def __str__(self):
        return f"{self.icao} – {self.name}"

class Frequency(models.Model):
    airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="frequencies")
    service = models.CharField(max_length=100)  # Tower, Ground, ATIS, Approach, Delivery, etc.
    mhz = models.DecimalField(max_digits=6, decimal_places=3)
    description = models.TextField(blank=True)

class SpottingLocation(models.Model):
    airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="spots")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    lat = models.FloatField()
    lon = models.FloatField()
    tips = models.TextField(blank=True)  # parking, lens, light, etc.

class Photo(models.Model):
    spot = models.ForeignKey(SpottingLocation, on_delete=models.CASCADE, related_name="photos")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(upload_to="spot_photos/")
    caption = models.CharField(max_length=200, blank=True)
    created = models.DateTimeField(auto_now_add=True)

class Aircraft(models.Model):
    registration = models.CharField(max_length=16, unique=True)  # e.g., G-EZTH
    type = models.CharField(max_length=50, blank=True)          # A320, B738, DH8D...
    airline = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)

class UserSeen(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="seen")
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name="seen_by")
    seen_at = models.DateTimeField(auto_now_add=True)
    airport = models.ForeignKey(Airport, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        unique_together = ("user", "aircraft")

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    airport = models.ForeignKey(Airport, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

class Badge(models.Model):
    code = models.CharField(max_length=50, unique=True)   # e.g., FIRST_SPOT, HUNDRED_SPOTS
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)

class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="badges")
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "badge")

