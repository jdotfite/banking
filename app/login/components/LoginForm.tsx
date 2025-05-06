'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { animated } from 'react-spring';
import { Eye, EyeOff, HelpCircle, Lock, Mail, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setView }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    console.log('Login attempt:', formData);
    
      setTimeout(() => {
        document.cookie = `auth_token=dummy_token; path=/; max-age=${60 * 60 * 24 * 7}`;
        localStorage.removeItem('selectedUserId');
        localStorage.setItem('selectedUserId', 'user1');
        document.cookie = `selectedUserId=user1; path=/; max-age=${60 * 60 * 24 * 7}`;
        router.push('/admin');
        window.location.href = '/admin'; // Force full page reload
      }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg flex items-start">
          <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-gray-500" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-gray-500" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-green-200"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
            Remember me
          </label>
        </div>
        <button
          type="button"
          className="text-sm text-green-200 hover:text-green-100 transition-colors"
          onClick={() => setView('forgotPassword')}
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-green-200 text-black font-medium rounded-lg hover:bg-green-300 transition-colors"
      >
        Log in
      </button>
      
      <div className="text-center pt-2">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/signup')}
            className="text-white hover:text-green-200 transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-800 text-center">
        <button
          type="button"
          onClick={() => setView('helpCenter')}
          className="text-sm text-gray-400 hover:text-white inline-flex items-center gap-1 transition-colors"
        >
          <HelpCircle size={16} />
          <span>Need help?</span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
