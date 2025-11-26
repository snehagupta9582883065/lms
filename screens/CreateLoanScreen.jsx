'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createLoan } from '../store/loanSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';

const CreateLoanScreen = () => {
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [purpose, setPurpose] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const router = useRouter();
  const { isSubmitting, error } = useSelector((state) => state.loans);

  const validate = () => {
    const errors = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) errors.amount = 'Valid loan amount is required.';
    if (!tenure || isNaN(Number(tenure)) || Number(tenure) <= 0) errors.tenure = 'Valid tenure (months) is required.';
    if (!purpose) errors.purpose = 'Loan purpose is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const loanData = {
      amount: Number(amount),
      tenure: Number(tenure),
      purpose,
    };

    try {
      await dispatch(createLoan(loanData)).unwrap();
      // Reset form
      setAmount('');
      setTenure('');
      setPurpose('');
      setFormErrors({});
      alert('Loan application submitted successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Loan submission failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          New Loan Application
        </h2>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Loan Amount ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 5000"
            error={formErrors.amount}
          />
          <Input
            label="Tenure (Months)"
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="e.g., 12"
            error={formErrors.tenure}
          />
          <Input
            label="Loan Purpose"
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., Car repair, Education fee"
            error={formErrors.purpose}
          />

          <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
            {isSubmitting ? <Loader size="sm" message="Submitting..." /> : 'Submit Application'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/dashboard')}
            className="mt-3 w-full"
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoanScreen;
