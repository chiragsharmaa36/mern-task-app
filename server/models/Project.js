import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // team members
  activityLogs: [ActivityLogSchema]
}, { timestamps: true });

ProjectSchema.index({ manager: 1 });

export default mongoose.model('Project', ProjectSchema);