const express = require('express');
const UpdatesReceiver = require('./updates-receiver');

module.exports = class WebhooksRoute {
  constructor(modules, config) {
    this._telegramToken = config.telegramToken;
    this._updatesReceiver = new UpdatesReceiver(modules);
  }

  initRoutes(app) {
    const api = express.Router();
    api.post(`/telegram/${encodeURI(this._telegramToken)}`, this._updatesReceiver.handler);
    app.use('/webhooks', api);
  }
};
