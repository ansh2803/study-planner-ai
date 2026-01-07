import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiPlan.routes.js';
import connectDB from './config/db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/ai-plan', aiRoutes);
app.get("/", (req, res) => {
  res.send("Study Planner AI Backend is running");
});

app.listen(5000, ()=>{
    console.log('Server is running on port 5000');
    connectDB();
});