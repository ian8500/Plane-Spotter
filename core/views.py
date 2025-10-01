from django.db.models import Count
from rest_framework import viewsets, permissions, response, views
from .models import (
    Airport,
    Frequency,
    SpottingLocation,
    Photo,
    Aircraft,
    UserSeen,
    Post,
    Comment,
    Badge,
    UserBadge,
    ForumTopic,
    Challenge,
    UserChallengeProgress,
)
from .serializers import (AirportSerializer, FrequencySerializer, SpottingLocationSerializer, PhotoSerializer,
                          AircraftSerializer, UserSeenSerializer, PostSerializer, CommentSerializer,
                          BadgeSerializer, UserBadgeSerializer, ForumTopicSerializer,
                          ChallengeSerializer, UserChallengeProgressSerializer)

class AirportViewSet(viewsets.ModelViewSet):
    """Expose airports with their related frequencies and spotting locations."""

    queryset = (
        Airport.objects.all()
        .prefetch_related("frequencies", "spots")
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
    queryset = UserSeen.objects.all()
    serializer_class = UserSeenSerializer
    permission_classes = [permissions.IsAuthenticated]

class ForumTopicViewSet(viewsets.ModelViewSet):
    queryset = ForumTopic.objects.all()
    serializer_class = ForumTopicSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PostViewSet(viewsets.ModelViewSet):
    queryset = (
        Post.objects.select_related("user", "airport", "topic")
        .annotate(comment_count=Count("comments"))
        .order_by("-created")
    )
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


class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class UserChallengeProgressViewSet(viewsets.ModelViewSet):
    queryset = UserChallengeProgress.objects.select_related("challenge", "user").all()
    serializer_class = UserChallengeProgressSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommunityFeedView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        posts = (
            Post.objects.select_related("user", "airport", "topic")
            .annotate(comment_count=Count("comments"))
            .order_by("-created")[:10]
        )
        badges = UserBadge.objects.select_related("user", "badge").order_by("-awarded_at")[:10]

        events = []

        for post in posts:
            events.append(
                {
                    "type": "post",
                    "timestamp": post.created,
                    "payload": PostSerializer(post, context={"request": request}).data,
                }
            )

        for badge in badges:
            events.append(
                {
                    "type": "badge_awarded",
                    "timestamp": badge.awarded_at,
                    "payload": UserBadgeSerializer(badge, context={"request": request}).data,
                }
            )

        events.sort(key=lambda item: item["timestamp"], reverse=True)

        for event in events:
            event["timestamp"] = event["timestamp"].isoformat()

        return response.Response(events[:20])

