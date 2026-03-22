# Civic AI Platform

A nonpartisan web platform that helps citizens understand ballot propositions and voter guides through AI-powered plain-language analysis.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CIVIC AI PLATFORM                         │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────────────┐  │
│  │   FRONTEND       │         │      BACKEND             │  │
│  │  React + Vite    │──POST──▶│  Node.js + Express       │  │
│  │  (Vercel)        │◀──JSON──│  (Render / Heroku)       │  │
│  └──────────────────┘         └──────────┬───────────────┘  │
│                                          │                  │
│                               ┌──────────▼───────────────┐  │
│                               │   pdf-parse              │  │
│                               │   (text extraction)      │  │
│                               └──────────┬───────────────┘  │
│                                          │                  │
│                               ┌──────────▼───────────────┐  │
│                               │   Anthropic Claude API   │  │
│                               │   (claude-sonnet-4)      │  │
│                               └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User drags/drops a PDF into the browser
2. Frontend sends `POST /api/analyze` with `multipart/form-data`
3. Backend receives file via multer (memory storage — no disk write)
4. `pdf-parse` extracts text from the PDF buffer
5. Text is truncated/chunked if >15,000 chars
6. Backend calls Claude API with structured prompt
7. Claude returns JSON: `{ title, summary, simplified, impacts, alignment }`
8. Backend validates/normalizes and returns JSON to frontend
9. Frontend renders tabbed results UI

---

## Project Structure

```
civic-ai/
├── README.md
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       └── components/
│           ├── HeroHeader.jsx
│           ├── UploadZone.jsx
│           ├── LoadingState.jsx
│           ├── AnalysisResults.jsx
│           ├── AlignmentChart.jsx
│           └── Footer.jsx
└── backend/
    ├── server.js          ← Express API server
    ├── aiAnalysis.js      ← Claude API integration & prompts
    ├── package.json
    └── .env.example
```

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set CLAUDE_API_KEY=sk-ant-your-key
npm install
npm run dev
# Backend runs on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
# Vite proxies /api → http://localhost:3001
```

Open http://localhost:5173 in your browser.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `CLAUDE_API_KEY` | ✅ Yes | Your Anthropic API key |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins (default: localhost) |
| `PORT` | No | Server port (default: 3001) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Production only | Full backend URL (e.g. `https://your-backend.onrender.com/api`) |

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
# Set VITE_API_URL=https://your-backend.onrender.com/api in Vercel environment vars
```

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel --cwd frontend
```

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add environment variables:
   - `CLAUDE_API_KEY` = your key
   - `ALLOWED_ORIGINS` = your Vercel frontend URL
   - `NODE_ENV` = `production`

---

## API Reference

### `POST /api/analyze`

Upload a PDF for AI analysis.

**Request**: `multipart/form-data`
- `file`: PDF file (max 10MB)

**Response** (200 OK):
```json
{
  "success": true,
  "processingTimeMs": 18432,
  "analysis": {
    "title": "Proposition 47 — Community Schools Act",
    "documentType": "ballot_proposition",
    "summary": "...",
    "simplified": "...",
    "impacts": [
      { "area": "Education", "description": "...", "direction": "positive" }
    ],
    "alignment": {
      "democratic": { "score": 72, "reasoning": "..." },
      "republican": { "score": 31, "reasoning": "..." },
      "independent": { "score": 54, "reasoning": "..." }
    }
  }
}
```

**Error Response** (4xx/5xx):
```json
{ "error": "Human-readable error message" }
```

### `GET /api/health`
Returns `{ "status": "ok", "timestamp": "...", "version": "1.0.0" }`

---

## Testing Plan

### Manual Test Checklist

- [ ] Upload a valid ballot proposition PDF → analysis displays
- [ ] Upload a non-PDF file → error message shown
- [ ] Upload a PDF > 10MB → size error shown
- [ ] Upload a scanned/image PDF → "no extractable text" error
- [ ] All 4 tabs render correctly (Summary, Simplified, Impacts, Alignment)
- [ ] Alignment bars animate on load
- [ ] "Analyze Another" button resets correctly
- [ ] Works on mobile viewport
- [ ] Loading steps cycle during analysis

### Integration Test (curl)

```bash
# Health check
curl http://localhost:3001/api/health

# Analyze a PDF
curl -X POST http://localhost:3001/api/analyze \
  -F "file=@/path/to/your/ballot-proposition.pdf"
```

### Unit Tests (examples)

```javascript
// Test: validateAndNormalizeResponse clamps scores
const result = validateAndNormalizeResponse({ alignment: { democratic: { score: 150 } } })
assert(result.alignment.democratic.score === 100)

// Test: truncateText respects MAX_TEXT_CHARS
const long = 'x'.repeat(20000)
const truncated = truncateText(long)
assert(truncated.length <= 15100) // allows for separator text
```

---

## Security Notes

- API keys are **server-side only** — never sent to the browser
- PDFs are processed **in memory** — never written to disk
- Rate limiting: **10 requests/IP/hour**
- File size limit: **10MB**
- CORS restricted to configured origins in production
- Input validation on both client and server

---

## Nonpartisan Disclaimer

Political alignment indicators are based on documented party platform positions and are provided for educational context only. This platform does not endorse any political party or candidate. Always verify information with official government and campaign sources before voting.
