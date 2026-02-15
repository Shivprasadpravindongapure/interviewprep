import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isAdmin) {
        await login(formData.email, formData.password, true);
        navigate('/admin/dashboard');
      } else if (isSignup) {
        await register(formData.name, formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await login(formData.email, formData.password, false);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          EcoSense Interview Prep
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isAdmin ? 'Admin Login' : isSignup ? 'Create Account' : 'Student Login'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 text-center">
            <button
              onClick={() => {
                setIsAdmin(!isAdmin);
                setIsSignup(false);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              {isAdmin ? 'Switch to Student Login' : 'Switch to Admin Login'}
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isAdmin && isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {isAdmin ? 'Admin Email' : 'Email Address'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={isAdmin ? 'admin@ecosense.com' : 'you@example.com'}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={isSignup ? 'Create a password' : 'Enter your password'}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading 
                  ? (isSignup ? 'Creating account...' : 'Signing in...') 
                  : (isSignup ? 'Create Account' : isAdmin ? 'Admin Login' : 'Sign In')
                }
              </button>
            </div>
          </form>

          {!isAdmin && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                    setFormData({ name: '', email: '', password: '' });
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-500 font-medium"
                >
                  {isSignup ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          )}

          {isAdmin && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Default: admin@ecosense.com / admin123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
