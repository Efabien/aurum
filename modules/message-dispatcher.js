module.exports = class MessageDispatcher {
  constructor(modules) {
    this._brain = modules.brain;
    this._telegramClient = modules.telegramClient;
    this._paypiteClient = modules.paypiteClient;
    this.process = this.process.bind(this);
    this._map = {
      'greating': '_great',
      'askRate': 'askPaypiteMarketRates'
    };
  }

  async process(message) {
    const analyse = this._detect(message.text);
    const method = this._map[analyse.intent];
    if (!method) return this._unknown(message.chat.id);
    return this[method](message.chat.id);
  }

  _detect(text) {
    return this._brain.detect(text)
    .sort((a, b) => b.score - a.score)[0];
  }

  async _replyText(to, text) {
    return this._telegramClient.sendMessage({
      chat_id: to,
      text
    });
  }

  async _replyHtml(to, text) {
    return this._telegramClient.sendMessage({
      chat_id: to,
      text,
      parse_mode: 'HTML'
    });
  }

  async askPaypiteMarketRates(to) {
    const data = await this._paypiteClient.getMarketRate();
    const startMessage = '<b>Le cours sur le marché Paypite sont les suivants</b>: \n';
    const rates = data.cours.reduce((resp, item) => {
      return resp += `${item.paire} : ${item.meilleurPrix}\n`;
    }, '');
    const toSend = startMessage + rates;
    return this._replyHtml(to, toSend);
  }

  _great(to) {
    return this._replyText(to, 'Bonjour!');
  }

  _unknown(to) {
    return this._replyText(to, 'J\'ai pas compris!');
  }
};
