import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    day: String,
    subject: String,
    task: String,
    duration_hours: Number,
    completed: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "guest"
    },

    dailyHours: Number,
    goal: String,
    studyTime: String,

    subjects: [
      {
        name: String,
        confidence: Number,
        units: Number,
        priority: String
      }
    ],

    plan: [taskSchema],

    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

export default mongoose.model("StudyPlan", studyPlanSchema);

/*import mongoose from 'mongoose';
const studyPlanSchema = new mongoose.Schema({
    userId: String,
    plan: Array,
    createdAt: {
        type: Date,
        default: Date.now
    }

});
export default mongoose.model('StudyPlan', studyPlanSchema);*/
