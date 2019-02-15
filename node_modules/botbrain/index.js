const brain = require('./brain');
const _ = require('lodash');

module.exports = class Brain {
  constructor(knowledges, configs) {
    this._brain = brain;

    this._knowledge = knowledges.reduce((item, result) => {
      result.keyWords = _.merge(result.keyWords, item.keyWords);
      result.intents = _.merge(result.intents, item.intents);
      return result;
    }, { keyWords: {}, intents: {} });
    
    this._degree = configs.degree;
    this._scope = configs.scope;

    this._feed();
  }

  _feed() {
    this._brain.feed(
      this._knowledge.keyWords,
      this._knowledge.intents,
      this._scope,
      this._degree
    );
  }

  detect(input) {
    return this._brain.detect(input);
  }

  extract(input, what) {
    return this._brain.extract(input, what);
  }

  freeExtract(input) {
    return this._brain.extractAll(input);
  }
}
