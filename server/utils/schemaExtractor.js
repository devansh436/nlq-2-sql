const pool = require('../config/db');

async function extractSchema(userRole = null) {
  const connection = await pool.getConnection();
  try {
    // If no role, show all tables (backward compatible)
    const allowedTables = userRole 
      ? require('./roleValidator').filterTablesByRole(userRole)
      : ['books', 'members', 'staff', 'transactions'];
    
    const [tables] = await connection.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
    `);

    let schema = '';
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      
      // Skip tables user doesn't have access to
      if (!allowedTables.includes(tableName)) {
        continue;
      }

      const [columns] = await connection.query(`DESCRIBE ${tableName}`);

      schema += `\nTable: ${tableName}\n`;
      columns.forEach(col => {
        schema += `  - ${col.Field} (${col.Type}) ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''} ${col.Key === 'MUL' ? 'FOREIGN KEY' : ''}\n`;
      });
    }

    return schema;
  } finally {
    connection.release();
  }
}

module.exports = { extractSchema };
