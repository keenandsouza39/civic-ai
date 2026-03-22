// AGENT: BACKEND
// Civic AI Platform — Express API Server
// Routes: POST /api/analyze, GET /api/health

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const rateLimit = require("express-rate-limit");
const { analyzeDocument } = require("./aiAnalysis");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman) in development
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const analyzeRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many analysis requests. Please try again in an hour.",
  },
});

// ─── File Upload (Memory Storage — no disk persistence) ─────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted."), false);
    }
  },
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Main analysis endpoint
app.post(
  "/api/analyze",
  analyzeRateLimit,
  upload.single("file"),
  async (req, res) => {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] POST /api/analyze — incoming request`);

    // ── Validation ──
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Please attach a PDF." });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return res.status(500).json({ error: "Server configuration error. Contact support." });
    }

    let extractedText;

    // ── PDF Text Extraction ──
    try {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;

      if (!extractedText || extractedText.trim().length < 50) {
        return res.status(422).json({
          error:
            "Could not extract readable text from this PDF. It may be scanned/image-based. Please use a text-based PDF.",
        });
      }

      console.log(
        `[${new Date().toISOString()}] PDF extracted — ${extractedText.length} chars, ${pdfData.numpages} pages`
      );
    } catch (pdfErr) {
      console.error("PDF parse error:", pdfErr.message);
      return res.status(422).json({
        error: "Failed to read PDF file. Please ensure the file is a valid, uncorrupted PDF.",
      });
    }

    // ── AI Analysis ──
    try {
      const analysis = await analyzeDocument(extractedText);
      const elapsed = Date.now() - startTime;

      console.log(`[${new Date().toISOString()}] Analysis complete in ${elapsed}ms`);

      return res.json({
        success: true,
        processingTimeMs: elapsed,
        analysis,
      });
    } catch (aiErr) {
      console.error("AI analysis error:", aiErr.message);
      return res.status(500).json({
        error: aiErr.message || "AI analysis failed. Please try again.",
      });
    }
  }
);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large. Maximum size is 10MB." });
  }
  if (err.message === "Only PDF files are accepted.") {
    return res.status(415).json({ error: err.message });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "An unexpected error occurred." });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Civic AI backend running on http://localhost:${PORT}`);
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? "✓ set" : "✗ MISSING"}`);
});
