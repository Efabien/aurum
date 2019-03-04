const httpStatus = require('http-status');

module.exports = class UpdatesReceiver {
  constructor(modules) {
    this.handler = this.handler.bind(this);
    this._telegramClient = modules.telegramClient;
    this._dispatcher = modules.messageDispatcher;
  }

  async handler(req, res) {
    const update = req.body;
    console.log(update);
    try {
      if (update.message) await this._dispatcher.process(update.message);
      res.status(httpStatus.OK).json({ ok: true });
    } catch (e) {
      this._telegramClient.sendMessage({
        chat_id: update.message.chat.id,
        text: 'Ouppps, quelque chose c\'est mal passé!'
      });
      console.log(e);
      res.status(500).json({ error: e.message || e });
    }
  }
};
