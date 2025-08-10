import React from 'react';
import CreateClientForm from '../components/CreateClientForm';

const CreateClient = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Client</h2>
      {/* Aquí va tu formulario */}
        <CreateClientForm />
    </div>
  );
};

export default CreateClient;
