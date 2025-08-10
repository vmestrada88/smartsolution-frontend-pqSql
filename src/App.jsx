import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Footer from './components/layout/Footer';
import Contact from './components/Contact';
import Header from './components/layout/Header';

import Home from './modules/landing/Home';
import Products from './modules/product/pages/Products';
import Clients from './modules/clients/pages/Clients';
import ClientDetails from './modules/clients/components/ClientDetails';

import { InvoicePage } from './modules/invoice/pages/InvoicePage';
import Login from './modules/authentication/pages/Login';
import AdminDashboard from './modules/authentication/pages/Admin';
import Profile from './modules/authentication/pages/Profile';
import Unauthorized from './modules/authentication/pages/Unauthorized';


import ProtectedRoute from './modules/authentication/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Header />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {/* Publics Routs */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ADMIN */}
            <Route
              path="/clients"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'technician']}>
                  <ClientDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/invoice"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <InvoicePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* CLIENT */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Contact />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;



