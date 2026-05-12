# ReleaseDesk

ReleaseDesk is an internal release management web application built with Django REST Framework, React, PostgreSQL, and Docker. The app helps teams track user-reported issues, planned releases, QA validation notes, deployment activity, dashboard metrics, and release readiness.

This project was built as a practical full-stack interview preparation project focused on Django, React, REST APIs, PostgreSQL, Docker, session authentication, role-based access control, CSRF protection, reusable frontend architecture, and backend API testing.

---

## Project Purpose

ReleaseDesk models a lightweight internal platform used by digital products, engineering, QA, and operations teams that support business-critical web applications.

The project focuses on practical workflows such as tracking bugs, managing release readiness, recording QA validation notes, logging deployment activity, viewing dashboard-level reporting, practicing Docker-based local development, and validating session authentication with role-based access control.

This is intentionally scoped as a small but realistic internal tool, not a large production SaaS product.

---

## Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Django Sessions
- Django Groups
- CSRF protection
- django-cors-headers
- python-dotenv
- Django test framework / DRF APITestCase

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- CSS

### DevOps / Tooling

- Docker
- Docker Compose
- Git / GitHub
- Linux terminal workflows
- Environment variable configuration through `.env`

---

## Core Features

### Issue Tracking

Users can create and manage internal issues such as bugs, feature requests, and support tasks.

Issue fields include title, description, issue type, priority, status, reported by, assigned to, environment, created date, and updated date.

### Release Tracking

Users can create and manage planned releases.

Release fields include name, release date, status, summary, created date, and updated date.

### QA Notes

Users can attach QA validation notes to specific issues.

QA notes are displayed on the Issue Detail page through a reusable `QANotesPanel` component.

### Deployment Logs

Users can track deployment activity by release and environment.

Deployment log fields include related release, environment, status, notes, deployed by, and created date.

### Dashboard Summary

The dashboard provides a high-level overview of platform status, including open issues, critical issues, QA-ready issues, blocked issues, upcoming releases, and recent deployments.

### Release Readiness

ReleaseDesk includes a release readiness endpoint that summarizes release status and blockers.

The release readiness endpoint helps answer:

> Are we ready to release?

It evaluates planned releases, QA testing releases, prod test releases, deployed releases, rollback-needed releases, critical issues, blocked issues, release blockers, and ready-for-release status.

---

## Authentication & Authorization

ReleaseDesk uses Django session-based authentication.

Authentication features include:

- Login
- Logout
- Current session user endpoint
- Account page
- Profile editing
- CSRF-protected unsafe requests
- Frontend auth context
- Protected frontend routes

Authorization uses Django Groups as roles.

Supported roles:

- Admin
- Developer
- QA
- Viewer

### RBAC Behavior

Admin users can perform full CRUD actions.

Developer users can create and edit issues, releases, and deployment logs, but cannot perform restricted admin actions.

QA users can view issues and releases, add QA notes, and create deployment logs.

Viewer users can view permitted data but cannot create, update, or delete records.

Backend permissions are the source of truth. Frontend role-aware rendering only improves the user experience by hiding unavailable actions.

---

## Project Structure

