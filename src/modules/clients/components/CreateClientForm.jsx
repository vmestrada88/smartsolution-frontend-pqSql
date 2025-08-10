// src/components/CreateClientForm.jsx - Component for creating new clients
import React, { useState } from 'react';
import axios from 'axios';

const CreateClientForm = () => {
  const [clientData, setClientData] = useState({
    companyName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    contacts: [{ name: '', email: '', phone: '', role: '' }],
  });

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleContactChange = (index, e) => {
    const updatedContacts = [...clientData.contacts];
    updatedContacts[index][e.target.name] = e.target.value;
    setClientData({ ...clientData, contacts: updatedContacts });
  };

  const addContact = () => {
    setClientData({
      ...clientData,
      contacts: [...clientData.contacts, { name: '', email: '', phone: '', role: '' }],
    });
  };

  const removeContact = (index) => {
    const updatedContacts = clientData.contacts.filter((_, i) => i !== index);
    setClientData({ ...clientData, contacts: updatedContacts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/clients', clientData);
      alert('Cliente creado con éxito');
      setClientData({
        companyName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        contacts: [{ name: '', email: '', phone: '', role: '' }],
      });
    } catch (err) {
      alert('Error al crear cliente: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="companyName" placeholder="Nombre de la compañía" className="w-full p-2 border" onChange={handleChange} value={clientData.companyName} />
        <input name="address" placeholder="Dirección" className="w-full p-2 border" onChange={handleChange} value={clientData.address} />
        <input name="city" placeholder="Ciudad" className="w-full p-2 border" onChange={handleChange} value={clientData.city} />
        <input name="state" placeholder="Estado" className="w-full p-2 border" onChange={handleChange} value={clientData.state} />
        <input name="zip" placeholder="Código Postal" className="w-full p-2 border" onChange={handleChange} value={clientData.zip} />

        <h3 className="text-lg font-semibold mt-4">Contactos</h3>
        {clientData.contacts.map((contact, index) => (
          <div key={index} className="border p-2 space-y-2">
            <input name="name" placeholder="Nombre" className="w-full p-2 border" onChange={(e) => handleContactChange(index, e)} value={contact.name} />
            <input name="email" placeholder="Email" className="w-full p-2 border" onChange={(e) => handleContactChange(index, e)} value={contact.email} />
            <input name="phone" placeholder="Teléfono" className="w-full p-2 border" onChange={(e) => handleContactChange(index, e)} value={contact.phone} />
            <input name="role" placeholder="Rol (Ej: dueño, asistente)" className="w-full p-2 border" onChange={(e) => handleContactChange(index, e)} value={contact.role} />
            <button type="button" className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeContact(index)}>Eliminar</button>
          </div>
        ))}

        <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addContact}>Agregar Contacto</button>

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Guardar Cliente</button>
      </form>
    </div>
  );
};

export default CreateClientForm;
