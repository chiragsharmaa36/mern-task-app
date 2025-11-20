import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set in .env');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');

  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({})
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin'
  });

  const pm = await User.create({
    name: 'Priya PM',
    email: 'priya.pm@example.com',
    role: 'ProjectManager'
  });

  const tm1 = await User.create({
    name: 'Ravi Team',
    email: 'ravi.team@example.com',
    role: 'TeamMember'
  });

  const tm2 = await User.create({
    name: 'Meera Team',
    email: 'meera.team@example.com',
    role: 'TeamMember'
  });

  const project = await Project.create({
    title: 'Project Alpha',
    description: 'Normalized schema test',
    manager: pm._id,
    members: [tm1._id, tm2._id],
    activityLogs: [{ actor: pm._id, action: 'Project created' }]
  });

  const task1 = await Task.create({
    project: project._id,
    title: 'Implement auth endpoints',
    assignedTo: tm1._id,
    assignedBy: pm._id,
    status: 'Todo',
    priority: 'High',
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000)
  });

  const task2 = await Task.create({
    project: project._id,
    title: 'Define DB schema',
    assignedTo: tm2._id,
    assignedBy: pm._id,
    status: 'InProgress',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000)
  });

  project.activityLogs.push(
    { actor: pm._id, action: `Task created: ${task1.title}`, meta: { taskId: task1._id } },
    { actor: pm._id, action: `Task created: ${task2.title}`, meta: { taskId: task2._id } }
  );
  await project.save();

  console.log('Seed complete');
  console.log({
    admin: admin._id.toString(),
    pm: pm._id.toString(),
    teamMembers: [tm1._id.toString(), tm2._id.toString()],
    project: project._id.toString(),
    tasks: [task1._id.toString(), task2._id.toString()]
  });

  await mongoose.disconnect();
  console.log('Disconnected');
}

main().catch(err => console.error(err));
