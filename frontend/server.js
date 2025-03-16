const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

const app = express();

// Middleware to handle SPA history mode
app.use(history());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Get port from environment or use 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});