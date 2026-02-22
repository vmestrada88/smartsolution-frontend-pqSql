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
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../store/authSlice';
import { extractError } from '../../../services';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(login({ email, password })).unwrap();
      toast.success('Login successful!');

      const user = result.user;
      if (user.role === 'admin') {
        navigate('/dash/admin');
      } else if (user.role === 'technician') {
        navigate('/dash/technician');
      } else if (user.role === 'client') {
        navigate('/dash/client');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed: ' + (err || extractError(err)));
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
