# ReleaseDesk

ReleaseDesk is a small internal web application built to practice full-stack web development patterns used in real business applications. The app helps a digital products or engineering team track user-reported issues, release candidates, QA validation notes, and deployment activity.

This project was designed as interview preparation for a Web Application Developer role focused on Django, React, SQL databases, RESTful APIs, testing, Docker, Linux-based workflows, and AI-augmented development.

---

## Project Purpose

The goal of ReleaseDesk is to model a lightweight internal platform used by teams that support and enhance business-critical web applications.

The app focuses on practical workflows such as:

- Tracking bugs, feature requests, and support issues
- Managing release readiness
- Recording QA validation notes
- Logging deployment activity
- Viewing dashboard-level reporting
- Practicing backend/frontend/API/database integration
- Practicing Docker-based local development
- Practicing testing and documentation habits

This is intentionally scoped as a small but realistic internal tool, not a large production SaaS product.

---

## Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Django TestCase or pytest
- django-cors-headers

### Frontend

- React
- Vite
- JavaScript
- Fetch API or Axios
- React Router

### Database

- PostgreSQL through Docker Compose
- SQLite may be used as a local fallback during early development

### DevOps / Tooling

- Docker
- Docker Compose
- Git / GitHub
- Linux terminal commands
- Optional cloud deployment with Render, Railway, Fly.io, or DigitalOcean App Platform

---

## Core Features

### Issue Tracking

Users can create and manage internal issues such as bugs, feature requests, and support tasks.

Issue fields include:

- Title
- Description
- Issue type
- Priority
- Status
- Reported by
- Assigned to
- Environment
- Created date
- Updated date

### Release Tracking

Users can create and manage planned releases.

Release fields include:

- Name
- Release date
- Status
- Summary
- Created date
- Updated date

### QA Notes

Users can attach QA validation notes to issues.

QA note fields include:

- Related issue
- Tester name
- Result
- Notes
- Created date

### Deployment Logs

Users can track deployment events by release and environment.

Deployment log fields include:

- Related release
- Environment
- Status
- Notes
- Deployed by
- Created date

### Dashboard Summary

The dashboard provides a quick overview of platform status, including:

- Open issues
- Critical issues
- QA-ready issues
- Blocked issues
- Upcoming releases
- Recent deployment logs

---

## Planned Pages

### Dashboard

Displays summary cards and recent deployment activity.

Example cards:

- Open Issues
- Critical Issues
- QA Ready
- Blocked
- Upcoming Releases

### Issues Page

Displays a table of issues with filtering and search.

Planned functionality:

- View all issues
- Search issues by title
- Filter by status
- Filter by priority
- Create new issue
- Update issue status

### Issue Detail Page

Displays a single issue and related QA notes.

Planned functionality:

- View issue details
- Update status
- Add QA note
- Review validation history

### Releases Page

Displays planned and completed releases.

Planned functionality:

- View all releases
- Create release
- Update release status
- Review release summary

### Deployment Logs Page

Displays deployment activity.

Planned functionality:

- View deployment history
- Add deployment log
- Track deployment environment and status

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

### Issues

```txt
GET    /api/issues/
POST   /api/issues/
GET    /api/issues/:id/
PATCH  /api/issues/:id/
DELETE /api/issues/:id/
```

### Releases

```txt
GET    /api/releases/
POST   /api/releases/
GET    /api/releases/:id/
PATCH  /api/releases/:id/
```

### QA Notes

```txt
GET    /api/qa-notes/
POST   /api/qa-notes/
```

### Deployment Logs

```txt
GET    /api/deployment-logs/
POST   /api/deployment-logs/
```

### Dashboard Summary

```txt
GET /api/dashboard-summary/
```

Example response:

```json
{
  "open_issues": 12,
  "critical_issues": 2,
  "qa_ready": 4,
  "blocked": 1,
  "upcoming_releases": 2
}
```

---

## Project Structure

```txt
releasedesk/
  backend/
    manage.py
    releasedesk/
      settings.py
      urls.py
    core/
      models.py
      serializers.py
      views.py
      urls.py
      tests.py
    requirements.txt
    Dockerfile

  frontend/
    src/
      api/
        client.js
      components/
        IssueTable.jsx
        DashboardCard.jsx
        StatusBadge.jsx
      pages/
        Dashboard.jsx
        Issues.jsx
        IssueDetail.jsx
        Releases.jsx
        DeploymentLogs.jsx
      App.jsx
      main.jsx
    package.json
    Dockerfile

  docker-compose.yml
  README.md
  QA_CHECKLIST.md
  .env.example
```

---

## Getting Started

### Prerequisites

Install the following:

- Python 3.12+
- Node.js 20+
- Docker Desktop
- Git

Optional:

- Postman or Insomnia for API testing
- VS Code
- PostgreSQL client tool such as pgAdmin or TablePlus

---

## Local Backend Setup Without Docker

From the project root:

```bash
cd backend
python -m venv venv
source venv/bin/activate
```

For Windows PowerShell:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install django djangorestframework psycopg2-binary django-cors-headers
pip freeze > requirements.txt
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

## Docker Setup

The recommended development setup uses Docker Compose to run:

- Django backend
- React frontend
- PostgreSQL database

From the project root:

```bash
docker compose up --build
```

Run database migrations inside the backend container:

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

Create a Django admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

