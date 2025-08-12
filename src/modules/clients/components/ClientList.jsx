//smartsolution-frontend\src\shared\components\ClientList.jsx

import React, { useEffect, useState } from 'react';
import { api } from '../../../services/httpClient';
import { useNavigate } from 'react-router-dom';
import { ShieldUser } from 'lucide-react';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
  const data = Array.isArray(res.data) ? res.data : [];
  const normalized = data.map(c => ({ ...c, _id: c._id ?? c.id }));
  setClients(normalized);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Clients List </h2>
      {clients.length === 0 ? (
        <p>No clients avalible.</p>
      ) : (
        <ul className="divide-y divide-gray-300 border border-gray-300 rounded">
          {clients.map(client => {
            const cid = String(client._id || client.id);
            return (
            <li
              key={cid}
              className="p-4 hover:bg-teal-100 cursor-pointer flex items-start gap-3"
              onClick={() => navigate(`/clients/${cid}`)}
            >
              <ShieldUser className="text-teal-600 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-semibold">{client.companyName || 'No Name'}</h3>
                <p>{client.address}, {client.city}, {client.state} {client.zip}</p>
                <p>Contacts: {client.contacts?.length ?? 0}</p>
              </div>
            </li>
          );})}
        </ul>
      )}
    </div>
  );
};

export default ClientList;
