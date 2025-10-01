from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ForumTopic",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(max_length=64, unique=True)),
                ("title", models.CharField(max_length=120)),
                ("description", models.TextField(blank=True)),
                ("order", models.PositiveIntegerField(default=0)),
            ],
            options={"ordering": ("order", "title")},
        ),
        migrations.AddField(
            model_name="post",
            name="topic",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="posts", to="core.forumtopic"),
        ),
        migrations.CreateModel(
            name="Challenge",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(max_length=60, unique=True)),
                ("title", models.CharField(max_length=150)),
                ("description", models.TextField()),
                ("start", models.DateField()),
                ("end", models.DateField()),
                ("target_count", models.PositiveIntegerField(default=1)),
                ("badge_reward", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to="core.badge")),
            ],
            options={"ordering": ("-start",)},
        ),
        migrations.CreateModel(
            name="UserChallengeProgress",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("progress", models.PositiveIntegerField(default=0)),
                ("completed", models.BooleanField(default=False)),
                ("last_updated", models.DateTimeField(auto_now=True)),
                ("challenge", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="participants", to="core.challenge")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="challenges", to=settings.AUTH_USER_MODEL)),
            ],
            options={"unique_together": {("user", "challenge")}},
        ),
    ]
