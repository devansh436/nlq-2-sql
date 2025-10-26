// Check table access permissions
const canAccessTable = (userRole, tableName) => {
  if (!userRole) return true; // No auth = access all (backward compatible)
  
  const permissions = {
    ADMIN: ['books', 'members', 'staff', 'transactions'],
    STAFF: ['books', 'members', 'transactions'], // No staff table
    USER: ['books'] // Only books
  };

  return permissions[userRole]?.includes(tableName) || false;
};

// Filter tables based on role
const filterTablesByRole = (userRole) => {
  if (!userRole) return ['books', 'members', 'staff', 'transactions']; // No auth = all tables
  
  const permissions = {
    ADMIN: ['books', 'members', 'staff', 'transactions'],
    STAFF: ['books', 'members', 'transactions'],
    USER: ['books']
  };

  return permissions[userRole] || [];
};

module.exports = { canAccessTable, filterTablesByRole };
