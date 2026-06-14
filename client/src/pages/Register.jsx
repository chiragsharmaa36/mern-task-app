import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data);
      navigate('/');
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Register failed';
      setError(serverMessage);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Register</h2>
    {/* CONDITIONAL RENDER: If error exists, show this banner! */}
    {error && (
      <div style={{ 
        backgroundColor: '#ffdde0', 
        color: '#d32f2f', 
        padding: '10px', 
        borderRadius: '4px', 
        marginBottom: '15px',
        border: '1px solid #d32f2f',
        fontSize: '14px'
      }}>
        ⚠️ {error}
      </div>
    )}
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /><br/>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
