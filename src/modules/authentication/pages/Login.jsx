import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (!response.data.user.role) {
        alert('Error: role is undefined in response!');
        return;
      }

      const role = response.data.user.role;

      switch (role) {
        case 'client':
          navigate('/dashboard/client');
          break;
        case 'technician':
          navigate('/dashboard/technician');
          break;
        case 'manager':
          navigate('/dashboard/manager');
          break;
        case 'admin':
          navigate('/');
          break;
        default:
          alert('Rol unknown ');
          break;
      }
    } catch (err) {
      console.error('Error complet:', err);
      alert(
        'Login failed: ' +
        (err.response?.data?.message ||
          err.response?.data?.error ||
          'Unknown error')
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="w-full mb-6 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-4">
          <Button
            type="submit"
          >
            Login
          </Button>
          <Button
            type="button"
            onClick={() => {
              setEmail('');
              setPassword('');
              navigate('/');
            }

            }
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;
