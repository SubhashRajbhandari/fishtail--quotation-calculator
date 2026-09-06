import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import nodemailer from 'nodemailer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'ses-smtp-server-relay',
        configureServer(server) {
          server.middlewares.use('/api/send-email', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const data = JSON.parse(body || '{}');
                const {
                  to,
                  cc,
                  subject,
                  html,
                  fromEmail = data.fromEmail || env.VITE_AWS_SES_FROM_EMAIL || 'reservations@fishtail.org',
                  fromName = data.fromName || env.VITE_AWS_SES_FROM_NAME || 'FishTail Tours & Travels',
                  region = data.region || env.VITE_AWS_SES_REGION || 'us-east-1',
                  smtpUser = data.smtpUser || env.VITE_AWS_SES_SMTP_USER || 'AKIAYNKQA2QVZMS3VPFZ',
                  smtpPass = data.smtpPass || env.VITE_AWS_SES_SMTP_PASS || 'BN1R9SxNky+61bRQ8MbSV1qxpE9eBv5PHKZyKYCpjb4g'
                } = data;

                if (!to) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Recipient email ("to") is required.' }));
                  return;
                }

                const host = `email-smtp.${region}.amazonaws.com`;
                const transporter = nodemailer.createTransport({
                  host,
                  port: 465,
                  secure: true,
                  auth: {
                    user: smtpUser,
                    pass: smtpPass
                  }
                });

                const formattedSender = fromName ? `"${fromName}" <${fromEmail}>` : fromEmail;
                const info = await transporter.sendMail({
                  from: formattedSender,
                  to,
                  cc: cc || undefined,
                  subject,
                  html
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, messageId: info.messageId, mode: 'ses_smtp' }));
              } catch (err) {
                console.error('[AWS SES SMTP Relay Error]:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Failed to dispatch email via AWS SES SMTP' }));
              }
            });
          });
        }
      }
    ],
    server: {
      port: 5173,
      host: true
    }
  };
});
