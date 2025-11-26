import { Link } from 'react-router-dom';

/**
 * DashboardAdmin component displays the admin dashboard with access to key sections.
 * 
 * @returns {JSX.Element} Renders the admin dashboard with navigation links.
 */
const DashboardAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">Welcome, {user?.name}! Here you can access the main sections of the application.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/clients"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Clients</h2>
            <p className="text-gray-600">Manage and view client information.</p>
          </Link>
          
          <Link
            to="/products"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-green-600 mb-2">Products</h2>
            <p className="text-gray-600">Browse and manage products.</p>
          </Link>
          
          <Link
            to="/invoice"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-purple-600 mb-2">Invoices</h2>
            <p className="text-gray-600">Create and manage invoices.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;