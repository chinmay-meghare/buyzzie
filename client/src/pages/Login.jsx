import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, status } = useSelector(s => s.auth || {});

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const onSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const result = await dispatch(login({ email: form.email.trim(), password: form.password }));
    if (result.type === 'auth/login/fulfilled') {
      navigate(location.state?.from || '/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md" onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-white">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Email</label>
          <input name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} className="w-full p-2 rounded bg-gray-700 text-white" />
          {errors.email && <div className="text-red-400 text-sm mt-1">{errors.email}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Password</label>
          <input type="password" name="password" autoComplete="current-password" value={form.password} onChange={onChange} className="w-full p-2 rounded bg-gray-700 text-white" />
          {errors.password && <div className="text-red-400 text-sm mt-1">{errors.password}</div>}
        </div>
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded" disabled={status === 'pending'}>
          {status === 'pending' ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="text-red-400 text-sm mt-4">{typeof error === 'string' ? error : error?.error}</div>}
        <div className="mt-6 text-center text-sm text-gray-300">
          New here? <a href="/signup" className="text-blue-400 hover:underline">Register here</a>
        </div>
      </form>
    </div>
  );
}

export default Login