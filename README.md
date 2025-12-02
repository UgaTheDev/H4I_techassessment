# ⚛️ Quantum Entanglement: An Interactive Learning Experience

> _"Spooky action at a distance"_ — Albert Einstein

An interactive educational website that teaches the fascinating world of quantum entanglement through immersive 3D visualizations, interactive quizzes, and hands-on simulations. Built for Hack4Impact IdeaCon 2026.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-r158-000000?logo=three.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-4169E1?logo=postgresql)

## 🌟 Features

### 📚 Comprehensive Learning Modules

- **What is Entanglement?** - Introduction to quantum entanglement with the "magic coins" analogy
- **EPR Paradox** - Einstein's challenge to quantum mechanics and the Einstein-Bohr debate
- **Bell's Theorem** - The mathematical proof that changed physics forever
- **Famous Experiments** - From Aspect's 1982 breakthrough to the 2022 Nobel Prize
- **Real Applications** - Quantum cryptography, computing, and teleportation

### 🎮 Interactive 3D Visualizations

- **Entangled Particles** - Watch particles correlate in real-time
- **Bell Test Apparatus** - Simulate the famous experiment with adjustable polarizers
- **Aspect's Experiment** - See fast-switching polarizers in action
- **Quantum Computer** - Visualize qubits, gates, and entanglement creation
- **Quantum Teleportation** - Step-by-step protocol animation

### 🧠 Learning Features

- **Multiple Choice Quizzes** - Test your understanding with instant feedback
- **AI-Graded Short Answers** - Get personalized feedback powered by Google Gemini
- **Live Poll Results** - See how other learners answered
- **Progress Tracking** - Track pages visited and quizzes completed
- **Achievement System** - Unlock 13 achievements as you learn
- **ELI5 Mode** - Toggle between Simple, Standard, and Advanced explanations
- **Interactive Glossary** - Quick access to quantum physics terminology
- **Knowledge Gap Analysis** - Identify areas that need review
- **Quantum Escape Room** - Test your knowledge with puzzle challenges

### 💬 Community Features

- **Comment Sections** - Discuss and ask questions on each page
- **Share Progress** - Share your learning achievements

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Three Fiber** + **Three.js** for 3D visualizations
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation

### Backend

- **Node.js** with Express
- **PostgreSQL** database
- **Google Gemini AI** for short answer grading

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (for backend features)

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your environment variables:
# DATABASE_URL=your_postgres_connection_string
# GEMINI_API_KEY=your_google_gemini_api_key
# PORT=5001

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:5001`

### Environment Variables

#### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@host:5432/database
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
PORT=5001
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5001
```

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Achievements.tsx        # Achievement system
│   │   │   ├── AspectExperiment3D.tsx  # Aspect experiment visualization
│   │   │   ├── BellTestApparatus.tsx   # Bell test simulation
│   │   │   ├── CommentSection.tsx      # Page comments
│   │   │   ├── ELI5Mode.tsx            # Explanation level toggle
│   │   │   ├── EntangledParticles3D.tsx# Particle visualization
│   │   │   ├── EscapeRoom.tsx          # Puzzle game
│   │   │   ├── Glossary.tsx            # Interactive glossary
│   │   │   ├── KnowledgeGaps.tsx       # Learning analytics
│   │   │   ├── MultipleChoiceQuiz.tsx  # Quiz component
│   │   │   ├── Navbar.tsx              # Navigation
│   │   │   ├── ProgressTracker.tsx     # Learning progress
│   │   │   ├── QuantumComputer3D.tsx   # Quantum computer viz
│   │   │   ├── QuantumTeleportation3D.tsx # Teleportation viz
│   │   │   ├── QuizStats.tsx           # Quiz statistics
│   │   │   ├── ReadingProgress.tsx     # Page reading tracker
│   │   │   ├── ShortAnswerQuiz.tsx     # AI-graded questions
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.tsx                # Landing page
│   │   │   ├── WhatIsEntanglement.tsx  # Intro module
│   │   │   ├── EPRParadox.tsx          # EPR module
│   │   │   ├── BellsTheorem.tsx        # Bell's theorem module
│   │   │   ├── FamousExperiments.tsx   # Experiments module
│   │   │   ├── Applications.tsx        # Applications module
│   │   │   └── EscapeRoomPage.tsx      # Escape room
│   │   ├── utils/
│   │   │   └── api.ts                  # API client
│   │   ├── App.tsx                     # Main app component
│   │   └── main.tsx                    # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/
│   ├── server.js                       # Express server & routes
│   ├── package.json
│   └── .env.example
│
├── pr_template.md                      # PR submission template
└── README.md
```

## 🎯 API Endpoints

| Method | Endpoint                        | Description                    |
| ------ | ------------------------------- | ------------------------------ |
| `GET`  | `/api/health`                   | Health check & database status |
| `POST` | `/api/quiz/submit`              | Submit quiz answer             |
| `GET`  | `/api/quiz/results/:questionId` | Get live poll results          |
| `POST` | `/api/grade-answer`             | AI grade short answer (Gemini) |
| `POST` | `/api/comments`                 | Add a comment                  |
| `GET`  | `/api/comments/:pageId`         | Get comments for a page        |

## 🌐 Deployment

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and connect your GitHub repo
2. Set **Root Directory** to `frontend`
3. Framework will auto-detect as Vite
4. Add environment variable: `VITE_API_URL=https://your-backend.up.railway.app`
5. Deploy!

