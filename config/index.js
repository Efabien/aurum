const APP = {
  port: process.env.port || 3000
};

const TELEGRAM = {
  token: process.env.AURUM_TELEGRAM_TOKEN
};

const NLP = {
  degree: 2,
  scope: 3
};

module.exports = Object.freeze({
  APP,
  TELEGRAM,
  NLP
});
