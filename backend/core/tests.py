# Create your tests here.
from datetime import date

from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User, Group

from .models import Issue, Release, QANote, DeploymentLog

class AuthenticatedAPITestCase(APITestCase):
    """Base test case for API tests that require an authenticated app user."""

    def setUp(self):
        self.admin_group, _ = Group.objects.get_or_create(name="Admin")
        self.authenticated_user = User.objects.create_user(
            username="authenticated_admin",
            password="testpass123",
        )
        self.authenticated_user.groups.add(self.admin_group)
        self.client.force_login(self.authenticated_user)

class IssueAPITests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.issue = Issue.objects.create(
            title="Login button does not respond",
            description="Users cannot submit the login form in QA.",
            issue_type="bug",
            priority="high",
            status="new",
            reported_by="QA Analyst",
            assigned_to="Jacqueline",
            environment="qa",
        )

    def test_get_issue_list(self):
        response = self.client.get("/api/issues/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Login button does not respond")

    def test_get_issue_detail(self):
        response = self.client.get(f"/api/issues/{self.issue.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.issue.id)
        self.assertEqual(response.data["priority"], "high")

    def test_create_issue(self):
        payload = {
            "title": "Dashboard count is incorrect",
            "description": "Open issue count does not match the issue table.",
            "issue_type": "bug",
            "priority": "medium",
            "status": "new",
            "reported_by": "Product Owner",
            "assigned_to": "Jacqueline",
            "environment": "prod_test",
        }

        response = self.client.post("/api/issues/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Issue.objects.count(), 2)
        self.assertEqual(response.data["title"], payload["title"])
        self.assertEqual(response.data["environment"], "prod_test")

    def test_create_issue_requires_title(self):
        payload = {
            "title": "",
            "description": "Missing title should fail.",
            "issue_type": "bug",
            "priority": "medium",
            "status": "new",
            "reported_by": "QA Analyst",
            "assigned_to": "Jacqueline",
            "environment": "qa",
        }

        response = self.client.post("/api/issues/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_update_issue_with_patch(self):
        payload = {
            "status": "qa_ready",
            "priority": "critical",
        }

        response = self.client.patch(
            f"/api/issues/{self.issue.id}/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.issue.refresh_from_db()
        self.assertEqual(self.issue.status, "qa_ready")
        self.assertEqual(self.issue.priority, "critical")

    def test_delete_issue(self):
        response = self.client.delete(f"/api/issues/{self.issue.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Issue.objects.count(), 0)


class ReleaseAPITests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.release = Release.objects.create(
            name="May Internal Tools Release",
            release_date=date(2026, 5, 12),
            status="planned",
            summary="Release for internal web app updates.",
        )

    def test_get_release_list(self):
        response = self.client.get("/api/releases/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "May Internal Tools Release")

    def test_get_release_detail(self):
        response = self.client.get(f"/api/releases/{self.release.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.release.id)
        self.assertEqual(response.data["status"], "planned")

    def test_create_release(self):
        payload = {
            "name": "June Patch Release",
            "release_date": "2026-06-03",
            "status": "qa_testing",
            "summary": "Patch release for bug fixes and QA validation.",
        }

        response = self.client.post("/api/releases/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Release.objects.count(), 2)
        self.assertEqual(response.data["name"], payload["name"])
        self.assertEqual(response.data["status"], "qa_testing")

    def test_create_release_requires_name(self):
        payload = {
            "name": "",
            "release_date": "2026-06-03",
            "status": "planned",
            "summary": "Missing name should fail.",
        }

        response = self.client.post("/api/releases/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_update_release_with_patch(self):
        payload = {
            "status": "deployed",
            "summary": "Release successfully deployed to production.",
        }

        response = self.client.patch(
            f"/api/releases/{self.release.id}/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.release.refresh_from_db()
        self.assertEqual(self.release.status, "deployed")
        self.assertEqual(self.release.summary, "Release successfully deployed to production.")

    def test_delete_release(self):
        response = self.client.delete(f"/api/releases/{self.release.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Release.objects.count(), 0)


class QANoteAPITests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.issue = Issue.objects.create(
            title="Search results missing records",
            description="Search page does not return expected results.",
            issue_type="bug",
            priority="medium",
            status="qa_ready",
            reported_by="QA Analyst",
            assigned_to="Jacqueline",
            environment="qa",
        )

        self.qa_note = QANote.objects.create(
            issue=self.issue,
            tester_name="QA Analyst",
            result="pass",
            notes="Validated search results in QA.",
        )

    def test_get_qa_note_list(self):
        response = self.client.get("/api/qa-notes/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["tester_name"], "QA Analyst")

    def test_get_qa_note_detail(self):
        response = self.client.get(f"/api/qa-notes/{self.qa_note.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.qa_note.id)
        self.assertEqual(response.data["issue"], self.issue.id)

    def test_create_qa_note(self):
        payload = {
            "issue": self.issue.id,
            "tester_name": "Business User",
            "result": "fail",
            "notes": "Issue still occurs during user acceptance testing.",
        }

        response = self.client.post("/api/qa-notes/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(QANote.objects.count(), 2)
        self.assertEqual(response.data["issue"], self.issue.id)
        self.assertEqual(response.data["result"], "fail")

    def test_create_qa_note_requires_valid_issue(self):
        payload = {
            "issue": 99999,
            "tester_name": "QA Analyst",
            "result": "fail",
            "notes": "Invalid issue should fail.",
        }

        response = self.client.post("/api/qa-notes/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("issue", response.data)

    def test_update_qa_note_with_patch(self):
        payload = {
            "result": "fail",
            "notes": "Retest failed after additional validation.",
        }

        response = self.client.patch(
            f"/api/qa-notes/{self.qa_note.id}/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.qa_note.refresh_from_db()
        self.assertEqual(self.qa_note.result, "fail")
        self.assertEqual(self.qa_note.notes, "Retest failed after additional validation.")

    def test_delete_qa_note(self):
        response = self.client.delete(f"/api/qa-notes/{self.qa_note.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(QANote.objects.count(), 0)


class DeploymentLogAPITests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.release = Release.objects.create(
            name="May Internal Tools Release",
            release_date=date(2026, 5, 12),
            status="prod_test",
            summary="Release for internal web app updates.",
        )

        self.deployment_log = DeploymentLog.objects.create(
            release=self.release,
            environment="qa",
            status="started",
            notes="Started QA deployment.",
            deployed_by="Jacqueline",
        )

    def test_get_deployment_log_list(self):
        response = self.client.get("/api/deployment-logs/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["environment"], "qa")

    def test_get_deployment_log_detail(self):
        response = self.client.get(f"/api/deployment-logs/{self.deployment_log.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.deployment_log.id)
        self.assertEqual(response.data["release"], self.release.id)

    def test_create_deployment_log(self):
        payload = {
            "release": self.release.id,
            "environment": "production",
            "status": "successful",
            "notes": "Deployment completed successfully.",
            "deployed_by": "Jacqueline",
        }

        response = self.client.post("/api/deployment-logs/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DeploymentLog.objects.count(), 2)
        self.assertEqual(response.data["release"], self.release.id)
        self.assertEqual(response.data["status"], "successful")

    def test_create_deployment_log_requires_valid_release(self):
        payload = {
            "release": 99999,
            "environment": "qa",
            "status": "started",
            "notes": "Invalid release should fail.",
            "deployed_by": "Jacqueline",
        }

        response = self.client.post("/api/deployment-logs/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("release", response.data)

    def test_update_deployment_log_with_patch(self):
        payload = {
            "status": "successful",
            "notes": "QA deployment completed successfully.",
        }

        response = self.client.patch(
            f"/api/deployment-logs/{self.deployment_log.id}/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.deployment_log.refresh_from_db()
        self.assertEqual(self.deployment_log.status, "successful")
        self.assertEqual(self.deployment_log.notes, "QA deployment completed successfully.")

    def test_delete_deployment_log(self):
        response = self.client.delete(f"/api/deployment-logs/{self.deployment_log.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(DeploymentLog.objects.count(), 0)


class DashboardSummaryAPITests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.issue_open = Issue.objects.create(
            title="Open issue",
            description="Open issue description.",
            issue_type="bug",
            priority="medium",
            status="new",
            reported_by="QA Analyst",
            assigned_to="Jacqueline",
            environment="qa",
        )

        self.issue_critical = Issue.objects.create(
            title="Critical issue",
            description="Critical issue description.",
            issue_type="bug",
            priority="critical",
            status="blocked",
            reported_by="Product Owner",
            assigned_to="Jacqueline",
            environment="production",
        )

        self.issue_qa_ready = Issue.objects.create(
            title="QA ready issue",
            description="QA ready issue description.",
            issue_type="bug",
            priority="high",
            status="qa_ready",
            reported_by="QA Analyst",
            assigned_to="Jacqueline",
            environment="qa",
        )

        self.release = Release.objects.create(
            name="Upcoming Release",
            release_date=date(2026, 5, 20),
            status="planned",
            summary="Upcoming planned release.",
        )

        self.deployment_log = DeploymentLog.objects.create(
            release=self.release,
            environment="qa",
            status="successful",
            notes="QA deployment completed.",
            deployed_by="Jacqueline",
        )

    def test_dashboard_summary_returns_expected_keys(self):
        response = self.client.get("/api/dashboard-summary/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_keys = {
            "open_issues",
            "critical_issues",
            "qa_ready",
            "blocked",
            "upcoming_releases",
            "recent_deployments",
        }

        self.assertEqual(set(response.data.keys()), expected_keys)

    def test_dashboard_summary_counts_issues_and_releases(self):
        response = self.client.get("/api/dashboard-summary/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["open_issues"], 3)
        self.assertEqual(response.data["critical_issues"], 1)
        self.assertEqual(response.data["qa_ready"], 1)
        self.assertEqual(response.data["blocked"], 1)
        self.assertEqual(response.data["upcoming_releases"], 1)

    def test_dashboard_summary_includes_recent_deployments(self):
        response = self.client.get("/api/dashboard-summary/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["recent_deployments"]), 1)

        deployment = response.data["recent_deployments"][0]
        self.assertEqual(deployment["id"], self.deployment_log.id)
        self.assertEqual(deployment["release__name"], "Upcoming Release")
        self.assertEqual(deployment["environment"], "qa")
        self.assertEqual(deployment["status"], "successful")
        
class ReleaseReadinessAPITests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.prod_test_release = Release.objects.create(
            name="Prod Test Release",
            release_date=date(2026, 5, 20),
            status="prod_test",
            summary="Release currently in prod test."
        )
        self.planned_release = Release.objects.create(
            name="Planned Release",
            release_date=date(2026, 5, 25),
            status="planned",
            summary="Upcoming planned release.",
        )
        
        self.issue_critical = Issue.objects.create(
            title="Critical blocker",
            description="Critical issue blocking release.",
            issue_type="bug",
            priority="critical",
            status="blocked",
            reported_by="QA Analyst",
            assigned_to="Jacqueline",
            environment="prod_test",
        )

    def test_release_readiness_returns_expected_keys(self):
        response = self.client.get("/api/release-readiness/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_keys = {
            "planned_releases",
            "qa_testing_releases",
            "prod_test_releases",
            "deployed_releases",
            "rollback_needed_releases",
            "critical_issues",
            "blocked_issues",
            "release_blockers",
            "ready_for_release",
        }
        self.assertEqual(set(response.data.keys()), expected_keys)

    def test_release_readiness_counts_release_statuses_and_blockers(self):
        response = self.client.get("/api/release-readiness/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["planned_releases"], 1)
        self.assertEqual(response.data["qa_testing_releases"], 0)
        self.assertEqual(response.data["prod_test_releases"], 1)
        self.assertEqual(response.data["deployed_releases"], 0)
        self.assertEqual(response.data["rollback_needed_releases"], 0)
        self.assertEqual(response.data["critical_issues"], 1)
        self.assertEqual(response.data["blocked_issues"], 1)
        self.assertEqual(response.data["release_blockers"], 2)
        self.assertFalse(response.data["ready_for_release"])

    def test_release_readiness_true_when_no_blockers_and_release_in_prod_test(self):
        Issue.objects.all().delete()
        response = self.client.get("/api/release-readiness/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["critical_issues"], 0)
        self.assertEqual(response.data["blocked_issues"], 0)
        self.assertEqual(response.data["release_blockers"], 0)
        self.assertTrue(response.data["ready_for_release"])

class RBACSessionAuthTests(APITestCase):
    def setUp(self):
        self.admin_group = Group.objects.create(name="Admin")
        self.developer_group = Group.objects.create(name="Developer")
        self.qa_group = Group.objects.create(name="QA")
        self.viewer_group = Group.objects.create(name="Viewer")

        self.admin_user = User.objects.create_user(
            username="adminuser",
            password="testpass123",
        )
        self.admin_user.groups.add(self.admin_group)

        self.developer_user = User.objects.create_user(
            username="developeruser",
            password="testpass123",
        )
        self.developer_user.groups.add(self.developer_group)

        self.qa_user = User.objects.create_user(
            username="qauser",
            password="testpass123",
        )
        self.qa_user.groups.add(self.qa_group)

        self.viewer_user = User.objects.create_user(
            username="vieweruser",
            password="testpass123",
        )
        self.viewer_user.groups.add(self.viewer_group)

        self.issue = Issue.objects.create(
            title="RBAC test issue",
            description="Issue used for RBAC tests.",
            issue_type="bug",
            priority="medium",
            status="new",
            reported_by="QA Analyst",
            assigned_to="Jacqueline",
            environment="qa",
        )

        self.release = Release.objects.create(
            name="RBAC Test Release",
            release_date=date(2026, 5, 20),
            status="planned",
            summary="Release used for RBAC tests.",
        )

    def test_unauthenticated_user_cannot_access_issues(self):
        response = self.client.get("/api/issues/")

        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
        )

    def test_viewer_can_read_issues(self):
        self.client.force_login(self.viewer_user)

        response = self.client.get("/api/issues/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_viewer_cannot_create_issue(self):
        self.client.force_login(self.viewer_user)

        payload = {
            "title": "Viewer should not create",
            "description": "Viewer should receive forbidden.",
            "issue_type": "bug",
            "priority": "medium",
            "status": "new",
            "reported_by": "Viewer",
            "assigned_to": "Jacqueline",
            "environment": "qa",
        }

        response = self.client.post("/api/issues/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_developer_can_create_issue(self):
        self.client.force_login(self.developer_user)

        payload = {
            "title": "Developer-created issue",
            "description": "Developer should be allowed to create issues.",
            "issue_type": "bug",
            "priority": "medium",
            "status": "new",
            "reported_by": "Developer",
            "assigned_to": "Jacqueline",
            "environment": "qa",
        }

        response = self.client.post("/api/issues/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_developer_cannot_delete_issue(self):
        self.client.force_login(self.developer_user)

        response = self.client.delete(f"/api/issues/{self.issue.id}/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_delete_issue(self):
        self.client.force_login(self.admin_user)

        response = self.client.delete(f"/api/issues/{self.issue.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_qa_can_create_qa_note(self):
        self.client.force_login(self.qa_user)

        payload = {
            "issue": self.issue.id,
            "tester_name": "QA User",
            "result": "pass",
            "notes": "QA user should be allowed to create QA notes.",
        }

        response = self.client.post("/api/qa-notes/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_qa_cannot_create_release(self):
        self.client.force_login(self.qa_user)

        payload = {
            "name": "QA should not create release",
            "release_date": "2026-06-01",
            "status": "planned",
            "summary": "QA should receive forbidden.",
        }

        response = self.client.post("/api/releases/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_session_user_returns_logged_in_user_and_roles(self):
        self.client.force_login(self.developer_user)

        response = self.client.get("/api/session-user/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "developeruser")
        self.assertIn("Developer", response.data["roles"])

    def test_login_with_invalid_credentials_fails(self):
        response = self.client.post(
            "/api/login/",
            {"username": "baduser", "password": "badpass"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_valid_credentials_succeeds(self):
        response = self.client.post(
            "/api/login/",
            {"username": "developeruser", "password": "testpass123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "developeruser")
        self.assertIn("Developer", response.data["roles"])     