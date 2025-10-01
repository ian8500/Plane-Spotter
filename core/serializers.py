from rest_framework import serializers
from .models import (
    Airport,
    Frequency,
    SpottingLocation,
    AirportResource,
    Photo,
    Aircraft,
    UserSeen,
    Post,
    Comment,
    Badge,
    UserBadge,
)

class FrequencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Frequency
        fields = "__all__"

class SpottingLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpottingLocation
        fields = "__all__"

class AirportResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirportResource
        fields = "__all__"

class AirportSerializer(serializers.ModelSerializer):
    frequencies = FrequencySerializer(many=True, read_only=True)
    spots = SpottingLocationSerializer(many=True, read_only=True)
    resources = AirportResourceSerializer(many=True, read_only=True)
    class Meta:
        model = Airport
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
    class Meta:
        model = Post
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = "__all__"

class UserBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBadge
        fields = "__all__"