### Backend (Railway)

1. Go to [railway.app](https://railway.app) and connect your GitHub repo
2. Set **Root Directory** to `backend`
3. Add a **PostgreSQL** database (Railway auto-creates `DATABASE_URL`)
4. Add environment variables:
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `NODE_ENV` - `production`
   - `PORT` - `3000`
5. Generate a public domain under **Settings → Networking**
6. Deploy!

## 🏆 Achievements

| Achievement             | Description                | Requirement              |
| ----------------------- | -------------------------- | ------------------------ |
| 🔍 Quantum Curious      | Begin your quantum journey | Visit your first page    |
| 📚 Eager Learner        | Explore half the content   | Visit 3 topic pages      |
| ⭐ Knowledge Seeker     | Complete all topics        | Visit all 5 topic pages  |
| 🎯 First Steps          | Start testing yourself     | Complete your first quiz |
| 🔥 On Fire              | Build a streak             | Get 3 correct in a row   |
| 🧠 Quiz Master          | Become a quiz expert       | Complete 10 quizzes      |
| 💯 Perfectionist        | Achieve perfection         | Get 5 perfect scores     |
| ✍️ Deep Thinker         | Show your understanding    | Complete a short answer  |
| 💬 Conversation Starter | Join the discussion        | Post your first comment  |
| ⏱️ Dedicated Student    | Invest time in learning    | Spend 10+ minutes        |
| 🏅 Bell Test Expert     | Master the theorem         | Complete Bell's theorem  |
| 🚀 Quantum Pioneer      | Nearly there!              | Unlock 10 achievements   |
| 🏆 Quantum Master       | Ultimate achievement       | Complete everything      |

## 🎨 Design System

### Color Palette

- **Quantum Cyan**: `#06b6d4` - Primary accent
- **Entangled Purple**: `#a855f7` - Secondary accent
- **Success Green**: `#10b981`
- **Warning Amber**: `#f59e0b`
- **Error Red**: `#ef4444`

### Typography

- **Display**: Bold, gradient text for headings
- **Body**: Clean, readable sans-serif
- **Code**: Monospace for quantum notation (|ψ⟩, |Φ⁺⟩)

### Components

- Light mode UI with gradient accents
- Dark 3D visualization backgrounds for contrast
- Rounded cards with subtle shadows
- Interactive hover states

## 📱 Responsive Design

The website is fully responsive:

- 📱 **Mobile** (320px+) - Stacked layouts, touch-friendly
- 💻 **Desktop** (1024px+) - Full layouts with sidebars

## 🔬 Learning Outcomes

After completing this course, learners will understand:

1. **What quantum entanglement is** and why Einstein called it "spooky"
2. **The EPR Paradox** and the debate between Einstein and Bohr
3. **Bell's Theorem** and why it rules out local hidden variables
4. **How experiments proved** quantum mechanics correct
5. **Real-world applications** in cryptography, computing, and teleportation

## 🧪 Running Tests

```bash
# Frontend
cd frontend
npm run test

# Build check
npm run build
```

## 📄 License

This project was created for Hack4Impact IdeaCon 2026.

<p align="center">
  <strong>Made with ❤️ and quantum superposition</strong>
  <br>
  <em>The particles may be entangled, but learning should be fun!</em>
</p>
