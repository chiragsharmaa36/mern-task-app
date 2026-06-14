import React, {useRef, useEffect, useState, useReducer } from 'react';
import api from '../api/axios';

// // export default function CreateTaskForm({ projectId, onCreated }) {
// //   const titleInputRef = useRef(null);
// //   const [title, setTitle] = useState('');
// //   const [assignedTo, setAssignedTo] = useState('');
// //   const [assignedBy, setAssignedBy] = useState('');
// //   const [priority, setPriority] = useState('Medium');
// //   const [dueDate, setDueDate] = useState('');
// //   const [members, setMembers] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     if(titleInputRef.current)
// //         titleInputRef.current.focus();
// //   },[]);

// //   // fetch project members & all users to pick assigner
// //   useEffect(() => {
// //     let mounted = true;
// //     (async () => {
// //       try {
// //         const [pRes, uRes] = await Promise.all([
// //           api.get(`/projects/${projectId}`),
// //           api.get('/users')
// //         ]);
// //         if (!mounted) return;
// //         setMembers(pRes.data.project.members || []);
// //         setUsers(uRes.data || []);
// //         // set defaults
// //         if (pRes.data.project.members?.[0]) setAssignedTo(pRes.data.project.members[0]._id);
// //         if (uRes.data?.[0]) setAssignedBy(uRes.data[0]._id);
// //       } catch (err) {
// //         console.error('Failed to fetch members/users', err);
// //       }
// //     })();
// //     return () => { mounted = false; };
// //   }, [projectId]);

// //   const submit = async (e) => {
//     // e.preventDefault();
//     // if (!title) return alert('Title required');
//     // setLoading(true);
// //     try {
// //       const payload = {
// //         project: projectId,
// //         title,
// //         assignedTo: assignedTo || null,
// //         assignedBy: assignedBy || null,
// //         priority,
// //         dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
// //       };
// //       const res = await api.post('/tasks', payload);
//       // onCreated && onCreated(res.data);
//       // // clear some fields
//       // setTitle('');
//       // setDueDate('');
// //       titleInputRef.current.focus();
// //     } catch (err) {
//       // alert('Create failed: ' + (err.response?.data?.message || err.message));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="p-4 border rounded bg-dark text-light">
// //       <h3>Create New Pipeline Task</h3>

// //       <div className="mb-3">
// //         <label>Task Title:</label>
// //         <input
// //           type="text"
// //           name="title" // Crucial match for action.field
// //           value={state.title}
// //           onChange={handleChange}
// //           ref={titleInputRef}
// //           className="form-control bg-secondary text-light"
// //           required
// //           disabled={state.loading}
// //         />
// //       </div>

// //       <div className="mb-3">
// //         <label>Task Description:</label>
// //         <textarea
// //           name="description"
// //           value={state.description}
// //           onChange={handleChange}
// //           className="form-control bg-secondary text-light"
// //           disabled={state.loading}
// //         />
// //       </div>

// //       <div className="mb-3">
// //         <label>Assign Team Member:</label>
// //         <select
// //           name="assignedTo"
// //           value={state.assignedTo}
// //           onChange={handleChange}
// //           className="form-select bg-secondary text-light"
// //           disabled={state.loading}
// //         >
// //           <option value="">Unassigned</option>
// //           {users.map(u => (
// //             <option key={u._key || u._id} value={u._id}>{u.name}</option>
// //           ))}
// //         </select>
// //       </div>

// //       <button type="submit" className="btn btn-primary w-100" disabled={state.loading}>
// //         {state.loading ? 'Compiling Actions...' : 'Build Task Node'}
// //       </button>
// //     </form>
// //   );

// //   // return (
// //     <form onSubmit={submit}>
// //       <div className="form-row">
// //         <label>Title</label>
// //         <input className="input" placeholder="Enter task title" ref={titleInputRef} value={title} onChange={e => setTitle(e.target.value)} />
// //       </div>

// //       <div className="form-row">
// //         <label>Assigned To (member)</label>
// //         <select className="input" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
// //           <option value="">-- Unassigned --</option>
// //           {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
// //         </select>
// //       </div>

// //       <div className="form-row">
// //         <label>Assigned By (user)</label>
// //         <select className="input" value={assignedBy} onChange={e => setAssignedBy(e.target.value)}>
// //           <option value="">-- Select --</option>
// //           {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
// //         </select>
// //       </div>

