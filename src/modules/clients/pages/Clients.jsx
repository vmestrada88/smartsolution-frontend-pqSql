import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateClientForm from '../components/CreateClientForm';
import ClientList from '../components/ClientList';
import Button from '../../../components/ui/Button';


const Clients = () => {
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);


  const fetchClients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clients');
      setClients(res.data);
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <>
      {/* <headers /> */}
      <div className="p-6 bg-white-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">Clients</h1>

        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'Add New Client'}
        </Button>
        {showForm && <CreateClientForm />}
        <div >
          <ClientList />
        </div>

      </div></>
  );
};

export default Clients;
