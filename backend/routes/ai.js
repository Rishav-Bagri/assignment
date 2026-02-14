import express from "express";

const aiRouter = express.Router();

aiRouter.post("/generate", async (req, res) => {
    console.log("hi");
    
  try {
    const { topic, questionType, difficulty, bloomLevel } = req.body;

    if (!topic || !questionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let prompt;

if (questionType === "mcq") {
  prompt = `
You are an academic assessment question generator.

CRITICAL:
- Output ONLY valid JSON
- Do NOT use markdown
- Exactly ONE option must have "correct": true

Generate a high-quality MCQ question.

Topic: ${topic}
Difficulty: ${difficulty}
Bloom Level: ${bloomLevel}

Follow assessment best practices:
- Clear wording
- Plausible distractors
- Feedback must explain WHY correct or incorrect
- Option must be in 4-6 ranges
Return JSON in this format:

{
  "stem": "string",
  "learningObjective": "string",
  "generalFeedback": "string",
  "options": [
    {
      "text": "string",
      "correct": true,
      "feedback": "string"
    },
    {
      "text": "string",
      "correct": false,
      "feedback": "string"
    }
  ]
}
`;
}

if (questionType === "ordering") {
  prompt =`You are an academic assessment question generator.

CRITICAL RULES:
- Output ONLY valid JSON.
- Do NOT use markdown.
- The first character MUST be {.
- The response must be strictly parsable JSON.

Generate an ORDERING question.

Topic: ${topic}
Difficulty: ${difficulty}
Bloom Level: ${bloomLevel}

Important constraints:
- The question must ask students to arrange steps in the correct sequence.
- Each item must represent ONE step in a process.
- Items must NOT describe alternative methods.
- Items must NOT contain numbering like "1." or "(a)".
- Items must NOT contain full explanations.
- Items must be short action-based steps.
- Minimum 4 - 10 steps.
- Have a good stem defininf the problem.

Return JSON exactly in this format:

{
  "stem": "Arrange the following steps in the correct order.",
  "learningObjective": "string",
  "generalFeedback": "string",
  "items": [
    "Step description",
    "Step description",
    "Step description",
    "Step description"
  ]
}`
;
}

    const OLLAMA_BASE_URL =
    process.env.OLLAMA_BASE_URL || "http://localhost:11434";


    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:8b-instruct-q4_K_M",
        prompt,
        stream: false,
        options: {
          temperature: 0.7
        }
      })
    });

    const data = await response.json();

    if (!data.response) {
      return res.status(500).json({ error: "No response from Ollama" });
    }

    let parsed;
    let raw = data.response.trim();

// remove markdown fences if model adds them
raw = raw.replace(/```json|```/g, "");

// extract first JSON object
const jsonMatch = raw.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  console.error("No JSON found in:", raw);
  return res.status(500).json({ error: "Model did not return valid JSON" });
}

try {
  parsed = JSON.parse(jsonMatch[0]);
} catch (err) {
  console.error("JSON Parse Error:", jsonMatch[0]);
  return res.status(500).json({ error: "Invalid JSON from model" });
}

    // try {
    //   parsed = JSON.parse(data.response.trim());
    // } catch (e) {
    //   console.error("JSON Parse Error:", data.response);
    //   return res.status(500).json({ error: "Invalid JSON from model" });
    // }

    return res.json(parsed);

  } catch (err) {
    console.error("Internal Error:", err);
    return res.status(500).json({ error: "AI generation failed", details: err.message });
  }
});

export default aiRouter;
