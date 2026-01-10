import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    navigate("/generate");
  };
  return (
    <div className="container">
      <h1>AI-STUDY-PLANNER</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "20px", marginBottom: "10px" }} />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}  style={{ width: "100%", padding: "20px", marginBottom: "20px" }}
        />
        <button>Login</button>
        <div className="auth-container">
           <p style={{ marginTop: "15px" }}>Don’t have an account?</p>

        <Link to="/signup">
          <button style={{ width: "100%", marginTop: "5px" }}>
            Create Account
          </button>
        </Link>
        </div>
       
      </form>
    </div>
  );
};

export default Login;
