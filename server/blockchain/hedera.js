const { Client, TopicMessageSubmitTransaction, PrivateKey } = require('@hashgraph/sdk');

class HederaLogger {
  constructor() {
    this.accountId = process.env.HEDERA_ACCOUNT_ID;
    this.privateKey = process.env.HEDERA_PRIVATE_KEY;
    this.topicId = process.env.HEDERA_TOPIC_ID;
    this.client = null;

    if (this.accountId && this.privateKey && this.topicId) {
      this.client = Client.forTestnet();
      this.client.setOperator(this.accountId, PrivateKey.fromString(this.privateKey));
    }
  }

  async logDecision(data) {
    if (!this.client) {
      console.warn('Hedera not configured. Skipping audit log.');
      return;
    }

    try {
      const message = JSON.stringify({
        type: data.type || 'AI_DECISION',
        timestamp: Date.now(),
        version: '1.0',
        ...data
      });

      const transaction = await new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId)
        .setMessage(message)
        .execute(this.client);

      console.log('✓ Decision logged to Hedera:', transaction.transactionId.toString());
      return transaction;
    } catch (error) {
      console.error('Hedera logging error:', error);
    }
  }

  async logTrade(tradeData) {
    return this.logDecision({
      type: 'TRADE_EXECUTION',
      pair: tradeData.pair,
      action: tradeData.action,
      price: tradeData.price,
      lots: tradeData.lots,
      mt4Ticket: tradeData.ticket
    });
  }
}

module.exports = new HederaLogger();
