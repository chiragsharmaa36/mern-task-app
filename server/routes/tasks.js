import express from 'express';
import Task from '../models/Task.js';
const router = express.Router();

// GET /api/tasks - all tasks or filter by query ?assignedTo=...&status=Todo
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.project) filter.project = req.query.project;
    const tasks = await Task.find(filter).populate('assignedTo assignedBy','name email role').lean();
    res.json(tasks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const t = await Task.findById(req.params.id).populate('assignedTo assignedBy','name email').lean();
    if (!t) return res.status(404).json({ message: 'Task not found' });
    res.json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { project, title, assignedTo, assignedBy, dueDate, priority } = req.body;
    if (!project || !title) return res.status(400).json({ message: 'project and title required' });
    const created = await Task.create({ project, title, assignedTo, assignedBy, dueDate, priority });
    res.status(201).json(created);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/tasks/:id - update status, assignee etc.
router.put('/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const del = await Task.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
