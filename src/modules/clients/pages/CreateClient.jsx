/**
 * CreateClient component renders a page section for creating a new client.
 * 
 * This component displays a heading and includes the CreateClientForm component,
 * which contains the form logic and UI for adding a new client.
 * 
 * @component
 * @returns {JSX.Element} The rendered CreateClient page with a form to create a new client.
 */
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
