//smartsolution-frontend\src\shared\components\ClientList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/clients');
        setClients(res.data);
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
          {clients.map(client => (
            <li
              key={client._id}
              className="p-4 hover:bg-teal-100 cursor-pointer"
              onClick={() => navigate(`/clients/${client._id}`)}
              
            >
              <h3 className="text-xl font-semibold">{client.companyName || 'No Name'}</h3>
              <p>{client.address}, {client.city}, {client.state} {client.zip}</p>
              <p>Contacts: {client.contacts.length}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientList;
