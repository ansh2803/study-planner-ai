import axios from "axios";
import StudyPlan from "../models/StudyPlan.js";

export const generateStudyPlan = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { subjects, dailyHours } = req.body;

    if (!subjects || !dailyHours) {
      return res.status(400).json({
        error: "subjects and dailyHours are required",
      });
    }

    const prompt = `
You are an expert academic planner for MCA students.

Create a 7-day study plan.

IMPORTANT:
- Output MUST be a valid JSON ARRAY
- Do NOT add any explanation, text, or markdown
- Do NOT wrap the JSON in backticks
- Use ONLY the keys specified below

Each array element MUST have exactly these keys:
- "day" (string, example: "Day 1")
- "subject" (string)
- "task" (string)
- "duration_hours" (number, example: 2)

Example output format:
[
  {
    "day": "Day 1",
    "subject": "Data Structures",
    "task": "Study Arrays and Linked Lists",
    "duration_hours": 2
  }
]

Subjects:
${subjects
  .map(
    (s) =>
      `- ${s.name}, Difficulty: ${s.difficulty}, Exam Date: ${s.examDate}, Units: ${s.units}`
  )
  .join("\n")}

Rules:
- Allocate more time to subjects marked as Hard
- Include at least one revision task during the week
- Ensure total daily study time does not exceed the given daily hours

Return ONLY the JSON array.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // const plan = response.data.choices[0].message.content;
    let aiText = response.data.choices[0].message.content;

    // it remove markdown if AI adds ```json
    aiText = aiText.replace(/```json|```/g, "").trim();

    let parsedPlan;
    try {
      parsedPlan = JSON.parse(aiText);
    } catch (err) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: aiText,
      });
    }
    const savedPlan = await StudyPlan.create({
      plan: parsedPlan,
    });
    res.status(201).json({
      message: "Study plan generated and saved",
      data: savedPlan,
    });
  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI generation failed" });
  }
};

export const getStudyPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find().sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch study plans",
    });
  }
};
