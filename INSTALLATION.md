# Installation Guide

This project consists of:

-   PostgreSQL (Docker)
-   Ollama (Docker, for AI Suggest)
-   Backend (Node.js)
-   Frontend (Node.js)

Follow the steps below to set up the project locally.

------------------------------------------------------------------------

## Prerequisites

Ensure the following are installed:

-   Docker
-   Node.js (v22 or higher)
-   npm




start docker desktop
#Either do this ``` docker compose up --build ``` or follow steps below

------------------------------------------------------------------------

# 1. Start PostgreSQL (Docker)

Run the following command:

``` bash
docker run --name postgres   -e POSTGRES_USER=postgres   -e POSTGRES_PASSWORD=postgres   -e POSTGRES_DB=assessment   -p 5432:5432   -d postgres
```

Verify container is running:

``` bash
docker ps
```

------------------------------------------------------------------------

# 2. Start Ollama (Docker)

``` bash
docker run -d   -p 11434:11434   --name ollama   ollama/ollama
```

------------------------------------------------------------------------

## Pull Required Model

``` bash
docker exec -it ollama ollama pull llama3:8b-instruct-q4_K_M
```

Test model:

``` bash
docker exec -it ollama ollama run llama3:8b-instruct-q4_K_M
```

If the model responds, setup is successful.

------------------------------------------------------------------------

# 3. Configure Environment Variables

(dont do it, if it already has .enc file in backend)

In backend `.env` file:

    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/assessment"

If backend runs inside Docker, replace `localhost` with `postgres`.

------------------------------------------------------------------------

# 4. Backend Setup

``` bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev

```

Ensure backend connects successfully to PostgreSQL.

------------------------------------------------------------------------

# 5. Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

Frontend typically runs at:

    http://localhost:5173

------------------------------------------------------------------------

# 6. AI Suggest Verification

When clicking **AI Generate**:

-   Backend sends request to: `http://localhost:11434/api/generate`
-   Model used: `llama3:8b-instruct-q4_K_M`
-   Stem and distractors auto-populate in UI

If this works, the full system is operational.

------------------------------------------------------------------------

# Development Flow Summary

1.  Start Docker containers (PostgreSQL + Ollama)
2.  Run backend
3.  Run frontend
4.  Access application in browser

System is now demo-ready.
