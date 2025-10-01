from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Airport, Frequency, SpottingLocation, Photo, Aircraft, UserSeen, Post, Comment, Badge, UserBadge
from .serializers import (AirportSerializer, FrequencySerializer, SpottingLocationSerializer, PhotoSerializer,
                          AircraftSerializer, UserSeenSerializer, PostSerializer, CommentSerializer,
                          BadgeSerializer, UserBadgeSerializer)
from .services.aircraft_feed import AircraftFeedError, fetch_live_fleet

class AirportViewSet(viewsets.ModelViewSet):
    """Expose airports with their related frequencies and spotting locations."""

    queryset = (
        Airport.objects.all()
        .prefetch_related("frequencies", "spots", "resources")
        .order_by("icao")
    )
    serializer_class = AirportSerializer
    permission_classes = [permissions.AllowAny]

class FrequencyViewSet(viewsets.ModelViewSet):
    queryset = Frequency.objects.all()
    serializer_class = FrequencySerializer
    permission_classes = [permissions.AllowAny]

class SpottingLocationViewSet(viewsets.ModelViewSet):
    queryset = SpottingLocation.objects.select_related("airport").all()
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
    serializer_class = UserSeenSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            UserSeen.objects.filter(user=self.request.user)
            .select_related("aircraft", "airport")
            .order_by("-seen_at")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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


class LiveFleetView(APIView):
    """Expose a live view of the global aircraft fleet using the configured feed."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        params = request.query_params
        registration = params.get("registration")
        country = params.get("country")
        try:
            limit = int(params.get("limit", 0) or 0)
        except ValueError:
            return Response({"detail": "limit must be numeric"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            results = fetch_live_fleet(
                registration=registration,
                country=country,
                limit=limit or None,
            )
        except AircraftFeedError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response(
            {
                "count": len(results),
                "results": results,
                "filters": {
                    "registration": registration,
                    "country": country,
                },
            }
        )

