import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginUserApi } from '../../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('individual'); // Matches backend: individual/organization
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUserApi({ email, password });

      if (response.data.success) {
        // Save the JWT token to local storage or cookies
        localStorage.setItem('token', response.token);
        
        navigate('/dashboard');
      } else {
        setError(response.message || "Invalid login credentials");
      }
    } catch (err) {
      // Handles 400, 403, 404 errors from your backend
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-8 h-8 fill-white text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              EDU<span className="text-blue-500">LEARN</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Access your learning management system</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
          
          {/* User Type Selection - Now strictly for UI/Theme, not changing the email string */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setUserType('individual')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                userType === 'individual'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setUserType('organization')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                userType === 'organization'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Teacher
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none bg-slate-50 transition-all ${
                    userType === 'individual' ? 'focus:border-blue-500' : 'focus:border-orange-500'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-lg focus:outline-none bg-slate-50 transition-all ${
                    userType === 'individual' ? 'focus:border-blue-500' : 'focus:border-orange-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 rounded border-2 border-slate-300" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <Link to="#" className="text-blue-600 hover:text-blue-700 font-bold">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-black text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                userType === 'individual'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-600/20'
                  : 'bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-lg hover:shadow-orange-600/20'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login as {userType === 'individual' ? 'Student' : 'Teacher'}</span>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">or</span>
            </div>
          </div>

          <p className="text-center text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold">
              Sign up here
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          © 2026 EduLearn. All rights reserved.
        </p>
      </div>
    </div>
  );
}