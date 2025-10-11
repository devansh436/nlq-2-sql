import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Box, 
  Chip,
  Typography 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const SAMPLE_QUERIES = [
  "Show me all books",
  "List all available books",
  "Which members have overdue books?",
  "Show me all technology books",
  "How many books has each member borrowed?",
  "List members who joined in 2024"
];

function QueryInput({ onSubmit, loading }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
    }
  };

  const handleSampleClick = (sample) => {
    setQuestion(sample);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ask a Question
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="e.g., Show me all books currently borrowed"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={loading || !question.trim()}
          fullWidth
        >
          {loading ? 'Processing...' : 'Execute Query'}
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Try these sample queries:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {SAMPLE_QUERIES.map((sample, index) => (
            <Chip
              key={index}
              label={sample}
              onClick={() => handleSampleClick(sample)}
              variant="outlined"
              size="small"
              disabled={loading}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

export default QueryInput;
