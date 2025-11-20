import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function ProjectsList() {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get('/projects')
      .then(res => { if (mounted) setProjects(res.data); })
      .catch(err => { if (mounted) setError(err.message || 'Failed'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="container"><div className="card">Loading projects...</div></div>;
  if (error) return <div className="container"><div className="card">Error: {error}</div></div>;

  return (
    <div className="container">
      <div className="space-between" style={{ marginBottom: 12 }}>
        <h2>Projects ({projects.length})</h2>
      </div>

      {projects.length === 0 && <div className="card">No projects. Create one via Postman or seed script.</div>}

      {projects.map(p => (
        <div className="card" key={p._id}>
          <div className="space-between">
            <div>
              <h3 style={{ margin: 0 }}><Link to={`/projects/${p._id}`}>{p.title}</Link></h3>
              <div className="small-muted">{p.description}</div>
              <div style={{ marginTop: 8 }} className="small-muted">Manager: {p.manager?.name || '—'} ({p.manager?.email || '—'})</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="small-muted" style={{marginBottom:12}}>Members: {p.members?.length || 0}</div>
              <Link to={`/projects/${p._id}`} className="button" style={{ marginTop: 8 }}>Open</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