// //       <div className="form-row">
// //         <label>Priority</label>
// //         <select className="input" value={priority} onChange={e => setPriority(e.target.value)}>
// //           <option>Low</option>
// //           <option>Medium</option>
// //           <option>High</option>
// //         </select>
// //       </div>

// //       <div className="form-row">
// //         <label>Due date</label>
// //         <input className="input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
// //       </div>

// //       <div className="form-row">
// //         <button className="button" disabled={loading} type="submit">{loading ? 'Creating...' : 'Create'}</button>
// //       </div>
// //     </form>
// //   // );

// // }

// 1. Establish the Unified Form State Matrix
const initialState = {
  title: '',
  assignedTo: '',
  assignedBy: '',
  priority: 'Medium',
  dueDate: '',
  members: [],
  users: [],
  loading: false
};

// 2. Build the Reducer Machine (Lives purely outside the component function block)
function taskFormReducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return {
        ...state,
        members: action.payload.members,
        users: action.payload.users,
        assignedTo: action.payload.defaultAssignedTo,
        assignedBy: action.payload.defaultAssignedBy
      };
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'SUBMIT_START':
      return {
        ...state,
        loading: true
      };
    case 'SUBMIT_SUCCESS':
      // Clear ONLY user inputs upon success, retaining loaded network elements safely!
      return {
        ...state,
        loading: false,
        title: '',
        dueDate: ''
      };
    case 'SUBMIT_FAILURE':
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}

export default function CreateTaskForm({ projectId, onCreated }) {
  // 3. Mount the state machine hook
  const [state, dispatch] = useReducer(taskFormReducer, initialState);
  const titleInputRef = useRef(null);

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

        const fetchedMembers = pRes.data.project.members || [];
        const fetchedUsers = uRes.data || [];

        // Package all asynchronous data inside a single initial payload
        dispatch({
          type: 'SET_INITIAL_DATA',
          payload: {
            members: fetchedMembers,
            users: fetchedUsers,
            defaultAssignedTo: fetchedMembers[0]?._id || '',
            defaultAssignedBy: fetchedUsers[0]?._id || ''
          }
        });
      } catch (err) {
        console.error('Failed to fetch members/users', err);
      }
    })();
    return () => { mounted = false; };
  }, [projectId]);

  useEffect(()=> {
    if(titleInputRef.current)
      titleInputRef.current.focus();
  }, []);

  // 4. Elegant Single Event Handler for all layout form controls
  const handleInputChange = (field, value) => {
    dispatch({
      type: 'SET_FIELD',
      field,
      value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!state.title) return alert('Title required');
    
    dispatch({ type: 'SUBMIT_START' });
    try {
      const payload = {
        project: projectId,
        title: state.title,
        assignedTo: state.assignedTo || null,
        assignedBy: state.assignedBy || null,
        priority: state.priority,
        dueDate: state.dueDate ? new Date(state.dueDate).toISOString() : undefined
      };
      
      const res = await api.post('/tasks', payload);
      onCreated && onCreated(res.data);
      
      dispatch({ type: 'SUBMIT_SUCCESS' });

      if(titleInputRef.current) titleInputRef.current.focus();
    } catch (err) {
      alert('Create failed: ' + (err.response?.data?.message || err.message));
      dispatch({ type: 'SUBMIT_FAILURE' });
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label>Title</label>
        <input 
          className="input" 
          value={state.title} 
          onChange={e => handleInputChange('title', e.target.value)} 
          ref = {titleInputRef}
        />
      </div>

      <div className="form-row">
        <label>Assigned To (member)</label>
        <select 
          className="input" 
          value={state.assignedTo} 
          onChange={e => handleInputChange('assignedTo', e.target.value)}
        >
          <option value="">-- Unassigned --</option>
          {state.members.map(m => (
            <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Assigned By (user)</label>
        <select 
          className="input" 
          value={state.assignedBy} 
          onChange={e => handleInputChange('assignedBy', e.target.value)}
        >
          <option value="">-- Select --</option>
          {state.users.map(u => (
            <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Priority</label>
        <select 
          className="input" 
          value={state.priority} 
          onChange={e => handleInputChange('priority', e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="form-row">
        <label>Due date</label>
        <input 
          className="input" 
          type="date" 
          value={state.dueDate} 
          onChange={e => handleInputChange('dueDate', e.target.value)} 
        />
      </div>

      <div className="form-row">
        <button className="button" disabled={state.loading} type="submit">
          {state.loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
}