import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Sparkles, Eye, EyeOff, Briefcase } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('HR');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await API.post('/users/register', { name, email, password, role });
      toast.success('Account created successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-center" />

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-glow-lg mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-surface-400">Join InterviewHub and streamline your hiring</p>
        </div>

        {/* Register Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <User className="w-4 h-4 text-primary-400" />
                Full Name
              </label>
              <input
                id="register-name"
                className="input-field"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary-400" />
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary-400" />
                Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('HR')}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all duration-300 ${
                    role === 'HR'
                      ? 'bg-primary-600/20 border-primary-500/50 text-primary-300 shadow-glow'
                      : 'bg-surface-800/50 border-surface-600/30 text-surface-400 hover:border-surface-500/50'
                  }`}
                >
                  HR Manager
                </button>
                <button
                  type="button"
                  onClick={() => setRole('INTERVIEWER')}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all duration-300 ${
                    role === 'INTERVIEWER'
                      ? 'bg-primary-600/20 border-primary-500/50 text-primary-300 shadow-glow'
                      : 'bg-surface-800/50 border-surface-600/30 text-surface-400 hover:border-surface-500/50'
                  }`}
                >
                  Interviewer
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="register-submit"
              disabled={loading}
              className={`btn-primary flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-surface-700/50 text-center">
            <p className="text-surface-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
