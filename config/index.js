const APP = {
  port: process.env.port || 3000
};

const TELEGRAM = {
  token: process.env.AURUM_TELEGRAM_TOKEN
};

module.exports = Object.freeze({
  APP,
  TELEGRAM
});
