const AccountsModel = require('./accounts-model');

const checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;

  if (name === undefined || budget === undefined) {
      return res.status(400).json({ message: "name and budget are required" });
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 3 || trimmedName.length > 100) {
      return res.status(400).json({ message: "name must be between 3 and 100 characters" });
  }

  // Validate budget as a number
  // If budget is not a number (including NaN), return error
  if (typeof budget !== 'number' || isNaN(budget)) {
      return res.status(400).json({ message: "must be a number" });
  }

  if (budget < 0 || budget > 1000000) {
      return res.status(400).json({ message: "too large or too small" });
  }

  req.body.name = trimmedName;
  req.body.budget = budget; // Store the budget as a number
  next();
};
// Middleware to ensure account name is unique
const checkAccountNameUnique = async (req, res, next) => {
  try {
    const existingAccount = await AccountsModel.getByName(req.body.name);
    if (existingAccount) {
      return res.status(400).json({ message: "name is taken" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Error checking account name uniqueness" });
  }
};

// Middleware to check if account ID exists
const checkAccountId = async (req, res, next) => {
  try {
    const account = await AccountsModel.getById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "account not found" });
    }
    req.account = account;
    next();
  } catch (err) {
    res.status(500).json({ message: "Error retrieving account by ID" });
  }
};

module.exports = {
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId,
};