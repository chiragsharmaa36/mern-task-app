import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Admin', 'ProjectManager', 'TeamMember'],
    default: 'TeamMember'
  },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // who manages this user
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],             // projects this user is part of (denormalized)
  manages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });


export default mongoose.model('User', UserSchema);