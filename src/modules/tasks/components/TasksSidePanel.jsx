import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, fetchTasks } from '../../../store/tasksSlice';
import { fetchProducts, selectAllProducts, selectProductsStatus } from '../../../store/productsSlice';

const TasksSidePanel = ({ isOpen, onClose, task = {}, users = [], clients = [], onSaved }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const productsStatus = useSelector(selectProductsStatus);

  const [form, setForm] = useState({ notes: '', equipmentInstalled: [], status: task.status || 'scheduled' });

  useEffect(() => {
    if (productsStatus === 'idle') dispatch(fetchProducts());
  }, [dispatch, productsStatus]);

  useEffect(() => {
    if (isOpen) {
      setForm({
        notes: task.notes || '',
        equipmentInstalled: task.equipmentInstalled || [],
        status: task.status || 'scheduled'
      });
    }
  }, [isOpen, task]);

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
      // Refresh tasks list after saving
      dispatch(fetchTasks());
      onSaved && onSaved();
      onClose();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg z-50">
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tarea #{task.id || ''}</h3>
          <button onClick={onClose} className="px-2 py-1 border rounded">Cerrar</button>
        </div>
        <div className="flex-1 overflow-auto">
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
            <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border p-2">
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="en_camino">En camino</option>
              <option value="incomplete">Incomplete</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Notas</label>
            <textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full border p-2 h-24" />
          </div>

          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-1">Productos usados</div>
            {productsStatus === 'loading' && <div>Loading products...</div>}
            <div className="max-h-40 overflow-auto border p-2">
              {products.map(p => (
                <label key={p.id} className="flex items-center gap-2 mb-1">
                  <input type="checkbox" checked={(form.equipmentInstalled || []).includes(p.name)} onChange={() => toggleProduct(p.name)} />
                  <span className="text-sm">{p.name}</span>
                </label>
              ))}
              {products.length === 0 && <div className="text-sm text-gray-500">No products</div>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button onClick={onClose} className="px-3 py-1 border rounded">Cancelar</button>
          <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default TasksSidePanel;
