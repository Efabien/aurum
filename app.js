// App Config
const port = process.env.PORT || 3000;

// Internal dependencies
const ErrorHandler = require('./middlewares/error-handler');

//utils
const errorHandler = new ErrorHandler();

// Internal dependencies
const ExpressBootstrapper = require('./modules/express-bootstrapper');

//routes
const Routes = require('./routes');
const TestRoute = require('./routes/test');

// routes instances
const testRoute = new TestRoute();

// Bootstrap
const expressBootstrapper = new ExpressBootstrapper(
  { errorHandler }
);
expressBootstrapper.bootstrap();

const routes = new Routes(
  [
    testRoute
  ],
  errorHandler
);

routes.initRoutes(expressBootstrapper.app);

expressBootstrapper.app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
