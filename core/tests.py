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
from .serializers import ChallengeSerializer, UserChallengeProgressSerializer


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
        self.challenge = Challenge.objects.create(
            code="FIRST_WEEK",
            title="First Week Challenge",
            description="Share a post in your first week",
            start=date.today() - timedelta(days=1),
            end=date.today() + timedelta(days=6),
            target_count=1,
        )
        self.progress = UserChallengeProgress.objects.create(
            user=self.user,
            challenge=self.challenge,
            progress=1,
        )

    def test_feed_returns_posts_and_badges(self):
        url = reverse("community-feed")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(any(item["type"] == "post" for item in payload))
        self.assertTrue(any(item["type"] == "badge_awarded" for item in payload))
        self.assertTrue(any(item["type"] == "challenge_completed" for item in payload))
        post_event = next(item for item in payload if item["type"] == "post")
        self.assertEqual(post_event["payload"]["comment_count"], 0)
        self.assertEqual(post_event["payload"]["topic"], self.topic.id)
        challenge_event = next(item for item in payload if item["type"] == "challenge_completed")
        self.assertEqual(challenge_event["payload"]["challenge"], self.challenge.id)
        self.assertEqual(challenge_event["payload"]["completed"], True)


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
        self.assertIn("is_active", data)
        self.assertIn("progress_percentage", data)
        self.assertTrue(data["is_active"])
        self.assertEqual(data["progress_percentage"], 40)

    def test_challenge_serializer_marks_active_and_remaining_days(self):
        serialized = ChallengeSerializer(self.challenge).data
        self.assertTrue(serialized["is_active"])
        self.assertGreaterEqual(serialized["days_remaining"], 0)


class UserChallengeProgressModelTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user("loop", "loop@example.com", "strongpass")
        self.challenge = Challenge.objects.create(
            code="MONTHLY",
            title="Monthly Marathon",
            description="Log ten aircraft in a month",
            start=date.today() - timedelta(days=1),
            end=date.today() + timedelta(days=28),
            target_count=3,
        )

    def test_completed_flag_updates_when_progress_meets_target(self):
        progress = UserChallengeProgress.objects.create(user=self.user, challenge=self.challenge, progress=3)
        self.assertTrue(progress.completed)

    def test_completed_flag_can_revert_when_progress_drops(self):
        progress = UserChallengeProgress.objects.create(user=self.user, challenge=self.challenge, progress=3)
        progress.refresh_from_db()
        progress.progress = 1
        progress.save()
        progress.refresh_from_db()
        self.assertFalse(progress.completed)


class EngagementSummaryViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user("writer", "writer@example.com", "password123")
        self.topic = ForumTopic.objects.create(slug="news", title="News")
        self.airport = Airport.objects.create(
            icao="EGCC",
            iata="MAN",
            name="Manchester",
            city="Manchester",
            country="United Kingdom",
            lat=53.365,
            lon=-2.2727,
        )
        for _ in range(3):
            Post.objects.create(user=self.user, title="Update", body="Big movements", topic=self.topic, airport=self.airport)
        badge = Badge.objects.create(code="ACTIVE", name="Staying Active")
        UserBadge.objects.create(user=self.user, badge=badge)
        self.challenge = Challenge.objects.create(
            code="DAILY",
            title="Daily Diary",
            description="Share daily updates",
            start=date.today() - timedelta(days=2),
            end=date.today() + timedelta(days=5),
            target_count=1,
        )

    def test_engagement_summary_highlights_trends(self):
        url = reverse("community-engagement")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("trending_topics", payload)
        self.assertTrue(payload["trending_topics"])
        self.assertEqual(payload["trending_topics"][0]["slug"], "news")
        self.assertTrue(payload["active_challenges"])
        challenge_payload = payload["active_challenges"][0]
        self.assertIn("is_active", challenge_payload)
        self.assertTrue(payload["recent_badges"])
