import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { isValidEmail, isNotEmpty } from '../utils/validators';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, status } = useSelector(s => s.auth || {});

  const validate = (values) => {
    const errs = {};
    if (!isNotEmpty(values.email)) errs.email = 'Email is required';
    else if (!isValidEmail(values.email)) errs.email = 'Invalid email';
    if (!isNotEmpty(values.password)) errs.password = 'Password is required';
    return errs;
  };

  const loginUser = async (values) => {
    const result = await dispatch(login({ email: values.email.trim(), password: values.password }));
    if (result.type === 'auth/login/fulfilled') {
      navigate(location.state?.from || '/');
    }
  };

  const { values: form, errors, handleChange: onChange, handleSubmit } = useForm(
    { email: '', password: '' },
    validate
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit(loginUser)}>
        <h2 className="text-2xl font-bold mb-6 text-white">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          {errors.email && <div className="text-red-400 text-sm mt-1">{errors.email}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          {errors.password && <div className="text-red-400 text-sm mt-1">{errors.password}</div>}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
          disabled={status === 'pending'}
        >
          {status === 'pending' ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="text-red-400 text-sm mt-4">{typeof error === 'string' ? error : error?.error}</div>}
        <div className="mt-6 text-center text-sm text-gray-300">
          New here? <a href="/signup" className="text-blue-400 hover:underline">Register here</a>
        </div>
      </form>
    </div>
  );
};

export default Login;