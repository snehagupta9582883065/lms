// /store/loanSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const initialState = {
  loans: [],
  selectedLoan: null,
  isLoading: false,
  error: null,
  isSubmitting: false,
};

export const fetchUserLoans = createAsyncThunk(
  'loans/fetchUserLoans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/loans/my');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch your loans';
      return rejectWithValue(message);
    }
  }
);

// 2. Create New Loan
export const createLoan = createAsyncThunk(
  'loans/createLoan',
  async (loanData, { rejectWithValue }) => {
    try {
      const response = await api.post('/loans', loanData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create loan';
      return rejectWithValue(message);
    }
  }
);

// 3. Fetch Single Loan Details
export const fetchLoanDetails = createAsyncThunk(
  'loans/fetchLoanDetails',
  async (loanId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/loans/${loanId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch loan details';
      return rejectWithValue(message);
    }
  }
);


const loanSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLoans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserLoans.fulfilled, (state, action) => {
        state.isLoading = false;

        const payload = action.payload;

        // Normalize so state.loans is ALWAYS an array
        state.loans = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.loans)
            ? payload.loans
            : Array.isArray(payload?.data)
              ? payload.data
              : [];
      })
      .addCase(fetchUserLoans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // --- Create Loan Reducers ---
      .addCase(createLoan.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createLoan.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Optional: add the new loan to the list
        state.loans.unshift(action.payload);
      })
      .addCase(createLoan.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      // --- Fetch Single Loan Details Reducers ---
      .addCase(fetchLoanDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedLoan = null;
      })
      .addCase(fetchLoanDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedLoan = action.payload;
      })
      .addCase(fetchLoanDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default loanSlice.reducer;