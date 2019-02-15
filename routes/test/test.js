const httpStatus = require('http-status');

module.exports = class Test {
  constructor(models, modules, config) {
    this.handler = this.handler.bind(this);
  }

  handler(req, res, next) {
    try {
      return res.status(httpStatus.OK).json({ ok: true, message: 'Hello world!' });
    } catch (e) {
      return next(e);
    }
  }
};
