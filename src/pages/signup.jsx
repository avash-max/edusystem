import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function BasementSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!formData.password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // If all validations pass
    console.log('Form submitted:', formData);
    toast.success('Account created errorfully!');
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-pink-300 flex items-center justify-center p-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          <p>{toast.message}</p>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      <div className="w-full max-w-6xl flex gap-8 items-center">
        {/* Left side - Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-black rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <span className="text-xl font-bold">Basement</span>
          </div>

          <h1 className="text-4xl font-bold mb-2">Keep your online business organized</h1>
          <p className="text-gray-500 mb-8">Sign up to start your 30 days free trial</p>

          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Create Account
            </button>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <a href="#" className="text-black font-medium hover:underline">
              Login Here
            </a>
          </p>
        </div>

        {/* Right side - Testimonial & Stats */}
        <div className="hidden lg:flex flex-col gap-6 flex-1">
          {/* Category pills */}
          <div className="flex gap-4 justify-end mb-4">
            <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              Social Media
            </div>
            <div className="bg-yellow-200 px-4 py-2 rounded-full text-sm">
              TV & Radio
            </div>
            <div className="bg-blue-200 px-4 py-2 rounded-full text-sm">
              Billboards
            </div>
          </div>

          {/* Testimonial card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <p className="text-2xl font-medium text-purple-600 mb-6">
              "Basement is surprisingly handy for keeping all my business stuff in one place."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
              <div>
                <p className="font-semibold">David Miller</p>
                <p className="text-sm text-gray-600">E-commerce Specialist</p>
              </div>
            </div>
          </div>

          {/* Growth card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <p className="text-gray-600 text-sm mb-2">GROWTH</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold">+21,35%</span>
              <span className="text-gray-500 text-sm">last month</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              This significant increase in growth highlights the effectiveness of our recent strategies and content approach.
            </p>
            <div className="h-24 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                <path
                  d="M0,60 Q50,50 100,30 T200,10"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="3"
                />
                <circle cx="200" cy="10" r="4" fill="#9333ea" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}