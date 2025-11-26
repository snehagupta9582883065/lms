const db = require('../config/db');

exports.createLoan = async (req, res) => {
  const { amount, tenure, purpose } = req.body;
  const userId = req.user.id;

  if (!amount || !tenure || !purpose) {
    return res.status(400).json({ message: 'Please provide amount, tenure, and purpose.' });
  }

  if (isNaN(amount) || amount <= 0 || isNaN(tenure) || tenure <= 0) {
    return res.status(400).json({ message: 'Amount and tenure must be positive numbers.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO loans (amount, tenure, purpose, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [amount, tenure, purpose, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create Loan Error:', error);
    res.status(500).json({ message: 'Server error creating loan.' });
  }
};

exports.getUserLoans = async (req, res) => {
  try {
    // Protect middleware must set req.user.id (see below)
    const userId = req.user?.id || req.userId || null;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await db.query(
      'SELECT id, amount, tenure, purpose, status, created_at FROM loans WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return res.status(200).json({ loans: result.rows });
  } catch (error) {
    console.error('Get User Loans Error:', error);
    return res.status(500).json({ message: 'Server error fetching loans.' });
  }
};

// GET /api/loans/:id - fetch loan details by numeric id
exports.getLoanDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // If someone calls /api/loans/my and you still hit this route,
    // protect against non-numeric values
    if (id === 'my') {
      // Optionally redirect to getUserLoans, or return 400
      return exports.getUserLoans(req, res);
    }

    const loanId = Number(id);
    if (!Number.isInteger(loanId)) {
      return res.status(400).json({ message: 'Invalid loan id parameter.' });
    }

    const result = await db.query('SELECT * FROM loans WHERE id = $1', [loanId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Loan not found' });

    return res.status(200).json({ loan: result.rows[0] });
  } catch (error) {
    console.error('Get Loan Details Error:', error);
    return res.status(500).json({ message: 'Server error fetching loan details.' });
  }
};

exports.updateLoanStatus = async (req, res) => {
  const loanId = req.params.id;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be approved or rejected.' });
  }

  try {
    const result = await db.query(
      'UPDATE loans SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND status = $3 RETURNING *',
      [status, loanId, 'pending']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Loan not found or status already processed.' });
    }

    res.json({ message: `Loan ${loanId} successfully set to ${status}.`, loan: result.rows[0] });
  } catch (error) {
    console.error('Admin Update Loan Status Error:', error);
    res.status(500).json({ message: 'Server error updating loan status.' });
  }
};

exports.getAllLoansAdmin = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT l.*, u.name as applicant_name, u.email as applicant_email FROM loans l JOIN users u ON l.user_id = u.id ORDER BY l.created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Admin Get All Loans Error:', error);
    res.status(500).json({ message: 'Server error fetching all loans.' });
  }
};