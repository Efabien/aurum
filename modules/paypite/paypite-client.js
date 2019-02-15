const request = require('request-promise');

module.exports = class PaypiteClient {
  constructor() {
    this._url = 'https://compte.paypite.fr';
  }

  _get(url) {
    return request({
      uri: url,
      method: 'GET'
    }).then(response => {
      return JSON.parse(response);
    }).catch(e => {
      throw e;
    });
  }

  getMarketRate() {
    const url = this._url + '/api/cours';
    return this._get(url);
  }
};
