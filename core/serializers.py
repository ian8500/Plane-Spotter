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
    class Meta:
        model = Challenge
        fields = "__all__"


class UserChallengeProgressSerializer(serializers.ModelSerializer):
    user_display = serializers.SerializerMethodField()
    challenge_title = serializers.CharField(source="challenge.title", read_only=True)

    class Meta:
        model = UserChallengeProgress
        fields = "__all__"

    def get_user_display(self, obj):
        username_field = getattr(User, "USERNAME_FIELD", "username")
        return getattr(obj.user, username_field, str(obj.user))

