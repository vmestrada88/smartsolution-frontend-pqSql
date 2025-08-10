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
    <header className="bg-teal-600 p-4 flex justify-between items-center text-white text-xl font-bold gap-4">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img src={logo} alt="Smart Solution Logo" className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
        <Link to="/" className="text-white font-bold flex flex-col justify-center items-center">
          <h2>Smart Solution for Living</h2>
          <p className="text-sm italic">Your trusted partner in smart and security solutions</p>
        </Link>
      </div>
      
      <nav className="flex gap-4 items-center text-sm ">
        <Link to="/" className="hover:text-gray-200 border-b border-white pb-2" >Home</Link>
        <Link to="/products" className="hover:text-gray-200 border-b border-white pb-2">Products</Link>

        {role === 'admin' && (
          <>
            <Link to="/clients" className="hover:text-gray-200 border-b border-white pb-2">Clients</Link>
            <Link to="/invoice" className="hover:text-gray-200 border-b border-white pb-2">Invoices</Link>
          </>
        )}

        {role === 'client' && (
          <Link to="/profile" className="hover:text-gray-200">My Profile</Link>
        )}

        {!user && (
          <Link to="/login" className="hover:text-gray-200 border-b border-white pb-2">Login</Link>
        )}

        {user && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-light">Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-white text-teal-600 rounded hover:bg-gray-100 text-sm"
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
