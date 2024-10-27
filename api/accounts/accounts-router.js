const router = require('express').Router();
const AccountsModel = require('./accounts-model');
const {
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId
} = require('./accounts-middleware');

// GET all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await AccountsModel.getAll();
    res.status(200).json(accounts || []);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving accounts" });
  }
});

// GET account by ID with middleware to check ID
router.get('/:id', checkAccountId, async (req, res) => {
  res.status(200).json(req.account); // `req.account` is set in `checkAccountId`
});

// POST new account with middleware for payload validation and unique name check
router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res) => {
  const { name, budget } = req.body;

  try {
    const newAccount = await AccountsModel.create({
      name: name,
      budget: budget,
    });
    res.status(201).json(newAccount);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: "Error creating account" });
  }
});

// PUT update account by ID with payload, unique name, and ID validation
router.put('/:id', checkAccountId, checkAccountPayload, checkAccountNameUnique, async (req, res) => {
  try {
    const updatedAccount = await AccountsModel.update(req.params.id, {
      name: req.body.name,
      budget: req.body.budget,
    });
    res.status(200).json(updatedAccount);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: "Error updating account" });
  }
});
// DELETE account by ID with ID validation middleware
router.delete('/:id', checkAccountId, async (req, res) => {
  try {
    await AccountsModel.delete(req.params.id);
    res.status(200).json({ message: "account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting account" });
  }
});

// Error handler
router.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    message: err.message || 'An unexpected error occurred',
    stack: err.stack, // Optional: Include stack trace for debugging (remove in production)
  });
});

module.exports = router;