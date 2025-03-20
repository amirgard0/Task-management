from rest_framework import serializers
from .models import *
from authentication.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class NormalTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalTask
        fields = ("id", "name", "is_done")
        
class ProjectTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTask
        fields = ("__all__")

class ProjectSerializer(serializers.ModelSerializer):
    users = serializers.ListField(
        child=serializers.CharField(), write_only=True
    )
    users_detail = serializers.SerializerMethodField(read_only=True)
    # tasks = ProjectTaskSerializer(many=True, read_only=True)
    class Meta:
        model = Project
        # fields = ("id", "name", "description", "dead_line", "users", "users_detail", "creator_id", "tasks")
        fields = ("id", "name", "description", "dead_line", "users", "users_detail", "creator_id",)
        read_only_fields = ("creator_id",)
        
    def get_users_detail(self, instance: Project):
        names = []
        for i in instance.users.all():
            i: User
            names.append({"username": i.username, "id": i.pk})
        return names

    def validate(self, attrs):
        if  attrs.get('users'):
            for i in attrs.get("users"):
                if not User.objects.filter(username=i).exists():
                    raise serializers.ValidationError(f"User {i} not found")
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user_usernames = validated_data.pop("users")
        project = self.Meta.model.objects.create(**validated_data)
        for username in user_usernames:
            user = User.objects.get(username=username)
            project.users.add(user)
        return project

    def update(self, instance, validated_data: dict):
        user_usernames = validated_data.pop("users", None)
        instance = super().update(instance, validated_data)
        if user_usernames is not None:
            instance.users.clear()
            for username in user_usernames:
                user = User.objects.get(username=username)
                instance.users.add(user)
        return instance
