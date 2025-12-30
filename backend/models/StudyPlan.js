import mongoose from 'mongoose';
const studyPlanSchema = new mongoose.Schema({
    userId: String,
    plan: Array,
    createdAt: {
        type: Date,
        default: Date.now
    }

});
export default mongoose.model('StudyPlan', studyPlanSchema);