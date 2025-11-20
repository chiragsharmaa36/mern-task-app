import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // team member
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // project manager or admin
  status: { type: String, enum: ['Todo','InProgress','Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  dueDate: { type: Date }
}, { timestamps: true });

// indexes to speed common queries
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ dueDate: 1 });

export default mongoose.model('Task', TaskSchema);