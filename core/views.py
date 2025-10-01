from rest_framework import viewsets, permissions
from .models import Airport, Frequency, SpottingLocation, Photo, Aircraft, UserSeen, Post, Comment, Badge, UserBadge
from .serializers import (AirportSerializer, FrequencySerializer, SpottingLocationSerializer, PhotoSerializer,
                          AircraftSerializer, UserSeenSerializer, PostSerializer, CommentSerializer,
                          BadgeSerializer, UserBadgeSerializer)

class AirportViewSet(viewsets.ModelViewSet):
    queryset = Airport.get_queryset().order_by("icao") if hasattr(Airport, "get_queryset") else Airport.objects.all().order_by("icao")
    serializer_class = AirportSerializer
    permission_classes = [permissions.AllowAny]

class FrequencyViewSet(viewsets.ModelViewSet):
    queryset = Frequency.objects.all()
    serializer_class = FrequencySerializer
    permission_classes = [permissions.AllowAny]

class SpottingLocationViewSet(viewsets.ModelViewSet):
    queryset = SpottingLocation.objects.all()
    serializer_class = SpottingLocationSerializer
    permission_classes = [permissions.AllowAny]

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class AircraftViewSet(viewsets.ModelViewSet):
    queryset = Aircraft.objects.all().order_by("registration")
    serializer_class = AircraftSerializer
    permission_classes = [permissions.AllowAny]

class UserSeenViewSet(viewsets.ModelViewSet):
    queryset = UserSeen.objects.all()
    serializer_class = UserSeenSerializer
    permission_classes = [permissions.IsAuthenticated]

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("-created")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by("created")
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UserBadgeViewSet(viewsets.ModelViewSet):
    queryset = UserBadge.objects.all()
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

