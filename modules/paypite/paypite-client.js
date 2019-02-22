const request = require('request-promise');
const httpStatus = require('http-status');

module.exports = class PaypiteClient {
  constructor(config) {
    this._url = config.url;
    this._currenciesId = config.currenciesId;
    this._login = config.login;
    this.authenticate(this._login).then(auth => {
      this.token = auth.token;
    });
  }

  _getPublic(url) {
    return request({
      uri: url,
      method: 'GET'
    }).then(response => {
      return JSON.parse(response);
    });
  }

  _get(url, token) {
    return request({
      uri: url,
      method: 'GET',
      headers: {
        authorization: token
      }
    })
    .then(resp => JSON.parse(resp))
    .catch(async (e) => {
      if (e.statusCode !== httpStatus.UNAUTHORIZED) throw e;
      console.log('Renewed token from Paypite');
      this.token  = (await this.authenticate(this._login)).token;
      return this._get(url, this.token);
    });
  }

  _postPublic(url, body) {
    return request({
      uri: url,
      method: 'POST',
      json: body
    });
  }

  getMarketRate() {
    const url = this._url + '/api/cours';
    return this._getPublic(url);
  }

  authenticate({ email, password }) {
    const url = this._url + '/connection';
    return this._postPublic(url, { email, password });
  }

  getExchangeHistory(currencyCode) {
    const currency = this._currenciesId[currencyCode];
    const url = `${this._url}/transaction/buy-historical/currency/${currency}`;
    return this._get(url, this.token);
  }
};
