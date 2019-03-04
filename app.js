// App Config
const { APP, TELEGRAM, NLP, PAYPITE } = require('./config');
const port = APP.port;
const knwlg = require('botbrain/resources/knowledge');
const knwlg2 = require('botbrain/resources/knowledge2');

// Internal dependencies
const ErrorHandler = require('./middlewares/error-handler');
const TelegramClient = require('telegram-bot-api');
const MessageListner = require('./modules/telegram/message-listner');
const PaypiteClient = require('./modules/paypite/paypite-client');
const DataAnalyser = require('./modules/paypite/data-analyser');
const Brain = require('botbrain/index');
const MessageDispatcher = require('./modules/message-dispatcher');

//utils
const errorHandler = new ErrorHandler();
const telegramClient = new TelegramClient(
  {
    token: TELEGRAM.token
  }
);
telegramClient.setWebhook(
  { url: TELEGRAM.webhookUrl }
);
const paypiteClient = new PaypiteClient(PAYPITE);
const dataAnalyser = new DataAnalyser();
const brain = new Brain([knwlg2, knwlg], { degree: NLP.degree, scope: NLP.scope });
const messageDispatcher = new MessageDispatcher(
  { brain, telegramClient, paypiteClient, dataAnalyser },
  { ...TELEGRAM }
);
//const messageListner = new MessageListner({ telegramClient, messageDispatcher });
//messageListner.run();

// Internal dependencies
const ExpressBootstrapper = require('./modules/express-bootstrapper');

//routes
const Routes = require('./routes');
const TestRoute = require('./routes/test');
const Webhooks = require('./routes/webhooks');

// routes instances
const testRoute = new TestRoute();
const webhooks = new Webhooks(
  { messageDispatcher, telegramClient },
  { telegramToken:  TELEGRAM.token }
);

// Bootstrap
const expressBootstrapper = new ExpressBootstrapper(
  { errorHandler }
);
expressBootstrapper.bootstrap();

const routes = new Routes(
  [
    testRoute,
    webhooks
  ],
  errorHandler
);

routes.initRoutes(expressBootstrapper.app);

expressBootstrapper.app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
