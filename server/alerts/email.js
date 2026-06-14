const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const subscribers = new Set();

async function sendAlertEmail({ to, subject, body, pair, signal, confidence }) {
  const recipients = to ? [to] : [...subscribers];
  if (!recipients.length) return;
  const html = `<div style="font-family:monospace;background:#0a0d14;color:#fff;padding:24px;border-radius:12px">
    <h2 style="color:#7c3aed">⚡ AI Trading Alert</h2>
    ${pair?"<p><b>Pair:</b> "+pair+"</p>":""}
    ${signal?"<p><b>Signal:</b> "+signal+"</p>":""}
    ${confidence?"<p><b>Confidence:</b> "+confidence+"%</p>":""}
    <pre style="color:#a3e635">${body}</pre>
    <p style="color:#666;font-size:12px">AI Trading Agent · ${new Date().toUTCString()}</p>
  </div>`;
  for (const email of recipients)
    await sgMail.send({ to: email, from: process.env.ALERT_FROM_EMAIL || "alerts@aitrader.io", subject: subject || "AI Alert", html });
}

function subscribeEmail(email) { subscribers.add(email); }
function unsubscribeEmail(email) { subscribers.delete(email); }
module.exports = { sendAlertEmail, subscribeEmail, unsubscribeEmail };
