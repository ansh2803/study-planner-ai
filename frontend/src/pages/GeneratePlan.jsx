import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const GeneratePlan = () => {
  const navigate = useNavigate();

  const [dailyHours, setDailyHours] = useState(4);
  const [goal, setGoal] = useState("Exam Preparation");
  const [studyTime, setStudyTime] = useState("Night");

  const [subjects, setSubjects] = useState([
    {
      name: "",
      confidence: 3,   // 1–5
      units: 1,
      priority: "Medium",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        name: "",
        confidence: 3,
        units: 1,
        priority: "Medium",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/ai-plan/generate", {
        dailyHours,
        goal,
        studyTime,
        subjects,
      });

      alert("Study plan generated successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Error generating plan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Generate AI Study Plan</h2>

      <form onSubmit={handleSubmit}>
        {/* Global Inputs */}
        <label>Daily Study Hours</label>
        <input
          type="number"
          value={dailyHours}
          onChange={(e) => setDailyHours(e.target.value)}
        />

        <label>Study Goal</label>
        <select value={goal} onChange={(e) => setGoal(e.target.value)}>
          <option>Exam Preparation</option>
          <option>Concept Clarity</option>
          <option>Revision</option>
          <option>Backlog Clearance</option>
        </select>

        <label>Best Study Time</label>
        <select value={studyTime} onChange={(e) => setStudyTime(e.target.value)}>
          <option>Morning</option>
          <option>Evening</option>
          <option>Night</option>
        </select>

        <hr />

        {/* Subject Inputs */}
        {subjects.map((sub, idx) => (
          <div key={idx} className="card">
            <input
              placeholder="Subject name"
              value={sub.name}
              onChange={(e) => handleChange(idx, "name", e.target.value)}
            />

            <label>Confidence Level (1 = weak, 5 = strong)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={sub.confidence}
              onChange={(e) =>
                handleChange(idx, "confidence", Number(e.target.value))
              }
            />

            <label>Number of Units</label>
            <input
              type="number"
              value={sub.units}
              onChange={(e) =>
                handleChange(idx, "units", Number(e.target.value))
              }
            />

            <label>Priority</label>
            <select
              value={sub.priority}
              onChange={(e) =>
                handleChange(idx, "priority", e.target.value)
              }
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        ))}

        <button type="button" onClick={addSubject}>
          ➕ Add Subject
        </button>

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </form>
    </div>
  );
};

export default GeneratePlan;
