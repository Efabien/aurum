const express = require('express');
const Test = require('./test');

module.exports = class TestRoute {
  constructor(models, modules, config) {
    this.test = new Test(models, modules, config);
  }

  initRoutes(app) {
    const api = express.Router();
    api.get('/', this.test.handler);
    app.use('/test', api);
  }
};
