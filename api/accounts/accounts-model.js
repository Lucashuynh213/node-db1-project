const db = require('../../data/db-config')

// Retrieve all accounts from the database
async function getAll() {
  return await db('accounts').select('*');
}

// Retrieve a single account by ID
async function getById(id) {
  return await db('accounts').where({ id }).first();
}

// Retrieve a single account by name (for uniqueness check)
async function getByName(name) {
  return await db('accounts').where({ name }).first();
}

// Create a new account in the database
async function create(account) {
  const [id] = await db('accounts').insert(account);
  return getById(id); // Returns the newly created account
}

// Update an existing account by ID
async function update(id, changes) {
  await db('accounts').where({ id }).update(changes);
  return getById(id); // Returns the updated account
}

// Delete an account by ID
async function deleteAccount(id) {
  const deletedAccount = await getById(id);
  await db('accounts').where({ id }).del();
  return deletedAccount; // Returns the deleted account for confirmation
}

module.exports = {
  getAll,
  getById,
  getByName,
  create,
  update,
  delete: deleteAccount,
};