import axios from "axios";
const API = axios.create({
  baseURL: "https://study-planner-ai-frhq.onrender.com/api"
});

export default API;
