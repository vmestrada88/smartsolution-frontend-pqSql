import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, selectAllClients, selectClientsStatus } from '../../../store/clientsSlice';

const ClientsPanel = () => {
  const dispatch = useDispatch();
  const clients = useSelector(selectAllClients);
  const status = useSelector(selectClientsStatus);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchClients());
  }, [status, dispatch]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Clients</h3>
      {status === 'loading' && <p>Loading clients...</p>}
      {status === 'failed' && <p className="text-red-500">Failed to load clients.</p>}
      <ul className="list-disc list-inside">
        {clients && clients.length > 0 ? (
          clients.map((c) => (
            <li key={c.id}>{c.name} {c.email ? `— ${c.email}` : ''}</li>
          ))
        ) : (
          status === 'succeeded' && <li>No clients found.</li>
        )}
      </ul>
    </div>
  );
};

export default ClientsPanel;
