import React from 'react';
import Link from 'next/link';
import Loader from './Loader';

const getStatusClasses = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const dt = new Date(dateString);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const LoanList = ({ loans, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-8"><Loader message="Fetching loans..." /></div>;
  }

  // Coerce loans into an array — support multiple shapes
  const loanArray = Array.isArray(loans)
    ? loans
    : (loans && Array.isArray(loans.loans))
      ? loans.loans
      : (loans && Array.isArray(loans.data))
        ? loans.data
        : [];

  if (!loanArray || loanArray.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg p-6 mt-4">
        No loan applications found. Click "Create New Loan" to apply.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loanArray.map((loan) => {
            const id = loan._id ?? loan.id ?? loan.loan_id ?? '';
            const amount = loan.amount ?? 0;
            const createdAt = loan.createdAt ?? loan.created_at ?? loan.created ?? null;
            const status = loan.status ?? 'pending';

            return (
              <tr key={id || Math.random()}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${Number(amount).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {loan.tenure ?? '—'} months
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(status)}`}>
                    {String(status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/loans/${id}`} className="text-indigo-600 hover:text-indigo-900">
                    View Details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LoanList;