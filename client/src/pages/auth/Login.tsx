import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@example.com', password: 'password' },
    { role: 'Manager', email: 'manager@example.com', password: 'password' },
    { role: 'Employee', email: 'employee@example.com', password: 'password' },
  ];

  const loginWithDemo = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    setLoading(true);
    try {
      await login(demoEmail, 'password');
      navigate('/');
    } catch {
      setError('Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-6 py-12">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-blue-100">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">
            ExpenseFlow
          </h1>
          <p className="mt-2 text-gray-700 text-sm font-medium">
            Manage your expenses with style and control.
          </p>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-blue-400 hover:bg-blue-500 text-black font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150 ease-in-out disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin h-5 w-5 text-black" />}
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center justify-between">
          <div className="w-full border-t border-gray-300" />
          <span className="px-3 text-sm text-gray-500 bg-white">Or try demo</span>
          <div className="w-full border-t border-gray-300" />
        </div>

        {/* Demo Buttons */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {demoCredentials.map((cred) => (
            <button
              key={cred.role}
              onClick={() => loginWithDemo(cred.email)}
              disabled={loading}
              className="py-2 px-3 bg-blue-50 border border-blue-200 rounded-lg text-black text-sm font-semibold hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              {cred.role}
            </button>
          ))}
        </div>

        {/* Signup Link */}
        <p className="mt-8 text-center text-sm text-gray-700">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-500 font-semibold transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
