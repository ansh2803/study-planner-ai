import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = () => {
    API.get("/ai-plan")
      .then((res) => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const toggleTask = async (planId, index, value) => {
    await API.patch(`/ai-plan/${planId}/task/${index}`, {
      completed: value,
    });
    fetchPlans();
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Delete this study plan?")) return;
    await API.delete(`/ai-plan/${id}`);
    fetchPlans();
  };

  if (loading) return <p>Loading study plans...</p>;

  return (
    <div className="container">
      <h2>My Study Plans</h2>

      {plans.map((planDoc) => {
        const total = planDoc.plan.length;
        const done = planDoc.plan.filter((t) => t.completed).length;
        const progress = Math.round((done / total) * 100);

        return (
          <div key={planDoc._id} className="card" style={{ marginBottom: "25px" }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <b>Goal:</b> {planDoc.goal} <br />
                <b>Daily Hours:</b> {planDoc.dailyHours} <br />
                <b>Study Time:</b> {planDoc.studyTime}
              </div>

              <button
                style={{ background: "red", color: "white"
                , border: "none", 
                borderRadius: "5px", 
                cursor: "pointer", 
                height: "50px" }}
                onClick={() => deletePlan(planDoc._id)}
              >
                ❌
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{ margin: "10px 0" }}>
              <div style={{
                height: "10px",
                background: "#ddd",
                borderRadius: "5px"
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#2ecc71",
                  borderRadius: "5px"
                }} />
              </div>
              <small>{progress}% completed</small>
            </div>

            {/* Tasks */}
            {planDoc.plan.map((item, index) => (
              <div key={index} className="card">
                <label>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) =>
                      toggleTask(planDoc._id, index, e.target.checked)
                    }
                  />
                  <b style={{ marginLeft: "8px" }}>{item.day}</b>
                </label>

                <p><b>Subject:</b> {item.subject}</p>
                <p><b>Task:</b> {item.task}</p>
                <p><b>Duration:</b> {item.duration_hours} hrs</p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
