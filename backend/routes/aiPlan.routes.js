import express from 'express';
import { generateStudyPlan } from '../controllers/aiPlan.controller.js';
import { getStudyPlans } from '../controllers/aiPlan.controller.js';
import { updateTaskStatus } from '../controllers/aiPlan.controller.js';
import { deleteStudyPlan } from '../controllers/aiPlan.controller.js';
const router = express.Router();

router.post('/generate', generateStudyPlan);
router.get('/', getStudyPlans);

router.patch("/:planId/task/:taskIndex", updateTaskStatus);
router.delete("/:id", deleteStudyPlan);
export default router;