import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// Styles are loaded from CDN in index.html to avoid bundling issues
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, createTask, selectAllTasks } from '../../../store/tasksSlice';
import { fetchProducts } from '../../../store/productsSlice';
import TasksModal from './TasksModal';
import TasksSidePanel from './TasksSidePanel';
import { fetchClients } from '../../../store/clientsSlice';
import { fetchUsers } from '../../../services/usersService';

const TasksCalendar = ({ role, userId, clientId, onTaskSelect }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchClients());

    (async () => {
      if (!token) return setUsers([]);
      try {
        const u = await fetchUsers();
        setUsers(u);
      } catch (err) {
        console.warn('Failed to load users in calendar', err?.message || err);
        setUsers([]);
      }
    })();
  }, [dispatch, token]);

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);

  const clientsFromStore = useSelector(state => state.clients.items);
  const productsFromStore = useSelector(state => state.products.items);
  const productsStatus = useSelector(state => state.products.status);
  useEffect(() => setClients(clientsFromStore || []), [clientsFromStore]);
  useEffect(() => { if (productsStatus === 'idle') dispatch(fetchProducts()); }, [productsStatus, dispatch]);
  useEffect(() => setClients(clientsFromStore || []), [clientsFromStore]);

  const mapToEvents = () => {
    if (!tasks) return [];
    return tasks
      .filter(t => {
        // Show completed tasks in the calendar, but keep clients restricted
        if (role === 'admin') return true;
        if (role === 'technician') return true; // techs see all technicians' tasks
        if (role === 'client') return String(t.clientId) === String(clientId);
        return false;
      })
      .map(t => {
        const assigned = Array.isArray(t.assignedTo) ? t.assignedTo : (t.assignedTo ? [t.assignedTo] : []);
        // Status-driven colors (note: technician dots remain their own colors)
        const statusColors = {
          completed: '#10B981', // green
          incomplete: '#EF4444', // red for in_progress / en_camino
          assigned: '#06B6D4' // aqua for assigned but not started
        };

        let primaryColor = '#6b7280'; // default gray
        if (t.status === 'completed') {
          primaryColor = statusColors.completed;
        } else if (t.status === 'in_progress' || t.status === 'en_camino') {
          primaryColor = statusColors.incomplete;
        } else if (assigned.length) {
          primaryColor = statusColors.assigned;
        } else {
          primaryColor = '#6b7280';
        }

        return ({
          id: String(t.id),
          title: t.description || 'Task',
          start: t.startTime || t.date,
          end: t.endTime || null,
          backgroundColor: primaryColor,
          borderColor: primaryColor,
          extendedProps: { clientId: t.clientId, assignedTo: assigned, status: t.status, notes: t.notes || '', equipmentInstalled: t.equipmentInstalled || [] }
        });
      });
  };

  const handleEventDrop = async (info) => {
    const id = info.event.id;
    const updates = {
      startTime: info.event.start ? info.event.start.toISOString() : null,
      endTime: info.event.end ? info.event.end.toISOString() : null,
    };
    try {
      await dispatch(updateTask({ id, updates })).unwrap();
    } catch (err) {
      console.error('Update task failed', err);
      info.revert();
    }
  };

  const handleEventResize = async (info) => handleEventDrop(info);

  const handleEventClick = (info) => {
    const ev = info.event;
    const props = ev.extendedProps;
    const task = {
      id: Number(ev.id),
      description: ev.title,
      startTime: ev.start ? ev.start.toISOString() : null,
      endTime: ev.end ? ev.end.toISOString() : null,
      clientId: props.clientId || null,
      assignedTo: props.assignedTo || [],
      status: props.status || 'scheduled',
      notes: props.notes || '',
      equipmentInstalled: props.equipmentInstalled || []
    };
    setSelectedTask(task);
    // Notify parent that a task was selected (parent can render a card)
    if (typeof onTaskSelect === 'function') onTaskSelect(task);
    // For non-technician roles, still open the modal for editing
    if (role !== 'technician') {
      setModalOpen(true);
    }
  };

  const handleSelectRange = (selectInfo) => {
    const task = {
      description: '',
      startTime: selectInfo.startStr,
      endTime: selectInfo.endStr,
      clientId: '',
      assignedTo: [],
      status: 'scheduled'
    };
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleModalSave = async (data) => {
    try {
      if (selectedTask?.id) {
        await dispatch(updateTask({ id: selectedTask.id, updates: data })).unwrap();
      } else {
        // create via tasksSlice createTask thunk already exists, but avoid duplication here
        await dispatch(createTask(data)).unwrap();
      }
      setModalOpen(false);
      setSelectedTask(null);
      dispatch(fetchTasks());
    } catch (err) {
      console.error('Save task failed', err);
    }
  };

  const renderEventContent = (arg) => {
    const assigned = arg.event.extendedProps.assignedTo || [];
    const status = arg.event.extendedProps.status || '';

    const statusMap = {
      scheduled: { label: 'Scheduled', bg: '#9CA3AF', color: '#fff' },
      in_progress: { label: 'In Progress', bg: '#F59E0B', color: '#fff' },
      en_camino: { label: 'En camino', bg: '#0EA5E9', color: '#fff' },
      incomplete: { label: 'Incomplete', bg: '#EF4444', color: '#fff' },
      completed: { label: 'Completed', bg: '#10B981', color: '#fff' },
      cancelled: { label: 'Cancelled', bg: '#EF4444', color: '#fff' },
    };

    const st = statusMap[status] || { label: status || '', bg: '#6b7280', color: '#fff' };

    return (
      <div>
        <div className="fc-event-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: st.color, background: st.bg, borderRadius: 4, padding: '0 6px', lineHeight: '18px' }}>{st.label}</span>
          <span style={{ fontWeight: 600 }}>{arg.event.title}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
          {assigned.map(id => {
            const u = users.find(x => String(x.id) === String(id));
            const techColor = (u?.color || '').toString();
            const forbidden = [statusMap?.scheduled?.bg, statusMap?.in_progress?.bg, statusMap?.en_camino?.bg, statusMap?.completed?.bg, statusMap?.cancelled?.bg].map(c => c && c.toString().toLowerCase());
            const color = techColor && !forbidden.includes(techColor.toLowerCase()) ? techColor : '#6b7280';
            return <span key={id} style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} title={u?.name || id} />;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        initialView="timeGridWeek"
        editable={role === 'admin'}
        selectable={role === 'admin'}
        events={mapToEvents()}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventClick={handleEventClick}
        select={handleSelectRange}
        eventContent={renderEventContent}
        height="auto"
      />
      <TasksModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleModalSave} initial={selectedTask || {}} clients={clients} users={users} tasks={tasks} />
      <TasksSidePanel isOpen={sideOpen} onClose={() => setSideOpen(false)} task={selectedTask || {}} users={users} clients={clients} onSaved={() => { setSideOpen(false); dispatch(fetchTasks()); }} />
    </div>
  );
};

export default TasksCalendar;
