'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginUser } from '../store/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoading, error } = useSelector((state) => state.auth);

  const validate = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email address is invalid.';
    if (!password) errors.password = 'Password is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const credentials = { email, password };

      dispatch(loginUser(credentials))
        .unwrap()
        .then((result) => {
          const userRole = result.user?.role;

          if (userRole === 'admin') {
            router.push('/admin'); 
          } else {
            router.push('/dashboard'); 
          }
        })
        .catch((err) => {
          console.error("Login failed:", err);
        });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Sign In
        </h2>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={formErrors.email}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your secure password"
            error={formErrors.password}
          />

          <Button type="submit" disabled={isLoading} className="mt-6">
            {isLoading ? <Loader size="sm" message="Signing In..." /> : 'Log In'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <a onClick={() => router.push('/register')} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer ml-1">
            Register Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;