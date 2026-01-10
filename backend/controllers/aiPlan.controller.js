import axios from "axios";
import StudyPlan from "../models/StudyPlan.js";

export const generateStudyPlan = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { subjects, dailyHours, goal, studyTime } = req.body;

    // Basic validation
    if (!subjects || !dailyHours || !goal || !studyTime) {
      return res.status(400).json({
        error: "subjects, dailyHours, goal and studyTime are required",
      });
    }

    const prompt = `
You are an AI study planner.

CRITICAL RULES (MUST FOLLOW STRICTLY):
1. Use ONLY the subjects provided below.
2. DO NOT add, invent, rename, or assume any other subjects.
3. Every task's "subject" field MUST exactly match one of the provided subject names.
4. If only one subject is provided, ALL days must use that same subject.
5. Output ONLY valid JSON. No text, no explanation, no markdown.

Create a 7-day study plan as a JSON array.

Each item MUST have exactly these keys:
- "day" (string, e.g. "Day 1")
- "subject" (string — MUST be from the provided subjects)
- "task" (string)
- "duration_hours" (number)

Total study time per day must NOT exceed ${dailyHours} hours.

Provided subjects (DO NOT GO OUTSIDE THIS LIST):
${subjects.map((s) => `- ${s.name}`).join("\n")}

Additional guidance:
- Focus depth according to confidence and priority
- Include at least one revision task
- Keep tasks realistic and specific

Return ONLY the JSON array.
`;

    //     const prompt = `
    // You are an expert academic planner for MCA students.

    // Create a 7-day study plan based on the student's context.

    // IMPORTANT RULES (FOLLOW STRICTLY):
    // - Output MUST be a valid JSON ARRAY
    // - Do NOT add explanations or text
    // - Do NOT wrap output in markdown or backticks
    // - Use ONLY the keys specified below

    // Each array element MUST contain exactly:
    // - "day" (string, e.g. "Day 1")
    // - "subject" (string)
    // - "task" (string)
    // - "duration_hours" (number)

    // Example format:
    // [
    //   {
    //     "day": "Day 1",
    //     "subject": "Data Structures",
    //     "task": "Study arrays and linked lists",
    //     "duration_hours": 2
    //   }
    // ]

    // STUDENT CONTEXT:
    // - Daily study hours: ${dailyHours}
    // - Study goal: ${goal}
    // - Best study time: ${studyTime}

    // SUBJECT DETAILS:
    // ${subjects
    //   .map(
    //     (s) =>
    //       `- ${s.name}
    //         Confidence level (1–5): ${s.confidence}
    //         Priority: ${s.priority}
    //         Total units: ${s.units}`
    //   )
    //   .join("\n")}

    // PLANNING RULES:
    // - Allocate MORE time to subjects with LOW confidence (1–2)
    // - Respect subject priority (High > Medium > Low)
    // - Align harder tasks earlier in the week if confidence is low
    // - Include at least one revision task in the week
    // - Do NOT exceed daily study hours
    // - Keep tasks realistic and student-friendly

    // Return ONLY the JSON array.
    // `;

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

    let aiText = response.data.choices[0].message.content;

    // Remove accidental markdown if any
    aiText = aiText.replace(/```json|```/g, "").trim();

    let parsedPlan;
    try {
      parsedPlan = JSON.parse(aiText);
    } catch (err) {
      console.error("INVALID AI JSON:", aiText);
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
    console.log("OPENROUTER KEY:", process.env.OPENROUTER_API_KEY);
    console.log("REQ BODY:", req.body);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch study plans",
    });
  }
};

// Update task completion
export const updateTaskStatus = async (req, res) => {
  const { planId, taskIndex } = req.params;
  const { completed } = req.body;

  try {
    const plan = await StudyPlan.findById(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    plan.plan[taskIndex].completed = completed;
    await plan.save();

    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete entire study plan
export const deleteStudyPlan = async (req, res) => {
  try {
    await StudyPlan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete plan" });
  }
};
