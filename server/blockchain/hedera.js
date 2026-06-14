const { Client, TopicMessageSubmitTransaction, PrivateKey } = require("@hashgraph/sdk");

class HederaLogger {
  constructor() {
    try {
      this.client = Client.forTestnet();
      this.client.setOperator(process.env.HEDERA_ACCOUNT_ID, PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY));
      this.topicId = process.env.HEDERA_TOPIC_ID;
    } catch { this.client = null; }
  }
  async _submit(msg) {
    if (!this.client || !this.topicId) return;
    await new TopicMessageSubmitTransaction().setTopicId(this.topicId).setMessage(msg).execute(this.client);
  }
  async logDecision(data) { await this._submit(JSON.stringify({ type: "AI_DECISION", ...data })); }
  async logTrade(data)    { await this._submit(JSON.stringify({ type: "TRADE", ...data })); }
}

module.exports = { HederaLogger };
