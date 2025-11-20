import express from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
const router = express.Router();

// GET /api/projects - list
router.get('/', async (req, res) => {
  try {
    const list = await Project.find().populate('manager','name email role').populate('members','name email role').lean();
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/projects/:id - detail (include tasks)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager','name email')
      .populate('members','name email')
      .lean();
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const tasks = await Task.find({ project: project._id }).populate('assignedTo assignedBy','name email role').lean();
    res.json({ project, tasks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/projects - create (requires manager id & optional members array)
router.post('/', async (req, res) => {
  try {
    const { title, description, manager, members = [] } = req.body;
    if (!title || !manager) return res.status(400).json({ message: 'title and manager required' });
    const p = await Project.create({ title, description, manager, members });
    res.status(201).json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/projects/:id - update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const del = await Project.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Project not found' });
    // Optionally remove tasks: await Task.deleteMany({ project: del._id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
