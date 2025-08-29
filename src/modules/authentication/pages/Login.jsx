/**
 * Login component handles user authentication.
 * 
 * @module Login
 * @returns {JSX.Element} Renders the login page with a form.
 *
 * @example
 * <Login />
 *
 * State:
 * - email {string}: Stores the user's email input.
 * - password {string}: Stores the user's password input.
 *
 * Hooks:
 * - useNavigate: Used to programmatically navigate after login.
 *
 * Functions:
 * - handleLogin(e): Handles form submission, sends login request to API,
 *   stores token and user info in localStorage, shows toast notifications,
 *   and navigates to the home page on success.
 *
 * Rendered Components:
 * - LoginForm: Receives email, password, setters, handleLogin, and navigate as props.
 */
import React, { useState } from 'react';
import { api, extractError } from '../../../services/httpClient';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

     try {
       const response = await api.post('/login', { email, password });

       localStorage.setItem('token', response.data.token);
       localStorage.setItem('user', JSON.stringify(response.data.user));

        toast.success('Login successful!');
navigate('/');
      
    } catch (err) {
      console.error('Error complet:', err);
      toast.error('Login failed: ' + extractError(err));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        navigate={navigate}
      />
    </div>
  );
}

export default Login;
