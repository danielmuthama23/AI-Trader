const sgMail = require('@sendgrid/mail');

const FROM_EMAIL = process.env.ALERT_FROM_EMAIL || 'noreply@aitrader.local';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailAlertService {
  async subscribeEmail(email) {
    // In production, store in database
    console.log(`📧 Email subscribed: ${email}`);
    return { status: 'subscribed', email };
  }

  async unsubscribeEmail(email) {
    console.log(`📧 Email unsubscribed: ${email}`);
    return { status: 'unsubscribed', email };
  }

  async sendAlert(email, data) {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid not configured. Alert not sent.');
      return;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">🚨 High-Confidence Trading Signal</h2>
        <p><strong>Pair:</strong> ${data.pair}</p>
        <p><strong>Signal:</strong> <span style="color: ${data.action === 'BUY' ? '#10b981' : '#f43f5e'}; font-weight: bold;">${data.action}</span></p>
        <p><strong>Confidence:</strong> ${data.confidence}%</p>
        <p><strong>Strategy:</strong> ${data.strategy}</p>
        <hr>
        <p><em>${data.reasoning}</em></p>
        <p style="font-size: 12px; color: #666;">AI Trading Agent • ${new Date().toISOString()}</p>
      </div>
    `;

    try {
      await sgMail.send({
        to: email,
        from: FROM_EMAIL,
        subject: `AI Signal: ${data.action} ${data.pair} - ${data.confidence}% confidence`,
        html: htmlContent
      });
      console.log(`✓ Alert sent to ${email}`);
    } catch (error) {
      console.error('SendGrid error:', error);
    }
  }

  async sendTestAlert(email) {
    return this.sendAlert(email, {
      pair: 'EUR/USD',
      action: 'BUY',
      confidence: 85,
      strategy: 'Trend Following',
      reasoning: 'Strong bullish signal on 4H timeframe. RSI oversold, MACD bullish crossover.'
    });
  }
}

module.exports = new EmailAlertService();
