# Installation Guide

Repository: https://github.com/Rishav-Bagri/assignment

This project includes:

-   PostgreSQL (Docker)
-   Ollama (Docker -- AI Suggest engine)
-   Backend (Node.js v22 + Prisma v6)
-   Frontend (Vite + React)

You can run the project in **two ways**:

1.  One-command Docker setup (Recommended)
2.  Manual step-by-step setup

------------------------------------------------------------------------

## Prerequisites

Ensure the following are installed:

-   Docker Desktop
-   Git
-   Node.js v22+
-   npm

------------------------------------------------------------------------

# 📦 Step 0: Clone the Repository

``` bash
git clone https://github.com/Rishav-Bagri/assignment.git
cd assignment
```

------------------------------------------------------------------------

# 🚀 Option 1: One Command Setup (Recommended)

1.  Start Docker Desktop
2.  Open terminal in the project root folder
3.  Run:

``` bash
docker compose up --build
```

That's it.

On first run:

-   PostgreSQL starts\
-   Ollama starts\
-   Model downloads automatically (may take time)\
-   Prisma migrations apply\
-   Backend starts (Port 3000)\
-   Frontend starts (Port 5173)

Open:

http://localhost:5173

------------------------------------------------------------------------

# ⚙ Option 2: Manual Setup

Use this if you prefer running services individually.

------------------------------------------------------------------------

## 1. Start PostgreSQL (Docker)

``` bash
docker run --name postgres   -e POSTGRES_USER=postgres   -e POSTGRES_PASSWORD=postgres   -e POSTGRES_DB=assessment   -p 5432:5432   -d postgres
```

Verify:

``` bash
docker ps
```

------------------------------------------------------------------------

## 2. Start Ollama (Docker)

``` bash
docker run -d   -p 11434:11434   --name ollama   ollama/ollama
```

### Pull Required Model

``` bash
docker exec -it ollama ollama pull llama3:8b-instruct-q4_K_M
```

Test model:

``` bash
docker exec -it ollama ollama run llama3:8b-instruct-q4_K_M
```

If the model responds, setup is successful.

------------------------------------------------------------------------

## 3. Configure Environment Variables

If `.env` already exists in backend, skip this step.

In `backend/.env`:

    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/assessment"

If backend runs inside Docker, use:

    DATABASE_URL="postgresql://postgres:postgres@postgres:5432/assessment"

------------------------------------------------------------------------

## 4. Backend Setup

``` bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

Notes:

-   `migrate dev` creates and applies migrations locally.
-   Prisma version used: v6 (intentionally pinned for stability).

Backend runs at:

http://localhost:3000

------------------------------------------------------------------------

## 5. Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

http://localhost:5173

------------------------------------------------------------------------

# 🤖 AI Suggest Verification

When clicking **AI Generate**:

-   Backend sends request to: http://localhost:11434/api/generate
-   Model used: llama3:8b-instruct-q4_K\_M
-   Stem and distractors auto-populate in UI

If this works, the system is fully operational.

------------------------------------------------------------------------

# 🧭 System Overview

  Service      Port
  ------------ -------
  Frontend     5173
  Backend      3000
  Ollama       11434
  PostgreSQL   5432

------------------------------------------------------------------------

# Development Flow Summary

1.  Clone repository
2.  Start services (Docker recommended)
3.  Access application in browser

The system is now demo-ready.
