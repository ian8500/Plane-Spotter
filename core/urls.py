from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (AirportViewSet, FrequencyViewSet, SpottingLocationViewSet, PhotoViewSet,
                    AircraftViewSet, UserSeenViewSet, PostViewSet, CommentViewSet,
                    BadgeViewSet, UserBadgeViewSet, LiveFleetView)

router = DefaultRouter()
router.register(r"airports", AirportViewSet)
router.register(r"frequencies", FrequencyViewSet)
router.register(r"spots", SpottingLocationViewSet)
router.register(r"photos", PhotoViewSet)
router.register(r"aircraft", AircraftViewSet)
router.register(r"seen", UserSeenViewSet)
router.register(r"posts", PostViewSet)
router.register(r"comments", CommentViewSet)
router.register(r"badges", BadgeViewSet)
router.register(r"userbadges", UserBadgeViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("fleet/live/", LiveFleetView.as_view(), name="live-fleet"),
]

