"""
Views for the core app, including API endpoints for issues, releases, QA notes,
deployment logs, and dashboard summary.
"""
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import Group
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .models import Issue, Release, QANote, DeploymentLog
from .serializers import IssueSerializer, ReleaseSerializer, QANoteSerializer, DeploymentLogSerializer
from .permissions import (
    IssuePermission,
    ReleasePermission,
    QANotePermission,
    DeploymentLogPermission,
    DashboardPermission,
)

# Create your views here.
class IssueViewSet(viewsets.ModelViewSet):
    """ViewSet for managing issues in the release desk system. Provides CRUD operations"""
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IssuePermission]

class ReleaseViewSet(viewsets.ModelViewSet):
    """ViewSet for managing releases in the release desk system. Provides CRUD operations"""
    queryset = Release.objects.all()
    serializer_class = ReleaseSerializer
    permission_classes = [ReleasePermission]

class QANoteViewSet(viewsets.ModelViewSet):
    """ViewSet for managing QA notes in the release desk system. Provides CRUD operations"""
    queryset = QANote.objects.all()
    serializer_class = QANoteSerializer
    permission_classes = [QANotePermission]

class DeploymentLogViewSet(viewsets.ModelViewSet):
    """ViewSet for managing deployment logs in the release desk system. Provides CRUD operations"""
    queryset = DeploymentLog.objects.all()
    serializer_class = DeploymentLogSerializer
    permission_classes = [DeploymentLogPermission]

class DashboardSummary(APIView):
    """API view for providing a summary of the dashboard metrics."""
    permission_classes = [DashboardPermission]

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

@api_view(['GET'])
@permission_classes([DashboardPermission])
def release_readiness(request):
    """Return a quick summary of release readiness using existing Issue and Release data."""

    # release table data
    planned_releases = Release.objects.filter(status="planned").count()
    qa_testing_releases = Release.objects.filter(status="qa_testing").count()
    prod_test_releases = Release.objects.filter(status="prod_test").count()
    deployed_releases = Release.objects.filter(status="deployed").count()
    rollback_needed_releases = Release.objects.filter(status="rollback_needed").count()
    # issue table data
    critical_issues = Issue.objects.filter(priority="critical").count()
    blocked_issues = Issue.objects.filter(status="blocked").count()
    release_blockers = critical_issues + blocked_issues

    ready_for_release = (
        release_blockers == 0
        and rollback_needed_releases == 0
        and prod_test_releases > 0
    )

    return Response({
        "planned_releases": planned_releases,
        "qa_testing_releases": qa_testing_releases,
        "prod_test_releases": prod_test_releases,
        "deployed_releases": deployed_releases,
        "rollback_needed_releases": rollback_needed_releases,
        "critical_issues": critical_issues,
        "blocked_issues": blocked_issues,
        "release_blockers": release_blockers,
        "ready_for_release": ready_for_release,
    })

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token(request):
    """Endpoint to retrieve the CSRF token for authenticated requests."""
    token = get_token(request)
    return Response({'csrfToken': token})

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Endpoint for user login. Authenticates the user and returns a success message."""
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'message': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST,)
    login(request, user)
    roles = list(user.groups.values_list('name', flat=True))
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "roles": roles,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
        })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Endpoint for user logout. Logs out the user and returns a success message."""
    logout(request)
    return Response({'message': 'Logged out successfully'})

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def session_user(request):
    """Endpoint to retrieve the current authenticated user's information."""
    user = request.user
    if request.method == 'PATCH':
        username = request.data.get("username")
        email = request.data.get("email")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        
        if username:
            user.username = username
        if email is not None:
            user.email = email
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        user.save()
        
    roles = list(user.groups.values_list('name', flat=True))
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "roles": roles,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    })
