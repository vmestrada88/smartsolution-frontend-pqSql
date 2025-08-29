/**
 * LoginForm component renders a login form with email and password fields.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.email - Current value of the email input.
 * @param {Function} props.setEmail - Function to update the email value.
 * @param {string} props.password - Current value of the password input.
 * @param {Function} props.setPassword - Function to update the password value.
 * @param {Function} props.handleLogin - Function to handle form submission.
 * @param {Function} props.navigate - Function to navigate to a different route.
 *
 * @returns {JSX.Element} The rendered login form.
 *
 * @example
 * <LoginForm
 *   email={email}
 *   setEmail={setEmail}
 *   password={password}
 *   setPassword={setPassword}
 *   handleLogin={handleLogin}
 *   navigate={navigate}
 * />
 */
import React from 'react';
import Button from '../../../components/ui/Button';

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  navigate,
}) => (
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
      <Button type="submit">Login</Button>
      <Button
        type="button"
        onClick={() => {
          setEmail('');
          setPassword('');
          navigate('/');
        }}
      >
        Cancel
      </Button>
    </div>
  </form>
);

export default LoginForm;