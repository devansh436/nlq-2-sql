const axios = require('axios');
require('dotenv').config();

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function generateSQL(naturalLanguageQuery, schema) {
  const prompt = `You are an expert MySQL query generator.

Database Schema:
${schema}

CRITICAL: Return ONLY the SQL query as plain text. Do NOT include:
- Markdown code blocks
- The word "sql" before the query
- Explanations
- Comments
- Any text before or after the query

User Question: ${naturalLanguageQuery}

Plain SQL query:`;

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500
      }
    });

    let sqlQuery = response.data.candidates[0].content.parts[0].text.trim();
    
    // Remove markdown code blocks
    // sqlQuery = sqlQuery.replace("/```/g");
    sqlQuery = sqlQuery.replace(/```/g, '');
    
    // Remove the word "sql" at the beginning (case insensitive)
    sqlQuery = sqlQuery.replace(/^sql\s*/i, '');
    
    // Normalize whitespace - replace multiple spaces/newlines with single space
    sqlQuery = sqlQuery.replace(/\s+/g, ' ').trim();
    
    // Remove semicolon at the end
    sqlQuery = sqlQuery.replace(/;$/, '');
    
    // console.log('Cleaned SQL:', sqlQuery);
    
    return sqlQuery;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate SQL query');
  }
}

module.exports = { generateSQL };
