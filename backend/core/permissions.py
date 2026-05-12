from rest_framework.permissions import BasePermission, SAFE_METHODS


def user_in_group(user, group_name):
    return user.is_authenticated and user.groups.filter(name=group_name).exists()

def user_has_any_group(user, group_names):
    return user.is_authenticated and user.groups.filter(name__in=group_names).exists()

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or user_in_group(request.user, "Admin")

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_superuser or user_in_group(request.user, "Admin")

class IssuePermission(BasePermission):
    """
    Issue access:
    - Admin: full access
    - Developer: create/update issues, read issues
    - QA: read issues
    - Viewer: read only
    """

    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        if user.is_superuser or user_in_group(user, "Admin"):
            return True

        if request.method in SAFE_METHODS:
            return user_has_any_group(user, ["Developer", "QA", "Viewer"])

        if request.method in ["POST", "PUT", "PATCH"]:
            return user_has_any_group(user, ["Developer"])

        if request.method == "DELETE":
            return False

        return False


class ReleasePermission(BasePermission):
    """
    Release access:
    - Admin: full access
    - Developer: create/update releases, read releases
    - QA: read releases
    - Viewer: read only
    """

    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        if user.is_superuser or user_in_group(user, "Admin"):
            return True

        if request.method in SAFE_METHODS:
            return user_has_any_group(user, ["Developer", "QA", "Viewer"])

        if request.method in ["POST", "PUT", "PATCH"]:
            return user_has_any_group(user, ["Developer"])

        if request.method == "DELETE":
            return False

        return False


class QANotePermission(BasePermission):
    """
    QA Note access:
    - Admin: full access
    - QA: create/update QA notes
    - Developer: read QA notes
    - Viewer: read only
    """

    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        if user.is_superuser or user_in_group(user, "Admin"):
            return True

        if request.method in SAFE_METHODS:
            return user_has_any_group(user, ["Developer", "QA", "Viewer"])

        if request.method in ["POST", "PUT", "PATCH"]:
            return user_has_any_group(user, ["QA"])

        if request.method == "DELETE":
            return False

        return False


class DeploymentLogPermission(BasePermission):
    """
    Deployment Log access:
    - Admin: full access
    - Developer: create/update deployment logs
    - QA: create deployment logs
    - Viewer: read only
    """

    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        if user.is_superuser or user_in_group(user, "Admin"):
            return True

        if request.method in SAFE_METHODS:
            return user_has_any_group(user, ["Developer", "QA", "Viewer"])

        if request.method in ["POST", "PUT", "PATCH"]:
            return user_has_any_group(user, ["Developer", "QA"])

        if request.method == "DELETE":
            return False

        return False


class DashboardPermission(BasePermission):
    """
    Any authenticated app user can view dashboard/readiness summaries.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and user_has_any_group(
            request.user,
            ["Admin", "Developer", "QA", "Viewer"],
        ) or request.user.is_superuser