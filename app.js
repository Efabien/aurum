// App Config
const { APP, TELEGRAM } = require('./config');
const port = APP.port;

// Internal dependencies
const ErrorHandler = require('./middlewares/error-handler');
const TelegramClient = require('telegram-bot-api');
const MessageListner = require('./modules/telegram/message-listner');
const PaypiteClient = require('./modules/paypite/paypite-client');

//utils
const errorHandler = new ErrorHandler();
const telegramClient = new TelegramClient({
  token: TELEGRAM.token,
  updates: {
    enabled: true
  }
});
const paypiteClient = new PaypiteClient();
const messageLister = new MessageListner({ telegramClient, paypiteClient });
messageLister.run();

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
