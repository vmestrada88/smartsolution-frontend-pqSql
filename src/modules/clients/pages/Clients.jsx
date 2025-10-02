import { useEffect, useState } from 'react';
import { api } from '../../../services/httpClient';
import '../../../index.css';
import CreateClientForm from '../components/CreateClientForm';
import ClientList from '../components/ClientList';
import Button from '../../../components/ui/Button';

const Clients = () => {
  const [showForm, setShowForm] = useState(false);

  /**
   * Fetches the list of clients from the backend API.
   * Makes a GET request to the '/clients' endpoint using the api instance.
   * On success, logs the fetched client data to the console.
   * On failure, logs an error message to the console.
   * 
   * @async
   * @function fetchClients
   * @returns {Promise<void>} Resolves when the client data is fetched and logged.
   * 
   * Este archivo se encarga de gestionar la obtención de clientes desde el backend,
   * permitiendo visualizar en consola los datos obtenidos o los errores en caso de fallo.
   */
  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      console.log('Clients fetched:', res.data); 
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
        <div>
          <ClientList />
        </div>
      </div>
    </>
  );
};

export default Clients;
