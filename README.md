# Quantum Entanglement - Interactive Learning Platform

An interactive educational website exploring quantum entanglement, built for Hack4Impact IdeaCon.

## Features

- 📚 Comprehensive lessons on quantum entanglement
- 🎯 Interactive multiple-choice quizzes with live results
- 🤖 AI-powered short answer grading using Gemini API
- 💬 Comment sections for discussion
- 🎨 Beautiful, responsive design with 3D visualizations
- 📱 Mobile-friendly interface

## Tech Stack

**Frontend:**

- React 18 + TypeScript
- Vite
- TailwindCSS + Mantine UI
- Three.js / React Three Fiber for 3D visualizations
- React Router for navigation

**Backend:**

- Node.js + Express
- PostgreSQL for data storage
- Google Gemini API for AI grading

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or a free Neon/Supabase account)
- Google Gemini API key

### Database Setup (Choose One)

#### Option 1: Local PostgreSQL

1. Install PostgreSQL:

   - Mac: `brew install postgresql@14`
   - Windows: Download from postgresql.org
   - Linux: `sudo apt-get install postgresql`

2. Start PostgreSQL:

```bash
   # Mac
   brew services start postgresql@14

   # Linux
   sudo service postgresql start
```

3. Create database:

```bash
   psql postgres
   CREATE DATABASE quantum_entanglement;
   \q
```

4. Your connection string will be:

```
   postgresql://localhost:5432/quantum_entanglement
```

#### Option 2: Free Cloud PostgreSQL (Recommended)

**Neon (Recommended - Free Forever):**

1. Go to https://neon.tech
2. Sign up for free account
3. Create new project named "quantum-entanglement"
4. Copy the connection string from dashboard
5. Format: `postgresql://username:password@host/dbname?sslmode=require`

**OR Supabase (Alternative):**

1. Go to https://supabase.com
2. Sign up for free account
3. Create new project
4. Go to Settings → Database
5. Copy "Connection string" under "Connection pooling"

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Add your credentials to `.env`:

```
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgresql_connection_string
PORT=5001
NODE_ENV=development
```

5. Run backend:

```bash
npm run dev
```

Backend will run on http://localhost:5001
Tables will be created automatically on first run!

### Frontend Setup

1. Navigate to frontend directory (in a new terminal):

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Run frontend:

```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Getting API Keys

### Google Gemini API (Free):

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the API key

### Database Connection String Examples:

**Local PostgreSQL:**

```
postgresql://localhost:5432/quantum_entanglement
```

**Neon (with SSL):**

```
postgresql://username:password@ep-something.us-east-2.aws.neon.tech/quantum_entanglement?sslmode=require
```

**Supabase:**

```
postgresql://postgres.xxxxxxxxxxxxx:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

## Database Schema

The backend automatically creates these tables:

**quiz_results:**

- id (SERIAL PRIMARY KEY)
- question_id (VARCHAR)
- user_name (VARCHAR)
- selected_answer (TEXT)
- is_correct (BOOLEAN)
- timestamp (TIMESTAMP)
- UNIQUE constraint on (question_id, user_name)

**short_answers:**

- id (SERIAL PRIMARY KEY)
- question_id (VARCHAR)
- user_name (VARCHAR)
- answer (TEXT)
- score (INTEGER)
- feedback (TEXT)
- correct (BOOLEAN)
- missed_points (TEXT[])
- strengths (TEXT)
- timestamp (TIMESTAMP)

**comments:**

- id (SERIAL PRIMARY KEY)
- page_id (VARCHAR)
- user_name (VARCHAR)
- comment (TEXT)
- timestamp (TIMESTAMP)

## Deployment

### Backend (Railway/Render)

**Railway (Recommended):**

1. Push code to GitHub
2. Go to https://railway.app
3. Create new project → "Deploy from GitHub repo"
4. Select your repository
5. Add PostgreSQL service (Railway provides free PostgreSQL)
6. Add environment variables:
   - `GEMINI_API_KEY`
   - `DATABASE_URL` (auto-filled by Railway)
   - `NODE_ENV=production`
7. Set root directory to `backend`
8. Deploy!

**Render:**

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Root directory: `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add PostgreSQL database (free tier)
8. Add environment variables
9. Deploy!

### Frontend (Vercel/Netlify)

**Vercel:**

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Root directory: `frontend`
5. Framework: Vite
6. Build command: `npm run build`
7. Output directory: `dist`
8. Add environment variable:
   - `VITE_API_URL=https://your-backend-url.com/api`
9. Deploy!

## Project Structure

```
quantum-entanglement-ideacon/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Helper functions
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   └── package.json
└── backend/
    ├── server.js           # Express server with PostgreSQL
    ├── package.json        # Dependencies
    └── .env.example        # Environment variables template
```

## Development

### Running Both Servers Concurrently

Terminal 1 (Backend):

```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):

```bash
cd frontend
npm run dev
```

### Testing the API

```bash
# Health check (also tests database connection)
curl http://localhost:5001/api/health

# Get quiz results
curl http://localhost:5001/api/quiz/results/entanglement-basics-mc

# Get comments
curl http://localhost:5001/api/comments/what-is-entanglement
```

### Viewing Database Content

**If using local PostgreSQL:**

```bash
psql quantum_entanglement
SELECT * FROM quiz_results;
SELECT * FROM comments;
\q
```

**If using Neon/Supabase:**

- Use their web dashboard SQL editor

## Troubleshooting

### Backend won't start

- Check DATABASE_URL is correct
- Verify Gemini API key is valid
- Ensure port 5001 isn't already in use
- Check PostgreSQL is running (if local)

### Database connection issues

- For cloud databases, ensure SSL mode is enabled
- Check firewall/network settings
- Verify username and password are correct
- For Neon: Make sure project isn't suspended (free tier)

### Frontend can't connect to backend

- Verify backend is running on port 5001
- Check CORS settings in backend
- Make sure proxy is configured in vite.config.ts

## Learning Objectives

This project teaches:

1. **Quantum Entanglement Basics** - Understanding the phenomenon
2. **Bell's Theorem** - The mathematical proof and experiments
3. **Real Applications** - Quantum cryptography, computing, teleportation, and sensing

## Features Implemented

✅ Beautiful, responsive frontend design
✅ Home page with engaging introduction
✅ Multiple detailed lesson pages
✅ Interactive multiple-choice quizzes with live results
✅ AI-powered short answer grading
✅ Comment sections on each page
✅ User name persistence with localStorage
✅ Real-time poll results with user names
✅ 3D visualizations using Three.js
✅ PostgreSQL database with auto-initialization

## Credits

Created for Hack4Impact Technical Assessment

## License

MIT
