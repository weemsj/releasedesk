"""
Admin configuration for the core app.
"""

from django.contrib import admin

# Register your models here.
from .models import Issue, Release, QANote, DeploymentLog

admin.site.register(Issue)
admin.site.register(Release)
admin.site.register(QANote)
admin.site.register(DeploymentLog)