Access the app:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:8000
Admin:    http://localhost:8000/admin
API:      http://localhost:8000/api
```

---

## Example Docker Compose Configuration

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: releasedesk
      POSTGRES_USER: releasedesk_user
      POSTGRES_PASSWORD: releasedesk_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      DB_NAME: releasedesk
      DB_USER: releasedesk_user
      DB_PASSWORD: releasedesk_password
      DB_HOST: db
      DB_PORT: 5432
    depends_on:
      - db

  frontend:
    build: ./frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://localhost:8000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

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
docker compose exec backend python manage.py test
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

## Useful Linux Commands Practiced

```bash
ls
cd
pwd
cat
less
grep
tail -f
ps aux
chmod
chown
env
printenv
```

Example log inspection:

```bash
docker compose logs backend | grep ERROR
```

---

## Testing

Backend tests should cover:

- Creating an issue
- Listing issues
- Updating issue status
- Creating a QA note
- Creating a release
- Creating a deployment log
- Dashboard summary counts

Run tests locally:

```bash
cd backend
python manage.py test
```

Run tests in Docker:

```bash
docker compose exec backend python manage.py test
```

Example test names:

```txt
test_can_create_issue
test_can_list_issues
test_can_update_issue_status
test_can_create_qa_note
test_dashboard_summary_counts_open_issues
```

---

## QA Checklist

A separate `QA_CHECKLIST.md` file should be used to manually validate the application before considering it complete.

Suggested checklist:

```md
# QA Checklist

## Issue Workflow
- [ ] User can create a new issue
- [ ] User can view issue list
- [ ] User can filter by status
- [ ] User can filter by priority
- [ ] User can update issue status
- [ ] User can add QA note

## Release Workflow
- [ ] User can create release
- [ ] User can view releases
- [ ] User can update release status
- [ ] User can add deployment log

## Dashboard
- [ ] Open issue count is accurate
- [ ] Critical issue count is accurate
- [ ] QA-ready count is accurate
- [ ] Blocked issue count is accurate
- [ ] Upcoming release count is accurate

## Regression
- [ ] Existing issues still load
- [ ] Existing releases still load
- [ ] API returns expected JSON
- [ ] Frontend handles API errors
- [ ] Backend logs do not show unexpected errors
```

---

## Environment Variables

Create a `.env.example` file in the root or backend folder.

Example:

```env
DEBUG=True
SECRET_KEY=replace-this-with-a-local-dev-secret

DB_NAME=releasedesk
DB_USER=releasedesk_user
DB_PASSWORD=releasedesk_password
DB_HOST=db
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Frontend example:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Do not commit real secrets to GitHub.

---

## Security Notes

This project is for interview preparation and local development practice.

Security concepts to discuss or improve:

- Store secrets in environment variables
- Do not commit `.env` files
- Use Django authentication for protected routes
- Validate API input through serializers
- Use proper HTTP status codes
- Add permissions before production use
- Limit CORS origins in deployed environments
- Avoid exposing sensitive fields in API responses

---

## Optional Stretch Features

These are not required for the initial version.

### Authentication

Add Django authentication or token-based authentication.

Potential additions:

- Login
- Logout
- Protected routes
- User-specific issue assignment
- Permissions by role

### Issue-to-Release Relationship

Connect issues to releases.

Example:

```python
release = models.ForeignKey(
    "Release",
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="issues"
)
```

### Filtering and Search

Add backend query filtering.

Example:

```txt
/api/issues/?status=qa_ready&priority=high
```

### Database Indexes

Add indexes for common reporting fields.

Example:

```python
class Meta:
    indexes = [
        models.Index(fields=["status"]),
        models.Index(fields=["priority"]),
        models.Index(fields=["environment"]),
    ]
```

### Basic Error Logging

Add Django logging configuration for easier debugging.

### Simulated AI Summary

Add a no-cost simulated AI summary feature.

Example output:

```txt
This appears to be a high-priority QA issue affecting login behavior.
Recommended next step: inspect frontend click handler and backend auth response.
```

This can be used to discuss AI feature implementation patterns without using paid APIs.

---

## Cloud Deployment Options

Optional deployment platforms:

- Render
- Railway
- Fly.io
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- AWS ECS

For this project, local Docker Compose is enough for the main learning goal.

If deploying, recommended approach:

1. Deploy backend API
2. Deploy PostgreSQL database
3. Configure environment variables
4. Deploy frontend
5. Update `VITE_API_BASE_URL`
6. Test CORS settings
7. Run migrations
8. Validate API and frontend workflows

---

## Interview Talking Points

This project can be described in an interview like this:

> To prepare for this role, I built a small Django and React internal tool called ReleaseDesk. It tracks user-reported issues, release status, QA notes, and deployment logs. I used Django REST Framework for the API, React/Vite for the frontend, PostgreSQL for the database, and Docker Compose to run the backend, frontend, and database together.

A stronger version:

> I chose this project because it mirrors the kind of internal web application work described in the role: bug tracking, reporting workflows, QA validation, release support, and platform maintenance. It also helped me strengthen my Django-specific understanding while connecting to my SRE experience with deployments, testing, production validation, and stakeholder communication.

Key concepts practiced:

- Django project and app structure
- Models and migrations
- Django REST Framework serializers and viewsets
- RESTful API design
- React API consumption
- Loading and error states
- PostgreSQL database integration
- Docker Compose multi-service development
- Manual QA validation
- Automated backend tests
- Technical documentation
- Production-readiness mindset

---

## Current Status

Planned development timeline:

```txt
Day 2: Django backend foundation
Day 3: Django REST Framework APIs
Day 4: React frontend
Day 5: PostgreSQL, Docker, Docker Compose, Linux practice
Day 6: Testing, QA workflow, documentation, optional cloud prep
```

---

## Lessons Practiced

By completing this project, the developer should be able to explain:

- How Django models map to database tables
- How migrations manage schema changes
- How serializers validate and transform API data
- How React communicates with a Django backend
- How CORS affects local development
- How Docker Compose connects backend, frontend, and database services
- How tests and QA checklists support release confidence
- How internal applications require both feature development and operational thinking

---

## License

This project is for personal learning and interview preparation.
