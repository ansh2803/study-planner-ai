import express from 'express';
import { generateStudyPlan } from '../controllers/aiPlan.controller.js';
import { getStudyPlans } from '../controllers/aiPlan.controller.js';
const router = express.Router();

router.post('/generate', generateStudyPlan);
router.get('/', getStudyPlans);
export default router;