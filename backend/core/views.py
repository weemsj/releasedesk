"""
Views for the core app, including API endpoints for issues, releases, QA notes,
deployment logs, and dashboard summary.
"""
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Issue, Release, QANote, DeploymentLog
from .serializers import IssueSerializer, ReleaseSerializer, QANoteSerializer, DeploymentLogSerializer

# Create your views here.
class IssueViewSet(viewsets.ModelViewSet):
    """ViewSet for managing issues in the release desk system. Provides CRUD operations"""
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class ReleaseViewSet(viewsets.ModelViewSet):
    """ViewSet for managing releases in the release desk system. Provides CRUD operations"""
    queryset = Release.objects.all()
    serializer_class = ReleaseSerializer

class QANoteViewSet(viewsets.ModelViewSet):
    """ViewSet for managing QA notes in the release desk system. Provides CRUD operations"""
    queryset = QANote.objects.all()
    serializer_class = QANoteSerializer

class DeploymentLogViewSet(viewsets.ModelViewSet):
    """ViewSet for managing deployment logs in the release desk system. Provides CRUD operations"""
    queryset = DeploymentLog.objects.all()
    serializer_class = DeploymentLogSerializer
    
class DashboardSummary(APIView):
    """API view for providing a summary of the dashboard metrics."""

    def get(self, request):
        """Returns a summary of key metrics for the dashboard,
        including counts of open issues, critical issues, QA ready issues, blocked issues,
        upcoming releases, and recent deployments."""

        today = timezone.now().date()
        open_statuses = [
            Issue.Status.NEW,
            Issue.Status.IN_PROGRESS,
            Issue.Status.QA_READY,
            Issue.Status.BLOCKED,
        ]

        summary = {
            'open_issues': Issue.objects.filter(status__in=open_statuses).count(),
            "critical_issues": Issue.objects.filter(priority=Issue.Priority.CRITICAL).count(),
            'qa_ready': Issue.objects.filter(status=Issue.Status.QA_READY).count(),
            'blocked': Issue.objects.filter(status=Issue.Status.BLOCKED).count(),
            'upcoming_releases': Release.objects.filter(release_date__gte=today).exclude(
                status=Release.ReleaseStatus.DEPLOYED).count(),
            'recent_deployments': DeploymentLog.objects.order_by('-created_at')[:5].values(
                'id',
                'release__name',
                'environment',
                'status',
                'deployed_by',
                'created_at',
                ),
        }
        return Response(summary)
