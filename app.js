// App Config
const { APP, TELEGRAM, NLP } = require('./config');
const port = APP.port;
const knwlg = require('./modules/brain/resources/knowledge');
const knwlg2 = require('./modules/brain/resources/knowledge2');

// Internal dependencies
const ErrorHandler = require('./middlewares/error-handler');
const TelegramClient = require('telegram-bot-api');
const MessageListner = require('./modules/telegram/message-listner');
const PaypiteClient = require('./modules/paypite/paypite-client');
const Brain = require('./modules/brain/index');
const MessageDispatcher = require('./modules/message-dispatcher');

//utils
const errorHandler = new ErrorHandler();
const telegramClient = new TelegramClient({
  token: TELEGRAM.token,
  updates: {
    enabled: true
  }
});
const paypiteClient = new PaypiteClient();
const brain = new Brain([knwlg2, knwlg], { degree: NLP.degree, scope: NLP.scope });
const messageDispatcher = new MessageDispatcher({ brain, telegramClient, paypiteClient });
const messageListner = new MessageListner({ telegramClient, messageDispatcher });
messageListner.run();

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
