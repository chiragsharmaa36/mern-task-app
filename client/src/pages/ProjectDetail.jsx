import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import CreateTaskForm from '../components/CreateTaskForm';

export default function ProjectDetail() {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}`);
      setProjectData(res.data.project);
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [id]);

  const onTaskCreated = (newTask) => {
    // add newly created task to top
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleStatus = async (task) => {
    const next = task.status === 'Done' ? 'Todo' : 'Done';
    try {
      const res = await api.put(`/tasks/${task._id}`, { status: next });
      setTasks(prev => prev.map(t => t._id === task._id ? res.data : t));
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="container"><div className="card">Loading...</div></div>;
  if (error) return <div className="container"><div className="card">Error: {error}</div></div>;
  if (!projectData) return <div className="container"><div className="card">Project not found</div></div>;

  return (
    <div className="container">
      <div className="card">
        <div className="space-between">
          <div>
            <h2 style={{ margin: 0 }}>{projectData.title}</h2>
            <div className="small-muted">{projectData.description}</div>
            <div style={{ marginTop: 8 }} className="small-muted">Manager: {projectData.manager?.name}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 12 }}>
        <div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Tasks ({tasks.length})</h3>
            {tasks.length === 0 && <div className="small-muted">No tasks yet.</div>}

            {tasks.map(task => (
              <div key={task._id} className="card" style={{ marginBottom: 8 }}>
                <div className="space-between">
                  <div>
                    <strong>{task.title}</strong>
                    <div className="small-muted">{task.description}</div>
                    <div style={{ marginTop: 6 }} className="small-muted">
                      Assigned to: {task.assignedTo?.name || '—'} — By: {task.assignedBy?.name || '—'}
                    </div>
                    <div className="small-muted">Priority: {task.priority} • Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button className="button" onClick={() => toggleStatus(task)}>{task.status === 'Done' ? 'Reopen' : 'Mark Done'}</button>
                    <div style={{ marginTop: 8 }} className="small-muted">{task.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Create Task</h3>
            <CreateTaskForm projectId={projectData._id} onCreated={onTaskCreated} />
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <h4 style={{ marginTop: 0 }}>Members</h4>
            {projectData.members?.map(m => (
              <div key={m._id} className="small-muted" style={{ padding: '6px 0' }}>{m.name} • {m.email}</div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
