import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Create appropriate email based on user type
    const loginEmail = userType === 'teacher' 
      ? email.includes('teacher') ? email : 'teacher-' + email
      : email;

    const success = await login(loginEmail, password);
    
    if (success) {
      navigate(userType === 'teacher' ? '/teacher' : '/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
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

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
          
          {/* User Type Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => setUserType('student')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                userType === 'student'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setUserType('teacher')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                userType === 'teacher'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Teacher
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 rounded border-2 border-slate-300" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <Link to="#" className="text-blue-600 hover:text-blue-700 font-bold">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-black text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                userType === 'student'
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
                <span>Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">or</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-bold text-slate-600 mb-3">DEMO CREDENTIALS:</p>
            <div className="space-y-1 text-xs">
              <p className="text-slate-600"><span className="font-bold">Student:</span> student@example.com / password</p>
              <p className="text-slate-600"><span className="font-bold">Teacher:</span> teacher@example.com / password</p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Bottom Brand */}
        <p className="text-center text-slate-600 text-xs mt-8">
          © 2026 EduLearn. All rights reserved.
        </p>
      </div>
    </div>
  );
}
