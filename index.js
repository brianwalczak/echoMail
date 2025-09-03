const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const static = path.join(__dirname, 'client', 'dist');

app.listen(PORT, () => {
  console.log(`${chalk.green('[SUCCESS]')} Server is running on http://localhost:${PORT}`);

  if (fs.existsSync(static)) {
    app.use(express.static(static));

    console.log(`${chalk.green('[SUCCESS]')} Static files are being served from ${static}.`);
  } else {
    console.error(chalk.yellow('[WARNING]'), 'Static directory not found, website will not be served. Please build the client first.');
  }
});