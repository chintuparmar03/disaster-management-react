import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, ArrowLeft } from 'lucide-react';
import { loginCitizen } from '../services/api';

const CitizenLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username_or_phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Citizen Login Data:', formData);

    try {
      const submissionData = {
        username_or_phone: formData.username_or_phone,
        password: formData.password
      };

      console.log('Submission Data being sent:', submissionData);
      const response = await loginCitizen(submissionData);
      
      console.log('Login successful:', response.data);
      
      // Store tokens if provided by backend
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }

      // Store citizen data for SOS reporting
      if (response.data.user) {
        localStorage.setItem('citizen_data', JSON.stringify({
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          phone_number: response.data.user.phone_number,
          email: response.data.user.email,
          username: response.data.user.username,
          id: response.data.user.id
        }));
        console.log('Citizen data stored:', response.data.user);
      }

      alert('Login successful! Redirecting to Dashboard.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Login failed. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-blue-500 p-6 text-center">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Citizen Login</h2>
            <p className="text-blue-100 mt-2">Access your disaster management portal</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username_or_phone" className="block text-sm font-medium text-blue-100 mb-2">
                  Username or Phone Number
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="username_or_phone"
                    type="text"
                    placeholder="Enter username or phone number"
                    value={formData.username_or_phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-blue-200">
                  <input type="checkbox" className="mr-2 rounded" />
                  Remember me
                </label>
                <button type="button" className="text-blue-300 hover:text-white transition">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <LogIn className="w-5 h-5" />
                {loading ? 'Logging in...' : 'Login to Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-blue-200 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/citizen-register')}
                  className="text-blue-300 hover:text-white font-semibold transition"
                >
                  Register Here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenLogin;