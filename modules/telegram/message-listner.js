module.exports = class MessageListner {
  constructor(modules) {
    this._telegramClient = modules.telegramClient;
    this._dispatcher = modules.messageDispatcher;
    this.run = this.run.bind(this);
  }

  async run() {
    try {
      this._telegramClient.on('message', async (message) => {
        await this._dispatcher.process(message);
      });
    } catch (e) {
      console.log(e);
    }
  }
};

//https://compte.paypite.fr/api/cours
