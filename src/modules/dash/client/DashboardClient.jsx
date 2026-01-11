import { useEffect, useState } from 'react';
import { api } from '../../../services';
import { Link } from 'react-router-dom';
import TasksCalendar from '../../tasks/components/TasksCalendar';

/**
 * DashboardClient component displays the client dashboard with personal client information.
 * 
 * @returns {JSX.Element} Renders the client dashboard with client details and jobs.
 */
const DashboardClient = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState({
    clientInfo: true,
    contacts: false,
    jobs: false,
  });

  useEffect(() => {
    const fetchClient = async () => {
      console.log('Fetching client for email:', user.email);
      try {
        const res = await api.get(`/clients/by-email/${encodeURIComponent(user.email)}`);
        console.log('Client data received:', res.data);
        setClient(res.data);
      } catch (err) {
        console.error('Error fetching client:', err);
        if (err.response?.status === 404) {
          setError('No client associated with your email. Please contact an administrator.');
        } else {
          setError('An error occurred while loading your information. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) {
      fetchClient();
    } else {
      setError('User email not found. Please log in again.');
      setLoading(false);
    }
  }, [user?.email]);

  const toggleAccordion = (section) => {
    setAccordionOpen(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) return <div className="min-h-screen bg-gray-100 p-6"><p>Loading...</p></div>;
  if (error) return <div className="min-h-screen bg-gray-100 p-6"><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Client Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">Welcome, {user?.name}! Here is your client information.</p>
        
        {client ? (
          <div className="space-y-4">
            {/* Basic Info Accordion */}
            <div className="bg-white rounded-lg shadow-md">
              <button
                onClick={() => toggleAccordion('clientInfo')}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-2xl font-semibold text-blue-600">Client Information</h2>
                <svg
                  className={`w-6 h-6 transform transition-transform ${accordionOpen.clientInfo ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {accordionOpen.clientInfo && (
                <div className="px-6 pb-6 space-y-2">
                  <p><strong>Company Name:</strong> {client.companyName || 'N/A'}</p>
                  <p><strong>Address:</strong> {client.address || 'N/A'}</p>
                  <p><strong>City:</strong> {client.city || 'N/A'}</p>
                  <p><strong>State:</strong> {client.state || 'N/A'}</p>
                  <p><strong>ZIP:</strong> {client.zip || 'N/A'}</p>
                </div>
              )}
            </div>

            {/* Contacts Accordion */}
            <div className="bg-white rounded-lg shadow-md">
              <button
                onClick={() => toggleAccordion('contacts')}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-2xl font-semibold text-green-600">Contacts</h2>
                <svg
                  className={`w-6 h-6 transform transition-transform ${accordionOpen.contacts ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {accordionOpen.contacts && (
                <div className="px-6 pb-6">
                  {client.contacts?.length > 0 ? (
                    <ul className="space-y-4">
                      {client.contacts.map((contact, i) => (
                        <li key={i} className="border p-4 rounded">
                          <p><strong>Name:</strong> {contact.name}</p>
                          <p><strong>Role:</strong> {contact.role}</p>
                          <p><strong>Phone:</strong> {contact.phone}</p>
                          <p><strong>Email:</strong> {contact.email}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No contacts available.</p>
                  )}
                </div>
              )}
            </div>

            {/* Jobs Accordion */}
            <div className="bg-white rounded-lg shadow-md">
              <button
                onClick={() => toggleAccordion('jobs')}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-2xl font-semibold text-purple-600">Completed Jobs</h2>
                <svg
                  className={`w-6 h-6 transform transition-transform ${accordionOpen.jobs ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {accordionOpen.jobs && (
                <div className="px-6 pb-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Calendar</h3>
                    <TasksCalendar role="client" clientId={client.id} />
                  </div>
                  {client.jobs?.length > 0 ? (
                    <ul className="space-y-4">
                      {client.jobs.map((job, i) => (
                        <li key={job._id || i} className="border p-4 rounded">
                          <p><strong>Date:</strong> {new Date(job.date).toLocaleDateString()}</p>
                          <p><strong>Description:</strong> {job.description}</p>
                          <p><strong>Equipment Installed:</strong> {job.equipmentInstalled?.join(', ')}</p>
                          <p><strong>Notes:</strong> {job.notes}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No jobs recorded.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>No client information available.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardClient;