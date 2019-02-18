module.exports = Object.freeze(
  {
    APP: {
      port: process.env.PORT || 3000
    },

    TELEGRAM: {
      token: process.env.AURUM_TELEGRAM_TOKEN
    },

    NLP: {
      degree: 2,
      scope: 3
    },

    PAYPITE: {
      url: 'http://compte-staging.paypite.fr',
      currenciesId: {
        EUR: '5a2a9910a3921fabb3488480',
        MGA: '5a2a9914a3921fabb34884be',
        XOF: '5a2a9911a3921fabb3488487',
        BTC: '5a77fae8f36d281a9f561375',
        ETH: '5a6976f4f36d286a1cb31f2e'
      },
      login: {
        email: 'fabien@gleezo.com',
        password: 'enonedev@xanadulyrecohsYsT3ek'
      }
    }
  }
);
