from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from .models import (
    Airport,
    Badge,
    Challenge,
    ForumTopic,
    Post,
    UserBadge,
    UserChallengeProgress,
)
from .serializers import UserChallengeProgressSerializer


class CommunityFeedViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user("spotter", "spotter@example.com", "password123")
        self.topic = ForumTopic.objects.create(slug="general", title="General Chat")
        self.airport = Airport.objects.create(
            icao="EGLL",
            iata="LHR",
            name="Heathrow",
            city="London",
            country="United Kingdom",
            lat=51.47,
            lon=-0.4543,
        )
        self.post = Post.objects.create(user=self.user, title="First trip", body="Loved the spotting weekend!", topic=self.topic, airport=self.airport)
        self.badge = Badge.objects.create(code="FIRST_POST", name="First Post", description="Shared your first post")
        UserBadge.objects.create(user=self.user, badge=self.badge)

    def test_feed_returns_posts_and_badges(self):
        url = reverse("community-feed")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(any(item["type"] == "post" for item in payload))
        self.assertTrue(any(item["type"] == "badge_awarded" for item in payload))
        post_event = next(item for item in payload if item["type"] == "post")
        self.assertEqual(post_event["payload"]["comment_count"], 0)
        self.assertEqual(post_event["payload"]["topic"], self.topic.id)


class ChallengeSerializerTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user("player", "player@example.com", "strongpass")
        self.badge = Badge.objects.create(code="WEEKEND_SPOT", name="Weekend Warrior")
        self.challenge = Challenge.objects.create(
            code="WEEKEND",
            title="Weekend Spotting Sprint",
            description="Log five aircraft over the weekend",
            start=date.today(),
            end=date.today() + timedelta(days=2),
            target_count=5,
            badge_reward=self.badge,
        )
        self.progress = UserChallengeProgress.objects.create(user=self.user, challenge=self.challenge, progress=2)

    def test_user_challenge_progress_serializer_enriches_fields(self):
        data = UserChallengeProgressSerializer(self.progress).data
        self.assertEqual(data["challenge_title"], self.challenge.title)
        self.assertEqual(data["user_display"], self.user.username)
