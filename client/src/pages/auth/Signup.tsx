import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/');
    } catch {
      setError('Failed to create an account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-6 py-12">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">
            ExpenseFlow
          </h1>
          <h2 className="mt-4 text-2xl font-bold text-black">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You’ll be registered as an Admin for a new company.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input
              id="name"
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input
              id="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-blue-400 hover:bg-blue-500 text-black font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin h-5 w-5 text-black" />}
            Sign Up
          </button>
        </form>

        {/* Already have account */}
        <p className="mt-8 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-500 font-semibold transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
