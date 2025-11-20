import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js'
import projectsRouter from './routes/projects.js'
import tasksRouter from './routes/tasks.js'


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
}

start();