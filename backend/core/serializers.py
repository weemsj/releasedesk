"""
Serializers for the core app.
"""
from rest_framework import serializers

from .models import DeploymentLog, Issue, QANote, Release


class IssueSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the Issue model. Provides a way to convert
    Issue instances to and from JSON format."""
    class Meta:
        """Meta class for the IssueSerializer. Specifies the model
        and fields to be included in the serialization."""
        model = Issue
        fields = '__all__'

class ReleaseSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the Release model. Provides a way to convert
    Release instances to and from JSON format."""
    class Meta:
        """Meta class for the ReleaseSerializer. Specifies the model
        and fields to be included in the serialization."""
        model = Release
        fields = '__all__'

class QANoteSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the QANote model. Provides a way to convert
    QANote instances to and from JSON format."""
    class Meta:
        """Meta class for the QANoteSerializer. Specifies the model
        and fields to be included in the serialization."""
        model = QANote
        fields = '__all__'

class DeploymentLogSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the DeploymentLog model. Provides a way to convert
    DeploymentLog instances to and from JSON format."""
    class Meta:
        """Meta class for the DeploymentLogSerializer. Specifies the model
        and fields to be included in the serialization."""
        model = DeploymentLog
        fields = '__all__'

class DashboardSummarySerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the DashboardSummary model. Provides a way to convert
    DashboardSummary instances to and from JSON format."""
    class Meta:
        """Meta class for the DashboardSummarySerializer. Specifies the model
        and fields to be included in the serialization."""
        model = Issue
        fields = ['priority', 'status']
