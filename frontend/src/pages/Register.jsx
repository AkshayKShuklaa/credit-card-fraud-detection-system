import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, Lock, User, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, role);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md card p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-success to-primary-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-dark-900 border border-dark-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <ShieldAlert className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1">Join the Fraud Detection platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                className="input-field pl-10"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-500" />
              </div>
              <select
                className="input-field pl-10 appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">Analyst (USER)</option>
                <option value="ADMIN">Administrator (ADMIN)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-2.5 mt-2">
            Register Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400 relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
