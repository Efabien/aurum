module.exports = class MessageListner {
  constructor(modules) {
    this._telegramClient = modules.telegramClient;
    this._paypiteClient = modules.paypiteClient;
    this.run = this.run.bind(this);
  }

  async run() {
    try {
      this._telegramClient.on('message', async (message) => {
        const resp = await this.askPaypiteMarketRates(message.chat.id);
        console.log(resp);
      });
    } catch (e) {
      console.log(e);
    }
  }

  async replyText(to, text) {
    return this._telegramClient.sendMessage({
      chat_id: to,
      text
    });
  }

  async replyHtml(to, text) {
    return this._telegramClient.sendMessage({
      chat_id: to,
      text,
      parse_mode: 'HTML'
    });
  }

  async askPaypiteMarketRates(to) {
    const data = await this._paypiteClient.getMarketRate();
    const startMessage = '<b>Le cour sur le marché paypite sont les suivants</b>: \n';
    const rates = data.cours.reduce((resp, item) => {
      return resp += `Paire ${item.paire} : ${item.meilleurPrix}\n`;
    }, '');
    const toSend = startMessage + rates;
    return this.replyHtml(to, toSend);
  }
};

//https://compte.paypite.fr/api/cours
