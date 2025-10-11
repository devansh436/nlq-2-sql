const pool = require('../config/db');
const { generateSQL } = require('./llmService');
const { extractSchema } = require('../utils/schemaExtractor');

async function executeNLQuery(naturalLanguageQuery, maxRetries = 2) {
  let attempt = 0;
  let lastError = null;
  let generatedSQL = null;

  const schema = await extractSchema();

  while (attempt < maxRetries) {
    try {
      // Generate SQL from natural language
      if (attempt === 0) {
        generatedSQL = await generateSQL(naturalLanguageQuery, schema);
      } else {
        // Self-correction: include previous error in prompt
        generatedSQL = await generateSQL(
          `${naturalLanguageQuery}\n\nPrevious query failed with error: ${lastError}\nPlease fix the query.`,
          schema
        );
      }

      console.log(`Attempt ${attempt + 1} - Generated SQL:`, generatedSQL);

      // Validate query (security check)
      if (!isValidQuery(generatedSQL)) {
        throw new Error('Invalid or unsafe SQL query detected');
      }

      // Execute query
      const [results] = await pool.query(generatedSQL);

      return {
        success: true,
        query: generatedSQL,
        results: results,
        rowCount: results.length,
        attempt: attempt + 1
      };

    } catch (error) {
      lastError = error.message;
      attempt++;
      
      if (attempt >= maxRetries) {
        return {
          success: false,
          query: generatedSQL,
          error: lastError,
          attempts: attempt
        };
      }
    }
  }
}

function isValidQuery(sql) {
  const upperSQL = sql.toUpperCase().trim();
  
  // Only allow SELECT queries
  if (!upperSQL.startsWith('SELECT')) {
    return false;
  }
  
  // Block dangerous keywords
  const dangerousKeywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'TRUNCATE', 'ALTER', 'CREATE'];
  for (const keyword of dangerousKeywords) {
    if (upperSQL.includes(keyword)) {
      return false;
    }
  }
  
  return true;
}

module.exports = { executeNLQuery };
