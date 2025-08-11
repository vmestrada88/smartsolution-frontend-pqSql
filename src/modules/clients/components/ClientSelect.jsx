import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientSelect = ({ onSelectClient }) => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/clients');
    const data = Array.isArray(res.data) ? res.data : [];
    // Normalize IDs so UI can rely on a single field and string values for <option value>
    const normalized = data.map((c) => ({ ...c, _id: c._id ?? c.id }));
    setClients(normalized);
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const clientId = e.target.value;
    setSelectedClientId(clientId);

  const selectedClient = clients.find(c => String(c._id ?? c.id) === String(clientId));
    if (onSelectClient) {
      onSelectClient(selectedClient);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-bold">Select Client:</label>
      <select
        value={selectedClientId}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">-- Select a client --</option>
        {clients.map((client) => {
          const cid = String(client._id ?? client.id);
          return (
          <option key={cid} value={cid}>
            {client.companyName || client.address}
          </option>
        );})}
      </select>
    </div>
  );
};

export default ClientSelect;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ClientSelect = ({ onSelectClient }) => {
//   const [clients, setClients] = useState([]);
//   const [selectedClientId, setSelectedClientId] = useState('');

//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/clients');
//         setClients(res.data);
//       } catch (error) {
//         console.error('Error loading clients:', error);
//       }
//     };
//     fetchClients();
//   }, []);


// const handleChange = (e) => {
//   const clientId = e.target.value;
//   setSelectedClientId(clientId);

//   const selectedClient = clients.find(c => c._id === clientId);
//   onSelectClient(selectedClient);
// };



//   return (
//     <div className="mb-4">
//       <label className="block mb-1 font-bold">Select Client:</label>
//       <select
//         value={selectedClientId}
//         onChange={handleChange}
//         className="w-full p-2 border rounded"
//       >
//         <option value="">-- Select a client --</option>
//         {clients.map((client) => (
//           <option key={client._id} value={client._id}>
//             {client.companyName || client.address}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default ClientSelect;
