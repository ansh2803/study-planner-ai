import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";


const GeneratePlan = () => {
  const navigate = useNavigate();
  const [dailyHours, setDailyHours] = useState(4);
  const [subjects, setSubjects] = useState([
    { name: "", difficulty: "Medium", examDate: "", units: 1 },
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
      { name: "", difficulty: "Medium", examDate: "", units: 1 },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/ai-plan/generate", {
        dailyHours,
        subjects,
      });
    } catch (err) {
      alert("Error generating plan");
      console.error(err);
    } finally {
      setLoading(false);
    }
    navigate("/dashboard");

    setLoading(true);

    try {
      await API.post("/ai-plan/generate", {
        dailyHours,
        subjects,
      });

      alert("Study plan generated successfully!");
      // onPlanGenerated(); // refresh dashboard
    } catch (err) {
      alert("Error generating plan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2> Generate AI Study Plan</h2>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", color: "#34495e" }}>Daily Study Hours</label>
        <input
          type="number"
          value={dailyHours}
          onChange={(e) => setDailyHours(e.target.value)}
        />

        <hr />

        {subjects.map((sub, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <input
              placeholder="Subject name"
              value={sub.name}
              onChange={(e) => handleChange(idx, "name", e.target.value)}
            />

            <select
              value={sub.difficulty}
              onChange={(e) => handleChange(idx, "difficulty", e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <input
              type="date"
              value={sub.examDate}
              onChange={(e) => handleChange(idx, "examDate", e.target.value)}
            />

            <input
              type="number"
              placeholder="Units"
              value={sub.units}
              onChange={(e) => handleChange(idx, "units", e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={addSubject}>
          ➕ Add Subject
        </button>

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </form>
    </div>
  );
};

export default GeneratePlan;
