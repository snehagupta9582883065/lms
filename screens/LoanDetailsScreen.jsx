'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchLoanDetails } from '../store/loanSlice';
import Loader from '../components/Loader';
import Button from '../components/Button';

const getStatusClasses = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  switch (status.toLowerCase()) {
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'pending': 
    default: return 'bg-yellow-100 text-yellow-800';
  }
};

const DetailRow = ({ label, children }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100">
    <span className="text-gray-500 font-medium">{label}:</span>
    <span className="text-gray-900">{children}</span>
  </div>
);

const LoanDetailsScreen = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const loanIdParam = params?.id;

  const { selectedLoan, isLoading, error } = useSelector((state) => state.loans);

  useEffect(() => {
    if (loanIdParam) {
      if (!selectedLoan || String(selectedLoan.id ?? selectedLoan._id) !== String(loanIdParam)) {
        dispatch(fetchLoanDetails(loanIdParam));
      }
    }
  }, [loanIdParam, selectedLoan, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (isLoading || !selectedLoan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading loan details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-10">
        <div className="p-4 text-center text-sm text-red-800 bg-red-100 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  const idValue = selectedLoan._id ?? selectedLoan.id ?? '';
  const shortId = idValue ? String(idValue).slice(-6) : '—';

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">
          Loan Details - ID: {shortId}
        </h2>

        <div className="space-y-6">
          <DetailRow label="Amount">${Number(selectedLoan.amount ?? 0).toLocaleString()}</DetailRow>
          <DetailRow label="Tenure">{selectedLoan.tenure ?? '—'} months</DetailRow>
          <DetailRow label="Status">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(selectedLoan.status)}`}>
              {selectedLoan.status ?? '—'}
            </span>
          </DetailRow>
          <DetailRow label="Created At">{formatDate(selectedLoan.createdAt ?? selectedLoan.created_at)}</DetailRow>

          <div className="mt-8 pt-6 border-t">
            <Button variant="secondary" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsScreen;
