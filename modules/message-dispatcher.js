module.exports = class MessageDispatcher {
  constructor(modules, config) {
    this._brain = modules.brain;
    this._telegramClient = modules.telegramClient;
    this._paypiteClient = modules.paypiteClient;
    this._dataAnalyser = modules.dataAnalyser;
    this._botName = config.botName;
    this.process = this.process.bind(this);
    this._map = {
      'greating': '_great',
      'askRate': 'askPaypiteMarketRates',
      'askTodaysSellsByMArket': 'askTodaysSellsByMArket',
      'askMarketDaylyEvolution': 'askMarketEvolutionOn2Rows' //askTodaysSellsByMArket
    };
  }

  async process(message) {
    try {
      if (!this._canReceive(message)) return;
      const analyse = this._detect(message.text.replace(this._botName, ''));
      console.log(analyse);
      const method = this._map[analyse.intent];
      if (!method) return this._unknown(message.chat.id);
      return this[method](message.chat.id, message.text);
    } catch (e) {
      throw e;
    }
  }

  _canReceive(message) {
    if (!message.text) return;
    if (message.chat.type === 'group' && !message.text.startsWith(this._botName)) return;
    return true;
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
      const curCode = this._getCurrency(text);
      if (!curCode) return this._replyText(to, 'Merci de bien préciser la devise du marché');
      const response = await this._paypiteClient.getExchangeHistory(curCode);
      const sells = this._dataAnalyser.getTodaySells(response.data);
      const [quantity, fiatAmount]  = this._dataAnalyser.getQuantAndValueOfSells(sells);
      const message = `${quantity} PIT pour un total de ${fiatAmount} ${curCode} ont été vendu aujourd\'hui`;
      return this._replyText(to, message);
    } catch (e) {
      throw e;
    }
  }

  async askMarketEvolutionOn2Rows(to, text) {
    try {
      const curCode = this._getCurrency(text);
      if (!curCode) return this._replyText(to, 'Merci de bien préciser la devise du marché');
      const response = await this._paypiteClient.getExchangeHistory(curCode);
      const sellsPerDay = this._dataAnalyser.sellsPerday(response.data);
      const evolution = this._dataAnalyser.getMarketEvolutionOn2Rows(sellsPerDay[1], sellsPerDay[0]);
      const message = `Le marché de la paypite en ${curCode} a évolué de ${evolution}`;
      return this._replyText(to, message);
    } catch (e) {
      throw e;
    }
  }

  _getCurrency(text) {
    const keys = this._brain.extract(text, 'currency');
    const curCode = keys && keys.currency[0];
    return curCode;
  }

  _great(to) {
    return this._replyText(to, 'Bonjour!');
  }

  _unknown(to) {
    return this._replyText(to, 'J\'ai pas compris!');
  }
};
