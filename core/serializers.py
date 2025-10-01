from rest_framework import serializers
from django.contrib.auth import get_user_model
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


User = get_user_model()

class FrequencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Frequency
        fields = "__all__"

class SpottingLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpottingLocation
        fields = "__all__"

class AirportSerializer(serializers.ModelSerializer):
    frequencies = FrequencySerializer(many=True, read_only=True)
    spots = SpottingLocationSerializer(many=True, read_only=True)
    class Meta:
        model = Airport
        fields = "__all__"


class ForumTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumTopic
        fields = "__all__"


class ForumTopicSummarySerializer(serializers.ModelSerializer):
    recent_posts = serializers.IntegerField(read_only=True)

    class Meta:
        model = ForumTopic
        fields = ("id", "slug", "title", "description", "order", "recent_posts")

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = "__all__"

class AircraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aircraft
        fields = "__all__"

class UserSeenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSeen
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    user_display = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    topic = serializers.PrimaryKeyRelatedField(queryset=ForumTopic.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Post
        fields = "__all__"

    def get_user_display(self, obj):
        username_field = getattr(User, "USERNAME_FIELD", "username")
        return getattr(obj.user, username_field, str(obj.user))

    def get_comment_count(self, obj):
        return getattr(obj, "comment_count", obj.comments.count())

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = "__all__"

class UserBadgeSerializer(serializers.ModelSerializer):
    user_display = serializers.SerializerMethodField()
    badge_name = serializers.CharField(source="badge.name", read_only=True)

    class Meta:
        model = UserBadge
        fields = "__all__"

    def get_user_display(self, obj):
        username_field = getattr(User, "USERNAME_FIELD", "username")
        return getattr(obj.user, username_field, str(obj.user))


class ChallengeSerializer(serializers.ModelSerializer):
    is_active = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Challenge
        fields = (
            "id",
            "code",
            "title",
            "description",
            "start",
            "end",
            "target_count",
            "badge_reward",
            "is_active",
            "days_remaining",
        )

    def get_is_active(self, obj):
        return obj.is_active

    def get_days_remaining(self, obj):
        return obj.days_remaining


class UserChallengeProgressSerializer(serializers.ModelSerializer):
    user_display = serializers.SerializerMethodField()
    challenge_title = serializers.CharField(source="challenge.title", read_only=True)
    is_active = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = UserChallengeProgress
        fields = (
            "id",
            "user",
            "challenge",
            "progress",
            "completed",
            "last_updated",
            "user_display",
            "challenge_title",
            "is_active",
            "progress_percentage",
        )

    def get_user_display(self, obj):
        username_field = getattr(User, "USERNAME_FIELD", "username")
        return getattr(obj.user, username_field, str(obj.user))

    def get_is_active(self, obj):
        return obj.challenge.is_active

    def get_progress_percentage(self, obj):
        target = obj.challenge.target_count or 0
        if target == 0:
            return 100
        return min(int((obj.progress / target) * 100), 100)

