import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import { GoogleGenerativeAI } from "@google/generative-ai";

const { Pool } = pg;
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize database tables
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        question_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        selected_answer TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(question_id, user_name)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS short_answers (
        id SERIAL PRIMARY KEY,
        question_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        answer TEXT NOT NULL,
        score INTEGER NOT NULL,
        feedback TEXT NOT NULL,
        correct BOOLEAN NOT NULL,
        missed_points TEXT[] DEFAULT '{}',
        strengths TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        page_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Database tables initialized");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

// Parse JSON from Gemini response
function parseGeminiJSON(text) {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    // Try parsing directly
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON parsing error:", error);
    // Return default response if parsing fails
    return {
      score: 0,
      feedback: "Unable to grade response. Please try again.",
      correct: false,
      missedPoints: [],
      strengths: "",
    };
  }
}

// Routes

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    res.json({
      status: "healthy",
      message: "Backend is running",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", message: error.message });
  }
});

// Submit multiple choice quiz
app.post("/api/quiz/submit", async (req, res) => {
  const client = await pool.connect();

  try {
    const { questionId, userName, selectedAnswer, correctAnswer } = req.body;
    const isCorrect = selectedAnswer === correctAnswer;

    // Use UPSERT (INSERT ... ON CONFLICT)
    await client.query(
      `
      INSERT INTO quiz_results (question_id, user_name, selected_answer, is_correct, timestamp)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (question_id, user_name)
      DO UPDATE SET 
        selected_answer = EXCLUDED.selected_answer,
        is_correct = EXCLUDED.is_correct,
        timestamp = CURRENT_TIMESTAMP
    `,
      [questionId, userName, selectedAnswer, isCorrect]
    );

    // Get current results for this question
    const results = await client.query(
      "SELECT selected_answer, user_name FROM quiz_results WHERE question_id = $1",
      [questionId]
    );

    // Aggregate results by answer
    const answerCounts = {};
    const answerUsers = {};

    results.rows.forEach((row) => {
      const answer = row.selected_answer;
      const user = row.user_name;

      if (!answerCounts[answer]) {
        answerCounts[answer] = 0;
        answerUsers[answer] = [];
      }

      answerCounts[answer]++;
      answerUsers[answer].push(user);
    });

    res.json({
      success: true,
      isCorrect,
      results: {
        counts: answerCounts,
        users: answerUsers,
        total: results.rows.length,
      },
    });
  } catch (error) {
    console.error("Error in submit_quiz:", error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Get quiz results
app.get("/api/quiz/results/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    const results = await pool.query(
      "SELECT selected_answer, user_name FROM quiz_results WHERE question_id = $1",
      [questionId]
    );

    const answerCounts = {};
    const answerUsers = {};

    results.rows.forEach((row) => {
      const answer = row.selected_answer;
      const user = row.user_name;

      if (!answerCounts[answer]) {
        answerCounts[answer] = 0;
        answerUsers[answer] = [];
      }

      answerCounts[answer]++;
      answerUsers[answer].push(user);
    });

    res.json({
      counts: answerCounts,
      users: answerUsers,
      total: results.rows.length,
    });
  } catch (error) {
    console.error("Error in get_quiz_results:", error);
    res.status(500).json({ error: error.message });
  }
});

// Grade short answer using Gemini AI
app.post("/api/grade-answer", async (req, res) => {
  try {
    const {
      questionId,
      userName,
      question,
      answer,
      rubric,
      keyPoints = [],
    } = req.body;

    // Construct prompt for Gemini
    const prompt = `You are grading a student's answer to a quantum computing question.

Question: ${question}

Grading Rubric: ${rubric}

Key points that should be mentioned: ${keyPoints.join(", ")}

Student's Answer: ${answer}

Please evaluate this answer and respond with ONLY a valid JSON object (no markdown, no code blocks) containing:
1. "score": A number from 0-100
2. "feedback": Constructive feedback (2-3 sentences)
3. "correct": Boolean - true if score >= 70
4. "missedPoints": Array of key concepts the student missed (if any)
5. "strengths": What the student did well (1-2 sentences)

Be encouraging but accurate. Partial credit for partially correct answers.

Example format:
{"score": 85, "feedback": "Good explanation...", "correct": true, "missedPoints": [], "strengths": "Clear understanding..."}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const gradingResult = parseGeminiJSON(text);

    // Store in database
    await pool.query(
      `
      INSERT INTO short_answers (
        question_id, user_name, answer, score, feedback, 
        correct, missed_points, strengths, timestamp
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
    `,
      [
        questionId,
        userName,
        answer,
        gradingResult.score,
        gradingResult.feedback,
        gradingResult.correct,
        gradingResult.missedPoints || [],
        gradingResult.strengths || "",
      ]
    );

    res.json(gradingResult);
  } catch (error) {
    console.error("Error in grade_answer:", error);
    res.status(500).json({
      score: 0,
      feedback: `Error grading answer: ${error.message}`,
      correct: false,
      missedPoints: [],
      strengths: "",
    });
  }
});

// Add comment
app.post("/api/comments", async (req, res) => {
  try {
    const { pageId, userName, comment } = req.body;

    const result = await pool.query(
      `
      INSERT INTO comments (page_id, user_name, comment, timestamp)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING id, page_id, user_name, comment, timestamp
    `,
      [pageId, userName, comment]
    );

    const newComment = result.rows[0];

    res.json({
      success: true,
      comment: {
        _id: newComment.id.toString(),
        pageId: newComment.page_id,
        userName: newComment.user_name,
        comment: newComment.comment,
        timestamp: newComment.timestamp.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in add_comment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get comments
app.get("/api/comments/:pageId", async (req, res) => {
  try {
    const { pageId } = req.params;

    const results = await pool.query(
      "SELECT id, page_id, user_name, comment, timestamp FROM comments WHERE page_id = $1 ORDER BY timestamp DESC",
      [pageId]
    );

    const comments = results.rows.map((row) => ({
      _id: row.id.toString(),
      pageId: row.page_id,
      userName: row.user_name,
      comment: row.comment,
      timestamp: row.timestamp.toISOString(),
    }));

    res.json({ comments });
  } catch (error) {
    console.error("Error in get_comments:", error);
    res.status(500).json({ error: error.message });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n👋 Shutting down gracefully...");
  await pool.end();
  process.exit(0);
});
