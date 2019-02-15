
module.exports = class Routes {
  constructor(routes, errorHandler) {
    this._routes = routes;
    this._errorHandler = errorHandler;
  }

  initRoutes(app) {
    this._routes.forEach(route => route.initRoutes(app));
    app.use(this._errorHandler.handler);
  }
};
