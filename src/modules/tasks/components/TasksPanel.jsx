import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, selectAllTasks, selectTasksStatus } from '../../../store/tasksSlice';
import { fetchClients } from '../../../store/clientsSlice';
import { api } from '../../../services/httpClient';
import { Building, User } from 'lucide-react';
import { fetchUsers as fetchUsersService } from '../../../services/usersService';
import TasksModal from './TasksModal';

const TechSelect = ({ users = [], value, onChange, placeholder = 'Assign to' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const selected = users.find(u => String(u.id) === String(value));
  return (
    <div className="relative inline-block mr-2" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)} className="border p-2 flex items-center gap-2 min-w-[160px] justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          {selected ? (
            <>
              <span style={{ width: 12, height: 12, background: selected.color || '#6b7280', display: 'inline-block', borderRadius: 2 }} />
              <span className="text-sm">{selected.name || selected.email}</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">{placeholder}</span>
          )}
        </div>
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-56 overflow-auto">
          <div className="py-1">
            <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => { onChange(''); setOpen(false); }}>
              <span className="text-sm text-gray-600">— None —</span>
            </div>
            {users.map(u => (
              <div key={u.id} className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => { onChange(u.id); setOpen(false); }}>
                <span style={{ width: 12, height: 12, background: u.color || '#6b7280', display: 'inline-block', borderRadius: 2 }} />
                <span className="text-sm">{u.name || u.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ClientSelect = ({ clients = [], value, onChange, placeholder = 'Client' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const selected = clients.find(c => String(c.id) === String(value));
  return (
    <div className="relative inline-block mr-2" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)} className="border p-2 flex items-center gap-2 min-w-[200px] justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-600"><Building className="w-4 h-4" /></span>
          <span className="text-sm">{selected ? (selected.companyName || selected.name) : <span className="text-gray-500">{placeholder}</span>}</span>
        </div>
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-56 overflow-auto">
          <div className="py-1">
            <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => { onChange(''); setOpen(false); }}>
              <span className="text-sm text-gray-600">— None —</span>
            </div>
            {clients.map(c => (
              <div key={c.id} className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => { onChange(c.id); setOpen(false); }}>
                <span className="text-sm">{c.companyName || c.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TasksPanel = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const status = useSelector(selectTasksStatus);
  const clientsStatus = useSelector(state => state.clients.status);
  const clients = useSelector(state => state.clients.items);

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ description: '', clientId: '', assignedTo: '', startTime: '', endTime: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchTasks());
    if (clientsStatus === 'idle') dispatch(fetchClients());

    // Only fetch users when authenticated
    (async () => {
      if (!token) return setUsers([]);
      try {
        const u = await fetchUsersService();
        setUsers(u);
      } catch (e) {
        console.warn('Failed to load users', e?.message || e);
        if (e?.response?.status === 403) setUsers([]);
      }
    })();
  }, [status, clientsStatus, dispatch, token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTask({
        description: form.description,
        clientId: form.clientId || null,
        assignedTo: form.assignedTo || null,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      })).unwrap();
      setForm({ description: '', clientId: '', assignedTo: '', startTime: '', endTime: '' });
    } catch (err) {
      console.error('Create task failed', err);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask({
      id: task.id,
      description: task.description || '',
      clientId: task.clientId || '',
      assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo : (task.assignedTo ? [task.assignedTo] : []),
      startTime: task.startTime || task.date || '',
      endTime: task.endTime || '',
      status: task.status || 'scheduled'
    });
    setModalOpen(true);
  };

  const handleModalSave = async (data) => {
    try {
      if (selectedTask && selectedTask.id) {
        await dispatch(updateTask({ id: selectedTask.id, updates: data })).unwrap();
      } else {
        await dispatch(createTask(data)).unwrap();
      }
      setModalOpen(false);
      setSelectedTask(null);
      dispatch(fetchTasks());
    } catch (err) {
      console.error('Save task failed', err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Calendar Tasks</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="border p-2 mr-2" />
        <ClientSelect clients={clients} value={form.clientId} onChange={(v) => setForm({ ...form, clientId: v })} />
        <TechSelect users={users} value={form.assignedTo} onChange={(v) => setForm({ ...form, assignedTo: v })} />
        <div className="mt-2">
          <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required className="border p-2 mr-2" />
          <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required className="border p-2 mr-2" />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
        </div>
      </form>

      {status === 'loading' && <p>Loading tasks...</p>}
      <ul className="list-disc list-inside">
        {tasks && tasks.length > 0 ? tasks.filter(t => String(t.status) !== 'completed').map(t => (
          <li key={t.id} className="mb-2 flex justify-between items-start gap-4">
            <div className="flex-1 cursor-pointer" onClick={() => handleEdit(t)}>
              <strong>{t.description}</strong> — {t.startTime ? new Date(t.startTime).toLocaleString() : ''} to {t.endTime ? new Date(t.endTime).toLocaleString() : ''}
              <div className="text-sm text-gray-600">Client: {clients.find(c => String(c.id) === String(t.clientId))?.companyName || t.clientId || '—'} • Assigned: {(t.assignedTo || []).join(', ') || '—'}</div>
            </div>
            <div>
              <button onClick={() => handleEdit(t)} className="text-sm px-2 py-1 border rounded">Edit</button>
            </div>
          </li>
        )) : <li>No tasks found.</li>}
      </ul>

      <TasksModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedTask(null); }} onSave={handleModalSave} initial={selectedTask || {}} clients={clients} users={users} tasks={tasks} />
    </div>
  );
};

export default TasksPanel;
