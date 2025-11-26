import { Link } from 'react-router-dom';

/**
 * DashboardTechnician component displays the technician dashboard.
 * 
 * @returns {JSX.Element} Renders the technician dashboard with access to products and calendar.
 */
const DashboardTechnician = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Technician Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">Welcome, {user?.name}! Access your assigned tasks and products.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/products"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-green-600 mb-2">Products</h2>
            <p className="text-gray-600">View and manage products.</p>
          </Link>

                    <Link
            to="/products"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-green-600 mb-2">Inventory</h2>
            <p className="text-gray-600">View and manage yourInventory.</p>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-orange-600 mb-2">Calendar</h2>
            <p className="text-gray-600">View your assigned jobs and schedule.</p>
            {/* Aquí puedes agregar un componente de calendario más tarde */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTechnician;