const express = require('express');
const app = express();
const port = 3000;

// Serve static assets (e.g., CSS, JavaScript, images)
app.use(express.static('public'));

// Serve your main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
