'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { registerUser } from '../store/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const router = useRouter();
  
  const { isLoading, error } = useSelector((state) => state.auth);

  const validate = () => {
    const errors = {};
    if (!name) errors.name = 'Name is required.';
    if (!email) errors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email address is invalid.';
    if (!password) errors.password = 'Password is required.';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const userData = { name, email, password };
      dispatch(registerUser(userData))
        .unwrap() 
        .then(() => {
          alert('Registration successful! Please log in.');
          router.push('/login'); 
        })
        .catch(() => {
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Create Account
        </h2>
        
        {error && (
          <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            error={formErrors.name}
          />
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
            placeholder="Min 6 characters"
            error={formErrors.password}
          />

          <Button type="submit" disabled={isLoading} className="mt-6">
            {isLoading ? <Loader size="sm" message="Registering..." /> : 'Register'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? 
          <a onClick={() => router.push('/login')} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer ml-1">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;