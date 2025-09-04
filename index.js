const { getSession, createSession, revokeSession, expireSessions, addMessage, deleteMessage } = require('./db.js');
const { rateLimit } = require('express-rate-limit');
const SimpleMail = require('simple-mail-smtp');
const { DateTime } = require('luxon');
const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const mail = new SimpleMail();
mail.catch(getMessages);

require('dotenv').config({ quiet: true });

const static = path.join(__dirname, 'client', 'dist');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests limit
  message: {
    error: 'Too many requests, please try again later.'
  }
});

app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', Number(process.env.PROXY_TRUST) ?? false);
app.use(express.json());
app.use(limiter);

if(process.env.VERIFY_DKIM?.toString() === 'false') {
  console.log(chalk.blue('[SMTP]'), chalk.yellow('DKIM verification is disabled. This is not recommended for production.'));
  mail.verifyDKIM(false);
}

async function getMessages(parsed) {
  const email = parsed.to?.text.split('@')[0].toLowerCase();
  const domain = parsed.to?.text.split('@')[1].toLowerCase();
  const session = await getSession(email, false);
  if(!session || (process.env?.DOMAIN_CHECK && process.env.DOMAIN_CHECK?.toLowerCase() !== domain)) return;

  return await addMessage(session.id, {
    from: parsed.from?.text || 'Unknown',
    subject: parsed?.subject || '(No Subject)',
    body: parsed?.text || '(No Content)',
    html: parsed?.html || null,
    receivedAt: parsed?.date ? DateTime.fromJSDate(parsed.date).toUTC().toJSDate() : DateTime.utc().toJSDate()
  });
}

app.post('/api/session', async (req, res) => {
  try {
    const { method } = req.body;

    if (!method) {
      return res.status(400).json({ success: false, reason: 'Your request has been malformed. Please try again.' });
    }

    switch (method) {
      case 'get': {
        if(!req.body?.id) return res.status(400).json({ success: false, reason: 'Your request has been malformed. Please try again.' });

        try {
          const session = await getSession(req.body.id, true);

          if(!session) return res.status(404).json({ success: false, reason: 'Session not found.' });
          return res.status(200).json({ success: true, data: session });
        } catch (error) {
          console.error(chalk.red('[SERVER]'), 'Failed to retrieve a session:', error);

          return res.status(500).json({ success: false, reason: 'Failed to retrieve your session. Please try again later.' });
        }
      }
      case 'create': {
        const expiresAt = DateTime.utc().plus({ hours: 24 }).toJSDate(); // Sessions expire in 24 hours

        try {
          const session = await createSession({ id: crypto.randomUUID(), createdAt: DateTime.utc().toJSDate(), expiresAt });

          if(!session) return res.status(500).json({ success: false, reason: 'Failed to create a new session. Please try again later.' });
          return res.status(201).json({ success: true, data: session });
        } catch (error) {
          console.error(chalk.red('[SERVER]'), 'Failed to create a new session:', error);

          return res.status(500).json({ success: false, reason: 'Failed to create a new session. Please try again later.' });
        }
      }
      case 'revoke': {
        if(!req.body?.id) return res.status(400).json({ success: false, reason: 'Your request has been malformed. Please try again.' });

        try {
          const session = await revokeSession(req.body.id);

          if(!session) return res.status(404).json({ success: false, reason: 'Session not found or has already been revoked.' });
          return res.status(200).json({ success: true, data: session });
        } catch (error) {
          console.error(chalk.red('[SERVER]'), 'Failed to revoke an existing session:', error);

          return res.status(500).json({ success: false, reason: 'Failed to revoke this session. Please try again later.' });
        }
      }
      default: {
        return res.status(400).json({ success: false, reason: 'Your request contains an invalid method. Please try again.' });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, reason: 'An unknown error occurred. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`${chalk.green('[SERVER]')} Server is running on http://localhost:${PORT}`);
  setInterval(expireSessions, 30000);

  mail.listen(25, () => {
    console.log(`${chalk.blue('[SMTP]')} Catch-all mail server is running on port 25.`);
  });

  if (fs.existsSync(static)) {
    app.use(express.static(static));

    console.log(`${chalk.green('[SERVER]')} Static files are being served from ${static}.`);
  } else {
    console.error(chalk.yellow('[SERVER]'), 'Static directory not found, website will not be served. Please build the client first.');
  }
});