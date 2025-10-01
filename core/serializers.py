from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

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
    aircraft = AircraftSerializer(read_only=True)
    aircraft_id = serializers.PrimaryKeyRelatedField(
        queryset=Aircraft.objects.all(),
        source="aircraft",
        write_only=True,
        required=False,
    )
    registration = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = UserSeen
        fields = [
            "id",
            "aircraft",
            "aircraft_id",
            "registration",
            "airport",
            "seen_at",
        ]
        read_only_fields = ["id", "aircraft", "seen_at"]

    def validate(self, attrs):
        attrs = super().validate(attrs)
        registration = attrs.pop("registration", None)
        if registration is None:
            registration = self.initial_data.get("registration")
        aircraft = attrs.get("aircraft")

        if aircraft is None and registration:
            registration = registration.strip()
            if not registration:
                raise serializers.ValidationError(
                    {"registration": _("Registration cannot be blank.")}
                )
            try:
                attrs["aircraft"] = Aircraft.objects.get(
                    registration__iexact=registration
                )
            except Aircraft.DoesNotExist as exc:
                raise serializers.ValidationError(
                    {"registration": _("Unknown aircraft registration.")}
                ) from exc
        elif aircraft is None:
            raise serializers.ValidationError(
                {"aircraft": _("Select an aircraft or provide a registration.")}
            )

        return attrs

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

