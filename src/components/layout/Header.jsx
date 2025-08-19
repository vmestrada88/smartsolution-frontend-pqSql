import React from 'react';
import logo from '../../assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-teal-600 p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-center text-white text-xl font-bold gap-2 sm:gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <Link to="/">
          <img src={logo} alt="Smart Solution Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
        <Link to="/" className="text-white font-bold flex flex-col justify-center items-center">
          <h2 className="text-base sm:text-xl">Smart Solution for Living</h2>
          <p className="text-xs sm:text-sm italic">Your trusted partner in smart and security solutions</p>
        </Link>
      </div>
      
      <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center text-sm w-full sm:w-auto mt-2 sm:mt-0">
        <Link to="/" className="hover:text-gray-200 border-b border-white pb-1 sm:pb-2" >Home</Link>
        <Link to="/products" className="hover:text-gray-200 border-b border-white pb-1 sm:pb-2">Products</Link>

        {role === 'admin' && (
          <>
            <Link to="/clients" className="hover:text-gray-200 border-b border-white pb-1 sm:pb-2">Clients</Link>
            <Link to="/invoice" className="hover:text-gray-200 border-b border-white pb-1 sm:pb-2">Invoices</Link>
          </>
        )}

        {role === 'client' && (
          <Link to="/profile" className="hover:text-gray-200">My Profile</Link>
        )}

        {!user && (
          <Link to="/login" className="hover:text-gray-200 border-b border-white pb-1 sm:pb-2">Login</Link>
        )}

        {user && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs sm:text-sm font-light">Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="px-2 py-1 sm:px-3 sm:py-1 bg-white text-teal-600 rounded hover:bg-gray-100 text-xs sm:text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
