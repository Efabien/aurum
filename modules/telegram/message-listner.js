module.exports = class MessageListner {
  constructor(modules) {
    this._telegramClient = modules.telegramClient;
    this._dispatcher = modules.messageDispatcher;
    this.run = this.run.bind(this);
  }

  async run() {
    this._telegramClient.on('message', async (message) => {
      try {
        await this._dispatcher.process(message);
      } catch (e) {
        this._telegramClient.sendMessage({
          chat_id: message.chat.id,
          text: 'Ouppps, quelque chose c\'est mal passé!'
        });
        console.log(e);
      }
    });
  }
};

//https://compte.paypite.fr/api/cours
