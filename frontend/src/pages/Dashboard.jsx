import React from "react";
import { useEffect, useState } from "react";
// import API from "../api/API";
import API from "../services/api";



const Dashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/ai-plan")
      .then((res) => {
        console.log("api response",res.data);
        setPlans(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading study plans...</p>;


  return (
    <div className="container">
      <h2>My Study Plans</h2>
      {plans.length === 0 && <p>No plans generated yet.</p>}
      {plans.map((planDoc) =>
        planDoc.plan.map((item, index) => (
          <div className="card"
            key={index}
          >
          <pre className="pre">{JSON.stringify(item)}</pre>
            <h4>{item.day}</h4>
            <p>
              <b>Subject:</b> {item.subject}
            </p>
            <p>
              <b>Task:</b> {item.task}
            </p>
            <p>
              <b>Duration:</b> {item.duration_hours} hrs
            </p>
          </div>
        ))
      )}
    </div>
    
  );
};

export default Dashboard;