```txt
releasedesk/
├── backend/
│   ├── core/
│   │   ├── management/
│   │   │   ├── __init__.py
│   │   │   └── commands/
│   │   │       ├── __init__.py
│   │   │       └── seed_roles.py
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── releasedesk/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── releaseDeskApi.js
│   │   │
│   │   ├── components/
│   │   │   ├── AuthStatus.jsx
│   │   │   ├── BackButton.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── QANotesPanel.jsx
│   │   │   ├── ResourceForm.jsx
│   │   │   └── dataTable.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useResourceCrud.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Account.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DeploymentLogs.jsx
│   │   │   ├── IssueDetail.jsx
│   │   │   ├── Issues.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Release.jsx
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## Data Models

### Issue

```txt
id
title
description
issue_type: bug | feature | support
priority: low | medium | high | critical
status: new | in_progress | qa_ready | validated | released | blocked
reported_by
assigned_to
environment: dev | qa | prod_test | production
created_at
updated_at
```

### Release

```txt
id
name
release_date
status: planned | qa_testing | prod_test | deployed | rollback_needed
summary
created_at
updated_at
```

### QA Note

```txt
id
issue
tester_name
result: pass | fail | blocked
notes
created_at
```

### Deployment Log

```txt
id
release
environment: qa | prod_test | production
status: started | successful | failed
notes
deployed_by
created_at
```

---

## API Endpoints

### Auth / Session

```txt
GET    /api/csrf/
POST   /api/login/
POST   /api/logout/
GET    /api/session-user/
PATCH  /api/session-user/
```

### Issues

```txt
GET     /api/issues/
POST    /api/issues/
GET     /api/issues/:id/
PATCH   /api/issues/:id/
DELETE  /api/issues/:id/
```

### Releases

```txt
GET     /api/releases/
POST    /api/releases/
GET     /api/releases/:id/
PATCH   /api/releases/:id/
DELETE  /api/releases/:id/
```

### QA Notes

```txt
GET     /api/qa-notes/
POST    /api/qa-notes/
GET     /api/qa-notes/:id/
PATCH   /api/qa-notes/:id/
DELETE  /api/qa-notes/:id/
```

### Deployment Logs

```txt
GET     /api/deployment-logs/
POST    /api/deployment-logs/
GET     /api/deployment-logs/:id/
PATCH   /api/deployment-logs/:id/
DELETE  /api/deployment-logs/:id/
```

### Dashboard / Summary

```txt
GET /api/dashboard-summary/
GET /api/release-readiness/
```

---

## Release Readiness Endpoint

The release readiness endpoint summarizes whether the system is ready for release based on release statuses and issue blockers.

```txt
GET /api/release-readiness/
```

Example response:

```json
{
  "planned_releases": 1,
  "qa_testing_releases": 0,
  "prod_test_releases": 1,
  "deployed_releases": 0,
  "rollback_needed_releases": 0,
  "critical_issues": 1,
  "blocked_issues": 1,
  "release_blockers": 2,
  "ready_for_release": false
}
```

This endpoint demonstrates the workflow for adding a new API endpoint:

- Update models only if new stored data is needed
- Update serializers if request or response model serialization changes
- Update views for endpoint logic
- Update URLs to expose the route
- Update frontend API client if the UI consumes the endpoint
- Add tests for behavior and response shape

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
POSTGRES_DB=releasedesk
POSTGRES_USER=releasedesk_user
POSTGRES_PASSWORD=releasedesk_password
POSTGRES_HOST=db
POSTGRES_PORT=5432

DJANGO_SECRET_KEY='replace-this-dev-secret-key'
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend

VITE_API_BASE_URL=http://localhost:8000/api
```

Important: if your `DJANGO_SECRET_KEY` contains a `$`, wrap it in single quotes so Docker Compose does not interpret part of it as an environment variable.

Do not commit `.env` to GitHub.

---

## Running the Project with Docker

From the project root:

```bash
docker compose up --build
```

The app will be available at:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:8000/api
Admin:    http://localhost:8000/admin
```

---

## Database Setup

After containers are running, apply migrations:

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

Create a superuser:

```bash
docker compose exec backend python manage.py createsuperuser
```

Seed the default RBAC groups:

```bash
docker compose exec backend python manage.py seed_roles
```

Default groups created:

```txt
Admin
Developer
QA
Viewer
```

---

## Recommended Test Users

Create these users in Django Admin and assign them to the matching groups:

| Username | Password | Group | Purpose |
|---|---|---|---|
| admin_user | testpass123 | Admin | Full access |
| developer_user | testpass123 | Developer | Developer workflow |
| qa_user | testpass123 | QA | QA validation workflow |
| viewer_user | testpass123 | Viewer | Read-only workflow |

Avoid using only a superuser for RBAC testing because superusers bypass normal group restrictions.

---

## Local Backend Setup Without Docker

From the project root:

```bash
cd backend
python -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create admin user:

```bash
python manage.py createsuperuser
```

Run backend server:

```bash
python manage.py runserver
```

Backend should run at:

```txt
http://localhost:8000
```

Note: if running Django locally outside Docker, your database host should likely be `localhost` instead of `db`.

---

## Local Frontend Setup Without Docker

From the project root:

```bash
cd frontend
npm install
npm run dev
```

Frontend should run at:

```txt
http://localhost:5173
```

---

## Frontend Architecture

### Centralized API Client

All frontend API calls are centralized in:

```txt
frontend/src/api/releaseDeskApi.js
```

This file handles:

