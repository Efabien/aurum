module.exports = class MessageDispatcher {
  constructor(modules) {
    this._brain = modules.brain;
    this._telegramClient = modules.telegramClient;
    this._paypiteClient = modules.paypiteClient;
    this._dataAnalyser = modules.dataAnalyser;
    this.process = this.process.bind(this);
    this._map = {
      'greating': '_great',
      'askRate': 'askPaypiteMarketRates',
      'askTodaysSellsByMArket': 'askTodaysSellsByMArket'
    };
  }

  async process(message) {
    try {
      const analyse = this._detect(message.text.replace('@AuriusBot', ''));
      const method = this._map[analyse.intent];
      if (!method) return this._unknown(message.chat.id);
      return this[method](message.chat.id, message.text);
    } catch (e) {
      throw e;
    }
  }

  _detect(text) {
    const hold = this._brain.detect(text);
    console.log(hold);
    return hold
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
    try {
      const data = await this._paypiteClient.getMarketRate();
      const startMessage = '<b>Le cours sur le marché Paypite sont les suivants</b>: \n';
      const rates = data.cours.reduce((resp, item) => {
        return resp += `${item.paire} : ${item.meilleurPrix}\n`;
      }, '');
      const toSend = startMessage + rates;
      return this._replyHtml(to, toSend);
    } catch (e) {
      throw e;
    }
  }

  async askTodaysSellsByMArket(to, text) {
    try {
      const keys = this._brain.extract(text, 'currency');
      const curCode = keys && keys.currency[0];
      if (!curCode) return this._replyText(to, 'Merci de bien préciser la devise du marché');
      const response = await this._paypiteClient.getExchangeHistory(curCode);
      const holder = this._dataAnalyser.getTodaySells(response.data);
      const quantity = holder.reduce((total, item) => {
        return total += item.amount;
      }, 0);
      const fiatAmount = holder.reduce((total, item) => {
        let toTake = 0;
        if (item.meta && item.meta.currentRate) {
          toTake = item.meta.currentRate * item.amount;
        } else if (item.meta && item.meta.sellPrice) {
          toTake = (item.meta.sellPrice.unit || 0) * item.amount;
        }
        return total += toTake;
      }, 0);
      const message = `${quantity} PIT pour un total de ${fiatAmount} ${curCode} ont été vendu aujourd\'hui`;
      return this._replyText(to, message);
    } catch (e) {
      throw e;
    }
  }

  _great(to) {
    return this._replyText(to, 'Bonjour!');
  }

  _unknown(to) {
    return this._replyText(to, 'J\'ai pas compris!');
  }
};
