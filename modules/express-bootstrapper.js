const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

module.exports = class ExpressBootstrapper {
  constructor(middlewares) {
    this.app = express();
    this._errorHandler = middlewares.errorHandler;
  }

  bootstrap() {
    this.app.use(helmet.hidePoweredBy());
    this.app.use(helmet.xssFilter());
    this.app.use(cors());

    this.app.use(bodyParser.json({ limit: '11mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(this._errorHandler.handler);
  }
};
