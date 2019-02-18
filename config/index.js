const env = process.env.NODE_ENV || 'DEV';
const config = require(`./${env}`);

module.exports = Object.freeze({
  ...config
});
