const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome! echoMail is still under active development.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});