- API base URL configuration
- Axios setup
- Session cookies
- CSRF headers
- Centralized error handling
- Resource-specific API functions

### Auth Context

Authentication state is managed globally in:

```txt
frontend/src/context/AuthContext.jsx
```

This provides:

- Current user
- Login
- Logout
- Account update
- Role checking
- Auth loading state

### Shared CRUD Hook

Repeated CRUD state and handlers are centralized in:

```txt
frontend/src/hooks/useResourceCrud.js
```

This handles:

- Loading state
- Error state
- Form state
- Submit behavior
- Edit behavior
- Delete behavior
- Reset behavior

### Reusable Components

Key reusable components include:

```txt
AuthStatus.jsx
BackButton.jsx
DashboardCard.jsx
ProtectedRoute.jsx
QANotesPanel.jsx
ResourceForm.jsx
dataTable.jsx
```

### Pages

```txt
Account.jsx
Dashboard.jsx
DeploymentLogs.jsx
IssueDetail.jsx
Issues.jsx
Login.jsx
Release.jsx
```

---

## CSRF and Session Authentication

Because ReleaseDesk uses Django session authentication, unsafe requests require CSRF protection.

Unsafe requests include:

```txt
POST
PATCH
PUT
DELETE
```

The frontend API client retrieves a CSRF token from:

```txt
GET /api/csrf/
```

Then sends the token with unsafe requests using:

```txt
X-CSRFToken: <token>
```

The Axios client also sends cookies with requests using:

```txt
withCredentials: true
```

This allows Django sessions to work correctly across the React frontend and Django backend during local development.

---

## Testing

Run the backend test suite:

```bash
docker compose exec backend python manage.py test core
```

The test suite covers:

- Issue CRUD API behavior
- Release CRUD API behavior
- QA note API behavior
- Deployment log API behavior
- Dashboard summary response
- Release readiness response
- Session login behavior
- Logout session clearing
- CSRF token endpoint
- Account update behavior
- RBAC allowed actions
- RBAC denied actions
- Privilege escalation prevention

Example successful test run:

```txt
Found 48 test(s).
System check identified no issues.
OK
```

---

## RBAC Test Coverage

The RBAC tests verify both positive and negative cases.

Examples:

- Unauthenticated users cannot access protected issue endpoints
- Viewer users can read issues
- Viewer users cannot create issues
- Developer users can create issues
- Developer users cannot delete issues
- Admin users can delete issues
- QA users can create QA notes
- QA users cannot create releases
- QA users can create deployment logs
- Viewer users cannot create deployment logs
- Users cannot update their own roles
- Users cannot assign themselves admin privileges
- Logout clears the authenticated session
- Account updates return updated profile fields

The most important principle: RBAC should be enforced on the backend. Frontend role-aware rendering is helpful, but it is not security.

---

## Useful Docker Commands

View running containers:

```bash
docker ps
```

View all services:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs backend
```

Follow backend logs:

```bash
docker compose logs -f backend
```

Open a shell inside the backend container:

```bash
docker compose exec backend bash
```

Run Django tests:

```bash
docker compose exec backend python manage.py test core
```

Stop containers:

```bash
docker compose down
```

Stop containers and remove volumes:

```bash
docker compose down -v
```

---


## Security Notes

This project is for interview preparation and local development practice, but it intentionally includes real-world security concepts.

Security practices included:

- Session-based authentication
- CSRF protection
- Backend-enforced role permissions
- Protected frontend routes
- Account updates without role editing
- Privilege escalation prevention tests
- Environment variables for secrets
- `.env` excluded from Git

Security concepts to improve before production:

- Add password change flow
- Add audit logging for sensitive actions
- Add production-ready Django settings
- Add HTTPS-only secure cookie settings
- Add stricter CORS configuration
- Add production logging and monitoring
- Add rate limiting for login attempts
- Add role management only for Admin users

---

## Future Improvements

Potential next steps:

- Add frontend tests
- Add filtering and search for issues/releases
- Add pagination for large tables
- Add QA notes edit/delete UI
- Add release readiness dashboard card
- Add audit logging for sensitive actions
- Add password change flow
- Add role management page for Admin users
- Add production-ready Docker configuration
- Add deployment pipeline
- Add AI-generated release summaries or QA summaries

---

## License

This project is for personal learning and interview preparation.
