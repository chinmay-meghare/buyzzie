import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import useForm from "../hooks/useForm";
import { isValidEmail, isNotEmpty, hasMinLength } from "../utils/validators";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, status } = useSelector((s) => s.auth || {});

  const validate = (values) => {
    const errs = {};
    if (!isNotEmpty(values.name)) errs.name = "Name is required";
    if (!isNotEmpty(values.email)) errs.email = "Email is required";
    else if (!isValidEmail(values.email)) errs.email = "Invalid email";

    if (!isNotEmpty(values.password)) errs.password = "Password is required";
    else if (!hasMinLength(values.password, 6))
      errs.password = "Password must be at least 6 characters";

    if (values.confirmPassword !== values.password)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const signupUser = async (values) => {
    const result = await dispatch(
      signup({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
    );
    if (result.type === "auth/signup/fulfilled") {
      navigate(location.state?.from || "/");
    }
  };

  const { values: form, errors, handleChange: onChange, handleSubmit } = useForm(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit(signupUser)}
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Sign Up</h2>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Name</label>
          <input
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          {errors.name && (
            <div className="text-red-400 text-sm mt-1">{errors.name}</div>
          )}
        </div>
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
          {errors.email && (
            <div className="text-red-400 text-sm mt-1">{errors.email}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          {errors.password && (
            <div className="text-red-400 text-sm mt-1">{errors.password}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          {errors.confirmPassword && (
            <div className="text-red-400 text-sm mt-1">
              {errors.confirmPassword}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
          disabled={status === "pending"}
        >
          {status === "pending" ? "Signing up..." : "Sign Up"}
        </button>
        {error && (
          <div className="text-red-400 text-sm mt-4">
            {typeof error === "string" ? error : error?.error}
          </div>
        )}
        <br />
        <div className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login here
          </a>
        </div>
      </form>
    </div>
  );
}
