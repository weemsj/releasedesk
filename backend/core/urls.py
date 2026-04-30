"""
URL configuration for the core app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    IssueViewSet,
    ReleaseViewSet,
    QANoteViewSet,
    DeploymentLogViewSet,
    DashboardSummary,
)

router = DefaultRouter()
router.register(r"issues", IssueViewSet)
router.register(r"releases", ReleaseViewSet)
router.register(r"qa-notes", QANoteViewSet)
router.register(r"deployment-logs", DeploymentLogViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard-summary/", DashboardSummary.as_view(), name="dashboard-summary"),
]