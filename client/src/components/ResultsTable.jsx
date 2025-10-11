import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

function ResultsTable({ result }) {
  if (!result) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Enter a question above to see results
        </Typography>
      </Paper>
    );
  }

  if (!result.success) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Alert severity="error" icon={<ErrorIcon />}>
          <Typography variant="h6">Query Failed</Typography>
          <Typography variant="body2">{result.error}</Typography>
          {result.query && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" display="block">
                Generated SQL:
              </Typography>
              <code style={{ 
                fontSize: '12px', 
                background: '#f5f5f5', 
                padding: '8px', 
                display: 'block',
                borderRadius: '4px',
                marginTop: '4px'
              }}>
                {result.query}
              </code>
            </Box>
          )}
        </Alert>
      </Paper>
    );
  }

  const { query, results, rowCount, attempt } = result;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
        <Typography variant="h6">Query Results</Typography>
        <Chip 
          label={`${rowCount} row${rowCount !== 1 ? 's' : ''}`} 
          size="small" 
          sx={{ ml: 2 }} 
        />
        {attempt > 1 && (
          <Chip 
            label={`Self-corrected (Attempt ${attempt})`} 
            size="small" 
            color="warning"
            sx={{ ml: 1 }} 
          />
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Generated SQL:
        </Typography>
        <code style={{ 
          fontSize: '12px', 
          background: '#e3f2fd', 
          padding: '8px', 
          display: 'block',
          borderRadius: '4px',
          marginTop: '4px',
          wordBreak: 'break-word'
        }}>
          {query}
        </code>
      </Box>

      <Divider sx={{ my: 2 }} />

      {results.length === 0 ? (
        <Alert severity="info">No results found</Alert>
      ) : (
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {Object.keys(results[0]).map((column) => (
                  <TableCell key={column} sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((row, index) => (
                <TableRow key={index} hover>
                  {Object.values(row).map((value, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {value === null ? (
                        <em style={{ color: '#999' }}>NULL</em>
                      ) : (
                        value.toString()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default ResultsTable;
