from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create default RBAC groups."

    def handle(self, *args, **options):
        roles = ["Admin", "Developer", "QA", "Viewer"]

        for role in roles:
            Group.objects.get_or_create(name=role)
            self.stdout.write(self.style.SUCCESS(f"Role ready: {role}"))