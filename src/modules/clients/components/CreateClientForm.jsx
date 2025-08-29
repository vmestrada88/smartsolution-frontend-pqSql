
/**
 * CreateClientForm component for creating a new client with multiple contacts.
 *
 * @component
 * @returns {JSX.Element} Form for entering client information and contacts.
 *
 * @description
 * This component renders a form to create a new client, including company details and a dynamic list of contacts.
 * Users can add or remove contacts, and submit the form to save the client data via an API call.
 *
 * @example
 * <CreateClientForm />
 *
 * @function handleChange
 * Handles changes to the main client input fields.
 * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
 *
 * @function handleContactChange
 * Handles changes to the contact input fields.
 * @param {number} index - The index of the contact being updated.
 * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
 *
 * @function addContact
 * Adds a new empty contact to the contacts array.
 *
 * @function removeContact
 * Removes a contact from the contacts array by index.
 * @param {number} index - The index of the contact to remove.
 *
 * @function handleSubmit
 * Handles form submission, sends client data to the API, and resets the form on success.
 * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
 */
import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import toast

  from 'react-hot-toast';
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
      toast.success('Cliente creado exitosamente');
      setClientData({
        companyName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        contacts: [{ name: '', email: '', phone: '', role: '' }],
      });
    } catch (err) {
      toast.error('Error creating client: ' + (err.response?.data?.message || err.message));
    }
  };
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New Client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="companyName" placeholder="Company Name" className="w-full p-2 border" onChange={handleChange} value={clientData.companyName} />
        <input name="address" placeholder="Address" className="w-full p-2 border" onChange={handleChange} value={clientData.address} />
        <input name="city" placeholder="City" className="w-full p-2 border" onChange={handleChange} value={clientData.city} />
        <input name="state" placeholder="State" className="w-full p-2 border" onChange={handleChange} value={clientData.state} />
        <input name="zip" placeholder="Zip Code" className="w-full p-2 border" onChange={handleChange} value={clientData.zip} />

        <h3 className="text-lg font-semibold mt-4">Contacts</h3>
        {clientData.contacts.map((contact, index) => (
          <div key={index} className="border p-2 space-y-2">
            <input name="name" placeholder="Name" className="w-full p-2 border" onChange={(e) => handleContactChange(index, e)} value={contact.name} />
            <input name="email" placeholder="Email" className="w-full p-2 border" onChange={(e) => handleContactChange(index, e)} value={contact.email} />
            <input name="phone" placeholder="Phone" className="w-full p-2 border" onChange={(e) => handleContactChange(index, e)} value={contact.phone} />
            <input name="role" placeholder="Role (e.g. owner, assistant)" className="w-full p-2 border" onChange={(e) => handleContactChange(index, e)} value={contact.role} />
            <button type="button" className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeContact(index)}>Remove</button>
          </div>
        ))}

        <Button
          type="button"
          onClick={addContact}>
          Add Contact</Button>

        <Button type="submit">
          Save Client
        </Button>
      </form>
    </div>
  );
};

export default CreateClientForm;
