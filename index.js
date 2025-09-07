const { getSession, createSession, revokeSession, expireSessions, addMessage } = require('./db.js');
const { rateLimit } = require('express-rate-limit');
const SimpleMail = require('simple-mail-smtp');
const { DateTime } = require('luxon');
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cors = require('cors');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const mail = new SimpleMail();
mail.catch(getMessages);

app.use('/api', cors());
require('dotenv').config({ quiet: true });

const static = path.join(__dirname, 'client', 'dist');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests limit
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

function randomString(length = 7) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function createEmail() {
  const email = randomString().toLowerCase();
  const exists = await getSession(email, false);

  if (exists) return createEmail();
  return email;
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
        if(!req.body?.token) return res.status(401).json({ success: false, reason: 'An invalid session token was provided. Please try again.' });

        try {
          const session = await getSession(req.body.id, true);
          if(!session) return res.status(404).json({ success: false, reason: 'Session not found.' });
          
          const valid = await bcrypt.compare(req.body.token, session.token);
          if(!valid) return res.status(401).json({ success: false, reason: 'An invalid session token was provided. Please try again.' });

          const { token: _, ...omitSession } = session;
          return res.status(200).json({ success: true, data: omitSession });
        } catch (error) {
          console.error(chalk.red('[SERVER]'), 'Failed to retrieve a session:', error);

          return res.status(500).json({ success: false, reason: 'Failed to retrieve your session. Please try again later.' });
        }
      }
      case 'create': {
        let duration = '24h';
        
        if(req.body?.duration && ['24h', '48h', '3d', '7d'].includes(req.body.duration)) duration = req.body.duration;
        if(duration.endsWith('h')) duration = parseInt(duration);
        if(duration.endsWith('d')) duration = (parseInt(duration) * 24);

        const expiresAt = DateTime.utc().plus({ hours: duration }).toJSDate(); // Sessions expire in 24 hours (default), configurable by user

        try {
          const token = crypto.randomBytes(60).toString('base64url');
          const session = await createSession({ id: (await createEmail()), token: (await bcrypt.hash(token, 10)), createdAt: DateTime.utc().toJSDate(), expiresAt });

          if(!session) return res.status(500).json({ success: false, reason: 'Failed to create a new session. Please try again later.' });

          const { token: _, ...omitSession } = session;
          return res.status(201).json({ success: true, token: token, data: omitSession });
        } catch (error) {
          console.error(chalk.red('[SERVER]'), 'Failed to create a new session:', error);

          return res.status(500).json({ success: false, reason: 'Failed to create a new session. Please try again later.' });
        }
      }
      case 'revoke': {
        if(!req.body?.id) return res.status(400).json({ success: false, reason: 'Your request has been malformed. Please try again.' });
        if(!req.body?.token) return res.status(401).json({ success: false, reason: 'An invalid session token was provided. Please try again.' });

        try {
          const session = await getSession(req.body.id, true);
          if(!session) return res.status(404).json({ success: false, reason: 'Session not found or has already been revoked.' });
          
          const valid = await bcrypt.compare(req.body.token, session.token);
          if(!valid) return res.status(401).json({ success: false, reason: 'An invalid session token was provided. Please try again.' });

          const revoked = await revokeSession(req.body.id);
          const { token: _, ...omitSession } = revoked;
          return res.status(200).json({ success: true, data: omitSession });
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

  if (fs.existsSync(static) && fs.existsSync(path.join(static, "index.html"))) {
    app.use(express.static(static)); // First serve static files
    app.get('/{*any}', (req, res) => { // Then serve any other paths left
      res.sendFile(path.join(static, "index.html"));
    });

    console.log(`${chalk.green('[SERVER]')} Static files are being served from ${static}.`);
  } else {
    console.error(chalk.yellow('[SERVER]'), 'Static directory not found, website will not be served. Please build the client first.');
  }
});