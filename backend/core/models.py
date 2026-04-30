"""
Django models for the release desk system, representing issues, releases, QA notes,
and deployment logs. Each model includes fields relevant to its purpose,
along with enumerations for standardized values.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.
class Issue(models.Model):
    """Represents an issue or ticket tracked in the release desk system."""

    class IssueType(models.TextChoices):
        """Enumeration for different types of issues."""
        BUG = 'bug', _('Bug')
        FEATURE = 'feature', _('Feature')
        SUPPORT = 'support', _('Support')

    class Priority(models.TextChoices):
        """Enumeration for issue priority levels."""
        LOW = 'low', _('Low')
        MEDIUM = 'medium', _('Medium')
        HIGH = 'high', _('High')
        CRITICAL = 'critical', _('Critical')

    class Status(models.TextChoices):
        """Enumeration for issue status."""
        NEW = 'new', _('New')
        IN_PROGRESS = 'in_progress', _('In Progress')
        QA_READY = 'qa_ready', _('QA Ready')
        VALIDATED = 'validated', _('Validated')
        RELEASED = 'released', _('Released')
        BLOCKED = 'blocked', _('Blocked')

    class Environment(models.TextChoices):
        """Enumeration for issue environment."""
        DEV = 'dev', _('Development')
        QA = 'qa', _('QA')
        PROD_TEST = 'prod_test', _('Production Testing')
        PRODUCTION = 'production', _('Production')

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    issue_type = models.CharField(max_length=20, choices=IssueType.choices, default=IssueType.BUG)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.LOW)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    reported_by = models.CharField(max_length=255)
    assigned_to = models.CharField(max_length=255, blank=True, null=True)
    environment = models.CharField(max_length=20, choices=Environment.choices,
                                   default=Environment.DEV)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.title)


class Release(models.Model):
    """Represents a release in the release desk system."""

    class ReleaseStatus(models.TextChoices):
        """Enumeration for release status."""
        PLANNED = 'planned', _('Planned')
        QA_TESTING = 'qa_testing', _('QA Testing')
        PROD_TEST = 'prod_test', _('Production Testing')
        DEPLOYED = 'deployed', _('Deployed')
        ROLLBACK_NEEDED = 'rollback_needed', _('Rollback Needed')

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    release_date = models.DateField()
    status = models.CharField(max_length=20, choices=ReleaseStatus.choices,
                              default=ReleaseStatus.PLANNED)
    summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.name)


class QANote(models.Model):
    """Represents a quality assurance note for an issue."""

    class Result(models.TextChoices):
        """Enumeration for QA note results."""
        PASS = 'pass', _('Pass')
        FAIL = 'fail', _('Fail')
        BLOCKED = 'blocked', _('Blocked')

    id = models.AutoField(primary_key=True)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='qa_notes')
    tester_name = models.CharField(max_length=255)
    result = models.CharField(max_length=20, choices=Result.choices, default=Result.BLOCKED)
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(f"QA Note for Issue: {self.issue.title} by {self.tester_name}") # pylint: disable=no-member

class DeploymentLog(models.Model):
    """Represents a deployment log entry for a release."""

    class Environment(models.TextChoices):
        """Enumeration for deployment environments."""
        QA = 'qa', _('QA')
        PROD_TEST = 'prod_test', _('Production Testing')
        PRODUCTION = 'production', _('Production')

    class Status(models.TextChoices):
        """Enumeration for deployment status."""
        STARTED = 'started', _('Started')
        SUCCESSFUL = 'successful', _('Successful')
        FAILED = 'failed', _('Failed')

    id = models.AutoField(primary_key=True)
    release = models.ForeignKey(Release, on_delete=models.CASCADE, related_name='deployment_logs')
    environment = models.CharField(max_length=20, choices=Environment.choices,
                                   default=Environment.QA)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.STARTED)
    notes = models.TextField()
    deployed_by = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(f"Deployment Log for Release: {self.release.name} to {self.environment}")
