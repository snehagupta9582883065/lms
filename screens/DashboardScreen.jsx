'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchUserLoans } from '../store/loanSlice';
import { logout } from '../store/authSlice';
import Button from '../components/Button';
import LoanList from '../components/LoanList';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, token } = useSelector((state) => state.auth);
  const { loans, isLoading, error } = useSelector((state) => state.loans);
  
  useEffect(() => {
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;

  if (!token && !storedToken) {
    router.push('/login');
  } else {
    // Proceed to fetch loans — api interceptor will pick token from localStorage
    dispatch(fetchUserLoans());
  }
}, [token, dispatch, router]);
  
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Loan Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome, {user ? user.name : 'User'}!
          </h2>
          <Button onClick={() => router.push('/create-loan')}>
            Create New Loan
          </Button>
        </div>
        
        {error && (
          <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
            Error fetching loans: {error}
          </div>
        )}

        <h3 className="text-xl font-medium text-gray-700 mt-8 mb-4">
          Your Loan Applications
        </h3>
        <LoanList loans={loans} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default DashboardScreen;