import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function CreateTaskForm({ projectId, onCreated }) {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedBy, setAssignedBy] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch project members & all users to pick assigner
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [pRes, uRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get('/users')
        ]);
        if (!mounted) return;
        setMembers(pRes.data.project.members || []);
        setUsers(uRes.data || []);
        // set defaults
        if (pRes.data.project.members?.[0]) setAssignedTo(pRes.data.project.members[0]._id);
        if (uRes.data?.[0]) setAssignedBy(uRes.data[0]._id);
      } catch (err) {
        console.error('Failed to fetch members/users', err);
      }
    })();
    return () => { mounted = false; };
  }, [projectId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!title) return alert('Title required');
    setLoading(true);
    try {
      const payload = {
        project: projectId,
        title,
        assignedTo: assignedTo || null,
        assignedBy: assignedBy || null,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
      };
      const res = await api.post('/tasks', payload);
      onCreated && onCreated(res.data);
      // clear some fields
      setTitle('');
      setDueDate('');
    } catch (err) {
      alert('Create failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label>Title</label>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="form-row">
        <label>Assigned To (member)</label>
        <select className="input" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
          <option value="">-- Unassigned --</option>
          {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
        </select>
      </div>

      <div className="form-row">
        <label>Assigned By (user)</label>
        <select className="input" value={assignedBy} onChange={e => setAssignedBy(e.target.value)}>
          <option value="">-- Select --</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
        </select>
      </div>

      <div className="form-row">
        <label>Priority</label>
        <select className="input" value={priority} onChange={e => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="form-row">
        <label>Due date</label>
        <input className="input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </div>

      <div className="form-row">
        <button className="button" disabled={loading} type="submit">{loading ? 'Creating...' : 'Create'}</button>
      </div>
    </form>
  );
}
