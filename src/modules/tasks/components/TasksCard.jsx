import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, fetchTasks } from '../../../store/tasksSlice';
import { fetchProducts, selectAllProducts, selectProductsStatus } from '../../../store/productsSlice';

const TasksCard = ({ task = {}, users = [], clients = [], onClose, onSaved }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const productsStatus = useSelector(selectProductsStatus);

  const [form, setForm] = useState({ notes: '', equipmentInstalled: [], status: task?.status || 'scheduled' });

  useEffect(() => {
    if (productsStatus === 'idle') dispatch(fetchProducts());
  }, [dispatch, productsStatus]);

  useEffect(() => {
    setForm({
      notes: task?.notes || '',
      equipmentInstalled: task?.equipmentInstalled || [],
      status: task?.status || 'scheduled'
    });
  }, [task]);

  // Only allow editing status if the task is scheduled for today
  const isStatusEditable = (() => {
    if (!task || !task.startTime) return false;
    try {
      const start = new Date(task.startTime);
      const now = new Date();
      return start.getFullYear() === now.getFullYear() && start.getMonth() === now.getMonth() && start.getDate() === now.getDate();
    } catch (e) {
      return false;
    }
  })();

  const toggleProduct = (name) => {
    setForm(f => {
      const cur = Array.isArray(f.equipmentInstalled) ? [...f.equipmentInstalled] : [];
      if (cur.includes(name)) return { ...f, equipmentInstalled: cur.filter(x => x !== name) };
      cur.push(name);
      return { ...f, equipmentInstalled: cur };
    });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateTask({ id: task.id, updates: { notes: form.notes, equipmentInstalled: form.equipmentInstalled, status: form.status } })).unwrap();
      // Refresh tasks list and notify parent
      dispatch(fetchTasks());
      onSaved && onSaved();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  if (!task || !task.id) return (
    <div className="bg-white p-4 rounded shadow-md w-full md:w-80">
      <div className="text-sm text-gray-600">Selecciona una tarea para ver detalles</div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded shadow-md w-full md:w-96">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Tarea #{task.id}</h3>
        <button onClick={onClose} className="px-2 py-1 border rounded text-sm">Cerrar</button>
      </div>

      <div className="mb-3">
        <div className="text-sm text-gray-600">Descripción</div>
        <div className="font-medium">{task.description}</div>
      </div>

      <div className="mb-3">
        <div className="text-sm text-gray-600">Cliente</div>
        <div className="font-medium">{clients.find(c => String(c.id) === String(task.clientId))?.companyName || task.clientId || '—'}</div>
      </div>

      <div className="mb-3">
        <div className="text-sm text-gray-600">Horario</div>
        <div className="font-medium">{task.startTime ? new Date(task.startTime).toLocaleString() : task.date} — {task.endTime ? new Date(task.endTime).toLocaleString() : '—'}</div>
      </div>

      <div className="mb-3">
        <div className="text-sm text-gray-600">Asignados</div>
        <div className="flex gap-2 mt-1 flex-wrap">
          {(task.assignedTo || []).map(id => {
            const u = users.find(x => String(x.id) === String(id));
            return <div key={id} className="text-sm px-2 py-1 rounded" style={{ background: u?.color || '#f3f4f6' }}>{u?.name || id}</div>;
          })}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">Estado</label>
        <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border p-2" disabled={!isStatusEditable}>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="en_camino">En camino</option>
          <option value="incomplete">Incomplete</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {!isStatusEditable && (
          <div className="text-xs text-gray-500 mt-1">El estado solo se puede editar si la tarea es para hoy.</div>
        )}
      </div>

      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">Notas</label>
        <textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full border p-2 h-24" />
      </div>

      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-1">Productos usados</div>
        {productsStatus === 'loading' && <div>Loading products...</div>}
        <div className="max-h-32 overflow-auto border p-2">
          {products.map(p => (
            <label key={p.id} className="flex items-center gap-2 mb-1">
              <input type="checkbox" checked={(form.equipmentInstalled || []).includes(p.name)} onChange={() => toggleProduct(p.name)} />
              <span className="text-sm">{p.name}</span>
            </label>
          ))}
          {products.length === 0 && <div className="text-sm text-gray-500">No products</div>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3">
        <button onClick={onClose} className="px-3 py-1 border rounded">Cancelar</button>
        <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded">Guardar</button>
      </div>
    </div>
  );
};

export default TasksCard;
