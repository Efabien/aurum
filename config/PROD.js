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
      url: 'https://compte-staging.paypite.fr',
      currenciesId: {
        EUR: '5a2a997c5f9123e6010d39a5',
        MGA: '5a2a99815f9123e6010d3a00',
        XOF: '5a2a997d5f9123e6010d39b8',
        BTC: '5a79a7437829e692e152c113',
        ETH: '5a6976f4f36d286a1cb31f2e'
      },
      login: {
        email: 'fabien050988@gmail.com',
        password: 'enonedevxanadulyrecohsYsT3ek'
      }
    }
  }
);
