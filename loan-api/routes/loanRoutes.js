const express = require('express');
const { protect } = require('../middleware/auth');
const { adminProtect } = require('../middleware/admin');
const {
    createLoan,
    getUserLoans,
    getLoanDetails,
    updateLoanStatus,
    getAllLoansAdmin
} = require('../controllers/loanController');
const router = express.Router();

router.post('/', protect, createLoan);
router.get('/my', protect, getUserLoans);
router.get('/:id', protect, getLoanDetails);

router.put('/admin/:id', protect, adminProtect, updateLoanStatus);
router.get('/admin', protect, adminProtect, getAllLoansAdmin);

module.exports = router;