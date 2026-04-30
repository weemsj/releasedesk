"""
Serializers for the core app.
"""
from rest_framework import serializers

from .models import DeploymentLog, Issue, QANote, Release


class IssueSerializer(serializers.ModelSerializer):
    """Serializer for the Issue model. Provides a way to convert
    Issue instances to and from JSON format."""
    class Meta:
        """Meta class for the IssueSerializer. Specifies the model
        and fields to be included in the serialization."""
        model = Issue
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class ReleaseSerializer(serializers.ModelSerializer):
    """Serializer for the Release model. Provides a way to convert
    Release instances to and from JSON format."""
    class Meta:
        """Meta class for the ReleaseSerializer. Specifies the model
        and fields to be included in the serialization."""
        model = Release
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class QANoteSerializer(serializers.ModelSerializer):
    """Serializer for the QANote model. Provides a way to convert
    QANote instances to and from JSON format."""
    issue = serializers.PrimaryKeyRelatedField(queryset=Issue.objects.all())
    class Meta:
        """Meta class for the QANoteSerializer. Specifies the model
        and fields to be included in the serialization."""
        model = QANote
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class DeploymentLogSerializer(serializers.ModelSerializer):
    """Serializer for the DeploymentLog model. Provides a way to convert
    DeploymentLog instances to and from JSON format."""
    release = serializers.PrimaryKeyRelatedField(queryset=Release.objects.all())
    class Meta:
        """Meta class for the DeploymentLogSerializer. Specifies the model
        and fields to be included in the serialization."""
        model = DeploymentLog
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

