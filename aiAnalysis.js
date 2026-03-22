// Civic AI Platform — AI Integration Layer (Google Gemini version)
// Swap from Claude: only this file + package.json changed

const { GoogleGenerativeAI } = require("@google/generative-ai");

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_TEXT_CHARS = 15000;
const MODEL = "gemini-1.5-flash"; // Free tier model

// ─── Prompt ──────────────────────────────────────────────────────────────────
// Gemini uses a single combined prompt (no separate system prompt on free tier)

function buildAnalysisPrompt(text) {
  return `You are a nonpartisan civic education assistant. Your job is to help everyday citizens understand ballot propositions, voter guides, and policy documents.

You MUST:
- Use plain, clear language accessible to a general adult audience
- Present policy alignment analysis based on documented party platform positions — NOT personal advocacy
- Be factually accurate and balanced
- Return ONLY valid JSON with no extra commentary, markdown, or code fences

You MUST NOT:
- Advocate for any political position
- Use emotionally charged or partisan language
- Invent information not present in the document
- Include anything outside the JSON structure

Analyze the following civic document and return a JSON object with this EXACT structure. No markdown, no code fences — raw JSON only.

{
  "title": "<document title or best short description>",
  "documentType": "<one of: ballot_proposition | voter_guide | policy_document | candidate_guide | other>",
  "summary": "<2-3 sentence plain-language summary of what this document covers>",
  "simplified": "<explanation a 12-year-old could understand, 3-5 sentences, no jargon>",
  "impacts": [
    {
      "area": "<policy area, e.g. Education, Housing, Taxes, Public Safety>",
      "description": "<1-2 sentences describing the specific impact>",
      "direction": "<one of: positive | negative | neutral | mixed>"
    }
  ],
  "alignment": {
    "democratic": {
      "score": 0,
      "reasoning": "<1-2 sentences citing specific platform alignment or divergence>"
    },
    "republican": {
      "score": 0,
      "reasoning": "<1-2 sentences citing specific platform alignment or divergence>"
    },
    "independent": {
      "score": 0,
      "reasoning": "<1-2 sentences explaining centrist perspective>"
    }
  }
}

Rules for the "impacts" array: include 3-6 items covering the most significant policy areas.
Rules for alignment scores: use integers 0-100. Democratic: 100 = strongly aligned with Democratic platform. Republican: 100 = strongly aligned with Republican platform. Independent: 100 = strongly centrist. Base scores on documented party platform positions. A score of 50 means neutral/mixed.

DOCUMENT TEXT:
---
${text}
---`;
}

// ─── Chunking ─────────────────────────────────────────────────────────────────

function truncateText(text) {
  if (text.length <= MAX_TEXT_CHARS) return text;
  const firstPart = text.slice(0, Math.floor(MAX_TEXT_CHARS * 0.6));
  const lastPart = text.slice(text.length - Math.floor(MAX_TEXT_CHARS * 0.4));
  return firstPart + "\n\n[... document truncated ...]\n\n" + lastPart;
}

// ─── Response Validation ──────────────────────────────────────────────────────

function validateAndNormalizeResponse(parsed) {
  const validDirections = ["positive", "negative", "neutral", "mixed"];
  const result = {
    title: parsed.title || "Civic Document",
    documentType: parsed.documentType || "other",
    summary: parsed.summary || "Summary not available.",
    simplified: parsed.simplified || "Simplified explanation not available.",
    impacts: Array.isArray(parsed.impacts) ? parsed.impacts : [],
    alignment: {
      democratic: {
        score: parsed.alignment?.democratic?.score ?? 50,
        reasoning: parsed.alignment?.democratic?.reasoning || "Analysis not available.",
      },
      republican: {
        score: parsed.alignment?.republican?.score ?? 50,
        reasoning: parsed.alignment?.republican?.reasoning || "Analysis not available.",
      },
      independent: {
        score: parsed.alignment?.independent?.score ?? 50,
        reasoning: parsed.alignment?.independent?.reasoning || "Analysis not available.",
      },
    },
  };

  // Clamp scores to 0-100
  for (const party of ["democratic", "republican", "independent"]) {
    result.alignment[party].score = Math.max(0, Math.min(100, result.alignment[party].score));
  }

  // Validate impact directions
  result.impacts = result.impacts.map((impact) => ({
    area: impact.area || "General",
    description: impact.description || "",
    direction: validDirections.includes(impact.direction) ? impact.direction : "neutral",
  }));

  return result;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

async function analyzeDocument(rawText) {
  if (!rawText || rawText.trim().length < 50) {
    throw new Error("Document text is too short or empty. Please upload a valid PDF.");
  }

  const processedText = truncateText(rawText.trim());
  const prompt = buildAnalysisPrompt(processedText);

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const model = client.getGenerativeModel({ model: MODEL });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Strip any accidental markdown fences Gemini sometimes adds
      const cleaned = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      return validateAndNormalizeResponse(parsed);
    } catch (err) {
      if (attempts === maxAttempts) {
        throw new Error(`AI analysis failed after ${maxAttempts} attempts: ${err.message}`);
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

module.exports = { analyzeDocument };
